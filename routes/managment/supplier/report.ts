import { Handlers } from "$fresh/server.ts";
import { QueryArrayResult } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { getSuppliers, initConnection, Supplier } from "../../../services/database.ts";
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';

// path of the local where pdf file will be saved
const pdfPath = "static/suppliers_report.pdf";

export const handler: Handlers = {
	async GET(req, _ctx) {
		const headers = new Headers(req.headers);

		const result: QueryArrayResult = await getSuppliers(initConnection())
		
		const suppliers: Supplier[] = result.rows.map((supplier): Supplier => {
			return {
				id: supplier[0] as string,
				cnpj: supplier[1] as string,
				name: supplier[2] as string,
				telephone: supplier[3] as string,
				email: supplier[4] as string,
				registerDate: supplier[5] as string,
				address: supplier[6] as string,
			}
		})

		await createPDF(suppliers);

		const pdfBytes = await Deno.readFile(pdfPath);

		headers.set("Content-Type", "application/pdf");
		headers.set("Content-Disposition", 'attachment; filename="relatorio_fornecedores.pdf"');

		return new Response(pdfBytes, {
			status: 200,
			headers,
		});
	},
};

async function createPDF(suppliers: Supplier[]): Promise<void> {

	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage();
	const { width, height } = page.getSize();
	
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	
	const margin = 50;
	let yPosition = height - margin;
	
	const fontSizeTitle = 14;
	const fontSizeText = 7;
	const lineSpacing = 3;
	
  	const columnWidths = {
		id: 5,
		cnpj: 75,
		name: 50,
		telephone: 75,
		email: 100,
		registerDate: 50,
		address: 120,
	};
	
	page.drawText("Lista de Fornecedores", {
		x: (width - font.widthOfTextAtSize("Lista de Fornecedores", fontSizeTitle)) / 2,
		y: yPosition,
		size: fontSizeTitle,
		font: font,
	});
	
	yPosition -= fontSizeTitle + 10;
	
	page.drawText("CNPJ", {
		x: margin + columnWidths.id + (columnWidths.cnpj - font.widthOfTextAtSize("CNPJ", fontSizeText)) / 2,
		y: yPosition,
		size: fontSizeText,
		font: font,
	});
	
	page.drawText("Nome", {
		x: margin + columnWidths.id + columnWidths.cnpj + (columnWidths.name - font.widthOfTextAtSize("Nome", fontSizeText)) / 2,
		y: yPosition,
		size: fontSizeText,
		font: font,
	});
	
	page.drawText("Telefone", {
		x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + (columnWidths.telephone - font.widthOfTextAtSize("Telefone", fontSizeText)) / 2,
		y: yPosition,
		size: fontSizeText,
		font: font,
	});
	
	page.drawText("Email", {
		x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + columnWidths.telephone + (columnWidths.email - font.widthOfTextAtSize("Email", fontSizeText)) / 2,
		y: yPosition,
		size: fontSizeText,
		font: font,
	});
	
	page.drawText("Registro", {
		x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + columnWidths.telephone + columnWidths.email + (columnWidths.registerDate - font.widthOfTextAtSize("Registro", fontSizeText)) / 2,
		y: yPosition,
		size: fontSizeText,
		font: font,
	});
	
	page.drawText("Endereço", {
		x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + columnWidths.telephone + columnWidths.email + columnWidths.registerDate + (columnWidths.address - font.widthOfTextAtSize("Endereço", fontSizeText)) / 2,
		y: yPosition,
		size: fontSizeText,
		font: font,
	});
	
	yPosition -= fontSizeText + 5;
	
	page.drawLine({
		start: { x: margin, y: yPosition },
		end: { x: width - margin, y: yPosition },
		thickness: 0.8,
		color: rgb(0, 0, 0),
	});
	
	yPosition -= 15;
	
	suppliers.forEach((supplier) => {
		
		page.drawText(supplier.cnpj, {
			x: margin + columnWidths.id + (columnWidths.cnpj - font.widthOfTextAtSize(supplier.cnpj, fontSizeText)) / 2,
			y: yPosition,
			size: fontSizeText,
			font: font,
		});

		page.drawText(supplier.name, {
			x: margin + columnWidths.id + columnWidths.cnpj + (columnWidths.name - font.widthOfTextAtSize(supplier.name, fontSizeText)) / 2,
			y: yPosition,
			size: fontSizeText,
			font: font,
		});

		page.drawText(supplier.telephone, {
			x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + (columnWidths.telephone - font.widthOfTextAtSize(supplier.telephone, fontSizeText)) / 2,
			y: yPosition,
			size: fontSizeText,
			font: font,
		});

		page.drawText(supplier.email, {
			x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + columnWidths.telephone + (columnWidths.email - font.widthOfTextAtSize(supplier.email, fontSizeText)) / 2,
			y: yPosition,
			size: fontSizeText,
			font: font,
		});

		page.drawText(supplier.registerDate, {
			x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + columnWidths.telephone + columnWidths.email + (columnWidths.registerDate - font.widthOfTextAtSize(supplier.registerDate, fontSizeText)) / 2,
			y: yPosition,
			size: fontSizeText,
			font: font,
		});

		page.drawText(supplier.address, {
			x: margin + columnWidths.id + columnWidths.cnpj + columnWidths.name + columnWidths.telephone + columnWidths.email + columnWidths.registerDate + (columnWidths.address - font.widthOfTextAtSize(supplier.address, fontSizeText)) / 2,
			y: yPosition,
			size: fontSizeText,
			font: font,
		});

		yPosition -= 5 + fontSizeText + lineSpacing;

		page.drawLine({
			start: { x: margin, y: yPosition },
			end: { x: width - margin, y: yPosition },
			thickness: 0.5,
			color: rgb(0, 0, 0),
		});

		yPosition -= 15 + lineSpacing;
	});
	
	const pdfBytes = await pdfDoc.save();

	await Deno.writeFile(pdfPath, pdfBytes);
}