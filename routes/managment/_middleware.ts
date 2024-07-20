import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

interface State {
	data: string;
}

export async function handler(
	req: Request,
	ctx: FreshContext<State>,
) {
	const cookies = getCookies(req.headers);
	const access_token = cookies.auth;

	const headers = new Headers();
	headers.set("location", "/");

	if (!access_token) {
		// Can't use 403 if we want to redirect to home page.
		return new Response("", {
			status: 307,
			headers: headers,
		});
	}

	const role = cookies.role;

	ctx.state.data = role;

	return await ctx.next();
}
