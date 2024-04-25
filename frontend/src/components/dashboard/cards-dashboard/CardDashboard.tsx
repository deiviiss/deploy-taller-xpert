'use client'

import { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Modal } from "@/components/ui/modal/Modal";
import { sendReport } from "@/actions";
import { Order, Report, Supplier } from "@/components";
import type { Order as OrderInterface, Supplier as SupplierInterface } from "@/interfaces";
import clsx from 'clsx';

interface Props {
  orders: OrderInterface[]
  suppliers: SupplierInterface[]
}

interface productsWithOtNumber {
  product_id: string
  product_name: string
  state: string | null
  ot_number: string
}

export const CardsDashboard = ({ orders, suppliers }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<productsWithOtNumber[] | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<productsWithOtNumber | null>(null);
  const [isSelectOrder, setIsSelectOrder] = useState(false)

  const productsWithOtNumber = orders.flatMap(order =>
    order.products.map(product => ({
      product_id: product.id,
      product_name: product.product_name,
      state: product.state,
      ot_number: order.ot_number
    }))
  )

  const filterOrder = (query: string) => {
    const trimmedQuery = query.trim();

    const filteredOrders = productsWithOtNumber.filter(order => order.ot_number.includes(trimmedQuery));

    if (trimmedQuery === '') {
      setFilteredOrders(null)
      return;
    }

    setFilteredOrders(filteredOrders)

  }

  const handleSelectOrder = (order: productsWithOtNumber) => {
    setSelectedOrder(order);
  };

  const handleClickWorkReport = () => {
    setIsModalOpen(true)
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">

        <Link href={'/dashboard/orders'} className="bg-[#F1CC5B] w-[215px] h-[170px] flex flex-col gap-4 rounded p-4 text-black cursor-pointer">
          <Order />
          <h1 className="text-2xl capitalize">nueva orden de trabajo</h1>
          <span className="text-right">Total: {orders.length}</span>
        </Link>

        <div onClick={handleClickWorkReport} className="bg-[#8A7CC9] w-[215px] h-[170px] flex flex-col gap-4 rounded p-4 text-white cursor-pointer">
          <Report />
          <h1 className="text-2xl capitalize">nuevo informe de trabajo</h1>
          <span className="text-right">Total: 67</span>
        </div>

        <Link href={'/dashboard/suppliers'} className="bg-[#EB6196] w-[215px] h-[170px] flex flex-col gap-4 rounded p-4 text-white cursor-pointer">
          <Supplier />
          <h1 className="text-2xl capitalize">agregar proveedor</h1>
          <span className="text-right">Total: {suppliers.length}</span>
        </Link>

        <Link href={'/dashboard/orders'} className="bg-[#34A853] w-[215px] h-[170px] flex flex-col gap-4 rounded p-4 text-white cursor-pointer">
          <Report />
          <h1 className="text-2xl capitalize">consultar reparación</h1>
          <span className="text-right">Total: {orders.length}</span>
        </Link>
      </div>

      <Modal
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            <h1 className="capitalize text-2xl font-bold">nuevo informe de trabajo</h1>
          </div>

          <p className="text-base font-bold">
            Ingresa un número de Orden y luego selecciona el artículo para generar el informe
          </p>

          <div className="flex gap-2 w-full items-center mt-4 rounded pl-2 h-[40px] border border-[#8A7CC9] px-2">
            <input
              type="text"
              placeholder="Ingresa un número de orden"
              className="w-full bg-transparent outline-none focus:outline-none"
              onChange={(e) => filterOrder(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="#8A7CC9" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>

          <div className='w-full flex flex-col gap-4 mt-6 h-72'>
            {filteredOrders !== null && (
              <>
                {
                  isSelectOrder ? (
                    <h2 className="text-base font-bold">Articulos agregados en la orden: <span className='text-[#8A7CC9]'>{selectedOrder?.ot_number}</span></h2>
                  ) : (
                    <h2 className="text-base font-bold">Selecciona un artículo</h2>
                  )
                }
                <div className='flex flex-col gap-2 px-2 overflow-auto h-48'>

                  {
                    filteredOrders.length > 0 ? (
                      <>
                        {productsWithOtNumber.map((order, index) => (
                          <div key={index} className="flex gap-4 items-center cursor-pointer w-full justify-between p-4 rounded bg-secondary text-xs" onClick={() => {
                            handleSelectOrder(order)
                            setIsSelectOrder(true)
                          }}>
                            <div>
                              {
                                isSelectOrder && selectedOrder?.product_id === order.product_id && (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#34A853" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                )
                              }
                            </div>
                            <p className="text-sm">{order.product_name}</p>
                            <p className={
                              clsx(
                                'border rounded-full h-6 py-1 px-5 flex justify-center items-center uppercase font-semibold',
                                {
                                  'bg-[#F1CC5B] text-black': order.state === 'Pendiente' || order.state === null,
                                  'bg-[#B9B8B8] text-black': order.state === 'En espera',
                                  'bg-[#34A853] text-white': order.state === 'Reparado',
                                  'bg-[#EB6196] text-white': order.state === 'Pagado',
                                  'bg-[#252525] text-white': order.state === 'devuelto',
                                }
                              )
                            }
                            >
                              <span>
                                {order.state !== null ? order.state : 'Pendiente'}
                              </span>
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <h1>No se encontraron resultados</h1>
                    )
                  }
                </div>
              </>
            )}

            {/* buttons */}
            <div className="flex w-full justify-center gap-4">

              {
                isSelectOrder ? (
                  <Link className="btn-primary" href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation/pdf/${selectedOrder?.ot_number || ''}`} target="_blank">
                    Vista previa
                  </Link>
                ) : (
                  <button disabled className="btn-disable">
                    Vista previa
                  </button>
                )
              }

              <button
                onClick={async () => {
                  if (!selectedOrder) return;

                  const rta = await sendReport(selectedOrder.ot_number);

                  if (rta.ok) {
                    Swal.fire({
                      title: 'Nuevo informe de trabajo',
                      text: 'Envío exitoso',
                      confirmButtonColor: "#6264D5",
                      confirmButtonText: "Aceptar",
                    });

                    setIsModalOpen(false)
                    setFilteredOrders(null)
                    return;
                  }

                  Swal.fire({
                    title: 'Lo sentimos',
                    text: 'Algo salió mal :(',
                    confirmButtonColor: "#6264D5",
                    confirmButtonText: "Aceptar",
                  });
                }}
                className={
                  clsx(
                    {
                      'btn-disable': !selectedOrder,
                      'btn-primary': selectedOrder
                    }
                  )}
                disabled={!selectedOrder}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      </Modal >
    </>
  );
};
