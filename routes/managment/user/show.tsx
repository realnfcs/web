import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getUsers, initConnection, roles, User } from "../../../services/database.ts";

export const handler: Handlers<User[]> = {

	async GET(req, ctx) {

		const cookies = getCookies(req.headers);
		if (cookies.role !== roles[0]) {
			const url = new URL(req.url);
      		url.pathname = "/";
      		return Response.redirect(url);
		}

		const result: QueryArrayResult = await getUsers(initConnection())
		
		const users: User[] = result.rows.map((user): User => {
			return {
				id: user[0] as string,
				name: user[1] as string,
				email: user[2] as string,
				password: user[3] as string,
				role: user[4] as string
			}
		})
		return ctx.render(users)
	}
}

export default function ShowUsers({ data }: PageProps<User[]>) {

	return (
		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Usuários Cadastrados</h1>
			
			<table class="table-fixed border-collapse border border-gray-300 my-8 text-lg">
				<thead>
					<tr>
						<th class="border border-gray-300 px-4 py-2">ID</th>
						<th class="border border-gray-300 px-4 py-2">Nome</th>
						<th class="border border-gray-300 px-4 py-2">Email</th>
					</tr>
				</thead>
				<tbody>
					{data.map((user) => (
						<tr>
							<td class="border border-gray-300 px-4 py-2">{user.id}</td>
							<td class="border border-gray-300 px-4 py-2">{user.name}</td>
							<td class="border border-gray-300 px-4 py-2">{user.email}</td>
							<td class="border border-gray-300 px-4 py-2">
								<a href={`/managment/user/update/${user.id}`} class="text-blue-400 mr-2">Atualizar ↗</a>
								<a href={`/managment/user/delete/${user.id}`} class="text-red-600 ml-2">Remover ↗</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-700 hover:text-violet-700">Voltar ↗</a>

		</div>
	);
}