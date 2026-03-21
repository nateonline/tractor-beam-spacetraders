import fs from "fs";
import path from "path";

const STATE_FILE = path.join(process.cwd(), "data", "state.json");

export function initDb() {
	if (!fs.existsSync(path.dirname(STATE_FILE))) {
		fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
	}
	if (!fs.existsSync(STATE_FILE)) {
		fs.writeFileSync(STATE_FILE, JSON.stringify({ ships: {} }, null, 4));
	}
}

export function readState() {
	initDb();
	const raw = fs.readFileSync(STATE_FILE, "utf-8");
	return JSON.parse(raw);
}

export function writeState(state) {
	initDb();
	fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 4));
}

export function setShipStrategy(shipSymbol, strategyName) {
	const state = readState();
	if (!state.ships[shipSymbol]) {
		state.ships[shipSymbol] = {};
	}
	state.ships[shipSymbol].strategy = strategyName;
	writeState(state);
}

export function getShipStrategy(shipSymbol) {
	const state = readState();
	return state.ships[shipSymbol]?.strategy || "IDLE";
}
