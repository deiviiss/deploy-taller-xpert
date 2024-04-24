'use client';
import Link from 'next/link';
import {useEffect, useState} from 'react';
// import {getDate} from '../page';
import { getDateFormat } from "@/utils";
import {Loader} from '@/components/loader';
import {useSession} from 'next-auth/react';
import Image from "next/image";

export default function ReparateId({
  params,
}: {
  params: {id: string; idProduct: string};
}) {
  const {data: session} = useSession();
  const [dataResponse, setDataResponse] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [methodPayment, setMethodPayment] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      setLoading(true);

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/product/" + params.idProduct,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + session?.user.token,
          },
        }
      );
      const data = await response.json();
      setDataResponse(data);
      setLoading(false);
    })();
  }, [params.idProduct, session?.user.token]);
  if (loading) {
    return (
      <div className='h-3/4 flex justify-center items-center'>
        <Loader></Loader>
      </div>
    );
  }

  return dataResponse && !dataResponse?.error ? (
    <div>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold  text-2xl flex gap-2 items-center">
              <Image src="/dataReparation.svg" alt="dataReparation" />
              Datos de Reparación
              <span className="text-xl font-normal">
                (ID:{params.idProduct})
              </span>
            </h2>
            <p>Fecha de ingreso - {getDateFormat(dataResponse.entry_date)}</p>
          </div>
          <div className="relative flex flex-col gap-6 pt-12 pb-12 text-white p-4 border-[1px] rounded-lg border-[#B9B8B8] shadow-[0px_4px_4px_0px_#00000040] bg-gradient-to-b from-[#4F3E9C] to-[#6162D3]  ">
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
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl">Diagnóstico</h2>
          <p className="flex gap-4 items-center">
            Técnico Asignado{" "}
            <span className="ml-1 font-semibold">NOMBRE DEL TÉCNICO </span>
          </p>
          <div className="flex gap-24 max-xl:gap-8 min-md:justify-between max-xl:flex-col items-center">
            <div className="flex flex-col gap-4 max-lg:w-full">
              <div className="p-4 w-[510px] h-[140px] max-xl:w-full border-[1px] border-[#B9B8B8]">
                {dataResponse.diagnostic || "Aún no se registra un diagnóstico"}
              </div>
              <div>
                <input
                  type="radio"
                  name="reparate"
                  id="reparate"
                  defaultChecked
                />
                <label htmlFor="reparate" className="ml-2">
                  Reparado
                </label>
                <input
                  type="radio"
                  name="wait"
                  id="wait"
                  defaultChecked={false}
                  className="ml-4"
                />
                <label htmlFor="wait" className="ml-2">
                  En Espera
                </label>
              </div>
              <div className="flex max-lg:justify-center gap-4 mt-8 max-lg:hidden">
                <Link
                  href={"/dashboard/orders"}
                  className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
                >
                  Editar
                </Link>
                <Link
                  href={"/dashboard/orders/" + params.id}
                  className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
                >
                  Volver
                </Link>
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
                    value={(dataResponse.reparation_cost | 0).toFixed(2)}
                    className="bg-[#F4F4F4] rounded-md border-[1px] border-[#B9B8B8] w-[200px] p-2"
                    disabled
                  />
                </div>
                <div className="flex text-2xl font-semibold justify-between items-center ">
                  <p className="w-full  flex justify-between mr-2">
                    Costo Total <span className="ml-2 ">$</span>
                  </p>
                  <input
                    type="number"
                    value={(
                      (dataResponse.reparation_cost | 0) +
                      (dataResponse.revision_cost | 0)
                    ).toFixed(2)}
                    className="bg-[#F4F4F4] rounded-md border-[1px] border-[#B9B8B8] w-[200px] p-2"
                    disabled
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <button className="mt-4 p-2 pl-6 pr-6 bg-[#2E353A] text-white hover:opacity-70 rounded-md w-[170px] h-[55px] flex items-center justify-center gap-2">
                    <Image src="/dislikeProduct.svg" alt="success" />
                    Devuelto
                  </button>
                  <button
                    onClick={() => setMethodPayment(true)}
                    className="mt-4 p-2 pl-6 pr-6 bg-[#6264D5] text-white hover:opacity-70 rounded-md w-[170px] h-[55px]  flex items-center justify-center gap-2"
                  >
                    <Image src="/succesDeliver.svg" alt="success" />
                    Entregar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" max-lg:justify-center gap-4 mt-8 max-lg:flex hidden">
            <Link
              href={"/dashboard/orders"}
              className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
            >
              Editar
            </Link>
            <Link
              href={"/dashboard/orders/" + params.id}
              className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
            >
              Volver
            </Link>
          </div>
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
                <Image src="/cardCash.svg" alt="cash" />
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
                <Image src="/cash.svg" alt="cash" />
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
