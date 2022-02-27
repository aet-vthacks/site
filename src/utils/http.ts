import ky from "ky";

export const http = ky.extend({
	timeout: 10_000,
	credentials: "include",
	prefixUrl: "https://api.slinky.codes/v1",
	hooks: {
		beforeRequest: [
			request => {
				request.headers.set("Content-Type", "application/json");
			}
		]
	}
});
