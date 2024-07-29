import { Handlers } from "$fresh/server.ts";
import { deleteSupplier, initConnection } from "../../../../services/database.ts";

export const handler: Handlers = {
	async GET(req, ctx) {
		const headers = new Headers(req.headers);

		const id = ctx.params.id;
		const result = await deleteSupplier(initConnection(), id);
		console.log(result);

		headers.set("location", "/managment/supplier/show");
		return new Response(null, {
			status: 302,
			headers,
		});
	},
};
