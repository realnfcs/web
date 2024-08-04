import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getSuppliers, initConnection, roles, Supplier } from "../../../services/database.ts";

interface Data {
	suppliers: Supplier[]
	role: string
}

export const handler: Handlers<Data> = {

	async GET(req, ctx) {

		const cookies = getCookies(req.headers);

		const result: QueryArrayResult = await getSuppliers(initConnection())
		
		const suppliers: Supplier[] = result.rows.map((supplier): Supplier => {
			return {
				id: supplier[0] as string,
				cnpj: supplier[1] as string,
				name: supplier[2] as string,
				telephone: supplier[3] as string,
				email: supplier[4] as string,
				registerDate: supplier[5] as string,
				address: supplier[6] as string,
			}
		})
		return ctx.render({suppliers, role: cookies.role})
	}
}

export default function ShowSuppliers({ data }: PageProps<Data>) {

	return (

		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Fornecedores Registrados</h1>
			
			<table class="table-auto border-collapse border border-gray-300 my-8 text-lg">
				<thead>
					<tr>
						<th class="border border-gray-300 px-4 py-2">ID</th>
						<th class="border border-gray-300 px-4 py-2">Nome</th>
						<th class="border border-gray-300 px-4 py-2">Email</th>
						<th class="border border-gray-300 px-4 py-2">CNPJ</th>
						<th class="border border-gray-300 px-4 py-2">Telefone</th>
						<th class="border border-gray-300 px-4 py-2">Data de Cadastro</th>
						<th class="border border-gray-300 px-4 py-2">Endereço</th>
					</tr>
				</thead>
				<tbody>
					{data.suppliers.map((supplier) => (
						<tr>
							<td class="border border-gray-300 px-4 py-2">{supplier.id}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.name}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.email}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.cnpj}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.telephone}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.registerDate}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.address}</td>
							{data.role == roles[0] &&
								<td class="border border-gray-300 px-4 py-2">
									<a href={`/managment/supplier/update/${supplier.id}`} class="text-blue-400 mr-2">Atualizar ↗</a>
									<a href={`/managment/supplier/delete/${supplier.id}`} class="text-red-600 ml-2">Remover ↗</a>
								</td>
							}
						</tr>
					))}
				</tbody>
			</table>
			
			{data.role == roles[0] &&
				<a href="/managment/supplier/report" class="font-normal text-2xl underline text-blue-400 hover:text-violet-700">Fazer Download do Relatório ↗</a>
			}
			<a href="/managment" class="font-normal mt-2 text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);
}