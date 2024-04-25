'use client'
import Image from 'next/image'
import Link from 'next/link'
import { textLogo } from '@/config/fonts'
import { Dashboard, Orders, Technicians, Suppliers, Statistics, Workshop } from '@/components'
import { useEffect, useState } from 'react'
import { getUserSessionServer } from '@/actions'
import { UserData } from '@/interfaces/userData/userdata.interface'

const sideItems = [
  {
    path: '/dashboard',
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12.094V25c0 .232.105.455.293.619.187.164.442.256.707.256h6v-7.438c0-.348.158-.681.44-.928a1.616 1.616 0 0 1 1.06-.384h5c.398 0 .78.138 1.06.384.282.247.44.58.44.928v7.438h6c.265 0 .52-.092.707-.256A.824.824 0 0 0 27 25V12.094"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M30 14.5 16.68 3.344c-.312-.289-1.043-.292-1.36 0L2 14.5m23-4.21V4h-3v3.773"
      />
    </svg>,
    title: 'Dashboard'
  },
  {
    path: '/dashboard/technicians',
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 12.5h5m-5 4h5m-5 4h5m-19 6h20a3 3 0 0 0 3-3v-14a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3ZM14 13a2.5 2.5 0 1 1-5.001 0A2.5 2.5 0 0 1 14 13Zm1.725 8.448A8.961 8.961 0 0 1 11.5 22.5a8.962 8.962 0 0 1-4.224-1.052 4.501 4.501 0 0 1 8.45 0Z"
      />
    </svg>,
    title: 'Técnicos'
  },
  {
    path: '/dashboard/orders',
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 16.5h5m-5 4h5m-5 4h5m4 1h3a3 3 0 0 0 3-3V8.644c0-1.513-1.127-2.797-2.635-2.923a64.559 64.559 0 0 0-1.497-.106m0 0c.088.286.132.585.132.885a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1c0-.308.047-.605.133-.885m7.735 0A3.002 3.002 0 0 0 20 3.5h-2a3.002 3.002 0 0 0-2.867 2.115m0 0c-.501.03-1 .066-1.498.106C12.127 5.847 11 7.131 11 8.644V11.5m0 0H6.5A1.5 1.5 0 0 0 5 13v15a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 21 28V13a1.5 1.5 0 0 0-1.5-1.5H11Zm-2 5h.01v.01H9v-.01Zm0 4h.01v.01H9v-.01Zm0 4h.01v.01H9v-.01Z"
      />
    </svg>,
    title: 'Ordenes'
  },
  {
    path: '/dashboard/suppliers',
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.79 5.753A1.5 1.5 0 0 1 15.27 4.5h1.458a1.5 1.5 0 0 1 1.48 1.253l.199 1.192c.093.566.512 1.019 1.04 1.24.53.219 1.14.19 1.606-.144l.983-.702a1.5 1.5 0 0 1 1.933.16L25 8.53c.52.518.587 1.336.16 1.933l-.703.983c-.333.466-.362 1.074-.142 1.605.22.53.673.947 1.24 1.04l1.19.2c.724.12 1.254.745 1.254 1.479v1.458a1.5 1.5 0 0 1-1.254 1.48l-1.192.199c-.565.093-1.018.51-1.238 1.04-.22.53-.19 1.139.142 1.605l.703.984a1.5 1.5 0 0 1-.16 1.934l-1.032 1.03a1.5 1.5 0 0 1-1.932.16l-.984-.702c-.467-.334-1.075-.363-1.604-.143-.53.22-.947.673-1.041 1.239l-.199 1.192a1.5 1.5 0 0 1-1.48 1.253H15.27c-.733 0-1.358-.53-1.48-1.253l-.197-1.192c-.095-.566-.512-1.019-1.041-1.24-.53-.219-1.139-.19-1.606.144l-.984.702a1.5 1.5 0 0 1-1.933-.16l-1.03-1.032a1.5 1.5 0 0 1-.16-1.933l.702-.983c.333-.466.363-1.074.144-1.605-.22-.53-.675-.947-1.24-1.04l-1.192-.2A1.5 1.5 0 0 1 4 17.229v-1.458a1.5 1.5 0 0 1 1.253-1.48l1.192-.199c.565-.093 1.02-.51 1.24-1.04.22-.53.19-1.139-.144-1.605l-.701-.984a1.5 1.5 0 0 1 .16-1.934l1.03-1.03a1.5 1.5 0 0 1 1.934-.16l.982.702c.467.334 1.076.363 1.606.143s.946-.673 1.04-1.239l.2-1.192Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 16.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </svg>,
    title: 'Proveedores'
  },
  {
    path: '/dashboard/statistics',
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 18a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 10 18v9a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 4 27v-9Zm9-6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 19 12v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 13 27V12Zm9-6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 28 6v21a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 22 27V6Z"
      />
    </svg>,
    title: 'Estadísticas'
  },
  {
    path: '/dashboard/workshop',
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18 28.5v-10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v10m-6 0H3.147M18 28.5h6m0 0h4.853M27 28.5V12.965m0 0a4 4 0 0 1-5-.818 3.994 3.994 0 0 1-3 1.353 3.991 3.991 0 0 1-3-1.355 3.99 3.99 0 0 1-3 1.355 3.991 3.991 0 0 1-3-1.355 4.002 4.002 0 0 1-5 .82m22 0a4 4 0 0 0 .828-6.293L26.24 5.087a2 2 0 0 0-1.413-.587H7.17a2 2 0 0 0-1.414.585L4.172 6.672A4.005 4.005 0 0 0 5 12.965M5 28.5V12.965M9 24.5h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"
      />
    </svg>,
    title: 'Taller'
  }
]

