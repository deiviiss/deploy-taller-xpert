import { NextFunction, Request, Response } from 'express'
import { Reparation, User } from '../models'
import { Client } from '../models'
import { Product } from '../models/product.model'
import Pdfmake from 'pdfmake'
import { ErrorMessage, fontsPdf, pdfCreate } from '../utils'
import {
	SENDPULSE_WHATSAPP_ID,
	SENDPULSE_WHATSAPP_SECRET,
	dataHarcodeada,
} from '../constants'
import { HttpCodes } from '../utils'
import { sendEmailWithAttachment } from '../utils/doc.mails'
import { Base64Encode } from 'base64-stream'

export interface ProductReparation {
	name: string
	brand: string
	model: string
	serial_number?: string
	detail: string
	workshopId?: string
}
export interface ClientOrderReparation {
	fullName: string
	dni: number
	address: string
	city?: string
	phone?: number
	email: string
}
export interface ReparationOrder {
	ot_number?: string
	products: [ProductReparation]
	client: string
	issue_detail: string
	note?: string
	diagnostic?: string
	amount?: number
	entry_date?: Date
	exit_date?: Date
	register_by?: string
	reparation_cost?: number
	revision_cost: number
	total_cost?: number
	is_paid?: boolean
	state?: boolean
	assigned_user?: string
	warranty_invoice_number?: string
	warranty_date?: Date
}

