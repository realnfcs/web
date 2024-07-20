import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { Dependent, initConnection, insertDependent } from "../../../services/database.ts";

interface Data {
	id: string;
}

export const handler: Handlers = {
	
	async POST(req, _ctx) {
		
		const form = await req.formData();

		const name = form.get("name")?.toString() || "";
		const birthDate = form.get("birthDate")?.toString() || "";

		const cookies = getCookies(req.headers);

		const dependent: Dependent = {
			id: crypto.randomUUID(),
			name,
			birthDate,
			relationship: cookies.id
		}

		const result = await insertDependent(initConnection(), dependent);
		console.log(result)

        const url = `/managment/dependent/${dependent.id}`

		const headers = new Headers();
		headers.set("location", url);

		return new Response(null, {
		  status: 302,
		  headers,
		})
	}
}

export default function Register() {

	return (
		<div class="flex flex-col items-center justify-center">
			<h1 class="font-bold text-2xl mb-4">Cadastrar Dependente</h1>

			<form method="POST" class="p-4 border-2 border-violet-950">
				<div class="m-2">
					<label>Nome: </label>
					<input type="text" name="name" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
				</div>

				<div class="m-2">
					<label>Data de Nascimento: </label>
					<input type="date" name="birthDate" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
				</div>

				<div class="flex w-full justify-center items-center">
					<button type="submit" class="mx-2 my-4 bg-slate-900 text-white p-2 shadow-sm">Cadastrar</button>
				</div>
			</form>
		</div>		
	);
}