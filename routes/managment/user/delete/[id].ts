import { Handlers } from "$fresh/server.ts";
import { deleteUser, initConnection } from "../../../../services/database.ts";

export const handler: Handlers = {
	async GET(req, ctx) {
		const headers = new Headers(req.headers);

		const id = ctx.params.id;
		const result = await deleteUser(initConnection(), id);
		console.log(result);

		headers.set("location", "/managment/user/show");
		return new Response(null, {
			status: 302,
			headers,
		});
	},
};
