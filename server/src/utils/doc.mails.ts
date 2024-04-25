import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'thegrozzo@gmail.com',
		pass: 'clcqqlnbhsdnhrmx',
	},
})

// Configurar el contenido del correo electrónico
// const mailOptions = {
// 	from: 'tallerxpert@gmail.com',
// 	to: 'dcastiblanco14@gmail.com', // Dirección de correo electrónico de la entidad "admin"
// 	subject: 'PDF Review',
// 	text: 'Adjunto encontrarás el PDF solicitado.',
// 	attachments: [
// 		{
// 			filename: 'documento.pdf', // Nombre del archivo adjunto
// 			// path: '/ruta/al/archivo/documento.pdf', // Ruta al archivo PDF en tu sistema
// 			contentType: 'application/pdf', // Tipo MIME del archivo adjunto
// 		},
// 	],
// }
export async function sendEmailWithAttachment({
	text,
	subject,
  to,
  attachments
}:{
  text: string
  subject: string
  to: string
  attachments?: any
}) {
	try {
		// Enviar el correo electrónico
		transporter.sendMail(
			{
				from: 'mjparedes2505@gmail.com',
				to, // Dirección de correo electrónico de la entidad "admin"
				subject,
				text,
				attachments,
			},
			(error, info) => {
				if (error) {
					console.error('Error al enviar el correo electrónico:', error)
				} else {
					console.log('Correo electrónico enviado:', info.response)
				}
			},
		)
	} catch (error) {
		console.error('Error al enviar el correo electrónico:', error)
		throw new Error(`${error}`)
	}
}

// import nodemailer from 'nodemailer'

// // Configura el transporte de correo electrónico
// const transporter = nodemailer.createTransport({
// 	host: 'smtp.gmail.com',
// 	port: 587,
// 	secure: false, // false para conexiones sin SSL
// 	auth: {
// 		user: 'tallerxpert@gmail.com',
// 		pass: 'NocountryS16',
// 	},
// })

// export async function sendEmailWithAttachment() {
// 	try {
// 		const mailOptions = {
// 			from: 'tallerXpert@gmail.com',
// 			to: 'melcabo954@gmail.com',
// 			subject: 'Product Review PDF',
// 			text: 'Review del producto.',
// 			attachments: [
// 				{
// 					filename: 'reparation_tallerxpert.pdf', // Nombre del archivo adjunto
// 					path: '/public/pdf/reparation_tallerxpert.pdf', // Ruta al archivo PDF en tu sistema
// 					contentType: 'application/pdf', // Tipo MIME del archivo adjunto
// 				},
// 			],
// 		}

// 		// Enviar el correo electrónico
// 		await transporter.sendMail(mailOptions)
// 		console.log('Correo electrónico enviado con éxito.')
// 	} catch (error) {
// 		console.error('Error al enviar el correo electrónico:', error)
// 	}
// }

// Llama a la función para enviar el correo electrónico con el archivo adjunto
// sendEmailWithAttachment()
