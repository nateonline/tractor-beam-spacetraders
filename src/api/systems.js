import { spacetradersFetch } from "../apiClient.js";

/**
 * List all waypoints in a system.
 */
export async function getSystemWaypoints(systemSymbol) {
	return spacetradersFetch(`/systems/${systemSymbol}/waypoints`, {
		method: "GET",
	});
}

/**
 * View market data for a waypoint.
 */
export async function getMarket(systemSymbol, waypointSymbol) {
	return spacetradersFetch(
		`/systems/${systemSymbol}/waypoints/${waypointSymbol}/market`,
		{ method: "GET" },
	);
}

/**
 * View shipyard data for a waypoint.
 */
export async function getShipyard(systemSymbol, waypointSymbol) {
	return spacetradersFetch(
		`/systems/${systemSymbol}/waypoints/${waypointSymbol}/shipyard`,
		{ method: "GET" },
	);
}
