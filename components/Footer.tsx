export function Footer(props: {css?: string, icon: string}) {

	return (
		<footer class={`fixed mt-4 bottom-0 w-full ${props.css}`}>
			<div class="flex flex-1 items-center justify-around mx-auto max-w-7x1 p-4 bg-black text-white font-semibold">
				<div>
					<img class="mx-2" width="80" height="30" src={props.icon} alt="logo" />
				</div>
				<div class="flex flex-col items-end">
					<p>Departamento de Ciência da Computação</p>
					<p>Introdução ao Desenvolvimento Web</p>
				</div>
			</div>
			
		</footer>
	);
}