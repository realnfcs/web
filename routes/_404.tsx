import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div>
        <h1>Error 404 - Page not found</h1>
      </div>
    </>
  );
}
