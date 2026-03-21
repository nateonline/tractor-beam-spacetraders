import { spacetradersFetch } from "../apiClient.js";

export async function getSystem(systemSymbol) {
	return spacetradersFetch(`/systems/${systemSymbol}`, { method: "GET" });
}

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
