'use client'

import { CloseIcon } from '@/components/icons/modal/close'
import clsx from 'clsx'

interface Props {
  isModalOpen: boolean
  closeModal: () => void
  children: React.ReactNode
  className?: string
}

export const Modal = ({ isModalOpen, closeModal, children, className }: Props) => {

  return (
    <>
      {
        isModalOpen && (
          <>
            {/* background */}
            <div className='fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30'>
            </div>
            {/* blur */}
            <div onClick={closeModal} className='fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm'>
            </div>
          </>
        )
      }

      <div className={
        clsx(
          `fixed ${className} p-5 flex items-center justify-center bg-white z-20 shadow-2xl transform transition-all duration-300 top-2`,
          {
            'opacity-0 pointer-events-none': !isModalOpen
          }
        )
      }>

        <button
          className='absolute top-5 right-5 cursor-pointer'
          onClick={closeModal}
        >
          <CloseIcon />
        </button>

        <div className='p-5'>
          {children}
        </div>

      </div>
    </>
  )
}
