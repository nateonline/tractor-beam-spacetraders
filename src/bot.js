import { getMyAgent } from "./api/agent.js";
import {
	getMyShips,
	orbitShip,
	dockShip,
	extractResources,
	sellCargo,
} from "./api/fleet.js";

/**
 * Basic "mine and sell" loop for the first ship.
 */
export async function runBot() {
	console.log("=== Starting SpaceTraders Bot ===");

	const { data: agent } = await getMyAgent();
	console.log(`Agent: ${agent.symbol} | Credits: ${agent.credits}`);

	const { data: ships } = await getMyShips();
	if (ships.length === 0) {
		console.log(
			"No ships found. Please ensure you have accepted the initial contract to get a ship.",
		);
		return;
	}

	const ship = ships[0];
	console.log(`Using ship: ${ship.symbol} at ${ship.nav.waypointSymbol}`);

	// Simple infinite loop for mining
	while (true) {
		try {
			console.log(
				`\n-- Ship ${ship.symbol} Status: ${ship.nav.status} --`,
			);

			// 1. Ensure we are in orbit to extract
			if (ship.nav.status === "DOCKED") {
				console.log("Ship is docked. Orbiting...");
				await orbitShip(ship.symbol);
				await new Promise((r) => setTimeout(r, 2000));
			}

			// 2. Wait for cooldown if any
			// For simplicity in this basic bot, if extract fails due to cooldown, we'll catch it and wait

			// 3. Extract resources
			console.log("Extracting resources...");
			const { data: extractData } = await extractResources(ship.symbol);
			console.log(
				`Extracted ${extractData.extraction.yield.units} of ${extractData.extraction.yield.symbol}`,
			);

			const cooldownSecs = extractData.cooldown.totalSeconds || 15;
			console.log(`Cooling down for ${cooldownSecs} seconds...`);

			// 4. Check if cargo is full
			const cargo = extractData.cargo;
			console.log(`Cargo: ${cargo.units} / ${cargo.capacity}`);

			if (cargo.units >= cargo.capacity) {
				console.log("Cargo full. Docking to sell...");
				await dockShip(ship.symbol);
				await new Promise((r) => setTimeout(r, 2000));

				for (const item of cargo.inventory) {
					if (item.symbol !== "ANTIMATTER") {
						// keep antimatter if any, sell the rest
						console.log(`Selling ${item.units}x ${item.symbol}...`);
						const { data: sellData } = await sellCargo(
							ship.symbol,
							item.symbol,
							item.units,
						);
						console.log(
							`Sold for ${sellData.transaction.totalPrice}. Current credits: ${sellData.agent.credits}`,
						);
						await new Promise((r) => setTimeout(r, 1000));
					}
				}

				console.log("Orbiting again...");
				await orbitShip(ship.symbol);
				await new Promise((r) => setTimeout(r, 2000));
			}

			// Wait out the cooldown before the loop restarts
			await new Promise((r) => setTimeout(r, cooldownSecs * 1000));
		} catch (err) {
			console.error("Bot loop encountered an error:", err.message);
			console.log("Waiting 10 seconds before retrying...");
			await new Promise((r) => setTimeout(r, 10000));
		}
	}
}
