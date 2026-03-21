"use server";

import { setShipStrategy } from "../src/stateManager.js";
import { revalidatePath } from "next/cache";

export async function updateStrategy(shipSymbol, formData) {
	const strategy = formData.get("strategy");
	setShipStrategy(shipSymbol, strategy);
	// Forces Next.js to re-read state.json and send fresh props to the Client Components
	revalidatePath("/");
}
