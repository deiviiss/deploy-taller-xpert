'use client'

import { deleteSupplier } from '@/app/dashboard/suppliers/supplierRequest'
import { Alert } from '@/components/icons/Alert'
import Link from 'next/link'
import { useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import Swal from 'sweetalert2'

export const SupplierAccordion = ({ supplier, onDelete }: any) => {
  const [collapsed, setCollapsed] = useState(true)

  const handleDelete = async () => {
    const titleContent = ReactDOMServer.renderToString(
      <div className='flex flex-row items-center gap-2 justify-center'>
        <Alert /> ATENCION!
      </div>
    )
    const result = await Swal.fire({
      title: titleContent,
      text: '¿Está seguro que desea eliminar la orden?',
      showCancelButton: true,
      confirmButtonColor: '#6264D5',
      cancelButtonColor: '#4F3E9C',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    })
    if (result.isConfirmed) {
      try {
        onDelete(supplier.id)
        Swal.fire({
          title: 'Eliminada',
          text: 'El proveedor fue eliminado correctamente',
          confirmButtonText: 'Aceptar'
        })
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al eliminar el proveedor',
          confirmButtonText: 'Aceptar'
        })
      }
    }
  }

  return (
    <>
      <div
        onClick={() => setCollapsed(!collapsed)}
        className={`rounded-md grid grid-cols-6 px-4 py-4 gap-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.25)] mb-6 cursor-pointer hover:bg-[#CACCFF] transition-all
          ${collapsed ? 'bg-secondary' : 'bg-[#CACCFF]'}
          `}
      >
        <div className='col-span-1 text-sm text-black break-all'>{supplier.id}</div>
        <div className='col-span-1 text-sm text-black break-all'>{supplier.name}</div>
        <div className='col-span-1 text-sm text-black break-all'>{supplier.seller_name}</div>
        <div className='col-span-1 text-sm text-black break-all'>{supplier.phone}</div>
        <div className='col-span-1 text-sm text-black break-all'>{supplier.email}</div>
        <span className='relative flex col-span-1 break-all'>
          <Link href={`/dashboard/suppliers/${supplier.id}`}>
            <svg
              width='25'
              height='24'
              viewBox='0 0 25 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              preserveAspectRatio='none'
              className='mr-5'
            >
              <path
                d='M17.362 4.487L19.049 2.799C19.4007 2.44733 19.8777 2.24976 20.375 2.24976C20.8723 2.24976 21.3493 2.44733 21.701 2.799C22.0527 3.15068 22.2502 3.62766 22.2502 4.125C22.2502 4.62235 22.0527 5.09933 21.701 5.451L7.332 19.82C6.80332 20.3484 6.15137 20.7367 5.435 20.95L2.75 21.75L3.55 19.065C3.76328 18.3486 4.15163 17.6967 4.68 17.168L17.363 4.487H17.362ZM17.362 4.487L20 7.125'
                stroke='#6264D5'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </Link>
          <svg
            width='25'
            height='24'
            viewBox='0 0 25 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
            onClick={handleDelete}
          >
            <path
              d='M15.24 9.00003L14.894 18M10.106 18L9.76 9.00003M19.728 5.79003C20.07 5.84203 20.41 5.89703 20.75 5.95603M19.728 5.79003L18.66 19.673C18.6164 20.2383 18.3611 20.7662 17.945 21.1513C17.529 21.5364 16.9829 21.7502 16.416 21.75H8.584C8.0171 21.7502 7.47102 21.5364 7.05498 21.1513C6.63894 20.7662 6.38359 20.2383 6.34 19.673L5.272 5.79003M19.728 5.79003C18.5739 5.61555 17.4138 5.48313 16.25 5.39303M5.272 5.79003C4.93 5.84103 4.59 5.89603 4.25 5.95503M5.272 5.79003C6.42613 5.61555 7.58623 5.48313 8.75 5.39303M16.25 5.39303V4.47703C16.25 3.29703 15.34 2.31303 14.16 2.27603C13.0536 2.24067 11.9464 2.24067 10.84 2.27603C9.66 2.31303 8.75 3.29803 8.75 4.47703V5.39303M16.25 5.39303C13.7537 5.20011 11.2463 5.20011 8.75 5.39303'
              stroke='#EB6196'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <svg
            width='25'
            height='24'
            viewBox='0 0 25 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
            className={`absolute right-0
            ${collapsed ? '' : '-rotate-180'}`}
          >
            <path
              d='M4.5 8L12.5 16L20.5 8'
              stroke='#2E353A'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>
      </div>
      <div
        className={`accordion-body grid grid-cols-2 px-5 py-6 mb-4 shadow-[0_4px_12px_0_rgba(0,0,0,0.25)] rounded-md ${
          collapsed ? 'hidden overflow-hidden' : ''
        }`}
      >
        <div className=''>
          <p className='mb-4'>
            <strong>Empresa:</strong> {supplier.name}
          </p>
          <p className='mb-4'>
            <strong>Dirección:</strong> {supplier.address}
          </p>
          <p className='mb-4'>
            <strong>Ciudad:</strong> {supplier.city}
          </p>
          <p className='mb-4'>
            <strong>E-mail:</strong> {supplier.email}
          </p>
          <p>
            <strong>Categoria:</strong> {supplier.categories}
          </p>
        </div>
        <div className=''>
          <p className='mb-4'>
            <strong>Vendedor:</strong> {supplier.seller_name}
          </p>
          <p className='mb-4'>
            <strong>Teléfono:</strong> {supplier.phone}
          </p>
          <p className='mb-4'>
            <strong>CUIT:</strong> {supplier.cuit}
          </p>
        </div>
      </div>
    </>
  )
}
