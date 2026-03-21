import {
	orbitShip,
	dockShip,
	extractResources,
	sellCargo,
} from "./api/fleet.js";

/**
 * Single tick of the MINE strategy.
 * Returns the number of seconds to sleep before ticking again.
 */
export async function executeMineStrategy(shipSymbol) {
	console.log(`[MINE] Ticking for ${shipSymbol}`);
	let sleepSeconds = 10;
	try {
		// 1. Orbit before extraction
		await orbitShip(shipSymbol);

		// 2. Extract
		console.log(`[${shipSymbol}] Extracting resources...`);
		const { data: extractData } = await extractResources(shipSymbol);
		console.log(
			`[${shipSymbol}] Yield: ${extractData.extraction.yield.units} ${extractData.extraction.yield.symbol}`,
		);

		sleepSeconds = extractData.cooldown.totalSeconds || 15;

		// 3. Sell if cargo is full
		const cargo = extractData.cargo;
		if (cargo.units >= cargo.capacity) {
			console.log(`[${shipSymbol}] Cargo full. Selling items...`);
			await dockShip(shipSymbol);
			for (const item of cargo.inventory) {
				if (item.symbol !== "ANTIMATTER") {
					console.log(`[${shipSymbol}] Selling ${item.units}x ${item.symbol}...`);
					await sellCargo(shipSymbol, item.symbol, item.units);
				}
			}
			await orbitShip(shipSymbol);
		}
	} catch (err) {
		console.error(`[${shipSymbol}] Strategy Error:`, err.message);
	}
	return sleepSeconds;
}

/**
 * Single tick of the EXPLORE strategy.
 * Placeholder for navigation logic.
 */
export async function executeExploreStrategy(shipSymbol) {
	console.log(`[EXPLORE] Ticking for ${shipSymbol}`);
	// Explore logic to be added
	return 30; // Sleep for 30s
}