export class ReparationController {
	static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const results = await Reparation.findAll({
				include: [Client, Product, User],
			})
			res.status(HttpCodes.SUCCESS).json(results)
		} catch (error: any) {
			next(error)
		}
	}

	static async getOne(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await Reparation.findOne({
				where: {
					id: req.params.id,
				},
				include: [Client, Product, User],
			})
			res.status(HttpCodes.SUCCESS).json(result)
		} catch (error: any) {
			next(error)
		}
	}

	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const products = req.body.products
			const client = req.body.client
			let clientId: string
			if (!client) {
				throw new Error('No se ingresó un cliente')
			}
			const clientInstance = await Client.findOne({
				where: { dni: client.dni },
			})
			if (clientInstance) {
				clientId = clientInstance.id
			} else {
				const newClient = await Client.create({ ...client })
				clientId = newClient.id
			}
			const reparation = await Reparation.create(
				{ client_id: clientId },
			)
			if (!products) {
				throw new Error('No se registraron artefactos o productos')
			}
			if(products.length === 1){
				const newProduct = await Product.create({
					reparation_id: reparation.id,
					client_id: clientId,
					...products,
				})
			}else{
				products.forEach(async (product: any) => {
					const newProduct = await Product.create({
						reparation_id: reparation.id,
						client_id: clientId,
						...product,
					})
					await reparation.$add('products', newProduct)
				})
			}
			reparation.save()
			res.status(HttpCodes.SUCCESS_CREATED).json(reparation)
		} catch (error: any) {
			next(error)
		}
	}

	static async update(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await Reparation.update(
				{
					...req.body,
				},
				{
					where: {
						id: req.params.id,
					},
				},
			)
			res.status(HttpCodes.SUCCESS).json(result)
		} catch (error: any) {
			next(error)
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await Reparation.destroy({
				where: {
					id: req.params.id,
				},
			})
			res.status(HttpCodes.SUCCESS_DELETED).json(result)
		} catch (error: any) {
			next(error)
		}
	}

	static async getPdf(req: Request, res: Response, next: NextFunction) {
		try {
			const { otNumber } = req.params

			// buscamos la reparation por ot_number
			const reparation = await Reparation.findOne({
				where: {
					ot_number: otNumber,
				},
				include: [Client, Product],
			})

			if (!reparation) throw new Error(ErrorMessage.REPARATION_NOT_FOUND)

			const pdf_make = new Pdfmake(fontsPdf)

			// creamos las opciones del pdf a partir de la respuesta con la funcion del helper
			const data_pdf = await pdfCreate(reparation)

			// creamos el pdf
			const pdf_doc = pdf_make.createPdfKitDocument(data_pdf as any)

			// seteamos los encabezados del pdf
			res.setHeader('Content-Type', 'application/pdf')

			// subiendo cambios
			pdf_doc.pipe(res)
			pdf_doc.end()
		} catch (error) {
			next(error)
		}
	}

	static async sendPdfandWhatsapp(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { otNumber } = req.params

			//========= funcionalidad para enviar email =========

			// buscamos la reparation por ot_number
			const reparation = await Reparation.findOne({
				where: {
					ot_number: otNumber,
				},
				include: [Client, Product],
			})

			if (!reparation) throw new Error(ErrorMessage.REPARATION_NOT_FOUND)

			const pdf_make = new Pdfmake(fontsPdf)

			// creamos las opciones del pdf a partir de la respuesta con la funcion del helper
			const data_pdf = await pdfCreate(reparation)

			// creamos el pdf
			// const pdf_doc = pdf_make.createPdfKitDocument(data_pdf as any)
			const pdf_doc = pdf_make.createPdfKitDocument(data_pdf as any)

			// creamos el pdf como binario
			const base64Stream = pdf_doc.pipe(new Base64Encode())
			pdf_doc.end()

			let tempFileBase64 = ''

			base64Stream.on('data', function (buffer) {
				tempFileBase64 += buffer.toString()
			})

			// funcionalidad para enviar el pdf por correo
			base64Stream.on('end', async function () {
				await sendEmailWithAttachment({
					text: 'Hola 👋 te adjunto el PDF solicitado 🚀 desde nuestra App TallerXpert.',
					subject: `Reparacion OT-${otNumber}-Review Pdf`,
					to: 'mjparedes2505@gmail.com',
					attachments: [
						{
							filename: `Reparacion OT-${otNumber}.pdf`, // Nombre del archivo adjunto
							// path: '/ruta/al/archivo/documento.pdf', // Ruta al archivo PDF en tu sistema
							contentType: 'application/pdf', // Tipo MIME del archivo adjunto
							content: tempFileBase64, // Aquí pasamos el contenido binario en base64
							encoding: 'base64',
							contentDisposition: 'attachment',
						},
					],
				})
			})

			//========= funcionalidad para enviar x whatsapp =========

			//-------------- token sendpulse ----------------
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					grant_type: 'client_credentials',
					client_id: SENDPULSE_WHATSAPP_ID,
					client_secret: SENDPULSE_WHATSAPP_SECRET,
				}),
			}

			const fetchApiToken = await fetch(
				'https://api.sendpulse.com/oauth/access_token',
				options,
			)

			const { access_token } = await fetchApiToken.json()

			// const { message, phone } = req.body
			// const phone = '+573224849822'
			// CAMBIAR LUIS NUMERO DEL ADMIN O QUE VA HACER ELVIDEO
			// const phone = '51932052849'
			const phone = '5491124611071'

			// mensaje por whatsapp para contacto ya suscrito
			const url = `${req.protocol}://${req.hostname}`

			const message = `Hola Administrador de TallerXpert, este es tu orden con OT-${otNumber}: ${url}/api/reparation/pdf/${otNumber}`

			const fetchApi = await fetch(
				'https://api.sendpulse.com/whatsapp/contacts/sendByPhone',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${access_token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						// contact_id: "662303ff3e6468c75a032936",
						bot_id: '6622e56efa831206cc04c055',
						phone,
						message: {
							type: 'text',
							text: {
								body: message,
							},
						},
					}),
				},
			)
			const response = await fetchApi.json()
			return res.status(200).send({
				message: 'WhatsApp enviado correctamente.',
				response,
			})
		} catch (error) {
			next(error)
		}
	}

	static async handleWebhookWhatsapp(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const [
				{
					info: {
						message: {
							channel_data: {
								message: {
									text: { body = '' } = {},
									button: { payload = '' } = {},
								} = {},
							} = {},
						} = {},
					} = {},
					service = '',
					title = '',
					contact: { id: contact_id = '', phone = '' } = {},
				},
			] = req.body

			if (
				service === 'whatsapp' &&
				title === 'incoming_message' &&
				(body === 'Si' || payload === 'Si')
			) {
				//-------------- token sendpulse ----------------
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						grant_type: 'client_credentials',
						client_id: SENDPULSE_WHATSAPP_ID,
						client_secret: SENDPULSE_WHATSAPP_SECRET,
					}),
				}

				const fetchApiToken = await fetch(
					'https://api.sendpulse.com/oauth/access_token',
					options,
				)

				const { access_token } = await fetchApiToken.json()

				const client = await Client.findOne({
					where: { phone },
					include: Product,
				})

				if (!client) {
					throw new Error('El cliente no existe en la base de datos')
				}

				// revisar codigo porque no esta bien esto siempre traera un producto pero para la demo day esta bien xd

				const product = client?.products.find((p) => p.uriMercadoPago)

				if (!product) {
					throw new Error('El producto no existe en la base de datos')
				}

				const message = `Hola👋 usuario ${client.fullName} te escribimos desde TallerXpert. Para enviarte el pago que hemos generado la siguiente URL de Mercado Pago: ${product.uriMercadoPago || 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1526098788-f3d0ff67-7565-4bda-aa8c-9f017b115da3'}. Realiza el pago para el despacho de tu equipo ${product.product_name} ${product.brand}. El costo total es de $${product.total_cost || '$200'}. Además, si necesitas alguna asistencia adicional o tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por tu colaboración!`

				//-------------- mensaje whatsapp ----------------
				// esto es para enviar el mensaje por whatsapp
				const fetchApi = await fetch(
					'https://api.sendpulse.com/whatsapp/contacts/send',
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${access_token}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							// contact_id: "662303ff3e6468c75a032936",
							contact_id,
							message: {
								type: 'text',
								text: {
									body: message,
								},
							},
						}),
					},
				)
				const response = await fetchApi.json()
				return res.status(200).send({
					message: 'WhatsApp enviado correctamente.',
					response,
				})
			}
		} catch (error) {
			console.log(error)
			res.status(500).send({
				message: 'Error al enviar el mensaje de WhatsApp.',
				error: error,
			})
		}
	}
}
