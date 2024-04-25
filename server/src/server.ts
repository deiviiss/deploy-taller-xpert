import express, { json } from 'express'
import morgan from 'morgan'
import { sequelize } from './db/conn'
import { NODE_ENV, PORT } from './constants'
import { corsMiddleware } from './middlewares'
import apiRoute from './routes/api.route'
import { errorHandler } from './utils'
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from './config/swagger.config'
import cors from 'cors'

const app = express()
app.use(json())
app.use(morgan('dev'))
// app.use(corsMiddleware())
app.use(cors())
app.disable('x-powered-by')
app.use('/api', apiRoute)
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

// revisar si es necesario
app.use(errorHandler)

app.listen(PORT, async () => {
	console.log(`Server on port ${PORT}`)
	try {
		await sequelize.sync(
			{ alter: true },
		)
		console.log('Connection has been established successfully.')
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
})
