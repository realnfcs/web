import { Handlers, PageProps } from "$fresh/server.ts";
import { getSupplier, initConnection, Supplier } from "../../../services/database.ts";

export const handler: Handlers<Supplier> = {

	async GET(_req, ctx) {

		const result = await getSupplier(initConnection(), ctx.params.id)

		const supplier: Supplier = {
			id: result.rows[0][0] as string,
			cnpj: result.rows[0][1] as string,
			name: result.rows[0][2] as string,
			telephone: result.rows[0][3] as string,
			email: result.rows[0][4] as string,
			registerDate: result.rows[0][5] as string,
			address: result.rows[0][6] as string,
		}
		
		return ctx.render(supplier)
	}
}

export default function ShowSupplier({ data }: PageProps<Supplier>) {

	return (

		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Fornecedor Registrado</h1>
			
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
					<tr>
						<td class="border border-gray-300 px-4 py-2">{data.id}</td>
						<td class="border border-gray-300 px-4 py-2">{data.name}</td>
						<td class="border border-gray-300 px-4 py-2">{data.email}</td>
						<td class="border border-gray-300 px-4 py-2">{data.cnpj}</td>
						<td class="border border-gray-300 px-4 py-2">{data.telephone}</td>
						<td class="border border-gray-300 px-4 py-2">{data.registerDate}</td>
						<td class="border border-gray-300 px-4 py-2">{data.address}</td>
					</tr>
				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);

}