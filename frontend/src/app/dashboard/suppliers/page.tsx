'use client'

import { SupplierAccordion } from '@/components/suppliers/accordion/SupplierAccordion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { deleteSupplier, getAllSuppliers } from './supplierRequest'
import { useEffect, useState } from 'react'
import { Supplier } from './interface'

export default function SuppliersPage() {
  const { data: session, status } = useSession()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dataSupplier = async () => {
      try {
        const initialData = await getAllSuppliers()
        setSuppliers(initialData)
        setLoading(false)
      } catch (error) {
        console.error('Error al cargar: ', error)
        setLoading(false)
      }
    }
    dataSupplier()
  }, [session])

  const handleDeleteSupplier = async (supplierId: string) => {
    try {
      await deleteSupplier(supplierId)
      const updateData = await getAllSuppliers()
      setSuppliers(updateData)
    } catch (error) {
      console.error('Error al eliminar la orden: ', error)
    }
  }

  return (
    <section>
      <div className='flex items-end justify-between mt-2'>
        <Link
          href={'/dashboard/suppliers/create'}
          className='p-3 leading-none text-white rounded bg-primary'
        >
          Añadir Proveedor
        </Link>
        <div className='relative'>
          <input
            type='text'
            className='rounded border text-black bg-[#fff] pr-6 pl-3 py-1'
            placeholder='Buscar...'
          />
          <svg
            className='absolute top-1/2 right-2 -translate-y-2/4'
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clipPath='url(#clip0_259_1000)'>
              <path
                d='M15.9497 14.2969L12.9258 11.1989C15.1884 8.10235 14.5714 3.71368 11.5478 1.39653C8.52413 -0.920614 4.23873 -0.288803 1.9761 2.80771C-0.286522 5.90423 0.330422 10.2929 3.35408 12.61C5.78293 14.4714 9.11891 14.4714 11.5478 12.61L14.573 15.7081C14.9531 16.0974 15.5695 16.0974 15.9496 15.7081C16.3298 15.3188 16.3298 14.6876 15.9496 14.2983L15.9497 14.2969ZM7.47614 12.0121C4.78886 12.0121 2.61041 9.78114 2.61041 7.02911C2.61041 4.27707 4.78886 2.04613 7.47614 2.04613C10.1634 2.04613 12.3419 4.27707 12.3419 7.02911C12.339 9.7799 10.1622 12.0092 7.47614 12.0121Z'
                fill='#6264D5'
              />
            </g>
            <defs>
              <clipPath id='clip0_259_1000'>
                <rect width='15.6235' height='16' fill='white' transform='translate(0.611816)' />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <div className='mt-5'>
        <div className='bg-primary rounded-md flex px-4 py-4 gap-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.25)] mb-5'>
          <div className='flex-1 text-sm font-bold text-white'>Id Proveedor</div>
          <div className='flex-1 text-sm font-bold text-white'>Empresa</div>
          <div className='flex-1 text-sm font-bold text-white'>Vendedor</div>
          <div className='flex-1 text-sm font-bold text-white'>Teléfono</div>
          <div className='flex-1 text-sm font-bold text-white'>Email</div>
          <span className='flex-1'></span>
        </div>

        {suppliers.map((supplier, index) => (
          <SupplierAccordion key={index} supplier={supplier} onDelete={handleDeleteSupplier} />
        ))}
      </div>
    </section>
  )
}
