import { MercadoPagoConfig, MerchantOrder, Preference } from 'mercadopago'
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes'
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'

const client = new MercadoPagoConfig({
	accessToken: process.env.Mp_TOKEN as string,
})

// Configurar transporte de correo electrónico usando nodemailer
const transporter: Transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: 'mjparedes2505@gmail.com',
		pass: 'passwordDeGmail',
	},
})

// Definir una interfaz personalizada para el contenido del correo electrónico
interface CustomMailContent {
	from: string
	to: string
	subject: string
	text: string
	attachments?: {
		filename: string
		path: string
		contentType: string
	}[]
}

export async function createPreference(preferences: PreferenceRequest) {
	const preference = new Preference(client)
	const response = await preference.create({ body: preferences })
	return response
}

export async function getMerchantOrder(id: number, clienteEmail: string) {
	const merchantOrder = new MerchantOrder(client)
	const response = await merchantOrder.get({ merchantOrderId: id })

	// Verificar si external_reference es undefined antes de usarlo
	const externalReference =
		response.external_reference ?? 'Sin referencia externa'
	const orderStatus = response.order_status ?? 'Sin estado'

	// Enviar correo electrónico con el archivo adjunto y la URL de respuesta
	await sendEmailWithAttachment(
		clienteEmail,
		externalReference,
		orderStatus,
		false,
	)

	return {
		external_reference: externalReference,
		order_status: orderStatus,
	}
}

async function sendEmailWithAttachment(
	destinatarioEmail: string,
	externalReference: string,
	orderStatus: string,
	isAdmin: boolean,
) {
	// Configuración del contenido del correo electrónico
	const mailContent: CustomMailContent = {
		from: 'mjparedes2505@gmail.com',
		to: destinatarioEmail,
		subject: 'Resultado de la orden en MercadoPago',
		text: `La orden con referencia externa ${externalReference} tiene el estado: ${orderStatus}.`,
	}

	// Adjuntar el archivo PDF si el destinatario es un cliente o un administrador
	if (isAdmin || destinatarioEmail === 'cliente@gmail.com') {
		mailContent.attachments = [
			{
				filename: 'documento.pdf',
				path: '/ruta/al/archivo/documento.pdf',
				contentType: 'application/pdf',
			},
		]
	}

	// Si el destinatario es un cliente, agregar la URL de MercadoPago al texto del correo electrónico
	if (destinatarioEmail === 'cliente@gmail.com') {
		mailContent.text += ` Visita la URL de MercadoPago para más detalles: https://url-de-mercadopago.com`
	}

	// Enviar el correo electrónico
	await transporter.sendMail(mailContent as SendMailOptions)
}
