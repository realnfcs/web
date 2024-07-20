export interface items {
	name: string
	url: string
}

export function Navbar(props: {css?: string, navItems?: items[], icon: string}) {

	const css = `w-full border-b-2 border-gray-700 mb-16 ${props.css || ''}`

	return (
		<nav class={css}>
			<div class="mx-auto max-w-7x1 mb-4 p-2">
				<div class="flex flex-1 items-center justify-around">
					<div class="flex flex-shrink-0 justify-stretch items-center">
						<img class="mx-2" width="90" height="40" src={props.icon} alt="logo" />
						<a href="/" class="font-extrabold text-4xl">DACC</a>	
					</div>

					<div class="flex justify-around">
						{props.navItems ? props.navItems.map((item) =>
							<a href={item.url} class="font-normal text-xl px-4 py-2 mx-8">{item.name}</a>
						) : <a href="/" class="font-normal text-xl px-4 py-2 mx-8">Home</a>  }
					</div>
				</div>
			</div>
		</nav>
	);

}