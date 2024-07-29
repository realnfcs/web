import { Handlers, PageProps } from "$fresh/server.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getProducts, getSuppliers, initConnection, Product, Supplier } from "../../../services/database.ts";

interface Data {
	product: Product
	supplier: string
}

export const handler: Handlers = {

	async GET(_req, ctx) {

		const result: QueryArrayResult = await getProducts(initConnection())
		
		const suppliers_result: QueryArrayResult = await getSuppliers(initConnection())
		
		const suppliers: Supplier[] = suppliers_result.rows.map((supplier): Supplier => {
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

		const data: Data[] = result.rows.map((product): Data => {
			const p: Product = {
				id: product[0] as string,
				code: product[1] as string,
				qtt: product[2] as number,
				name: product[3] as string,
				price: product[4] as number,
				type: product[5] as string,
				supplierId: product[6] as string,
			}

			const supplier = suppliers.find(s => s.id === p.supplierId);
			const supplierName = supplier ? supplier.name : "Unknown Supplier";

			return {
				product: p, 
				supplier: supplierName
			}
		})

		return ctx.render(data)
	}
}

export default function ShowProducts({ data }: PageProps<Data[]>) {

	return (

		<div class="flex flex-col items-start justify-start p-12">
			
			<h1 class="font-semibold text-6xl">Produtos Registrados</h1>
			
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
					
					{data.map((d) => (
						<tr>
							<td class="border border-gray-300 px-4 py-2">{d.product.id}</td>
							<td class="border border-gray-300 px-4 py-2">{d.product.name}</td>
							<td class="border border-gray-300 px-4 py-2">{d.product.code}</td>
							<td class="border border-gray-300 px-4 py-2">R$ {d.product.price}</td>
							<td class="border border-gray-300 px-4 py-2">{d.product.qtt}</td>
							<td class="border border-gray-300 px-4 py-2">{d.product.type}</td>
							<td class="border border-gray-300 px-4 py-2">{d.supplier}</td>
							<td class="border border-gray-300 px-4 py-2">
								<a href={`/managment/product/update/${d.product.id}`} class="text-blue-400 mr-2">Atualizar ↗</a>
								<a href={`/managment/product/delete/${d.product.id}`} class="text-red-600 ml-2">Remover ↗</a>
							</td>
						</tr>
					))}

				</tbody>
			</table>
			<a href="/managment" class="font-normal text-2xl underline text-violet-950 hover:text-violet-700">Voltar ↗</a>

		</div>
	);
}