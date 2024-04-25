'use client'

import { CardOrders } from '@/components/dashboard-orders/cardOrders'
import { CardOrdersTitle } from '@/components/dashboard-orders/cardOrdersTitle'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { deleteReparation, getAllReparation } from './orderRequest'
import { Products, Reparation } from './interface'

export default function OrdersPage() {
  const { data: session } = useSession()
  const [reparations, setReparations] = useState<Reparation[] | undefined>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const dataReparation = async () => {
      try {
        const initialData = await getAllReparation()
        setReparations(initialData)
        setLoading(false)
      } catch (error) {
        console.error('Error al cargar las ordenes: ', error)
        setLoading(false)
      }
    }
    dataReparation()
  }, [session])

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteReparation(orderId)
      const updateData = await getAllReparation()
      setReparations(updateData)
    } catch (error) {
      console.error('Error al eliminar la orden: ', error)
    }
  }

  const filterReparations = reparations?.filter(reparation => {
    return (
      reparation.ot_number.includes(filter) ||
      reparation.client.fullName.toLowerCase().includes(filter.toLocaleLowerCase())
    )
  })

  return (
    <div>
      <div className='flex flex-row justify-between items-center mb-14 '>
        <Link
          href={'/dashboard/orders/new-order'}
          className='bg-primary rounded py-4 px-[14px] text-white'
        >
          Crear nueva orden
        </Link>
        <input
          type='text'
          placeholder='Ingresa Orden, Nombre o Apellido..'
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className='border rounded w-80 h-10 pl-4 text-sm'
        />
      </div>
      <div className='flex flex-col gap-4 mb-8 h-[600px]'>
        <CardOrdersTitle />
        {loading ? (
          <p>Cargando...</p>
        ) : filterReparations && filterReparations.length > 0 ? (
          <div className='flex flex-col gap-4 overflow-auto pb-2'>
            {filterReparations.map((reparation, index) => (
              <CardOrders key={index} reparation={reparation} onDelete={handleDeleteOrder} />
            ))}
          </div>
        ) : (
          <p className='text-center'>Aún no hay contenido agregado</p>
        )}
      </div>
      <Link href={'/dashboard'} className='bg-primary rounded py-4 px-[62px] text-white '>
        Volver
      </Link>
    </div>
  )
}
