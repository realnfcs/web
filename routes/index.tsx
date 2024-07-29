import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { items, Navbar } from "../components/Navbar.tsx";
// import { InputText } from "npm:primereact/inputtext"

const navItems: items[] = [
	{
		name: "Cadastrar-se",
		url: "/register"
	},
	{
		name: "Login",
		url: "/login"
	}
]

interface Data {
	isAllowed: boolean;
	id: string;
	role: string;
  }
  
export const handler: Handlers = {
	GET(req, ctx) {
		const cookies = getCookies(req.headers);

		if (cookies.auth === "bar") {
			const headers = new Headers(req.headers);
			headers.set("location", "/managment");
    		return new Response(null, {
      			status: 303,
      			headers,
    		});
		}

		return ctx.render();
	},
};

export default function Home() {

	return (
		<div class="h-max">
			<Navbar navItems={navItems} icon="/logo.svg" />
			<div class="flex flex-col h-full items-center justify-center">
				<div class="flex items-center justify-center">
					<img src="/undraw_secure_login_pdn4_1.svg" />
					<div class="max-w-min p-8">
						<h1 class="text-7xl font-bold">Plataforma de Gerenciamento de <code class="text-blue-950">usuários</code> e <code class="text-blue-950">produtos</code></h1>
					</div>
				</div>
				<div class="flex">
					<a href="/register" class="font-normal text-2xl px-4 py-2 mx-8 underline text-violet-950 hover:text-violet-700">Cadastrar-se ↗</a>
					<a href="/login" class="font-normal text-2xl px-4 py-2 mx-8 underline text-violet-950 hover:text-violet-700">Login ↗</a>
				</div>
			</div>	
		</div>
	);
}
