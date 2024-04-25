'use client';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { getDateFormat } from "@/utils";
import { Loader } from '@/components/loader';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { getProduct, updateProduct } from '../../orderRequest';
import Swal from 'sweetalert2';
import { Product } from '@/interfaces/order/order.interface';

export default function ReparateId({ params }: { params: { id: string; idProduct: string } }) {
  const { data: session } = useSession();
  const [dataResponse, setDataResponse] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [methodPayment, setMethodPayment] = useState(false);

  useEffect(() => {
    setLoading(true);
    const dataOrder = async () => {
      try {
        const initialData = await getProduct(params.idProduct)
        setDataResponse(initialData)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar la orden: ", error)
        setLoading(false)
      }
    }
    dataOrder()
  }, [params.idProduct, session]);

  if (loading) {
    return (
      <div className='h-3/4 flex justify-center items-center'>
        <Loader></Loader>
      </div>
    );
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setDataResponse((prevProduct: Product) => ({ ...prevProduct, [name]: value }))
  }

  const handleChangeDiagnostic = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setDataResponse((prevProduct: Product) => ({ ...prevProduct, [name]: value }))
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const guardarProducto = async () => {
    try {
      await updateProduct(dataResponse)

      Swal.fire({
        title: '¡Éxito!',
        text: 'El artículo se ha actualizó correctamente.',
        confirmButtonColor: '#6264D5',
        confirmButtonText: 'Aceptar'
      }
      ).then(() => {
        // window.history.go(-1);
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

  const notificarCliente = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/chekout/${params.idProduct}`)
      Swal.fire({
        title: '¡Éxito!',
        text: 'La notificación se ha enviado correctamente.',
        confirmButtonColor: '#6264D5',
        confirmButtonText: 'Aceptar'
      }
      ).then(() => {
        // window.history.go(-1);
      });
    } catch (error) {
      console.error("Error al enviar la notificación: ", error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al intentar enviar la notificación. Por favor, inténtalo nuevamente.',
        icon: 'error',
        confirmButtonColor: '#6264D5',
        confirmButtonText: 'Volver a intentar'
      });
    }
  }

  return dataResponse && !dataResponse?.error ? (
    <div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold  text-2xl flex gap-2 items-center">
              <Image src="/dataReparation.svg" alt="dataReparation" width={32} height={32} />
              Datos de Reparación
              <span className="text-xl font-normal">
                (ID:{params.idProduct})
              </span>
            </h2>
            <p>Fecha de ingreso - {getDateFormat(dataResponse.entry_date)}</p>
          </div>
          <div className="relative flex flex-col gap-6 px-4 py-8 text-white p-4 border-[1px] rounded-lg border-[#B9B8B8] shadow-[0px_4px_4px_0px_#00000040] bg-gradient-to-b from-[#4F3E9C] to-[#6162D3]  ">
            <p className="flex gap-4 items-center">
              Artículo:{" "}
              <span className="ml-1">{dataResponse.product_name} </span>
            </p>
            <p className="flex gap-4 items-center">
              Marca: <span className="ml-1">{dataResponse.brand}</span>
            </p>
            <p className="flex gap-4 items-center">
              Modelo: <span className="ml-1">{dataResponse.model}</span>
            </p>
            <p className="flex gap-4 items-center">
              N° de Serie:{" "}
              <span className="ml-1">{dataResponse.serial_number}</span>
            </p>{" "}
            <p className="flex gap-4 items-center">
              Datos de Garantía:{" "}
              <span className="ml-1">
                {getDateFormat(dataResponse.warranty_date)}
              </span>
            </p>{" "}
            <p className="flex gap-4 items-center">
              Daño Reportado:{" "}
              <span className="ml-1">{dataResponse.issue_detail}</span>
            </p>{" "}
            <p className="flex gap-4 items-center">
              Notas:{" "}
              <span className="ml-1">{dataResponse.note || "No hay nota"}</span>
            </p>
            <Image
              src="/orderReparation.svg"
              alt="orderReparation"
              className="absolute top-[5%] right-[2%] max-lg:hidden"
              width={200} height={200}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 relative">
          <h2 className="font-bold text-2xl">Diagnóstico</h2>
          <p className="flex gap-4 items-center">
            Técnico Asignado{" "}
            <span className="ml-1 font-semibold">NOMBRE DEL TÉCNICO </span>
          </p>
          <form onSubmit={handleSave} className="flex gap-24 max-xl:gap-8 min-md:justify-between max-xl:flex-col items-center">
            <div className="flex flex-col gap-4 max-lg:w-full">
              <textarea name="diagnostic" value={dataResponse.diagnostic ? dataResponse.diagnostic : "No hay un diagnóstico ingresado"} onChange={handleChangeDiagnostic} className="p-4 w-[510px] h-[140px] max-xl:w-full border-[1px] border-[#B9B8B8]" />
              <div className='space-x-3'>
                <input className="ml-2" type="radio" name="state" id="pendiente" value="Pendiente" checked={dataResponse.state === "Pendiente"} onChange={handleChange} />
                <label htmlFor="pendiente" className="ml-2">Pendiente</label>
                <input className="ml-2" type="radio" name="state" id="wait" value="En espera" checked={dataResponse.state === "En espera"} onChange={handleChange} />
                <label htmlFor="wait" className="ml-2">En Espera</label>
                <input className="ml-2" type="radio" name="state" id="reparate" value="Reparado" checked={dataResponse.state === "Reparado"} onChange={handleChange} />
                <label htmlFor="reparado" className="ml-2">Reparado</label>
              </div>
            </div>
            <div className="">
              <div className="p-4 border-[1px] border-[#B9B8B8] shadow-[0px_4px_4px_0px_#00000040] flex flex-col justify-evenly gap-4 bg-[#DBDCF7]  w-[430px] max-lg:w-full rounded-lg">
                <div className="flex text-lg font-normal   items-center ">
                  <p className="w-full flex justify-between mr-2">
                    Costo de Revisión <span className="ml-2">$</span>
                  </p>
                  <input
                    type="number"
                    value={(dataResponse.revision_cost | 0).toFixed(2)}
                    className="bg-[#F4F4F4] rounded-md border-[1px] border-[#B9B8B8] w-[200px] p-2"
                    disabled
                  />
                </div>
                <div className="flex text-xl font-medium justify-between items-center ">
                  <p className="w-full flex justify-between mr-2 items-center">
                    Costo de Reparación <span className="ml-2">$</span>
                  </p>
                  <input
                    type="number"
                    name="reparation_cost"
                    value={(dataResponse.reparation_cost | 0).toFixed(2)}
                    className="bg-[#F4F4F4] rounded-md border-[1px] border-[#B9B8B8] w-[200px] p-2"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex text-2xl font-semibold justify-between items-center ">
                  <p className="w-full  flex justify-between mr-2">
                    Costo Total <span className="ml-2 ">$</span>
                  </p>
                  <input
                    type="number"
                    value={
                      dataResponse.reparation_cost === null ||
                        dataResponse.reparation_cost <= 0 
                        ? 0
                        : (dataResponse.reparation_cost - dataResponse.revision_cost).toFixed(2)
                    }
                    className="bg-[#F4F4F4] rounded-md border-[1px] border-[#B9B8B8] w-[200px] p-2"
                    disabled
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <button onClick={notificarCliente} className="mt-4 p-2 pl-6 pr-6 bg-[#F1CC5B] text-white hover:opacity-70 rounded-md w-[170px] h-[55px]  flex items-center justify-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#2E353A" strokeWidth="{2}" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#2E353A" strokeWidth="{2}" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button className="mt-4 p-2 pl-6 pr-6 bg-[#2E353A] text-white hover:opacity-70 rounded-md w-[170px] h-[55px] flex items-center justify-center gap-2">
                    <Image src="/dislikeProduct.svg" alt="success" width={24} height={24} />
                    Devuelto
                  </button>
                  <button onClick={() => setMethodPayment(true)} className="mt-4 p-2 pl-6 pr-6 bg-[#6264D5] text-white hover:opacity-70 rounded-md w-[170px] h-[55px]  flex items-center justify-center gap-2">
                    <Image src="/succesDeliver.svg" alt="success" width={24} height={24}  style={{ width: 'auto', height: 'auto' }}/>
                    Entregar
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="flex max-lg:justify-center gap-4 mt-8 max-lg:hidden absolute bottom-0">
            {/* <Link
                  href={"/dashboard/orders"}
                  className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
                > */}
            <button type='submit' onClick={guardarProducto} className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70">
              Editar
            </button>
            {/* </Link> */}
            <Link
              href={"/dashboard/orders/" + params.id}
              className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
            >
              Volver
            </Link>
          </div>
          {/* <div className=" max-lg:justify-center gap-4 mt-8 max-lg:flex hidden">
            <Link href={"/dashboard/orders"} className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70">
              Editar
            </Link>
            <Link href={"/dashboard/orders/" + params.id} className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70">
              Volver
            </Link>
          </div> */}
        </div>
      </div>
      {methodPayment && !dataResponse.is_paid ? (
        <div className="fixed inset-0 brightness-80	 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg flex flex-col gap-6">
            <h2 className="font-bold text-2xl text-center">
              ENTREGA DE ARTICULO
            </h2>
            <p>Selecciona el método de pago escogido:</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 bg-[#DBDCF7] shadow-[0px_4px_12px_0px_#00000040] rounded-lg h-[50px] p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    id="cash"
                    className="rounded-none"
                  />
                  <label htmlFor="cash">PAGO EN EFECTIVO</label>
                </div>
                <Image src="/cardCash.svg" alt="cash" width={24} height={24} />
              </div>
              <div className="flex items-center justify-between gap-2 bg-[#DBDCF7] shadow-[0px_4px_12px_0px_#00000040] rounded-lg h-[50px] p-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    id="electronic"
                    className="rounded-none"
                  />
                  <label htmlFor="electronic">PAGO ELECTRONICO</label>
                </div>
                <Image src="/cash.svg" alt="cash" width={24} height={24} />
              </div>
            </div>

            <div>
              <div className=" justify-center gap-4 mt-8 flex ">
                <button
                  onClick={() => setMethodPayment(false)}
                  className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => setMethodPayment(false)}
                  className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  ) : (
    <div>No existe ID </div>
  );
}
