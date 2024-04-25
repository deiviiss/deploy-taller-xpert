'use client'

import { deleteTechnician, getTechnicianById } from "@/actions";
import { Pencil, Trash, SearchTechnician } from "@/components"
import { FormCreateTechnician } from "@/components";
import { titleFont } from "@/config/fonts";
import { Technician } from "@/interfaces";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react"
import Swal from 'sweetalert2';

interface Props {
  technicians: Technician[]
}

export const TechnicianGrid = ({ technicians }: Props) => {
  const [isFormAviable, setIsFormAviable] = useState(false)
  const [technician, setTechnician] = useState<Technician | null>(null)
  const [isEditTechnician, setIsEditTechnician] = useState(false)

  const handleFormAviability = () => {
    setIsFormAviable(!isFormAviable)
    setTechnician(null)
  }

  const handleClickPencil = async (id: string) => {
    const { technician } = await getTechnicianById(id)

    setIsEditTechnician(true)
    setIsFormAviable(true);
    setTechnician(technician)
  }

  const handleDelete = async (id: string) => {
    await deleteTechnician(id)
  }

  const handleClickTrash = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      showCancelButton: true,
      confirmButtonColor: '#6264D5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id)
      }
    })
  }

  const handleClickCard = async (id: string) => {
    const { technician } = await getTechnicianById(id)

    setTechnician(technician)
    setIsEditTechnician(false)
    setIsFormAviable(false)
  }

  return (
    <div className="flex gap-4">
      {/* section 1 */}
      {/* //TODO componentizar */}
      <div className="p-4 pb-6 border rounded flex flex-col gap-4 border-[#B9B8B8] shadow-lg min-w-[448px] justify-between">

        <div>
          <h1 className={`${titleFont.className} font-bold text-2xl text-black antialiased capitalize`}>técnicos registrados</h1>

          <SearchTechnician placeholder="Ingresa un nombre..." />

          <div className="mt-4 mb-4 flex flex-col gap-4 h-[414px] overflow-auto">
            {
              technicians.length === 0 ? (
                <h1 className="text-center">Aún no hay técnicos agregados</h1>
              ) : (
                technicians.map((technician, index) => (
                  <div
                    onClick={() => handleClickCard(technician.id)}
                    key={index}
                    className="flex items-center justify-between gap-8 p-3 rounded bg-secondary cursor-pointer">

                    <Image src='/avatarTechnician1.png' alt="avatar" width={50} height={50} className="rounded-full" />

                    <p className="text-black">{technician.fullName}</p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClickPencil(technician.id)
                        }}
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClickTrash(technician.id)
                        }}
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                ))
              )
            }
          </div>
        </div>

        <button
          type="button"
          onClick={handleFormAviability}
          disabled={isFormAviable}
          className={clsx(
            'bg-primary hover:opacity-85 text-white py-2 text-center rounded transition-all capitalize h-[51px] w-[220px]',
            {
              'btn-disable': isFormAviable,
              'btn-secondary': !isFormAviable
            }
          )}>crear técnico</button>

      </div>

      {/* section 2 */}
      <FormCreateTechnician setIsFormAviable={setIsFormAviable} isFormAviable={isFormAviable} isEditTechnician={isEditTechnician} setIsEditTechnician={setIsEditTechnician} technician={technician} />
    </div>
  )
}
