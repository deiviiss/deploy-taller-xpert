import { format, parse } from '@formkit/tempo'
import { ErrorMessage } from './errorMessage.utils'
import { Product, Reparation } from '../models'

export const fontsPdf = {
	Roboto: {
		normal: 'public/fonts/poppins/Poppins.ttf',
		bold: 'public/fonts/poppins/Poppins-Bold.ttf',
	},
}

// definimos el tamaño de fuente
export const font_size = 8.5

// definimos el tamaño de hoja
export const page_size = 'A4'

const tableGenerate1 = (data: Product) => ({
	headerRows: 1, // esto es para que se repita la cabecera
	// auto: es de acuerdo al ancho original, //* es para ocupe lo restante
	widths: ['*', '*', '*', '*', '*', '*'],
	body: [
		[
			{
				text: 'ID Art',
				style: 'tableHeader',
			},
			{
				text: 'Artículo',
				style: 'tableHeader',
			},
			{
				text: 'Marca',
				style: 'tableHeader',
			},
			{
				text: 'Modelo',
				style: 'tableHeader',
			},
			{
				text: 'Serie',
				style: 'tableHeader',
			},
			{
				text: 'Fecha de ingreso',
				style: 'tableHeader',
			},
		],
		// data detalle y sus valores
		[
			{
				text: data?.id?.substring(0, 13) || ' ',
				style: 'tableBody',
			},
			{
				text: data?.product_name || ' ',
				style: 'tableBody',
			},
			{
				text: data?.brand || ' ',
				style: 'tableBody',
			},
			{
				text: data?.model || ' ',
				style: 'tableBody',
			},
			{
				text: data?.serial_number || ' ',
				style: 'tableBody',
			},
			{
				text: data?.entry_date?.toISOString().substring(0, 10) || ' ',
				style: 'tableBody',
			},
		],
	],
})

const tableGenerate2 = (data: Product[]) => ({
	headerRows: 1,
	widths: ['*', '*'],
	body: [
		[
			{
				text: 'COSTO TOTAL DE REPARACION: ',
				style: 'tableHeader',
				alignment: 'left',
				bold: true,
				margin: [10, 5, 0, 5],
			},
			{
				text: data?.reduce(
					(acc: number, curr: Product) => acc + (curr?.total_cost ?? 0),
					0,
				),
				style: 'tableBody',
				alignment: 'right',
				bold: true,
				fillColor: '#eeeeee',
				margin: [0, 5, 10, 5],
			},
		],
	],
})

const renderArticles = (data: Product[]) =>
	data.map((item) => {
		return [
			{
				// propiedades de las lineas de la tabla
				layout: {
					hLineWidth: function (i: any, node: any) {
						// if (i === 0) {
						// 	return 0
						// }
						return 1
					},
					vLineWidth: function (i: any, node: any) {
						if (i === 0 || i === node.table.widths.length) {
							return 1
						}
						return 0
					},
					hLineColor: function (i: any, node: any) {
						// return i === 1 ||
						// 	i === node.table.body.length - 1 ||
						// 	i === node.table.body.length
						// 	? 'black'
						// 	: 'white'
						return 'black'
					},
					// paddingLeft: function (i: any) {
					// 	return i === 0 ? 0 : 5
					// },
					// paddingRight: function (i: any, node: any) {
					// 	return i === node.table.widths.length - 1 ? 0 : 5
					// },
				},
				fontSize: font_size,
				table: tableGenerate1(item),
			},
			{
				text: '\nDATOS DE GARANTÍA:',
				style: 'subheader',
				bold: true,
				margin: [0, 0, 0, 3],
			},
			{
				columns: [
					{
						text: [
							{
								text: `FECHA DE COMPRA:   `,
								style: 'subheader',
								bold: true,
							},
							{
								text: item?.exit_date?.toISOString().substring(0, 10) || ' ',
								style: 'text',
							},
						],
					},
					{
						text: [
							{
								text: `FACTURA:   `,
								style: 'subheader',
								bold: true,
							},
							{
								text: item?.warranty_invoice_number || ' ',
								style: 'text',
							},
						],
					},
				],

				margin: [0, 0, 0, 0],
			},
			{
				text: '\nMOTIVO DE INGRESO:',
				style: 'subheader',
				bold: true,
				margin: [0, 0, 0, 3],
			},
			{
				text: item?.issue_detail || ' ',
				bold: false,
				style: 'text',
				margin: [0, 0, 0, 0],
			},
			{
				text: '\nDIAGNOSTICO:',
				style: 'subheader',
				bold: true,
				margin: [0, 0, 0, 3],
			},
			{
				text: item?.diagnostic || ' ',
				bold: false,
				style: 'text',
				margin: [0, 0, 0, 0],
			},
			// {
			// 	text: '\nOBSERVACIONES:',
			// 	style: 'subheader',
			// 	bold: true,
			// 	margin: [0, 0, 0, 3],
			// },
			// {
			// 	text: | ' ',
			// 	bold: false,
			// 	style: 'text',
			// 	margin: [0, 0, 0, 0],
			// },
			{
				text: ' ',
			},
		]
	})
