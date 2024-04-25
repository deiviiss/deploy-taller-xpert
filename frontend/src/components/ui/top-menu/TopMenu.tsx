"use client";
import { usePathname } from "next/navigation";
import { Title } from "@/components";
import { getDateFormatSpanish } from "@/utils";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { logout } from "@/actions";

const routeConfig = {
  '/dashboard': {
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      fill="none"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7.5 19.875V42A1.5 1.5 0 0 0 9 43.5h9V30.75a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 30 30.75V43.5h9a1.5 1.5 0 0 0 1.5-1.5V19.875"
      />
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M45 24 25.02 4.875c-.468-.495-1.564-.5-2.04 0L3 24m34.5-7.219V6H33v6.469"
      />
    </svg>,
    title: 'Dashboard'
  },
  '/dashboard/technicians': {
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      fill="none"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M30 18h7.5M30 24h7.5M30 30h7.5M9 39h30a4.5 4.5 0 0 0 4.5-4.5v-21A4.5 4.5 0 0 0 39 9H9a4.5 4.5 0 0 0-4.5 4.5v21A4.5 4.5 0 0 0 9 39Zm12-20.25a3.75 3.75 0 1 1-7.499 0 3.75 3.75 0 0 1 7.499 0Zm2.588 12.672A13.442 13.442 0 0 1 17.248 33a13.44 13.44 0 0 1-6.336-1.578 6.753 6.753 0 0 1 12.676 0Z"
      />
    </svg>,
    title: 'Técnicos'
  },
  '/dashboard/orders': {
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
      />
    </svg>,
    title: 'Ordenes'
  },
  '/dashboard/orders/new-order': {
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
      />
    </svg>,
    title: 'Ordenes'
  },
  '/dashboard/suppliers': {
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
      />
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>,
    title: 'Proveedores'
  },
  '/dashboard/suppliers/create': {
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
      />
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>,
    title: 'Proveedores'
  },
  '/dashboard/statistics': {
    icon: <svg xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5} stroke="currentColor"
      className="w-12 h-12"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      />
    </svg>,
    title: 'Estadísticas'
  },
  '/dashboard/workshop': {
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-12 h-12"
    >
      <path
        stroke="#B9B8B8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
      />
    </svg>,
    title: 'Taller'
  }
}

export const TopMenu = () => {
  const pathName = usePathname();
  const { data: session, status } = useSession();

  const currentDate = new Date();
  const formatDate = getDateFormatSpanish(currentDate);

  const currentRouteConfig = routeConfig[pathName as keyof typeof routeConfig] || {};
  const { icon, title } = currentRouteConfig;

  const userName = "Admin";
  const userImage = "/avatar.png";

  if (status === "loading") {
    return (
      <div className="h-[128px] flex p-8 pl-[17px] items-center animate-pulse">
        <p>Cargando...</p>;
      </div>
    )
  }

  return (
    <nav className='flex p-8 pl-[17px] justify-between items-center w-full bg-white'>
      {/* left menu */}
      <div className='flex items-center justify-center gap-2'>
        <div className='flex items-center justify-center text-center'>{icon}</div>
        <Title title={title} className='text-[32px]' />
      </div>
      {/* center menu */}
      <h2 className='p-2 m-2'>{formatDate}</h2>
      {/* right menu */}
      <div className='flex items-center justify-center gap-[10.5px] py-2'>
        <div>
          <button onClick={async () => await logout()} className="btn btn-danger">
            Cerrar sesión
          </button>
        </div>
        <div className='flex'>
          <button type='button'>
            <svg width='20' height='20' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <polygon points='50,70 20,30 80,30' fill='black' />
            </svg>
          </button>
          <h2 className='text-base font-semibold text-gray-900'>{userName}</h2>
        </div>
        <Image
          src={userImage}
          alt={userName}
          className='object-cover w-12 h-12 m-auto rounded-full'
          width={150}
          height={150}
        />
      </div>
    </nav>
  )
}