export const Sidebar = () => {
  const logoSidebar = '/logoSidebar.png'
  const tallerName = 'TechRepair'

  const [userData, setUserData] = useState<UserData | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataFromServer = await getUserSessionServer();
        setUserData(userDataFromServer);
      } catch (error) {
        console.error('Error al cargar los datos del usuario: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <nav className='w-[248px] h-screen min-h-[1024px] flex flex-col justify-around bg-primary shadow-xl px-6 py-[42px] text-white'>
      <div className='flex flex-col items-center gap-3'>
        <Image
          src={logoSidebar}
          alt='logo sidebar'
          width={80}
          height={80}
          className='rounded-full'
        />
        <h1 className='text-xl font-black text-center capitalize'>{userData?.workshop?.name}</h1>
      </div>

      {/* menu */}
      <ul className='flex flex-col gap-6 text-white uppercase'>
        <li className='py-2 rounded-lg hover:bg-white hover:text-primary'>
          <Link
            href='/dashboard'
            className='flex items-center py-[4.5px] gap-6 font-bold text-base pr-2'
          >
            <span className='ml-2 text-current group-hover:text-primary'>
              <Dashboard />
            </span>
            Dashboard
          </Link>
        </li>
        <li className='py-2 rounded-lg hover:bg-white hover:text-primary'>
          <Link
            href='/dashboard/technicians'
            className='flex items-center py-[4.5px] gap-6 font-bold text-base pr-2'
          >
            <span className='ml-2 text-current group-hover:text-primary'>
              <Technicians />
            </span>
            Técnicos
          </Link>
        </li>
        <li className='py-2 rounded-lg hover:bg-white hover:text-primary'>
          <Link
            href='/dashboard/orders'
            className='flex items-center py-[4.5px] gap-6 font-bold text-base pr-2'
          >
            <span className='ml-2 text-current group-hover:text-primary'>
              <Orders />
            </span>
            Ordenes
          </Link>
        </li>
        <li className='py-2 rounded-lg hover:bg-white hover:text-primary'>
          <Link
            href='/dashboard/suppliers'
            className='flex items-center py-[4.5px] gap-6 font-bold text-base pr-2'
          >
            <span className='ml-2 text-current group-hover:text-primary'>
              <Suppliers />
            </span>
            Proveedores
          </Link>
        </li>
        <li className='py-2 rounded-lg hover:bg-white hover:text-primary'>
          <Link
            href='/dashboard/statistics'
            className='flex items-center py-[4.5px] gap-6 font-bold text-base pr-2'
          >
            <span className='ml-2 text-current group-hover:text-primary'>
              <Statistics />
            </span>
            Estadísticas
          </Link>
        </li>
        <li className='py-2 rounded-lg hover:bg-white hover:text-primary'>
          <Link
            href='/dashboard/workshop'
            className='flex items-center py-[4.5px] gap-6 font-bold text-base pr-2'
          >
            <span className='ml-2 text-current group-hover:text-primary'>
              <Workshop />
            </span>
            Taller
          </Link>
        </li>
      </ul>

      <div className='flex flex-col w-full items-center gap-[27px]'>
        <p className='text-base font-bold text-center text-white uppercase'>soporte</p>
        <Link href='/' className={`${textLogo.className} text-2xl`}>
          TallerXpert
        </Link>
      </div>
    </nav>
  )
}
