import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getSuppliers, initConnection, roles, Supplier } from "../../../services/database.ts";

export const handler: Handlers<Supplier[]> = {

	async GET(req, ctx) {

		const cookies = getCookies(req.headers);
		if (cookies.role !== roles[0]) {
			const url = new URL(req.url);
      		url.pathname = "/";
      		return Response.redirect(url);
		}

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
		return ctx.render(suppliers)
	}
}

export default function ShowSuppliers({ data }: PageProps<Supplier[]>) {

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
					{data.map((supplier) => (
						<tr>
							<td class="border border-gray-300 px-4 py-2">{supplier.id}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.name}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.email}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.cnpj}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.telephone}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.registerDate}</td>
							<td class="border border-gray-300 px-4 py-2">{supplier.address}</td>
							<td class="border border-gray-300 px-4 py-2">
								<a href={`/managment/supplier/update/${supplier.id}`} class="text-blue-400 mr-2">Atualizar ↗</a>
								<a href={`/managment/supplier/delete/${supplier.id}`} class="text-red-600 ml-2">Remover ↗</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);
}