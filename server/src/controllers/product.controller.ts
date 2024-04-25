import { NextFunction, Request, Response } from 'express'
import { Product, productState } from '../models/product.model'
import { ErrorMessage } from '../utils'
import {
	client,
	createPreference,
	getMerchantOrder,
} from '../utils/mercadopago.utils'
import { Payment } from 'mercadopago'
import { sendEmailWithAttachment } from '../utils/doc.mails'
import { SENDPULSE_WHATSAPP_ID, SENDPULSE_WHATSAPP_SECRET } from '../constants'
import { Client } from '../models'

type TypeProductPreference = {
	userId: string
	product_name: string
	unit_price: number
	product_id: string
	description?: string
}

export class ProductController {
	static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const results = await Product.findAll()
			res.status(200).json(results)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async getOne(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await Product.findOne({
				where: {
					id: req.params.id,
				},
			})
			res.status(200).json(result)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const product = await Product.create(req.body)
			res.status(201).json(product)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async update(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await Product.update(
				{
					...req.body,
				},
				{
					where: {
						id: req.params.id,
					},
				},
			)
			res.status(200).json(result)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await Product.destroy({
				where: {
					id: req.params.id,
				},
			})
			res.status(200).json(result)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async sendCheckout(req: Request, res: Response, next: NextFunction) {
		try {
			const { productId } = req.params

			if (!productId) {
				return res.json({
					message: 'Faltan datos',
				})
			}

			const product = await Product.findByPk(productId, {
				include: Client,
			})

			if (!product) {
				throw new Error(ErrorMessage.PRODUCT_NOT_FOUND)
			}

			// const order = await Order.create({
			// 	productId: product.id,
			// 	status: 'pending',
			// })

			// funcionalidad para crear la preferencia en Mercado Pago
			//====== MERCADOPAGO ======

			const preference = {
				items: [
					{
						id: product.id,
						title: product.product_name,
						quantity: 1,
						unit_price: product.total_cost ?? 200,
						description: product.issue_detail ?? 'Detalle de equipo',
						// picture_url?: string,
						category_id: product.product_category || 'Equipos',
						// currency_id?: string,
					},
				],
				back_urls: {
					success: 'https://s14-36-t-node-react.vercel.app/thanks',
					pending: 'https://s14-36-t-node-react.vercel.app/',
					failure: 'https://s14-36-t-node-react.vercel.app/thanks',
				},
				auto_return: 'approved',
				external_reference: product.id,
				notification_url: `https://s14-36-t-node-react.onrender.com/api/product/mp/webhook`,
			}

			const response = await createPreference(preference)

			await Product.update(
				{
					uriMercadoPago: response.init_point,
				},
				{
					where: {
						id: product.id,
					},
				},
			)

			// mensaje para el usuario usando nodemailer y whatsapp sendpulse
			const message = `Hola👋 usuario ${product.client.fullName} te escribimos desde TallerXpert. Para enviarte el pago, hemos generado la siguiente URL de Mercado Pago: ${response.init_point}. Realiza el pago para el despacho de tu equipo ${product.product_name} ${product.brand}. El costo total es de ${product.total_cost || '$200'}. Además, si necesitas alguna asistencia adicional o tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por tu colaboración!`

			// enviar correo con la url del pago al cliente
			//====== NODEMAILER ======

			await sendEmailWithAttachment({
				text: message,
				subject: `Pago TALLERXPERT Equipo ${product.product_name} ${product.brand}`,
				// CAMBIAR LUIS CORREO POR EL DEL CLIENTE
				to: product.client.email,
				// to: 'melcabo954@gmail.com',
			})

			// enviar mensaje wasap con la url del pago al cliente
			// ====== WHATSAPP SENDPULSE ======
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
			// const phone = '+51932052849'
			// -------------- nuevo contacto whatsapp ----------------
			const fetchApiNewContact = await fetch(
				'https://api.sendpulse.com/whatsapp/contacts',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${access_token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						// CAMBIAR LUIS NUMERO POR EL DEL CLIENTE
						phone: product.client.phone,
						// phone: '+51980459218',
						name: 'contacto nocountry',
						bot_id: '6622e56efa831206cc04c055', // esto lo saque de la aplicacion sino caballero dela api whatsapp
						tags: ['tallerxpert'],
						variables: [
							{
								name: 'productId',
								value: product.id.toString(),
							},
						],
					}),
				},
			)

			const responseNewContact = await fetchApiNewContact.json()

			if (responseNewContact.success === false) {
				// mensaje para el usuario usando nodemailer y whatsapp sendpulse

				// enviar mensaje de confirmación de pago al admin
				//====== WHATSAPP ======
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

				await fetch('https://api.sendpulse.com/whatsapp/contacts/sendByPhone', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${access_token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						// contact_id: "662303ff3e6468c75a032936",
						bot_id: '6622e56efa831206cc04c055',
						phone: product.client.phone,
						message: {
							type: 'text',
							text: {
								body: message,
							},
						},
					}),
				})
				return res.status(200).json({ ok: true })
			}
			// habilitar contacto

			await fetch('https://api.sendpulse.com/whatsapp/contacts/enable', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contact_id: responseNewContact.id,
				}),
			})
			// enviar plantilla

			await fetch(
				'https://api.sendpulse.com/whatsapp/contacts/sendTemplateByPhone',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${access_token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						bot_id: '6622e56efa831206cc04c055',
						phone: product.client.phone,
						template: {
							name: 'taller_expert_3',
							components: [],
							language: {
								policy: 'deterministic',
								code: 'es',
							},
						},
					}),
				},
			)

			return res.status(200).json({
				message: 'ok',
			})
		} catch (error: any) {
			next(error)
		}
	}

	static async getWebhook(req: Request, res: Response) {
		try {
			const payment = req.query

			if (payment.type === 'payment') {
				const dataId = payment['data.id'] as string | number

				const paymented = new Payment(client)

				const data = await paymented.get({
					id: dataId,
				})

				// verificar el estado del pago
				if (data && data.status === 'approved') {
					console.log('porque')
					// actualizar el estado del producto en la base de datos como pago aprobado
					const product = await Product.findByPk(data.external_reference, {
						include: Client,
					})

					if (!product) {
						throw new Error(ErrorMessage.PRODUCT_NOT_FOUND)
					}

					await Product.update(
						{
							is_paid: true,
							state: productState.PAID,
						},
						{
							where: {
								id: product.id,
							},
						},
					)

					// mensaje para el usuario usando nodemailer y whatsapp sendpulse
					const message = `Hola👋 desde la App TallerXpert el usuario ${product.product_name} realizo el pago para el despacho de su equipo ${product.product_name} ${product.brand} con serial ${product.serial_number}. El costo total fue de ${product.total_cost || '$200'}. ¡Nos vemos pronto! 🚀`

					// enviar correo con la url del pago al cliente
					//====== NODEMAILER ======
					// enviar correo de confirmación de pago al admin
					await sendEmailWithAttachment({
						text: message,
						subject: `PAGO TALLERXPERT - Usuario ${product.client.fullName} - Equipo ${product.product_name} ${product.brand} - APROBADO`,
						to: 'mjparedes2505@gmail.com',
					})

					// enviar mensaje de confirmación de pago al admin
					//====== WHATSAPP ======
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

					// CAMBIAR LUIS NUMERO DEL ADMIN O QUE VA HACER ELVIDEO
					// const phone = '+51932052849'
					// const phone = '5492996261033'
					const phone = '5491124611071'

					await fetch(
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
					return res.status(200).json({ ok: true })
				}
			}
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}
}
