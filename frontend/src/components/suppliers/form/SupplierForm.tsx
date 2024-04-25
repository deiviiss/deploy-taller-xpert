'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Supplier } from '@/app/dashboard/suppliers/interface'
import { createSupplier, editSupplier } from '@/app/dashboard/suppliers/supplierRequest'
import { useSession } from 'next-auth/react'

interface FormImputs {
  name: string
  address: string
  phone: string
  city: string
  cuit: string
  email: string
  seller_name: string
  categories: string
}

interface Props {
  isEditSupplier: boolean
  supplier?: Supplier
}

export const SupplierForm = ({ isEditSupplier, supplier }: Props) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
    formState: { errors }
  } = useForm<FormImputs>({
    defaultValues: {
      name: supplier?.name || '',
      address: supplier?.address || '',
      phone: supplier?.phone || '',
      city: supplier?.city || '',
      cuit: supplier?.cuit || '',
      email: supplier?.email || '',
      seller_name: supplier?.seller_name || ''
    }
  })

  useEffect(() => {
    if (supplier && isEditSupplier) {
      reset({
        name: supplier.name,
        address: supplier.address,
        phone: supplier.phone,
        city: supplier.city,
        cuit: supplier.cuit,
        email: supplier.email,
        seller_name: supplier.seller_name,
        categories: supplier.categories
      })
      return
    }
  }, [supplier, isEditSupplier, reset])

  const onSubmit = async (data: FormImputs) => {
    setErrorMessage('')
    setIsSubmitting(true)
    console.log('submitting')

    if (!supplier) {
      const res = await createSupplier(session, data)

      if (res.ok) {
        router.push('/dashboard/suppliers') // redirect to supplier listing
      } else {
        console.log('Error creating')
      }
    }

    if (supplier && isEditSupplier) {
      const res = await editSupplier(data, supplier.id, session)

      if (res.ok) {
        router.push('/dashboard/suppliers') // redirect to supplier listing
      } else {
        console.log('Error creating')
      }
    }

    setIsSubmitting(false)
    // reset({
    //   name: '',
    //   address: '',
    //   phone: '',
    //   city: '',
    //   cuit: '',
    //   email: '',
    //   seller_name: '',
    //   categories: ''
    // })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col items-center border rounded bg-[#FFFFFF] border-[#B9B8B8] shadow-lg w-full p-6 gap-8 mb-5'>
        <div className='flex flex-col w-full gap-4'>
          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[200px,1fr] items-center'>
                <label htmlFor='fullName'>Empresa</label>
                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                    {
                      'border-red-500': errors.name
                    }
                  )}
                  type='text'
                  {...register('name', { required: true })}
                />
              </div>
              {errors.name?.type === 'required' && (
                <span className='text-red-500'>* El nombre de la empresa es requerido</span>
              )}
            </div>
          </div>

          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[200px,1fr] items-center'>
                <label htmlFor='fullName'>Dirección</label>
                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                    {
                      'border-red-500': errors.address
                    }
                  )}
                  type='text'
                  {...register('address', { required: true })}
                />
              </div>
              {errors.address?.type === 'required' && (
                <span className='text-red-500'>* La dirección es requerida</span>
              )}
            </div>
          </div>

          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[200px,1fr] items-center'>
                <label htmlFor='fullName'>Teléfono</label>

                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                    {
                      'border-red-500': errors.phone
                    }
                  )}
                  type='text'
                  {...register('phone', { required: true })}
                />
              </div>
              {errors.phone?.type === 'required' && (
                <span className='text-red-500'>* El teléfono es requerido</span>
              )}
            </div>
          </div>

          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[200px,1fr] items-center'>
                <label htmlFor='fullName'>Ciudad</label>
                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                    {
                      'border-red-500': errors.city
                    }
                  )}
                  type='text'
                  {...register('city', { required: true })}
                />
              </div>
              {errors.city?.type === 'required' && (
                <span className='text-red-500'>* La Ciudad es requerida</span>
              )}
            </div>
          </div>

          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[200px,1fr] items-center'>
                <label htmlFor='fullName'>CUIT</label>
                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                    {
                      'border-red-500': errors.cuit
                    }
                  )}
                  type='text'
                  {...register('cuit', { required: true })}
                />
              </div>
              {errors.cuit?.type === 'required' && (
                <span className='text-red-500'>* El CUIT del proveedor es requerido</span>
              )}
            </div>
          </div>

          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[200px,1fr] items-center'>
                <label htmlFor='fullName'>E-mail</label>
                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                    {
                      'border-red-500': errors.email
                    }
                  )}
                  type='text'
                  {...register('email', { required: true })}
                />
              </div>
              {errors.email?.type === 'required' && (
                <span className='text-red-500'>* El E-Mail del proveedor es requerido</span>
              )}
            </div>
          </div>

          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid grid-cols-[200px,1fr] items-center'>
                <label htmlFor='fullName'>Vendedor</label>
                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                    {
                      'border-red-500': errors.seller_name
                    }
                  )}
                  type='text'
                  {...register('seller_name', { required: true })}
                />
              </div>
              {errors.seller_name?.type === 'required' && (
                <span className='text-red-500'>* El nombre del vendedor es requerido</span>
              )}
            </div>
          </div>

          <div className='flex flex-col p-[10px] gap-[10px]'>
            <div className='flex flex-col'>
              <div className='grid items-center'>
                <label htmlFor='fullName' className='mb-4'>
                  Descripción
                </label>
                <input
                  className={clsx(
                    'py-2 rounded-lg border border-solid focus:outline-none bg-white pl-2'
                  )}
                  type='text'
                  {...register('categories', { required: true })}
                />
              </div>
              {errors.categories?.type === 'required' && (
                <span className='text-red-500'>* La descripción del vendedor es requerida</span>
              )}
            </div>
          </div>

          <span className='text-red-500'>{errorMessage}</span>
        </div>
      </div>

      <div className='flex gap-2 mb-3'>
        <button type='submit' className='px-6 py-3 text-white rounded bg-primary'>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={router.back}
          type='button'
          className='text-white px-6 py-3 rounded bg-[#4F3E9C]'
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
