import { Navbar } from "../components/Navbar.tsx";

export default function Login() {
	return (
		<>
			<Navbar icon="/logo.svg" />
			
			<div class="flex flex-col items-center justify-center">

				<h1 class="font-bold text-2xl mb-4">Login</h1>

				<form method="POST" action="/api/login" class="p-4 border-2 border-violet-950">

					<div class="m-2">
						<label>Email: </label>
						<input type="text" name="email" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
					</div>

					<div class="m-2">
						<label>Senha: </label>
						<input type="password" name="password" class="w-full focus:outline-none p-2 bg-neutral-200" required autocomplete="off"/>
					</div>

					<div class="flex w-full justify-center items-center">
						<button type="submit" class="mx-2 my-4 bg-slate-900 text-white p-2 shadow-sm hover:bg-slate-800 transition">Logar</button>
					</div>

				</form>
			</div>
		</>
	);
}