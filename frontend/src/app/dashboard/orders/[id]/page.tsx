'use client';
import {Loader} from '@/components/loader';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { getDateFormat } from '@/utils';

export default function OrderId({params}: {params: {id: string}}) {
  const [dataResponse, setDataResponse] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const {data: session} = useSession();


  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await fetch(
        'https://s14-36-t-node-react.onrender.com/api/reparation/' + params.id,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: 'bearer ' + session?.user.token,
          },
        }
      );
      const data = await response.json();
      setDataResponse(data);
      setLoading(false);
    })();
  }, [params.id, session?.user.token]);
  if (loading) {
    return (
      <div className='h-3/4 flex justify-center items-center'>
        <Loader></Loader>
      </div>
    );
  }
  return dataResponse && !dataResponse?.error ? (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold  text-2xl flex gap-2 items-center">
            <Image src="/user.svg" alt="users" />
            Nombre del Cliente{" "}
            <span className="text-xl font-normal">(ID:{params.id})</span>
          </h2>
          <p>
            Fecha de ingreso{" "}
            {dataResponse?.client
              ? getDateFormat(dataResponse?.created_at)
              : ""}
          </p>
        </div>
        <div className="relative flex flex-col gap-6 pt-12 pb-12 text-white p-4 border-[1px] rounded-lg border-[#B9B8B8] shadow-[0px_4px_4px_0px_#00000040] bg-gradient-to-b from-[#4F3E9C] to-[#6162D3]  ">
          <p className="flex gap-4 items-center">
            <Image src="/direction.svg" alt="direction" />
            Dirección + Ciudad
          </p>
          <p className="flex gap-4 items-center">
            <Image src="/phone.svg" alt="phone" />
            Número de Teléfono
          </p>
          <p className="flex gap-4 items-center">
            <Image src="/email.svg" alt="email" />
            E-mail
          </p>
          <Image
            src="/human.svg"
            alt="human"
            className="absolute bottom-0 right-0 max-lg:hidden"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-bold">Artículos</h2>
        <div className="flex justify-between bg-[#6264D5] rounded-lg p-4 shadow-[0px_4px_12px_0px_#00000040] max-lg:flex-col max-lg:items-center max-lg:justify-center text-white max-lg:hidden">
          <p className="w-[15%]">Nombre de Artículo</p>
          <p className="w-[15%]">Marca</p>
          <p className="w-[15%]">Modelo</p>
          <p className="w-[15%]">Estado</p>
          <p className="w-[15%]">Estado de pago</p>
          <p className="w-[15%] mr-8">Fecha de ingreso</p>
        </div>
        <div className="flex flex-col gap-4 max-lg:flex-row max-lg:flex-wrap">
          {dataResponse
            ? dataResponse?.products?.map((item: any) => (
                <TemplateOrdersArticles
                  name={item.product_name}
                  mark={item.brand}
                  model={item.model}
                  state={item.state || "PENDING"}
                  is_paid={item.is_paid || "PAID"}
                  id={item.id}
                  key={item.id}
                  entryDate={getDateFormat(item.entry_date)}
                  idReparate={item.reparation_id}
                  idReparationProduct={params.id}
                />
              ))
            : "No hay Articulos"}
        </div>
      </div>
      <div className="max-lg:flex max-lg:justify-center">
        <Link
          href={"/dashboard/orders"}
          className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70"
        >
          Volver
        </Link>
      </div>
    </div>
  ) : (
    "El ID no existe"
  );
}

function TemplateOrdersArticles({
  name,
  mark,
  model,
  entryDate,
  state,
  is_paid,
  id,
  idReparate,
  idReparationProduct,
}: {
  name: string;
  mark: string;
  model: string;
  entryDate: string;
  state: string;
  is_paid: string;
  id: string;
  idReparate: string;
  idReparationProduct: string;
}) {
  return (
    <div className='flex justify-between bg-[#DBDCF7] rounded-lg p-4 shadow-[0px_4px_4px_0px_#00000040] max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:gap-2 max-lg:text-center text-[#2E353A]'>
      <p className='w-[15%] max-lg:w-full'>{name}</p>
      <p className='w-[15%] max-lg:w-full'>{mark}</p>
      <p className='w-[15%] max-lg:w-full'>{model}</p>
      <div className=' w-[15%] max-lg:w-full max-lg:flex max-lg:justify-center max-lg:items-center'>
        <p
          className={`${
            is_paid == 'PENDING'
              ? 'bg-[#F1CC5B]'
              : is_paid == 'REPAIRED'
              ? 'bg-[#34A853]'
              : 'bg-[#EB6196]'
          } pr-4 pl-4 rounded-lg text-white  w-max `}>
          {state}
        </p>
      </div>
      <div className=' w-[15%] max-lg:w-full max-lg:flex max-lg:justify-center max-lg:items-center'>
        <p className={`bg-[#35878C] pr-4 pl-4 rounded-lg text-white w-max `}>
          {is_paid}
        </p>
      </div>
      <p className='w-[15%] max-lg:w-full'>{entryDate}</p>
      <Link
        href={'/dashboard/orders/' + idReparationProduct + '/' + id}
        className='hover:opacity-70'>
        <Image src='/llaveOrders.svg' alt='llaveOrders' />
      </Link>
    </div>
  );
}

// export function getDate(fechaParmas: any) {
//   const fecha = new Date(fechaParmas);
//   const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
//   const fechaFormateada = fecha.toLocaleDateString(
//     'es-ES',
//     options as Intl.DateTimeFormatOptions
//   ); // Puedes ajustar el idioma aquí
//   return fechaFormateada;
// }
