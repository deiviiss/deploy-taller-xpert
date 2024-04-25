'use client'

import { createTechnician, editTechnician } from "@/actions";
import clsx from "clsx";
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { titleFont } from "@/config/fonts";
import { Technician } from "@/interfaces";

interface FormImputs {
  fullName: string
  address: string
  phone: string
  email: string
  password: string
  profile: {
    id: string
    userId: string
    fullName: string
    address: string
    phone: string
    photo_url?: string
  }
}

interface Props {
  isFormAviable: boolean
  setIsFormAviable: (value: boolean) => void
  technician: Technician | null,
  isEditTechnician: boolean,
  setIsEditTechnician: (value: boolean) => void
}

export const FormCreateTechnician = ({ isFormAviable, setIsFormAviable, isEditTechnician, setIsEditTechnician, technician }: Props) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  console.log('user form')
  console.log(technician)
  const { handleSubmit, register, formState: { isValid }, reset, formState: { errors } } = useForm<FormImputs>({
    defaultValues: {
      fullName: technician?.profile.fullName || '',
      address: technician?.profile.address || '',
      phone: technician?.profile.phone || '',
      email: technician?.email || '',
    }
  })

  useEffect(() => {
    // there are technician loaded and is in edit mode, reset the form with the technician data.
    if (technician && isEditTechnician) {
      reset({
        fullName: technician.profile.fullName,
        address: technician.profile.address,
        phone: technician.profile.phone,
        email: technician.email,
        password: technician.password
      });
      return;
    }

    // there are technician loaded but is not in edit mode, reset the form to empty values.
    if (technician && !isEditTechnician) {
      reset({ fullName: '', address: '', phone: '', email: '', password: '' });
      return;
    }

    // there are no technicians loaded, reset the form to empty values.
    if (!technician) {
      reset({ fullName: '', address: '', phone: '', email: '', password: '' });
    }
  }, [technician, isEditTechnician, reset]);

  const onSubmit = async (data: FormImputs) => {
    setErrorMessage('')
    setIsSubmitting(true)

    if (!technician) {
      // server action
      const rta = await createTechnician(data)

      if (!rta.ok) {
        setErrorMessage('No se pudo crear usuario')
        setIsSubmitting(false)
        setIsFormAviable(true)
        return
      }
    }

    if (technician && isEditTechnician) {
      // server action
      const rta = await editTechnician(data, technician.id)

      if (!rta.ok) {
        setErrorMessage('No se pudo editar usuario')
        setIsSubmitting(false)
        setIsFormAviable(true)
        return
      }

    }

    setIsSubmitting(false)
    reset({ fullName: '', address: '', phone: '', email: '', password: '' })
    setIsFormAviable(false)
  }

  const handleCancelled = () => {
    setIsFormAviable(false)
    setIsEditTechnician(false)
    reset({ fullName: '', address: '', phone: '', email: '', password: '' })
  }

  return (
    <div className="flex flex-col gap-8">

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center border rounded bg-[#FFFFFF] border-[#B9B8B8] shadow-lg w-full p-6 gap-8">
        <div className="flex flex-col w-full px-8 pb-4 gap-4">
          <h1 className={`${titleFont.className} font-bold text-2xl text-black antialiased`}>Datos del usuario</h1>

          <div className="flex flex-col p-[10px] gap-[10px]">
            <div className="flex flex-col">
              <div className="grid grid-cols-[200px,1fr] items-center py-[9px]">
                <label htmlFor="fullName">Nombre y Apellido</label>
                {
                  isEditTechnician === false && technician ? (
                    <div className='h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2 flex items-center text-primary'>
                      <p>{technician.fullName}</p>
                    </div>
                  ) : (
                    <input
                      disabled={!isFormAviable}
                      className={
                        clsx(
                          'h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                          {
                            'border-red-500': errors.fullName
                          }
                        )
                      }
                      type="text"
                      {...register('fullName', { required: true })}
                    />
                  )
                }
              </div>
              {
                errors.fullName?.type === 'required' && (
                  <span className='text-red-500'>* El nombre completo del usuario es requerido</span>
                )
              }
            </div>

            <div className="flex flex-col w-full">
              <div className="grid grid-cols-[200px,1fr] items-center py-[9px]">
                <label htmlFor="address">Dirección</label>
                {
                  isEditTechnician === false && technician ? (
                    <div className='h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2 flex items-center text-primary'>
                      <p>{technician.profile.address}</p>
                    </div>
                  ) : (
                    <input
                      disabled={!isFormAviable}
                      className={
                        clsx(
                          'h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                          {
                            'border-red-500': errors.address
                          }
                        )
                      }
                      type="text"
                      {...register('address', { required: true })}
                    />
                  )
                }
              </div>
              {
                errors.address?.type === 'required' && (
                  <span className='text-red-500'>* La dirección es requerida</span>
                )
              }
            </div>

            <div className="flex flex-col w-full">
              <div className="grid grid-cols-[200px,1fr] items-center py-[9px]">
                <label htmlFor="city">Número de teléfono</label>
                {
                  isEditTechnician === false && technician ? (
                    <div className='h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2 flex items-center text-primary'>
                      <p>{technician.profile.phone}</p>
                    </div>
                  ) : (
                    <input
                      disabled={!isFormAviable}
                      className={
                        clsx(
                          'h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                          {
                            'border-red-500': errors.phone
                          }
                        )
                      } type="text"
                      {...register('phone', { required: true })}
                    />
                  )
                }
              </div>
              {
                errors.phone?.type === 'required' && (
                  <span className='text-red-500'>* El teléfono es requerido</span>
                )
              }
            </div>

            <div className="flex flex-col w-full">
              <div className="grid grid-cols-[200px,1fr] items-center py-[9px]">
                <label htmlFor="email">E-mail</label>
                {
                  isEditTechnician === false && technician ? (
                    <div className='h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2 flex items-center text-primary'>
                      <p>{technician.email}</p>
                    </div>
                  ) : (
                    <input
                      disabled={!isFormAviable}
                      className={
                        clsx(
                          'h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                          {
                            'border-red-500': errors.email
                          }
                        )
                      }
                      type="email"
                      {...register('email', { required: true, pattern: /^\S+@\S+$/i, minLength: 6 })}
                    />
                  )
                }
              </div>
              {
                errors.email?.type === 'required' && (
                  <span className='text-red-500'>* El correo es requerido</span>
                )
              }
            </div>

            <div className="flex flex-col w-full">
              <div className="grid grid-cols-[200px,1fr] items-center py-[9px]">
                <label htmlFor="password">Contraseña</label>
                {
                  isEditTechnician === false && technician ? (
                    <div className='h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2 flex items-center text-primary'>
                      <p>{technician.password}</p>
                    </div>
                  ) : <>
                    {
                      !technician ? (
                        <input
                          disabled={!isFormAviable}
                          className={
                            clsx(
                              'h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                              {
                                'border-red-500': errors.password
                              }
                            )
                          } type="password"
                          {...register('password', { required: true })}
                        />
                      ) : (
                        (
                          <input
                            disabled={!isFormAviable}
                            className={
                              clsx(
                                'h-10 rounded-lg border border-solid focus:outline-none bg-white pl-2',
                                {
                                  'border-red-500': errors.password
                                }
                              )
                            } type="password"
                            {...register('password')}
                          />
                        )
                      )
                    }
                  </>
                }
              </div>
              {
                errors.password?.type === 'required' && (
                  <span className='text-red-500'>* La contraseña es requerida</span>
                )
              }
            </div>

          </div>

          <span className='text-red-500'>{errorMessage}</span>

          <div className="mt-8 mb-6 flex gap-[10px]">
            <button
              disabled={isSubmitting || !isFormAviable && !isEditTechnician}
              type="submit"
              className={clsx(
                'h-[51px]',
                {
                  'btn-primary': !isValid || !isSubmitting,
                  'btn-disable': isSubmitting || !isFormAviable
                }
              )}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              disabled={isSubmitting || !isFormAviable && !isEditTechnician}
              onClick={handleCancelled}
              type="button"
              className={clsx(
                {
                  'btn-secondary': !isValid || !isSubmitting,
                  'btn-disable': isSubmitting || !isFormAviable
                }
              )}
            >
              Cancelar
            </button>
          </div>

        </div>
      </form>

      <span className="text-sm">NOTA: Este usuario solo tendrá acceso a datos específicos de la orden de trabajo y solo podrá editar  reparaciones.</span>
    </div>
  )
}
