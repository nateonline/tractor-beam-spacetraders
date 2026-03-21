import * as dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://api.spacetraders.io/v2";

/**
 * Enhanced fetch to handle base URL, default headers, and rate limiting (429s).
 */
export async function spacetradersFetch(endpoint, options = {}) {
	const url = `${BASE_URL}${endpoint}`;
	const token = process.env.SPACETRADERS_TOKEN;

	const defaultHeaders = {
		"Content-Type": "application/json",
	};

	if (endpoint !== "/register") {
		if (!token) {
			throw new Error(
				"SPACETRADERS_TOKEN is missing in the environment variables.",
			);
		}
		defaultHeaders["Authorization"] = `Bearer ${token}`;
	}

	const config = {
		...options,
		headers: {
			...defaultHeaders,
			...options.headers,
		},
	};

	if (config.method === "POST" && !config.body) {
		config.body = "{}";
	}

	while (true) {
		const response = await fetch(url, config);

		// Rate Limiting handling
		if (response.status === 429) {
			const waitTime =
				parseFloat(response.headers.get("retry-after") || "1") * 1000;
			console.warn(
				`[API] Rate limited on ${endpoint}. Retrying after ${waitTime}ms...`,
			);
			await new Promise((res) => setTimeout(res, waitTime));
			continue;
		}

		if (!response.ok) {
			// parse the error response if possible
			let errorBody;
			try {
				errorBody = await response.json();
			} catch (e) {
				errorBody = await response.text();
			}
			throw new Error(
				`API Error ${response.status} on ${endpoint}: ${JSON.stringify(errorBody)}`,
			);
		}

		if (response.status !== 204) {
			return response.json();
		}

		return null;
	}
}
