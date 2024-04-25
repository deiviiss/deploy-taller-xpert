import { Router } from 'express'
import { ProductController } from '../controllers';

const productRouter = Router()

productRouter.get('/', ProductController.getAll)
productRouter.get('/:id', ProductController.getOne)
productRouter.post('/', ProductController.create)
productRouter.patch('/:id', ProductController.update)
productRouter.delete('/:id', ProductController.delete)
productRouter.get('/chekout/:productId', ProductController.sendCheckout)
productRouter.post("/mp/webhook", ProductController.getWebhook)

export default productRouter