import { Handlers, PageProps } from "$fresh/server.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getUser, initConnection, roles, updateUserRole, User } from "../../../../services/database.ts";

interface Data {
	name: string
}

export const handler: Handlers = {
	
	async GET (_req, ctx) {
		const result: QueryArrayResult = await getUser(initConnection(), ctx.params.id)

		return ctx.render!({name: result.rows[0][1] as string,})
	},

	async POST(req, ctx) {
		
		const form = await req.formData();

		const name = form.get("name")?.toString() || "";
		const role = form.get("role")?.toString() || "";

		const user: User = {
			id: ctx.params.id,
			name,
			email: "",
			password: "",
			role
		}

		const result = await updateUserRole(initConnection(), user);
		console.log(result)
        const url = `/managment/user/${user.id}`

		const headers = new Headers();
		headers.set("location", url);
		
		return new Response(null, {
		  status: 302,
		  headers,
		})
	}
}

export default function update({ data }: PageProps<Data>) {

	return (

		<div class="flex flex-col items-center justify-center">
			<h1 class="font-bold text-2xl mb-4">Atualizar Usuário</h1>

			<form method="POST" class="p-4 border-2 border-white bg-white text-black">

				<div class="m-2">
					<label>Nome: </label>
					<input type="text" value={data.name} name="name" class="w-full focus:outline-none p-2 bg-neutral-200 text-black" required autocomplete="off"/>
				</div>

				<div class="m-2">
				<label>Selecionar função: </label>
					<select name="role" class="w-full focus:outline-none p-3 bg-neutral-200 text-black" required>
						{roles.map((role) => 
							<option value={role}>{role}</option>
						)}
					</select>
				</div>

				<div class="flex w-full justify-center items-center">
					<button type="submit" class="mx-2 my-4 bg-slate-900 text-white p-2 shadow-sm hover:bg-slate-800 transition">Atualizar</button>
				</div>

			</form>
		</div>
	);
}