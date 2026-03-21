"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useState } from "react";
import { updateStrategy } from "../actions.js";

const STAR_TYPES = {
	NEUTRON_STAR: { size: 1.5, color: "#38BDF8" },
	BLACK_HOLE:   { size: 2,   color: "#0F172A", glow: "#7C3AED" },
	WHITE_DWARF:  { size: 2.5, color: "#F1F5F9" },
	RED_STAR:     { size: 4,   color: "#EF4444" },
	ORANGE_STAR:  { size: 5,   color: "#F97316" },
	YOUNG_STAR:   { size: 6,   color: "#FDE047" },
	UNSTABLE:     { size: 6.5, color: "#14B8A6" },
	BLUE_STAR:    { size: 8,   color: "#3B82F6" },
	HYPERGIANT:   { size: 14,  color: "#8B5CF6" },
	NEBULA:       { size: 16,  color: "#D946EF", opacity: 0.5 },
};
const DEFAULT_STAR = { size: 5, color: "#E2E8F0" };

// Categorical Neon Palette mapped to states
const SHIP_COLORS = {
	IDLE: "#10B981", // Green
	MINE: "#FF6A00", // Orange
	EXPLORE: "#00E5FF", // Cyan
};

function ShipNode({ ship, position, onClick }) {
	const color = SHIP_COLORS[ship.strategy] || "#E2E8F0";

	return (
		<mesh
			position={position}
			onClick={(e) => {
				e.stopPropagation();
				onClick(ship);
			}}
		>
			<sphereGeometry args={[1, 32, 32]} />
			{/* Flat Holographic Shader */}
			<meshBasicMaterial color={color} />
		</mesh>
	);
}

export default function SpaceMap({ shipsData, waypoints, mapCenter, systemInfo }) {
	const [selectedSymbol, setSelectedSymbol] = useState(null);

	// Convert exact nav position to the map, lifting the ships up by Y=2
	const ships = (shipsData || []).map((ship) => {
		let x = 0;
		let y = 0;
		if (ship.nav?.route?.destination) {
			x = ship.nav.route.destination.x;
			y = ship.nav.route.destination.y;
		}
		return {
			...ship,
			position: [x, 2, y],
		};
	});

	const selectedShip = ships.find((s) => s.symbol === selectedSymbol);

	return (
		<div
			style={{
				width: "100vw",
				height: "100vh",
				position: "fixed",
				top: 0,
				left: 0,
				zIndex: 0,
			}}
		>
			<Canvas 
				gl={{ logarithmicDepthBuffer: true }}
				camera={{ near: 0.1, far: 10000000, position: [mapCenter[0], mapCenter[1] + 60, mapCenter[2] + 60], fov: 45 }}
			>
				{/* Unlit Holographic Flat Strategy Map - No Lights Needed */}

				{/* Dynamic Central Star System */}
				{systemInfo && (() => {
					const starConfig = STAR_TYPES[systemInfo.type] || DEFAULT_STAR;
					return (
						<group position={[0, 0, 0]}>
							{/* Solid Star Core */}
							<mesh>
								<sphereGeometry args={[starConfig.size, 64, 64]} />
								<meshBasicMaterial 
									color={starConfig.color} 
									transparent={!!starConfig.opacity} 
									opacity={starConfig.opacity || 1} 
								/>
							</mesh>
							
							{/* Outer Holographic Glow (Halo) */}
							<mesh>
								<sphereGeometry args={[starConfig.size * 1.4, 64, 64]} />
								<meshBasicMaterial 
									color={starConfig.glow || starConfig.color} 
									transparent={true}
									opacity={0.15} 
									blending={THREE.AdditiveBlending}
									depthWrite={false}
								/>
							</mesh>

							{/* System Identification Label */}
							<Html position={[0, -(starConfig.size + 2.5), 0]} center style={{ textAlign: 'center', whiteSpace: 'nowrap', pointerEvents: 'none', textShadow: '0 0 8px rgba(0,0,0,1)' }}>
								<div style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 'bold' }}>{systemInfo.symbol}</div>
								<div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{systemInfo.type.replace('_', ' ')}</div>
							</Html>
						</group>
					);
				})()}

				{/* True System Grid anchored to Origin but rendered under geometry via depth rules */}
				<gridHelper
					args={[100000, 10000, "#30363D", "#161B22"]}
					position={[0, 0, 0]}
					renderOrder={-1}
					material-depthWrite={false}
				/>

				{waypoints?.map((w, idx) => {
					return (
						<group key={`wp-${idx}`}>
							<mesh position={[w.x, 0, w.y]}>
								<sphereGeometry args={[1.5, 32, 32]} />
								<meshBasicMaterial color={w.type === 'PLANET' ? '#CBD5E1' : '#64748B'} />
								<Html position={[0, -5, 0]} center style={{ textAlign: 'center', whiteSpace: 'nowrap', pointerEvents: 'none', textShadow: '0 0 5px rgba(0,0,0,0.9)' }}>
									<div style={{ color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 'bold' }}>{w.symbol}</div>
									<div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginTop: '0.1rem' }}>{w.type.replace('_', ' ')}</div>
								</Html>
							</mesh>
						</group>
					);
				})}

				{ships.map((ship, idx) => (
					<ShipNode
						key={idx}
						ship={ship}
						position={ship.position}
						onClick={(s) => setSelectedSymbol(s.symbol)}
					/>
				))}

				<OrbitControls makeDefault target={mapCenter} maxDistance={5000000} />
			</Canvas>

			{/* Interactive UI Callout Panel Overlay */}
			{selectedShip && (
				<div
					className={`hologram-panel ${selectedShip.strategy === "EXPLORE" ? "cyan-accent" : ""}`}
					style={{
						position: "absolute",
						top: "2rem",
						right: "2rem",
						width: "300px",
						zIndex: 10,
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<span className="tech-label">SELECTED SHIP</span>
						<button
							onClick={() => setSelectedSymbol(null)}
							style={{
								background: "none",
								border: "none",
								color: "var(--text-muted)",
								cursor: "pointer",
								fontFamily: "var(--font-primary)",
							}}
						>
							[X]
						</button>
					</div>

					<div
						style={{
							fontSize: "1.25rem",
							fontWeight: "bold",
							margin: "0.5rem 0 1.5rem 0",
						}}
					>
						{selectedShip.symbol}
					</div>

					<div className="tech-label">ASSIGN STRATEGY</div>

					{/* Next.js form handling Server Actions */}
					<form
						action={updateStrategy.bind(null, selectedShip.symbol)}
					>
						<select
							name="strategy"
							defaultValue={selectedShip.strategy}
							style={{
								width: "100%",
								padding: "0.75rem",
								background: "var(--bg-card)",
								color: "var(--text-main)",
								border: "1px solid var(--border-color)",
								fontFamily: "var(--font-primary)",
								outline: "none",
							}}
						>
							<option value="IDLE">IDLE (Hold Position)</option>
							<option value="MINE">
								MINE (Asteroid Auto-Loop)
							</option>
							<option value="EXPLORE">EXPLORE (Mapping)</option>
						</select>
						<button
							type="submit"
							style={{
								marginTop: "1rem",
								width: "100%",
								padding: "0.75rem",
								background: "var(--accent-orange)",
								border: "none",
								color: "#fff",
								cursor: "pointer",
								fontWeight: "bold",
								textTransform: "uppercase",
								fontFamily: "var(--font-primary)",
							}}
						>
							UPDATE DIRECTIVE
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
