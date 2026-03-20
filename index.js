import { getMyAgent } from "./src/api/agent.js";
import { runBot } from "./src/bot.js";

const cmd = process.argv[2];

async function main() {
	if (cmd === "status") {
		console.log("Fetching agent status...");
		const { data } = await getMyAgent();
		console.log("=== Agent Status ===");
		console.log(`Symbol: ${data.symbol}`);
		console.log(`Headquarters: ${data.headquarters}`);
		console.log(`Credits: ${data.credits}`);
		console.log(`Starting Faction: ${data.startingFaction}`);
		console.log(`Ship Count: ${data.shipCount}`);
	} else if (cmd === "run") {
		await runBot();
	} else {
		console.log("Usage: node index.js [status|run]");
	}
}

main().catch((error) => {
	console.error("Fatal Error:", error);
});
