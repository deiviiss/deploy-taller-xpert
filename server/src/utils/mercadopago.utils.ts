import { MercadoPagoConfig, MerchantOrder, Preference } from 'mercadopago'
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes'

export const client = new MercadoPagoConfig({
	accessToken: process.env.MP_TOKEN as string,
})

export async function createPreference(preferences: PreferenceRequest) {
	const preference = new Preference(client)
	const response =await preference.create({ body: preferences })
	return response
}
export async function getMerchantOrder(id: number) {
	const merchantOrder = new MerchantOrder(client)
	const response = await merchantOrder.get({ merchantOrderId: id })
	return {
		external_reference: response.external_reference,
		order_status: response.order_status,
	}
}
