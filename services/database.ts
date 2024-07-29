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

export interface Supplier {
	id: string
	cnpj: string
	name: string
	telephone: string
	email: string
	registerDate: string
	address: string
}

export interface Product {
	id: string
	code: string
	qtt: number
	name: string
	price: number
	type: string
	supplierId: string
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

///////////////////
// USER SECTION //
/////////////////

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

////////////////////////
// DEPENDENT SECTION //
//////////////////////

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

///////////////////////
// SUPPLIER SECTION //
/////////////////////

export async function getSuppliers(client: Client): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM supplier`)
	await client.end()
	return result
}

export async function getSupplier(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM supplier WHERE id = '${id}'`)
	await client.end()
	return result
}

export async function insertSupplier(client: Client, supplier: Supplier): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray`INSERT INTO supplier (id, cnpj, name, telephone, email, register_date, address) VALUES (${supplier.id}, ${supplier.cnpj}, ${supplier.name}, ${supplier.telephone}, ${supplier.email}, ${supplier.registerDate}, ${supplier.address})`
	await client.end();
	return result
}

export async function updateSupplier(client: Client, supplier: Supplier): Promise<QueryArrayResult> {
	await client.connect()
	const result = await client.queryArray(`UPDATE supplier SET cnpj = '${supplier.cnpj}', name = '${supplier.name}', telephone = '${supplier.telephone}', email = '${supplier.email}', register_date = '${supplier.registerDate}', address = '${supplier.address}' WHERE id = '${supplier.id}'`)
	await client.end();
	return result
}

export async function deleteSupplier(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`DELETE FROM supplier WHERE id = '${id}'`)
	await client.end();
	return result	
}

//////////////////////
// PRODUCT SECTION //
////////////////////

export async function getProducts(client: Client): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM product`)
	await client.end()
	return result
}

export async function getProduct(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`SELECT * FROM product WHERE id = '${id}'`)
	await client.end()
	return result
}

export async function insertProduct(client: Client, product: Product): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray`INSERT INTO product (id, code, qtt, name, price, type, id_supplier) VALUES (${product.id}, ${product.code}, ${product.qtt}, ${product.name}, ${product.price}, ${product.type}, ${product.supplierId})`
	await client.end();
	return result
}

export async function updateProduct(client: Client, product: Product): Promise<QueryArrayResult> {
	await client.connect()
	const result = await client.queryArray(`UPDATE product SET code = '${product.code}', qtt = ${product.qtt}, name = '${product.name}', price = ${product.price}, type = '${product.type}', id_supplier = '${product.supplierId}' WHERE id = '${product.id}'`)
	await client.end();
	return result
}

export async function deleteProduct(client: Client, id: string): Promise<QueryArrayResult> {
	await client.connect();
	const result = await client.queryArray(`DELETE FROM product WHERE id = '${id}'`)
	await client.end();
	return result	
}