import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getSupplier, initConnection, roles, Supplier, updateSupplier } from "../../../../services/database.ts";

export const handler: Handlers<Supplier> = {

	async GET (req, ctx) {

		const cookies = getCookies(req.headers);

		if (cookies.role !== roles[0]) {
			const url = new URL(req.url);
      		url.pathname = "/";
      		return Response.redirect(url);
		}

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
	},

	async POST(req, ctx) {
		
		const form = await req.formData();

		const name 		= form.get("name")?.toString()	  	|| "";
		const email 	= form.get("email")?.toString() 	|| "";
		const cnpj 		= form.get("cnpj")?.toString() 	  	|| "";
		const telephone = form.get("telephone")?.toString() || "";
		const date 		= form.get("date")?.toString() 	  	|| "";
		const address 	= form.get("address")?.toString()   || "";

		const supplier: Supplier = {
			id: ctx.params.id,
			cnpj,
			name,
			telephone,
			email,
			registerDate: date,
			address
		}

		const result = await updateSupplier(initConnection(), supplier);
		console.log(result)
		
        const url = `/managment/supplier/${supplier.id}`
		
		const headers = new Headers();
		headers.set("location", url);

		return new Response(null, {
		  status: 302,
		  headers,
		})
	}
}

export default function update({ data }: PageProps<Supplier>) {

	return (
		<div class="flex flex-col items-center justify-center">
			<h1 class="font-bold text-2xl mb-4">Atualizar Fornecedor</h1>

			<form method="POST" class="max-w-md mx-auto">
				<div class="relative z-0 w-full mb-5 group">
					<input
						type="text"
						value={data.name}
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
						type="email"
						value={data.email}
						name="email"
						id="email"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="email"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>
						Email
					</label>
				</div>

				<div class="relative z-0 w-full mb-5 group">
					<input
						type="text"
						value={data.cnpj}
						name="cnpj"
						id="cnpj"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="cnpj"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>
						CNPJ
					</label>
				</div>

				<div class="grid md:grid-cols-2 md:gap-6">
					<div class="relative z-0 w-full mb-5 group">
						<input
							type="text"
							value={data.telephone}
							name="telephone"
							id="telephone"
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="telephone"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Telefone
						</label>
					</div>
					<div class="relative z-0 w-full mb-5 group">
						<input
							type="text"
							value={data.registerDate}
							name="date"
							id="date"
							class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
							placeholder=" "
							required
						/>
						<label
							for="date"
							class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
						>
							Data de Cadastro
						</label>
					</div>
				</div>

				<div class="relative z-0 w-full mb-5 group">
					<input
						type="address"
						value={data.address}
						name="address"
						id="address"
						class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
						placeholder=" "
						required
					/>
					<label
						for="address"
						class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
					>
						Endereço
					</label>
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