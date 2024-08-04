import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { deleteProduct, initConnection, roles } from "../../../../services/database.ts";

export const handler: Handlers = {
	async GET(req, ctx) {

		const cookies = getCookies(req.headers);

		if (cookies.role !== roles[0]) {
			const url = new URL(req.url);
      		url.pathname = "/";
      		return Response.redirect(url);
		}

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
