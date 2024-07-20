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
		
			<div class="flex flex-col items-start justify-start p-12">
				<div class="flex flex-col items-start justify-start">
					<h1 class="font-semibold text-6xl">{data.user.name}</h1>
					<p class="font-normal text-lg">{data.user.role} - {data.user.email}</p>
				</div>
				<div class="flex flex-col items-start justify-start mt-8">
					<a href="/managment/user/show" class="my-2 font-medium text-4xl text-violet-700">Mostrar Usuários {'>'}</a>
					<a href="/managment/dependent/all" class="my-2 font-medium text-4xl text-violet-700">Mostrar Dependentes {'>'}</a>
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