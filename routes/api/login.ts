import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getUserByEmail, initConnection, User } from "../../services/database.ts";


export const handler: Handlers = {
	async POST(req) {
		const url = new URL(req.url);
		const form = await req.formData();

		const email		= form.get("email")?.toString() 	|| "";
		const password 	= form.get("password")?.toString() 	|| "";

		const result: QueryArrayResult = await getUserByEmail(initConnection(), email)

		if (result.rowCount == 0) {
			const headers = new Headers();
			headers.set("location", "/error");
			return new Response(null, {
				status: 303, // "See Other"
				headers,
			});
		}

		console.log(result, email, password)

		const user: User = {
			id: result.rows[0][0] as string,
			name: result.rows[0][1] as string,
			email: result.rows[0][2] as string,
			password: result.rows[0][3] as string,
			role: result.rows[0][4] as string,
		}
		
		if (
			user.password === password
		) {
			const headers = new Headers();
			setCookie(headers, {
				name: "auth",
				value: "bar", // this should be a unique value for each session
				maxAge: 520,
				sameSite: "Lax", // this is important to prevent CSRF attacks
				domain: url.hostname,
				path: `/`,
				secure: true,
			});

			setCookie(headers, {
				name: "id",
				value: user.id, // this should be a unique value for each session
				maxAge: 520,
				sameSite: "Lax", // this is important to prevent CSRF attacks
				domain: url.hostname,
				path: `/`,
				secure: true,
			});

			setCookie(headers, {
				name: "role",
				value: user.role, // this should be a unique value for each session
				maxAge: 520,
				sameSite: "Lax", // this is important to prevent CSRF attacks
				domain: url.hostname,
				path: `/`,
				secure: true,
			});

			headers.set("location", "/");
			return new Response(null, {
				status: 303, // "See Other"
				headers,
			});
		} else {
			return new Response(null, {
				status: 403,
			});
		}
	},
};