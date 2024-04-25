import { NextFunction, Request, Response } from 'express'
import { User, Client, Profile } from '../models'
import { getSHA256ofString } from './signin.controller'

export class UserController {
	static async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users = await User.findAll({
				attributes: { exclude: ['password'] },
				include: [Profile]
			})
			res.status(200).json(users)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const user = await User.create(req.body)
			res.status(201).json(user)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async updateUser(req: Request, res: Response) {
		try {
			const {...updateFields} = req.body;
			const profileValues = ['phone', 'address', 'photo_url'];
			const checkUser = await User.findByPk(res.locals.token.id) as User;
			//const checkAllKeys = profileValues.some((i) => Object.prototype.hasOwnProperty.call(updateFields, i));
			const checkAllKeys = profileValues.some((prop) => prop in updateFields);
			//const updatedPassword = getSHA256ofString(req.body.password)(req.body.password)
			if(checkAllKeys && checkUser){
				if(checkUser.rol == 'technician'){
					await checkUser.update({
						fullName: req.body.fullName || checkUser.fullName,
						email: req.body.email || checkUser.email
					})
					const profile = await Profile.update({
							...req.body,
						},
						{
							where: {
								userId: req.params.id,
							},
						},
					)
					return res.status(201).json({
						message: 'Actualizado',
						update: true,
					})
				}else{
					throw new Error("El usuario no se encuentra registrado")
				}
			}
			const user = await User.update(
				{
					rol: req.body.rol,
				},
				{
					where: {
						id: res.locals.token.id,
					},
				},
			)
			if (user[0]) {
				return res.status(201).json({
					message: 'Actualizado',
					update: true,
				})
			}
			res.status(401).json({
				message: 'No Actualizado',
				update: false,
			})
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async getById(req: Request, res: Response) {
		try {
			const user = await User.findByPk(req.params.id, {
				attributes: { exclude: ['password'] },
				include: [Profile]
			},)
			res.status(201).json(user?.dataValues)
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}

	static async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.id
			const user = await User.findByPk(userId)
			if (user) {
				await user.update({ is_active: false })
				res.status(200).json({ message: 'Usuario desactivado' })
			} else {
				res.status(404).json({ message: 'Usuario no encontrado' })
			}
		} catch (error: any) {
			res.status(500).json({
				message: error.message,
			})
		}
	}
}
