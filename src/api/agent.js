import { spacetradersFetch } from "../apiClient.js";

/**
 * Fetch the details of our own agent using the provided token.
 */
export async function getMyAgent() {
    return spacetradersFetch("/my/agent", {
        method: "GET",
    });
}