// funcion para crear el pdf
export const pdfCreate = async (data: Reparation) => {
	try {
		return {
			pageSize: page_size,
			header: {
				margin: [25, 20, 25, 0],
				fontSize: font_size,
				columns: [
					{
						svg: '<svg width="203" height="30" viewBox="0 0 203 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.6094 5.84766H13.6562V24.1914H9.59375V5.84766H0.625V1.78516H22.6094V5.84766ZM39.9688 18.5977C39.9688 19.1602 39.8698 19.7695 39.6719 20.4258C39.474 21.0716 39.151 21.6758 38.7031 22.2383C38.2656 22.7904 37.6875 23.2539 36.9688 23.6289C36.2604 24.0039 35.3958 24.1914 34.375 24.1914H27.0469C26.4844 24.1914 25.875 24.0924 25.2188 23.8945C24.5729 23.6966 23.9688 23.3789 23.4062 22.9414C22.8542 22.4935 22.3906 21.9154 22.0156 21.207C21.6406 20.4883 21.4531 19.6185 21.4531 18.5977C21.4531 18.0352 21.5521 17.4258 21.75 16.7695C21.9479 16.1133 22.2656 15.5091 22.7031 14.957C23.151 14.3945 23.7292 13.9258 24.4375 13.5508C25.1562 13.1758 26.026 12.9883 27.0469 12.9883H34.375V16.8633H27.0469C26.4948 16.8633 26.0677 17.0352 25.7656 17.3789C25.4635 17.7122 25.3125 18.1289 25.3125 18.6289C25.3125 19.1602 25.4844 19.5768 25.8281 19.8789C26.1823 20.1706 26.599 20.3164 27.0781 20.3164H34.375C34.9271 20.3164 35.3542 20.1497 35.6562 19.8164C35.9583 19.4831 36.1094 19.0664 36.1094 18.5664V12.8945C36.1094 12.3633 35.9427 11.9414 35.6094 11.6289C35.2865 11.3164 34.875 11.1602 34.375 11.1602H25.4531V7.30078H34.375C34.9375 7.30078 35.5417 7.39974 36.1875 7.59766C36.8438 7.79557 37.4479 8.11849 38 8.56641C38.5625 9.00391 39.0312 9.58203 39.4062 10.3008C39.7812 11.0091 39.9688 11.8737 39.9688 12.8945V18.5977ZM50.8594 24.1914H49.0469C48.4635 24.1914 47.8385 24.0924 47.1719 23.8945C46.5156 23.6966 45.901 23.3737 45.3281 22.9258C44.7552 22.4674 44.2812 21.8789 43.9062 21.1602C43.5312 20.431 43.3438 19.5404 43.3438 18.4883V0.160156H47.4062V18.4883C47.4062 18.9883 47.5625 19.3893 47.875 19.6914C48.1875 19.9831 48.5781 20.1289 49.0469 20.1289H50.8594V24.1914ZM60.8906 24.1914H59.0781C58.4948 24.1914 57.8698 24.0924 57.2031 23.8945C56.5469 23.6966 55.9323 23.3737 55.3594 22.9258C54.7865 22.4674 54.3125 21.8789 53.9375 21.1602C53.5625 20.431 53.375 19.5404 53.375 18.4883V0.160156H57.4375V18.4883C57.4375 18.9883 57.5938 19.3893 57.9062 19.6914C58.2188 19.9831 58.6094 20.1289 59.0781 20.1289H60.8906V24.1914ZM81.6719 12.8945C81.6719 13.457 81.5729 14.0664 81.375 14.7227C81.1771 15.3685 80.8542 15.9727 80.4062 16.5352C79.9688 17.0872 79.3906 17.5508 78.6719 17.9258C77.9635 18.3008 77.099 18.4883 76.0781 18.4883H68.75V14.6289H76.0781C76.6302 14.6289 77.0573 14.4622 77.3594 14.1289C77.6615 13.7852 77.8125 13.3633 77.8125 12.8633C77.8125 12.332 77.6406 11.9154 77.2969 11.6133C76.9635 11.3112 76.5573 11.1602 76.0781 11.1602H68.75C68.1979 11.1602 67.7708 11.332 67.4688 11.6758C67.1667 12.0091 67.0156 12.4258 67.0156 12.9258V18.5977C67.0156 19.1393 67.1823 19.5612 67.5156 19.8633C67.8594 20.1654 68.2812 20.3164 68.7812 20.3164H76.0781V24.1914H68.75C68.1875 24.1914 67.5781 24.0924 66.9219 23.8945C66.276 23.6966 65.6719 23.3789 65.1094 22.9414C64.5573 22.4935 64.0938 21.9154 63.7188 21.207C63.3438 20.4883 63.1562 19.6185 63.1562 18.5977V12.8945C63.1562 12.332 63.2552 11.7279 63.4531 11.082C63.651 10.4258 63.9688 9.82161 64.4062 9.26953C64.8542 8.70703 65.4323 8.23828 66.1406 7.86328C66.8594 7.48828 67.7292 7.30078 68.75 7.30078H76.0781C76.6406 7.30078 77.2448 7.39974 77.8906 7.59766C78.5469 7.79557 79.151 8.11849 79.7031 8.56641C80.2656 9.00391 80.7344 9.58203 81.1094 10.3008C81.4844 11.0091 81.6719 11.8737 81.6719 12.8945ZM99.1875 11.3633H90.0469C89.4948 11.3633 89.0781 11.5039 88.7969 11.7852C88.5156 12.056 88.375 12.457 88.375 12.9883V24.1914H84.3125V12.9883C84.3125 12.2904 84.401 11.6654 84.5781 11.1133C84.7552 10.5612 84.9896 10.0768 85.2812 9.66016C85.5833 9.23307 85.9271 8.8737 86.3125 8.58203C86.6979 8.27995 87.099 8.03516 87.5156 7.84766C87.9427 7.66016 88.3698 7.52474 88.7969 7.44141C89.2344 7.34766 89.6406 7.30078 90.0156 7.30078H99.1875V11.3633Z" fill="#2E353A"/><path d="M112.562 9.78516L119.406 1.78516H124.953L115.312 13.0195L124.891 24.1914H119.375L112.562 16.2539L105.781 24.1914H100.25L109.812 13.0195L100.219 1.78516H105.719L112.562 9.78516ZM145.688 18.4883C145.688 19.1862 145.599 19.8164 145.422 20.3789C145.245 20.931 145.01 21.4206 144.719 21.8477C144.427 22.2643 144.089 22.6237 143.703 22.9258C143.318 23.2174 142.911 23.457 142.484 23.6445C142.068 23.832 141.646 23.9727 141.219 24.0664C140.792 24.1497 140.385 24.1914 140 24.1914H132.672V20.1289H140C140.542 20.1289 140.948 19.9883 141.219 19.707C141.49 19.4258 141.625 19.0195 141.625 18.4883V13.0195C141.625 12.457 141.484 12.0404 141.203 11.7695C140.932 11.4987 140.531 11.3633 140 11.3633H132.703C132.151 11.3633 131.734 11.5039 131.453 11.7852C131.172 12.056 131.031 12.457 131.031 12.9883V29.4727H126.969V12.9883C126.969 12.2904 127.057 11.6654 127.234 11.1133C127.411 10.5612 127.646 10.0768 127.938 9.66016C128.24 9.23307 128.583 8.8737 128.969 8.58203C129.354 8.27995 129.755 8.03516 130.172 7.84766C130.599 7.66016 131.026 7.52474 131.453 7.44141C131.891 7.34766 132.297 7.30078 132.672 7.30078H140C140.698 7.30078 141.323 7.38932 141.875 7.56641C142.427 7.74349 142.911 7.97786 143.328 8.26953C143.755 8.5612 144.115 8.89974 144.406 9.28516C144.708 9.67057 144.953 10.0768 145.141 10.5039C145.328 10.9206 145.464 11.3424 145.547 11.7695C145.641 12.1966 145.688 12.6029 145.688 12.9883V18.4883ZM167.328 12.8945C167.328 13.457 167.229 14.0664 167.031 14.7227C166.833 15.3685 166.51 15.9727 166.062 16.5352C165.625 17.0872 165.047 17.5508 164.328 17.9258C163.62 18.3008 162.755 18.4883 161.734 18.4883H154.406V14.6289H161.734C162.286 14.6289 162.714 14.4622 163.016 14.1289C163.318 13.7852 163.469 13.3633 163.469 12.8633C163.469 12.332 163.297 11.9154 162.953 11.6133C162.62 11.3112 162.214 11.1602 161.734 11.1602H154.406C153.854 11.1602 153.427 11.332 153.125 11.6758C152.823 12.0091 152.672 12.4258 152.672 12.9258V18.5977C152.672 19.1393 152.839 19.5612 153.172 19.8633C153.516 20.1654 153.938 20.3164 154.438 20.3164H161.734V24.1914H154.406C153.844 24.1914 153.234 24.0924 152.578 23.8945C151.932 23.6966 151.328 23.3789 150.766 22.9414C150.214 22.4935 149.75 21.9154 149.375 21.207C149 20.4883 148.812 19.6185 148.812 18.5977V12.8945C148.812 12.332 148.911 11.7279 149.109 11.082C149.307 10.4258 149.625 9.82161 150.062 9.26953C150.51 8.70703 151.089 8.23828 151.797 7.86328C152.516 7.48828 153.385 7.30078 154.406 7.30078H161.734C162.297 7.30078 162.901 7.39974 163.547 7.59766C164.203 7.79557 164.807 8.11849 165.359 8.56641C165.922 9.00391 166.391 9.58203 166.766 10.3008C167.141 11.0091 167.328 11.8737 167.328 12.8945ZM184.844 11.3633H175.703C175.151 11.3633 174.734 11.5039 174.453 11.7852C174.172 12.056 174.031 12.457 174.031 12.9883V24.1914H169.969V12.9883C169.969 12.2904 170.057 11.6654 170.234 11.1133C170.411 10.5612 170.646 10.0768 170.938 9.66016C171.24 9.23307 171.583 8.8737 171.969 8.58203C172.354 8.27995 172.755 8.03516 173.172 7.84766C173.599 7.66016 174.026 7.52474 174.453 7.44141C174.891 7.34766 175.297 7.30078 175.672 7.30078H184.844V11.3633ZM202.891 11.3633H195.797V24.1914H191.688V11.3633H186.406V7.30078H191.688V1.78516H195.797V7.30078H202.891V11.3633Z" fill="url(#paint0_linear_376_1766)"/><defs><linearGradient id="paint0_linear_376_1766" x1="165.969" y1="-36.0586" x2="165.969" y2="61.4414" gradientUnits="userSpaceOnUse"><stop offset="0.5" stop-color="#6264D5"/><stop offset="1" stop-color="#DBDCF7"/></linearGradient></defs></svg>',
						width: 100,
					},
				],
			},
			// pie de pagina
			footer: (currentPage: any, pageCount: any, pageSize: any) => {
				return {
					margin: [40, 20, 40, 20],
					fontSize: font_size,
					columns: [
						{},
						{
							text: [
								{
									color: '#7f7f7f',
									text: 'Page | ',
								},
								{
									text: currentPage,
								},
							],
							alignment: 'right',
							width: 'auto',
						},
					],
				}
			},
			watermark: {
				text: 'TallerXpert',
				color: '#6264D5',
				opacity: 0.1,
				bold: true,
				italics: false,
				fontSize: 120,
				angle: 270,
			},
			content: [
				{
					columns: [
						{
							text: [
								{
									text: '\nINFORME DE REPARACION',
									style: 'subheader',
									color: '#6264D5',
									fontSize: font_size + 2,
									bold: true,
								},
								{
									text: '\nTallerXpert',
									fontSize: font_size + 2,
									style: 'header',
								},
								{
									text: '\nCOUT/FISCAL:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: `2024-ABCD-123456`,
									style: 'text',
								},
								{
									text: '\nTEL:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: `+54 9 343 514-3871`,
									style: 'text',
								},
							],
						},
						{
							text: [
								{
									text: `\nFECHA DE EMISION: ${format(new Date(), 'DD-MM-YYYY', 'es')}`,
									style: 'subheader',
									color: '#6264D5',
									fontSize: font_size + 2,
									bold: true,
								},
								{
									text: '\nDIR:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: `Avenida de Mayo 1234 Buenos Aires`,
									style: 'text',
								},
								{
									text: '\nE-MAIL:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: `mjparedes2505@gmail.com`,
									style: 'text',
								},
							],
							margin: [0, 2, 0, 0],
						},
					],
				},
				{
					columns: [
						{
							text: [
								{
									text: '\nDatos del Cliente:',
									style: 'subheader',
									fontSize: font_size + 2,
									bold: true,
								},
								{
									text: `\n${data.client.fullName}`,
									fontSize: font_size + 2,
									style: 'header',
								},
								{
									text: '\nDIR:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: `${data.client.address}, ${data.client.city}`,
									style: 'text',
								},
								{
									text: '\nTEL:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: data.client.phone,
									style: 'text',
								},
							],
						},
						{
							text: [
								{
									text: '\n\n\nDNI:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: data.client.dni,
									style: 'text',
								},
								{
									text: '\nE-MAIL:  ',
									style: 'subheader',
									fontSize: font_size + 1,
									bold: true,
								},
								{
									text: data.client.email,
									style: 'text',
								},
							],
							margin: [0, 4, 0, 0],
						},
					],
				},
				{
					text: '\nDetalles de reparación:',
					style: 'subheader',
					fontSize: font_size + 2,
					margin: [0, 0, 0, 5],
				},
				...renderArticles(data.products),
				{
					// propiedades de las lineas de la tabla
					layout: {
						hLineWidth: function (i: any, node: any) {
							// if (i === 0) {
							// 	return 0
							// }
							return 1
						},
						vLineWidth: function (i: any, node: any) {
							if (i === 0 || i === node.table.widths.length) {
								return 1
							}
							return 0
						},
						hLineColor: function (i: any, node: any) {
							// return i === 1 ||
							// 	i === node.table.body.length - 1 ||
							// 	i === node.table.body.length
							// 	? 'black'
							// 	: 'white'
							return 'black'
						},
						// paddingLeft: function (i: any) {
						// 	return i === 0 ? 0 : 5
						// },
						// paddingRight: function (i: any, node: any) {
						// 	return i === node.table.widths.length - 1 ? 0 : 5
						// },
					},
					fontSize: font_size,
					table: tableGenerate2(data.products),
				},
			],
			styles: {
				header: {
					fontSize: font_size + 4,
					bold: true,
					alignment: 'left',
				},
				subheader: {
					fontSize: font_size,
					margin: [0, 0, 0, 0],
					bold: true,
				},
				text: {
					alignment: 'left',
					fontSize: font_size,
					margin: [-45, 0, 0, 0],
				},
				tableHeader: {
					alignment: 'center',
					bold: true,
					fontSize: font_size,
					margin: [0, 0],
					fillColor: '#eeeeee',
				},
				tableBody: {
					alignment: 'center',
					fontSize: font_size,
					margin: [0, 2.5],
				},
			},
			pageMargins: [25, 30, 25, 50],
		}
	} catch (error) {
		console.log(`${error}`)
		throw new Error(ErrorMessage.PDF_NOT_CREATED)
	}
}
