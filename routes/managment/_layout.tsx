import { PageProps, RouteConfig } from "$fresh/server.ts";
import { Footer } from "../../components/Footer.tsx";
import { items, Navbar } from "../../components/Navbar.tsx";

const navItems: items[] = [
	{
		name: "Home",
		url: "/",
	},
	{
		name: "Logout",
		url: "/api/logout",
	},
];

export const config: RouteConfig = {
	skipInheritedLayouts: true, // Skip already inherited layouts
};  

export default function Layout({ Component, state }: PageProps) {
	
	const css = state.data === "user" ? "bg-white" : "bg-slate-950 text-white"
	const footerCss = state.data === "admin" ? "border-t-2 border-gray-700" : ""

	return (
		<div class={`h-screen ${css}`}>
			<Navbar css={css} navItems={navItems} icon={state.data === "user" ? "/logo.svg" : "/unir_logo.svg"} />
			<Component />
			<Footer css={footerCss} icon={state.data === "user" ? "/logo.svg" : "/unir_logo.svg"} />
		</div>
	);
}
