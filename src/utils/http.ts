import ky from "ky";

export const http = ky.extend({
	timeout: 10_000,
	credentials: "include",
	prefixUrl: "http://learnpy-api.tale.me:8000/v1",
	hooks: {
		beforeRequest: [
			request => {
				request.headers.set("Content-Type", "application/json");
			}
		]
	}
});
