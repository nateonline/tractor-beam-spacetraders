import { readState } from "../src/stateManager.js";
import { getMyAgent } from "../src/api/agent.js";
import { getMyShips } from "../src/api/fleet.js";
import { getSystem, getSystemWaypoints } from "../src/api/systems.js";
import SpaceMap from "./components/SpaceMap.jsx";

export default async function Dashboard() {
	// 1. Fetch Local Intent State
	const state = readState();

	// 2. Fetch Live Live Data
	const { data: agent } = await getMyAgent();
	const { data: remoteShips } = await getMyShips();
	
	const systemSymbol = agent.headquarters.split("-").slice(0, 2).join("-");
	const { data: systemInfo } = await getSystem(systemSymbol);
	const { data: waypoints } = await getSystemWaypoints(systemSymbol);

	// 3. Merge Live Position Data with Local Intent Strategy
	const mergedShips = remoteShips ? remoteShips.map((ship) => {
		const localState = state.ships[ship.symbol] || { strategy: "IDLE" };
		return {
			...ship,
			strategy: localState.strategy
		};
	}) : [];

	const hqWaypoint = waypoints ? waypoints.find((w) => w.symbol === agent.headquarters) || waypoints[0] : null;
	const mapCenter = hqWaypoint ? [hqWaypoint.x, 0, hqWaypoint.y] : [0, 0, 0];

	return (
		<main>
			<div style={{ position: "absolute", top: "1.5rem", left: "2rem", zIndex: 10, pointerEvents: "none" }}>
				<h1 style={{ color: "var(--accent-cyan)", fontSize: "1.5rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600", margin: 0 }}>
					Sector Command ({systemSymbol})
				</h1>
				<span className="tech-label" style={{ marginTop: "0.5rem" }}>
					Credits: {new Intl.NumberFormat().format(agent.credits)} ¢ | Ships: {agent.shipCount}
				</span>
			</div>

			<SpaceMap shipsData={mergedShips} waypoints={waypoints} mapCenter={mapCenter} systemInfo={systemInfo} />
		</main>
	);
}
