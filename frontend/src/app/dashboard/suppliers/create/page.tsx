import { SupplierForm } from '@/components'
import Image from 'next/image'

export default function SuppliersCreatePage() {
  return (
    <div>
      <div className='flex'>
        <svg
          width='32'
          height='32'
          viewBox='0 0 32 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          preserveAspectRatio='none'
          className='mr-3'
        >
          <g clipPath='url(#clip0_536_586)'>
            <path
              d='M31.897 14.5795C31.897 14.5795 28.8997 9.54742 28.8979 9.54456C28.8971 9.54322 28.8317 9.39737 28.6304 9.31685L16.1402 4.88451C16.0483 4.85197 15.9514 4.85197 15.8595 4.88451L3.36933 9.31685C3.36933 9.31685 3.19881 9.37869 3.09634 9.55251C3.05531 9.62213 0.10278 14.5795 0.10278 14.5795C0.00379404 14.7459 -0.0259303 14.9618 0.022994 15.1603C0.0719894 15.3588 0.19366 15.5158 0.350176 15.5826L2.99344 16.71V25.725C2.99344 25.9875 3.11938 26.2241 3.31252 26.3244L15.8028 32.8109C15.8399 32.8302 15.887 32.8601 15.9998 32.8601C16.1127 32.8601 16.1969 32.8109 16.1969 32.8109L28.6873 26.3244C28.8804 26.2241 29.0063 25.9875 29.0063 25.725V16.7098L31.6495 15.5824C31.806 15.5157 31.9277 15.3585 31.9767 15.1601C32.0256 14.9618 31.9959 14.7459 31.897 14.5795ZM1.3554 14.6413L3.71187 10.684L4.66497 11.014L10.0289 12.8709L15.1016 14.6271L12.1266 19.2355L1.3554 14.6413ZM15.4838 31.2414L4.02569 25.2911V17.1501L12.1352 20.6094C12.1895 20.6327 12.2455 20.6437 12.301 20.6437C12.4535 20.6437 12.6019 20.5586 12.7017 20.4037L15.4839 16.0944L15.4838 31.2414ZM15.9998 13.5928L5.43063 9.93349L15.9998 6.18268L26.5691 9.93349L15.9998 13.5928ZM27.9741 25.2911L16.5159 31.2414V16.0946L19.298 20.4039C19.3979 20.5586 19.5462 20.6439 19.6988 20.6439C19.7543 20.6439 19.8103 20.6329 19.8647 20.6096L27.9741 17.1503V25.2911ZM19.8732 19.2356L16.8981 14.6273L28.2879 10.684L30.6444 14.6413L19.8732 19.2356Z'
              fill='#2E353A'
            />
          </g>
          <defs>
            <clipPath id='clip0_536_586'>
              <rect width='32' height='32' fill='white' />
            </clipPath>
          </defs>
        </svg>

        <h2 className='flex items-center gap-2 text-2xl font-bold mb-7'>Nuevo Proveedor</h2>
      </div>

      <div className='grid w-full grid-cols-1 lg:grid-cols-2 gap'>
        <div className='col-span-1'>
          <SupplierForm isEditSupplier={true} />
        </div>
        <div className='hidden lg:block col-span-1'>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%'
            }}
          >
            <Image
              src='/connecting teams-bro.png'
              width='0'
              height='0'
              sizes='100vw'
              className='w-full h-auto'
              alt=''
            />
          </div>
        </div>
      </div>
    </div>
  )
}
