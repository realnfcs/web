import { Handlers, PageProps } from "$fresh/server.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getProduct, getSuppliers, initConnection, Product, roles, Supplier, updateProduct } from "../../../../services/database.ts";
import { getCookies } from "$std/http/cookie.ts";

interface Data {
	product: Product
	suppliers: Supplier[]
}

export const handler: Handlers<Data> = {

	async GET(req, ctx) {

		const cookies = getCookies(req.headers);

		if (cookies.role !== roles[0]) {
			const url = new URL(req.url);
      		url.pathname = "/";
      		return Response.redirect(url);
		}

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

		return ctx.render({product, suppliers})
	},

	async POST(req, ctx) {
		
		const form = await req.formData();

		const name 		= form.get("name")?.toString() 		|| "";
		const code 		= form.get("code")?.toString() 		|| "";
		const qtt 		= form.get("qtt")!.toString();
		const price 	= form.get("price")!.toString();
		const type 		= form.get("type")?.toString() 		|| "";
		const suppliers = form.get("suppliers")?.toString() || "";

		const product: Product = {
			id: ctx.params.id,
			name,
			code,
			qtt: parseInt(qtt, 10),
			price: parseFloat(price),
			type,
			supplierId: suppliers
		}

		console.log(product)
		
		const result = await updateProduct(initConnection(), product);
		console.log(result)
		
        const url = `/managment/product/${product.id}`
		
		const headers = new Headers();
		headers.set("location", url);

		return new Response(null, {
		  status: 302,
		  headers,
		})
	}
}

export default function update({ data }: PageProps<Data>) {

	return (
		<div class="flex flex-col items-center justify-center">
			<h1 class="font-bold text-2xl mb-4">Atualizar Produto</h1>

			<form method="POST" class="max-w-md mx-auto">
				<div class="relative z-0 w-full mb-5 group">
					<input
						type="text"
						value={data.product.name}
						name="name"
						id="name"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="name"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>
						Nome
					</label>
				</div>

				<div class="relative z-0 w-full mb-5 group">
					<input
						type="text"
						value={data.product.code}
						name="code"
						id="code"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="code"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>
						Código
					</label>
				</div>

				<div class="grid md:grid-cols-2 md:gap-6">
					<div class="relative z-0 w-full mb-5 group">
						<input
							type="number"
							value={data.product.qtt}
							name="qtt"
							id="qtt"
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="qtt"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Quantidade
						</label>
					</div>

					<div class="relative z-0 w-full mb-5 group">
						<input
							type="text"
							value={data.product.price}
							name="price"
							id="price"
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="price"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Preço
						</label>
					</div>
				</div>

				<div class="relative z-0 w-full mb-5 group">
					<input
						type="text"
						value={data.product.type}
						name="type"
						id="type"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="type"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>
						Tipo
					</label>
				</div>

				<div class="relative z-0 w-full mb-5 group">
					<label for="suppliers" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecione o Fornecedor</label>
					<select name="suppliers" id="suppliers" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						{data.suppliers.map((supplier) => (
							<option value={supplier.id}>{supplier.name}</option>
						))}
					</select>
				</div>
				
				<div class="flex w-full justify-center items-center">
					<button
						type="submit"
						class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Atualizar
					</button>
				</div>
			</form>
		</div>
	);
}