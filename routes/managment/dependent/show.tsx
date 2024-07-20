import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { Dependent, getDependents, initConnection } from "../../../services/database.ts";

export const handler: Handlers<Dependent[]> = {

	async GET(req, ctx) {

		const cookies = getCookies(req.headers);
	
		const result: QueryArrayResult = await getDependents(initConnection(), cookies.id)
		
		const dependents: Dependent[] = result.rows.map((dependent): Dependent => {
			return {
				id: dependent[0] as string,
				name: dependent[1] as string,
				birthDate: dependent[2] as string,
				relationship: dependent[3] as string
			}
		})

		return ctx.render(dependents);
	}
}

export default function Show({ data }: PageProps<Dependent[]>) {
	return (
		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Seus Dependentes</h1>
			
			<table class="table-auto border-collapse border border-gray-300 my-8 text-lg">
				<thead>
					<tr>
						<th class="border border-gray-300 px-4 py-2">Nome</th>
						<th class="border border-gray-300 px-4 py-2">Data de Nascimento</th>
					</tr>
				</thead>
				<tbody>
					{data.map((dependent) => (
						<tr>
							<td class="border border-gray-300 px-4 py-2">{dependent.name}</td>
							<td class="border border-gray-300 px-4 py-2">{dependent.birthDate}</td>
						</tr>
					))}
				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);
}