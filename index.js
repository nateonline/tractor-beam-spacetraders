import fs from "fs";
import { getMyAgent } from "./src/api/agent.js";
import { runBot } from "./src/bot.js";
import { registerAgent } from "./src/api/register.js";

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
    } else if (cmd === "register") {
        const callsign = process.argv[3] || process.env.SPACETRADERS_CALLSIGN;
        const faction = process.env.SPACETRADERS_FACTION || "AEGIS";
        if (!callsign) {
            console.log("Usage: node index.js register [CALLSIGN]");
            return;
        }
        console.log(
            `Registering new agent: ${callsign} with faction ${faction}...`,
        );
        const response = await registerAgent(callsign, faction);
        const { data } = response;
        console.log(`Success! Welcome ${data.agent.symbol}.`);
        console.log(`Saving new token to .env...`);
        fs.writeFileSync(
            ".env",
            `SPACETRADERS_CALLSIGN=${callsign}\nSPACETRADERS_FACTION=${faction}\nSPACETRADERS_TOKEN=${data.token}\n`,
        );
        console.log(
            `Done! You are ready to run 'node index.js status' or 'node index.js run'`,
        );
    } else {
        console.log("Usage: node index.js [status|run|register <callsign>]");
    }
}

main().catch((error) => {
    console.error("Fatal Error:", error);
});
