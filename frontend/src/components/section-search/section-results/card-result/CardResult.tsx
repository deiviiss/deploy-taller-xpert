"use client"

import { Button } from "@/components/button/Button"
import { Star } from "@/components/icons/Star"
import Image from "next/image"

type WorkshopProp = {
  nombreTaller: string,
  ciudad: string[],
  calificación: number,
  rubro: string,
  contacto: number,
  imagen: string
}

type ResultProp = {
  key: number,
  workshop: WorkshopProp
}

export const CardResult = ({ key, workshop }: ResultProp) => {

  const handleRate = () => {
    console.log('calificación')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-x-12 items-center border border-[#B9B8B8] rounded shadow	 py-6 px-4 w-max">
      {/* logo del taller */}
      {/* <div className="bg-slate-300 w-[150px] h-[150px] rounded"></div> */}
      <Image src={`/${workshop.imagen}`} alt={`logo de ${workshop.nombreTaller}`} width={150} height={150}/>

      <div className="flex flex-col gap-4">
        <p className="font-black text-2xl">{workshop.nombreTaller}</p>
        <div className="flex flex-row h-8">
          {[...Array(workshop.calificación)].map((index) => (
            <Star className="w-8" key={index} />
          ))}
        </div>
        <p className="font-normal text-base"><span className="font-bold">Rubro: </span>{workshop.rubro}</p>
        <p className="font-normal text-base"><span className="font-bold">Contacto: </span>{workshop.contacto}</p>
        <Button title="Calificar Taller" onClick={handleRate} />
      </div>
    </div>
  )
}
