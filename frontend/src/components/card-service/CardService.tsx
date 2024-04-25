import Image from 'next/image'
import React from 'react'

interface Props {
  service: {
    image: string
    title: string
    description: string
  }
}

export const CardService = ({ service }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center relative pt-16 mt-16 w-80'>
      <Image src={`/${service.image}`} alt='' className='absolute -top-16' width={120} height={120} />
      <h2 className='text-xl font-bold pt-4 px-8 text-center'>{service.title}</h2>
      <p className='py-4 px-8 text-center font-normal text-base'>{service.description}</p>
    </div>
  )
}
