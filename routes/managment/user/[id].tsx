import { Handlers, PageProps } from "$fresh/server.ts";
import { getUser, initConnection, User } from "../../../services/database.ts";

export const handler: Handlers<User> = {

	async GET(_req, ctx) {

		const result = await getUser(initConnection(), ctx.params.id)

		const user: User = {
			id: result.rows[0][0] as string,
			name: result.rows[0][1] as string,
			email: result.rows[0][2] as string,
			password: result.rows[0][3] as string,
			role: result.rows[0][4] as string,
		}
		
		return ctx.render(user)
	}
}

export default function ShowUser({ data }: PageProps<User>) {
	
	return (
		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Informações do Usuário</h1>
			
			<table class="table-auto border-collapse border border-gray-300 my-8 text-lg">
				<thead>
					<tr>
						<th class="border border-gray-300 px-4 py-2">ID</th>
						<th class="border border-gray-300 px-4 py-2">Nome</th>
						<th class="border border-gray-300 px-4 py-2">Email</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-300 px-4 py-2">{data.id}</td>
						<td class="border border-gray-300 px-4 py-2">{data.name}</td>
						<td class="border border-gray-300 px-4 py-2">{data.email}</td>
					</tr>
				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);
}