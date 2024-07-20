import { Handlers, PageProps } from "$fresh/server.ts";
import { Dependent, getDependent, initConnection } from "../../../services/database.ts";

export const handler: Handlers<Dependent> = {

	async GET(_req, ctx) {

		const result = await getDependent(initConnection(), ctx.params.id)

		const dependent: Dependent = {
			id: result.rows[0][0] as string,
			name: result.rows[0][1] as string,
			birthDate: result.rows[0][2] as string,
			relationship: result.rows[0][3] as string
		}
		
		return ctx.render(dependent)
	}
}

export default function ShowDependent({ data }: PageProps<Dependent>) {

	return (

		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Dependente Registrado</h1>
			
			<table class="table-auto border-collapse border border-gray-300 my-8 text-lg">
				<thead>
					<tr>
						<th class="border border-gray-300 px-4 py-2">ID</th>
						<th class="border border-gray-300 px-4 py-2">Nome</th>
						<th class="border border-gray-300 px-4 py-2">Data de Nascimento</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-300 px-4 py-2">{data.id}</td>
						<td class="border border-gray-300 px-4 py-2">{data.name}</td>
						<td class="border border-gray-300 px-4 py-2">{data.birthDate}</td>
					</tr>
				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);

}