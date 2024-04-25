'use client'

import { Orders, Title } from "@/components";
import { Button } from "@/components/button/Button";
import { CardItem } from "@/components/dashboard-orders/cardItem";
import { NewClient } from "@/components/dashboard-orders/newClient";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Client, Products } from "../interface";
import { NewItem } from "@/components/dashboard-orders/newItem";
import ReactDOMServer from "react-dom/server";
import Swal from "sweetalert2";
import { Alert } from "@/components/icons/Alert";
import { createReparation } from "../orderRequest";


export default function OrdersPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Products[]>([])
  const [client, setClient] = useState<Client>()
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null)

  const date = new Date();
  const day = date.getDate()
  const month = date.getMonth() + 1;
  const year = date.getFullYear()

  const handleDeleteProduct = (productToDelete: Products) => {
    setProducts(prevProducts => prevProducts.filter(product => product !== productToDelete))
  }

  const handleEditProduct = (product: Products) => {
    setSelectedProduct(product)
  }

  const guardarOrden = async () => {
    console.log("guardar", products)
    try {
      await createReparation(client, products)

      Swal.fire({
        title: '¡Éxito!',
        text: 'La orden se ha guardado exitosamente.',
        confirmButtonColor: '#6264D5',
        confirmButtonText: 'Aceptar'
      }
      ).then(() => {
        window.history.go(-1);
      });
    } catch (error) {
      console.error("Error al guardar la orden: ", error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al intentar guardar la orden. Por favor, inténtalo nuevamente.',
        icon: 'error',
        confirmButtonColor: '#6264D5',
        confirmButtonText: 'Volver a intentar'
      });
    }
  }

  const cancelarOrden = async () => {
    const titleContent = ReactDOMServer.renderToString(<div className="flex flex-row items-center gap-2 justify-center"><Alert /> ATENCION!</div>);
    const result = await Swal.fire({
      title: titleContent,
      text: "¿Está seguro que desea cancelar los cambios?",
      showCancelButton: true,
      confirmButtonColor: "#6264D5",
      cancelButtonColor: "#4F3E9C",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    })
    if (result.isConfirmed) {
      window.history.back();
    }
  }

  useEffect(() => {
    console.log("productos", products)
  }, [products, session])

  return (
    <div>
      <div className="flex flex-row justify-between mb-7">
        <div className="flex flex-row justify-center items-center gap-2">
          <Orders />
          <Title title="Nueva Orden" />
        </div>
        <p>Fecha de Ingreso: {day}/{month}/{year}</p>
      </div>
      <div className="grid grid-cols-2 justify-center gap-4">
        <div className="flex flex-col gap-4">
          <NewClient setClient={setClient} />
          <p className="text-base font-bold mt-7 mb-4">Articulos agregados</p>
          <div className="flex flex-col gap-4 h-40 overflow-auto pb-2">
            {products.length > 0
              ?
              <>
                {products?.map((product, index) =>
                  <CardItem key={index} product={product} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
                )}
              </>
              : <p>Aún no hay contenido agregado</p>
            }
          </div>
          <div className="flex flex-row gap-2 mt-3">
            <Button title="Guardar" onClick={guardarOrden} />
            <Button title="Cancelar" onClick={cancelarOrden} />
          </div>
        </div>
        <NewItem setProducts={setProducts} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
      </div>
    </div>
  )
}
