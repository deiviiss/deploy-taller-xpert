'use client';
import { Loader } from '@/components/loader';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { getDateFormat } from '@/utils';
import { getOrder } from '../orderRequest';

export default function OrderId({ params }: { params: { id: string } }) {
  const [dataResponse, setDataResponse] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    const dataOrder = async () => {
      try {
        const initialData = await getOrder(params.id)
        setDataResponse(initialData)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar la orden: ", error)
        setLoading(false)
      }
    }
    dataOrder()
  }, [params.id, session]);

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
            <Image src="/user.svg" alt="users" width={32} height={32} />
            Cliente: {dataResponse?.client?.fullName}
            <span className="text-xl font-normal">(ID:{dataResponse.ot_number})</span>
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
            <Image src="/direction.svg" alt="direction" width={24} height={24}  style={{ width: 'auto', height: 'auto' }}/>
            {dataResponse?.client?.address} - {dataResponse?.client?.city}
          </p>
          <p className="flex gap-4 items-center">
            <Image src="/phone.svg" alt="phone" width={24} height={24} />
            {dataResponse?.client?.phone}
          </p>
          <p className="flex gap-4 items-center">
            <Image src="/email.svg" alt="email" width={24} height={24} />
            {dataResponse?.client?.email}
          </p>
          <Image src="/human.svg" alt="human" className="absolute bottom-0 right-0 max-lg:hidden" width={200} height={200}  style={{ width: 'auto', height: 'auto' }}/>
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
                state={item.state}
                is_paid={item.is_paid}
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
        <Link href={"/dashboard/orders"} className="bg-primary text-white p-8 pt-2 pb-2 rounded-lg hover:opacity-70">
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
    <div className='flex justify-between items-center bg-[#DBDCF7] rounded-lg p-4 shadow-[0px_4px_4px_0px_#00000040] max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:gap-2 max-lg:text-center text-[#2E353A]'>
      <p className='w-[15%] max-lg:w-full'>{name}</p>
      <p className='w-[15%] max-lg:w-full'>{mark}</p>
      <p className='w-[15%] max-lg:w-full'>{model}</p>
      <div className=' w-[15%] max-lg:w-full max-lg:flex max-lg:justify-center max-lg:items-center'>
        <p className={`text-center py-1 w-32 font-semibold rounded-full uppercase
        ${
          state === 'Pendiente' ? 'bg-[#F1CC5B]  text-black' : 
          state === 'En espera' ? 'bg-[#B9B8B8] text-black' : 
          state === 'Reparado' ? 'bg-[#34A853] text-white' :
          state === 'Entregado' ? 'bg-[#EB6196] text-white' :
          state === 'Devuelto' ? 'bg-[#2E353A] text-white' : ''
        }
      `} >
          {state}
        </p>
      </div>
      <div className=' w-[15%] max-lg:w-full max-lg:flex max-lg:justify-center max-lg:items-center'>
        <p className={`text-center py-1 w-32 font-semibold rounded-full uppercase bg-[#35878C] pr-4 pl-4 text-white `}>
          {is_paid ? 'Pagado' :  'Pendiente'}
        </p>
      </div>
      <p className='w-[15%] max-lg:w-full'>{entryDate}</p>
      <Link
        href={'/dashboard/orders/' + idReparationProduct + '/' + id}
        className='hover:opacity-70'>
        <Image src='/llaveOrders.svg' alt='llaveOrders' width={24} height={24} />
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
