import { Handlers } from "$fresh/server.ts";
import { deleteProduct, initConnection } from "../../../../services/database.ts";

export const handler: Handlers = {
	async GET(req, ctx) {
		const headers = new Headers(req.headers);

		const id = ctx.params.id;
		const result = await deleteProduct(initConnection(), id);
		console.log(result);

		headers.set("location", "/managment/product/show");
		return new Response(null, {
			status: 302,
			headers,
		});
	},
};
