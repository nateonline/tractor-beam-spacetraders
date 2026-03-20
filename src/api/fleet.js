import { spacetradersFetch } from "../apiClient.js";

/**
 * Get all ships managed by your agent.
 */
export async function getMyShips() {
    return spacetradersFetch("/my/ships", { method: "GET" });
}

/**
 * Navigate a ship to a new waypoint.
 */
export async function navigateShip(shipSymbol, waypointSymbol) {
    return spacetradersFetch(`/my/ships/${shipSymbol}/navigate`, {
        method: "POST",
        body: JSON.stringify({ waypointSymbol }),
    });
}

/**
 * Orbit a ship.
 */
export async function orbitShip(shipSymbol) {
    return spacetradersFetch(`/my/ships/${shipSymbol}/orbit`, {
        method: "POST",
    });
}

/**
 * Dock a ship.
 */
export async function dockShip(shipSymbol) {
    return spacetradersFetch(`/my/ships/${shipSymbol}/dock`, {
        method: "POST",
    });
}

/**
 * Refuel a ship.
 */
export async function refuelShip(shipSymbol) {
    return spacetradersFetch(`/my/ships/${shipSymbol}/refuel`, {
        method: "POST",
    });
}

/**
 * Extract resources from an asteroid.
 */
export async function extractResources(shipSymbol) {
    return spacetradersFetch(`/my/ships/${shipSymbol}/extract`, {
        method: "POST",
    });
}

/**
 * Sell cargo.
 */
export async function sellCargo(shipSymbol, symbol, units) {
    return spacetradersFetch(`/my/ships/${shipSymbol}/sell`, {
        method: "POST",
        body: JSON.stringify({ symbol, units }),
    });
}

/**
 * Deliver cargo for a contract
 */
export async function deliverCargo(shipSymbol, contractId, tradeSymbol, units) {
    return spacetradersFetch(`/my/ships/${shipSymbol}/contract/${contractId}`, {
        method: "POST",
        body: JSON.stringify({ shipSymbol, tradeSymbol, units }), // Notice shipSymbol in body vs URL
    });
}
