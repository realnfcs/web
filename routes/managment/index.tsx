import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { getUser, initConnection, roles, User } from "../../services/database.ts";

interface Data {
	id: string;
	role: string;
	user: User
}

export const handler: Handlers = {
	async GET(req, ctx) {

		const cookies = getCookies(req.headers);

		const result = await getUser(initConnection(), cookies.id)

		const user: User = {
			id: result.rows[0][0] as string,
			name: result.rows[0][1] as string,
			email: result.rows[0][2] as string,
			password: result.rows[0][3] as string,
			role: result.rows[0][4] as string,
		}

		return ctx.render!({ id: cookies.id, role: cookies.role, user: user });
	},
};

export default function Managment({ data }: PageProps<Data>) {

	return (
		
		<>
		
		{data.role === roles[0] 
		
		? (
			<div class="flex items-center justify-around">
				<div class="flex flex-col items-start justify-start p-12">
					<div class="flex flex-col items-start justify-start">
						<h1 class="font-semibold text-6xl">{data.user.name}</h1>
						<p class="font-normal text-lg">{data.user.role} - {data.user.email}</p>
					</div>
					<div class="flex flex-col items-start justify-start mt-8">
						<a href="/managment/user/show" class="my-2 font-medium text-4xl text-violet-700">Mostrar Usuários {'>'}</a>
						<a href="/managment/dependent/all" class="my-2 font-medium text-4xl text-violet-700">Mostrar Dependentes {'>'}</a>
						<a href="/managment/supplier/show" class="my-2 font-medium text-4xl text-violet-700">Mostrar Fornecedores {'>'}</a>
						<a href="/managment/supplier/register" class="my-2 font-medium text-4xl text-violet-700">Cadastrar Fornecedores {'>'}</a>
						<a href="/managment/product/show" class="my-2 font-medium text-4xl text-violet-700">Mostrar Produtos {'>'}</a>
						<a href="/managment/product/register" class="my-2 font-medium text-4xl text-violet-700">Cadastrar Produto {'>'}</a>
					</div>
				</div>

				<div class="max-w-prose p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
						
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Você está na área de administração</h5>
					
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Aqui você gerencia usuarios, fornecedores e seus produtos, podendo ver, criar, modificar e excluir entidades.</p>
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Uma nova atualização aconteceu na UI, com adição do <code>Flowbite</code>, foi adicionado estilosos componentes às páginas!</p>
					<a href="https://flowbite.com/" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
						Ler mais sobre
						<svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
						</svg>
					</a>
				</div>

			</div>
			
		) : (

			<div class="flex flex-col items-start justify-start p-12">
				<div class="flex flex-col items-start justify-start">
					<h1 class="font-semibold text-6xl">{data.user.name}</h1>
					<p class="font-normal text-lg">{data.user.role} - {data.user.email}</p>
				</div>
				<div class="flex flex-col items-start justify-start mt-8">
					<a href="/managment/dependent/show" class="my-2 font-medium text-4xl text-violet-950">Mostrar Dependente {'>'}</a>
					<a href="/managment/dependent/register" class="my-2 font-medium text-4xl text-violet-950">Cadastrar Dependente {'>'}</a>
				</div>
			</div>
		)}

		</>
	);
}