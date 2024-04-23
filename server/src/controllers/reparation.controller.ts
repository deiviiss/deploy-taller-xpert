
import { NextFunction, Request, Response } from 'express'
import { Reparation, User } from '../models'
import { Client} from '../models'
import { Product } from '../models/product.model'
import { HttpCodes } from '../utils'

export interface ProductReparation {
    name: string,
    brand: string,
    model: string,
    serial_number?: string,
    detail: string,
    workshopId?: string
}
export interface ClientOrderReparation {
	fullName: string,
	dni: number,
	address: string,
	city?: string,
	phone?: number,
	email: string
}
export interface ReparationOrder {
    ot_number?: string,
    products: [ProductReparation],
    client: string,
	issue_detail: string,
	note?: string,
    diagnostic?: string,
    amount?: number,
    entry_date?: Date,
    exit_date?: Date,
    register_by?: string,
	reparation_cost?: number,
	revision_cost: number,
	total_cost?: number,
	is_paid?:  boolean,
	state?: boolean,
	assigned_user?: string,
	warranty_invoice_number?: string,
	warranty_date?: Date
}

export class ReparationController {
	static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const results = await Reparation.findAll({include: [Client,Product, User]})
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
				include: [Client,Product,User],
			})
			res.status(HttpCodes.SUCCESS).json(result)
		} catch (error: any) {
			next(error)
		}
	}

	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const products = req.body.products;
			const client = req.body.client;
			let clientId: string;
			if( !client ) {
				throw new Error("No se ingresó un cliente");
			}
			const clientInstance = await Client.findOne( { where :{ dni : client.dni } }) ;
			if(clientInstance){
				clientId = clientInstance.id;
			}else{
				const newClient = await Client.create({...client});
				clientId = newClient.id;
			}
			const reparation = await Reparation.create({client_id: clientId},{include: [Client,Product, User]});
			if(!products){
				throw new Error("No se registraron artefactos o productos");
			}
			products.forEach(async(product: any
			) => {
			   const newProduct = await Product.create({
				reparation_id: reparation.id,
				client_id: clientId,
				...product
			   });
			   await reparation.$add('products',newProduct);
		   });
			reparation.save();
			res.status(HttpCodes.SUCCESS_CREATED).json(reparation);
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
}