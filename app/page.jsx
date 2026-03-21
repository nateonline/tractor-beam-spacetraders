import { getMyAgent } from '../src/api/agent.js';

export default async function Dashboard() {
	// Directly fetching server-to-server data natively in the Next.js Server Component!
	const { data: agent } = await getMyAgent();

	return (
		<main style={{ padding: '3rem 1rem', width: '100%', maxWidth: '800px' }}>
			<h1 style={{ 
				color: 'var(--accent-cyan)', 
				fontSize: '2rem', 
				textTransform: 'uppercase', 
				letterSpacing: '2px', 
				marginBottom: '2rem',
				fontWeight: '600'
			}}>
				Agent Identification
			</h1>

			{/* Agent Status Panel */}
			<div className="hologram-panel cyan-accent" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
				<div>
					<span className="tech-label">Registered Callsign</span>
					<div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{agent.symbol}</div>
				</div>
				
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
					<div>
						<span className="tech-label">Available Credits</span>
						<div style={{ fontSize: '1.25rem', color: 'var(--accent-orange)' }}>
							{new Intl.NumberFormat().format(agent.credits)} ¢
						</div>
					</div>
					<div>
						<span className="tech-label">Headquarters</span>
						<div style={{ fontSize: '1.25rem' }}>{agent.headquarters}</div>
					</div>
					<div>
						<span className="tech-label">Active Ships</span>
						<div style={{ fontSize: '1.25rem' }}>{agent.shipCount}</div>
					</div>
				</div>
			</div>
		</main>
	);
}
