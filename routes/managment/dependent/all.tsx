import { Handlers, PageProps } from "$fresh/server.ts";
import { Dependent, getDependents, initConnection } from "../../../services/database.ts";

export const handler: Handlers<Dependent[]> = {

	async POST(req, ctx) {

		const form = await req.formData();

		const relationship = form.get("relationship")?.toString() || "";

		const result = await getDependents(initConnection(), relationship)
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

export default function All({ data }: PageProps<Dependent[]>) {
	return (

		<div class="flex flex-col items-start justify-start p-12">

			<h1 class="font-semibold text-6xl">Buscar Dependentes</h1>

			<form method="POST" class="p-4 border-2 border-violet-950 bg-white text-black my-8">
				<div class="m-2">
					<label>Parentesco: </label>
					<input type="text" name="relationship" class="w-full focus:outline-none p-2 bg-neutral-200" placeholder="ID do usuário" required autocomplete="off"/>
				</div>

				<div class="flex w-full justify-start items-start">
					<button type="submit" class="mx-2 my-4 bg-slate-900 text-white p-2 shadow-sm hover:bg-slate-700">Buscar</button>
				</div>
			</form>

			{data && 
				(
					<>
						<h1 class="text-xl">Dependentes Encontrados:</h1>

						<table class="table-auto border-collapse border border-gray-300 text-lg my-4">
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
					</>
				) 
			
			}

			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700 mt-4">Voltar ↗</a>
		</div>

	);
}