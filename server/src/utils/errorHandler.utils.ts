import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { ErrorMessage, HttpCodes } from '.'

interface ErrorType {
	name: string
	errors?: Array<{ path: string; message: string }>
	message: string
	parent?: { detail: string }
}

export const errorHandler = (
	error: ErrorType,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	if (error instanceof ZodError) {
		// Error de validación de Zod
		/*const errObj: { [key: string]: string } = {}
		error.errors.map((error) => {
			errObj[error.path] = error.message
		})*/
		return res.status(HttpCodes.BAD_REQUEST).json({
			message: 'Error de validación',
			errors: error.errors.map((e) =>
				`
			${e.message.trim()}`.trim(),
			),
		})
	}

	if (
		error.message === 'Mechanic not found' ||
		error.message === 'Service not found' ||
		error.message === 'Invalid credentials' ||
		error.message === 'Workshop not found' ||
		error.message === 'User not found' ||
		error.message === ErrorMessage.REPARATION_NOT_FOUND ||
    error.message === ErrorMessage.PRODUCT_NOT_FOUND
	) {
		return res.status(HttpCodes.NOT_FOUND).json({ message: error.message })
	}
	if (error.name === 'SequelizeUniqueConstraintError') {
		return res.status(HttpCodes.BAD_REQUEST).json({
			message: error?.errors?.[0].message,
			error: error.parent?.detail,
		})
	}
	if (error.name === 'SequelizeValidationError') {
		const errObj: { [key: string]: string } = {}
		error.errors?.map((er) => {
			errObj[er.path] = er.message
		})
		return res.status(HttpCodes.BAD_REQUEST).json(errObj)
	}
	if (error.name === 'SequelizeEagerLoadingError') {
		return res.status(HttpCodes.BAD_REQUEST).json({
			message: error.message,
			error: error,
		})
	}
	if (error.name === 'SequelizeForeignKeyConstraintError') {
		return res.status(HttpCodes.BAD_REQUEST).json({
			message: error.message,
			error: error.parent?.detail,
		})
	}
	if (
		error.name === 'SequelizeDatabaseError' ||
		error.message === ErrorMessage.PDF_NOT_CREATED
	) {
		return res.status(HttpCodes.BAD_REQUEST).json({
			message: error.message,
			error,
		})
	}

	return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({
		message: error.message,
		error,
	})
}
