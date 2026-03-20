import { spacetradersFetch } from "../apiClient.js";

/**
 * List all of your contracts.
 */
export async function getContracts() {
    return spacetradersFetch("/my/contracts", { method: "GET" });
}

/**
 * Accept a contract.
 */
export async function acceptContract(contractId) {
    return spacetradersFetch(`/my/contracts/${contractId}/accept`, {
        method: "POST",
    });
}
