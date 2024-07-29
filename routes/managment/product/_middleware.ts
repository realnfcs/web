import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export async function handler(
	req: Request,
	ctx: FreshContext,
) {
	const cookies = getCookies(req.headers);
	const role_token = cookies.role;

	const headers = new Headers();
	headers.set("location", "/");

	if (role_token != "admin") {
		// Can't use 403 if we want to redirect to home page.
		return new Response("", {
			status: 307,
			headers: headers,
		});
	}

	return await ctx.next();
}
