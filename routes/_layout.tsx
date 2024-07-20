import { PageProps } from "$fresh/server.ts";
import { Footer } from "../components/Footer.tsx";

export default function Layout({ Component }: PageProps) {
  // do something with state here
  return (
	<>
		<Component />
		<Footer icon="/logo.svg" />
    </>
  );
}