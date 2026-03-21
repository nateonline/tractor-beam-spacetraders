import { spacetradersFetch } from "../apiClient.js";

/**
 * Register a new SpaceTraders agent.
 * Faction can be COSMIC, VOID, GALACTIC, QUANTUM, DOMINION, AEGIS
 */
export async function registerAgent(symbol, faction = "COSMIC") {
	return spacetradersFetch("/register", {
		method: "POST",
		body: JSON.stringify({ symbol, faction }),
	});
}
