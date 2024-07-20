import { Client, QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

export interface User {
	id: string
	name: string
	email: string
	password: string
	role: string
}

export interface Dependent {
	id: string
	name: string
	birthDate: string
	relationship: string
}

export const roles: string[] = ["admin", "user"]

export function initConnection(): Client {
	// Alternatively you can use a connection string
	const config =
	"postgres://postgres:postgres@localhost:5432/test";

	const client = new Client(config);
	return client
} 

export async function testConnection(client: Client) {
	await client.connect();
	const result = await client.queryArray(`SELECT 1`);
	console.log(result)
	await client.end();
}

export async function getUsers(client: Client): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM "user" WHERE role = 'user'`);
	console.log(result)
	await client.end();
	return result
}

export async function getUser(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM "user" WHERE id = '${id}'`)
	await client.end()
	return result
}

export async function getUserByEmail(client: Client, email: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM "user" WHERE email = '${email}'`)
	await client.end()
	return result
}

export async function insertUser(client: Client, user: User): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray`INSERT INTO "user" (id, name, email, password, role) VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password}, ${user.role})`
	await client.end();
	return result
}

export async function updateUserRole(client: Client, user: User): Promise<QueryArrayResult> {
	await client.connect()
	const result = await client.queryArray(`UPDATE "user" SET role = '${user.role}' WHERE id = '${user.id}'`)
	await client.end();
	return result
}

export async function deleteUser(client: Client, id: string): Promise<QueryArrayResult> {
	await deleteDependents(client, id)
	await client.connect()
	const result = await client.queryArray(`DELETE FROM "user" WHERE id = '${id}'`)
	await client.end();
	return result
}

export async function getDependents(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM dependent WHERE relationship = '${id}'`)
	await client.end()
	return result
}

export async function getDependent(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM dependent WHERE id = '${id}'`)
	await client.end()
	return result
}

export async function insertDependent(client: Client, dependent: Dependent): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray`INSERT INTO dependent (id, name, birthdate, relationship) VALUES (${dependent.id}, ${dependent.name}, ${dependent.birthDate}, ${dependent.relationship})`
	await client.end();
	return result
}

export async function deleteDependents(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`DELETE FROM dependent WHERE relationship = '${id}'`)
	await client.end();
	return result	
}