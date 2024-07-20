import { Navbar } from "../components/Navbar.tsx";
import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { initConnection, insertUser, roles, User } from "../services/database.ts";

export const handler: Handlers = {
	
	async POST(req, _ctx) {
		
		const url = new URL(req.url);

		const form = await req.formData();

		const name 		= form.get("name")?.toString() 		|| "";
		const email 	= form.get("email")?.toString() 	|| "";
		const password 	= form.get("password")?.toString() 	|| "";
		const confirm 	= form.get("confirm")?.toString() 	|| "";
		const role 		= form.get("role")?.toString() 		|| "";

		if (password != confirm) {
			return new Response("Query não pode ser vazia", { status: 400 });
		}

		const user: User = {
			id: crypto.randomUUID(),
			name,
			email,
			password,
			role
		}

		const result = await insertUser(initConnection(), user);
		console.log(result)

		const headers = new Headers();
		setCookie(headers, {
			name: "auth",
			value: "bar", // this should be a unique value for each session
			maxAge: 120,
			sameSite: "Lax", // this is important to prevent CSRF attacks
			domain: url.hostname,
			path: `/`,
			secure: true,
		});

		setCookie(headers, {
			name: "id",
			value: user.id, // this should be a unique value for each session
			maxAge: 120,
			sameSite: "Lax", // this is important to prevent CSRF attacks
			domain: url.hostname,
			path: `/`,
			secure: true,
		});

		setCookie(headers, {
			name: "role",
			value: user.role, // this should be a unique value for each session
			maxAge: 120,
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
	}
}

export default function Register() {
	return (
		<>
			<Navbar icon="/logo.svg" />

			<div class="flex flex-col items-center justify-center">
				<h1 class="font-bold text-2xl mb-4">Registrar-se</h1>

				<form method="POST" class="p-4 border-2 border-violet-950">
					<div class="m-2">
						<label>Nome: </label>
						<input type="text" name="name" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
					</div>

					<div class="m-2">
						<label>Email: </label>
						<input type="text" name="email" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
					</div>

					<div class="m-2">
						<label>Senha: </label>
						<input type="password" name="password" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
					</div>

					<div class="m-2">
						<label>Confirmar Senha: </label>
						<input type="password" name="confirm" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
					</div>

					<div class="m-2">
						<label>Selecionar função: </label>
						<select name="role" class="w-full focus:outline-none p-3 bg-neutral-200" required>
							{roles.map((role) => 
								<option value={role}>{role}</option>
							)}
						</select>
					</div>

					<div class="flex w-full justify-center items-center">
						<button type="submit" class="mx-2 my-4 bg-slate-900 text-white p-2 shadow-sm hover:bg-slate-800 transition">Cadastrar</button>
					</div>
				</form>
			</div>
		</>
	);
}