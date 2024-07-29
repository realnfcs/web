import { Handlers, PageProps } from "$fresh/server.ts";
import { getProduct, getSupplier, initConnection, Product } from "../../../services/database.ts";

interface Data {
	product: Product
	supplier: string
}

export const handler: Handlers<Data> = {

	async GET(_req, ctx) {

		const result = await getProduct(initConnection(), ctx.params.id)

		const product: Product = {
			id: result.rows[0][0] as string,
			code: result.rows[0][1] as string,
			qtt: result.rows[0][2] as number,
			name: result.rows[0][3] as string,
			price: result.rows[0][4] as number,
			type: result.rows[0][5] as string,
			supplierId: result.rows[0][6] as string,
		}
		
		const supplier = await getSupplier(initConnection(), product.supplierId)

		return ctx.render!({product, supplier: supplier.rows[0][2] as string})
	}
}

export default function ShowProduct({ data }: PageProps<Data>) {

	return (

		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Produto Registrado</h1>
			
			<table class="table-auto border-collapse border border-gray-300 my-8 text-lg">
				<thead>
					<tr>
						<th class="border border-gray-300 px-4 py-2">ID</th>
						<th class="border border-gray-300 px-4 py-2">Nome</th>
						<th class="border border-gray-300 px-4 py-2">Código</th>
						<th class="border border-gray-300 px-4 py-2">Preço</th>
						<th class="border border-gray-300 px-4 py-2">Quantidade</th>
						<th class="border border-gray-300 px-4 py-2">Type</th>
						<th class="border border-gray-300 px-4 py-2">Fornecedor</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-300 px-4 py-2">{data.product.id}</td>
						<td class="border border-gray-300 px-4 py-2">{data.product.name}</td>
						<td class="border border-gray-300 px-4 py-2">{data.product.code}</td>
						<td class="border border-gray-300 px-4 py-2">R$ {data.product.price}</td>
						<td class="border border-gray-300 px-4 py-2">{data.product.qtt}</td>
						<td class="border border-gray-300 px-4 py-2">{data.product.type}</td>
						<td class="border border-gray-300 px-4 py-2">{data.supplier}</td>
					</tr>
				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);
}