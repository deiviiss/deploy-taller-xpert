import Link from 'next/link'
export default function NotFound() {
  return (
    <div className='absolute inset-0 z-10 flex justify-center items-center bg-white'>
      <div className='flex  max-md:flex-col items-center'>
        <div>
          <Link
            href={'/error.webp'}
            className='h-[500px] max-md:h-auto'
          />
        </div>
        <div className='flex flex-col items-center max-md:text-center'>
          <h2 className='text-black text-5xl font-semibold'>Página no encontrada</h2>
          <br />
          <Link
            href={'/'}
            className='text-white hover:opacity-90 fond-semibold p-2 pl-4 pr-4 bg-black rounded-lg'
          >
            Ir a inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
