'use client'
import { getUserSessionServer } from "@/actions";
import { Title } from "@/components"
import { Loader } from "@/components/loader";
import { UserData } from "@/interfaces/userData/userdata.interface";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function WorkshopPage() {

  const [userData, setUserData] = useState<UserData | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const userDataFromServer = await getUserSessionServer();
        setUserData(userDataFromServer);
        setLoading(false)
      } catch (error) {
        console.error('Error al cargar los datos del usuario: ', error);
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='h-3/4 flex justify-center items-center'>
        <Loader></Loader>
      </div>
    );
  }

  return userData ? (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold  text-2xl flex gap-2 items-center">
            {userData?.workshop?.name}
            <span className="text-xl font-normal">(Rubro: {userData?.workshop?.specializedField})</span>
          </h2>
        </div>
        <div className="flex flex-row gap-14  py-12 text-white px-12 border-[1px] rounded-lg border-[#B9B8B8] shadow-[0px_4px_4px_0px_#00000040] bg-gradient-to-b from-[#4F3E9C] to-[#6162D3]  ">
          <Image src={'/logoTaller.jpg'} alt="" width={150} height={150} style={{ width: 'auto', height: 'auto' }}/>
          <div className="relative flex flex-col gap-6">
            <p className="flex gap-4 items-center">Dirección: {userData?.workshop?.direction}</p>
            <p className="flex gap-4 items-center">Ciudad: {userData?.workshop?.city}</p>
            <p className="flex gap-4 items-center">Email: {userData?.workshop?.email}</p>
            <p className="flex gap-4 items-center">Phone: {userData?.workshop?.phone}</p>
            <p className="flex gap-4 items-center">CUIT: {userData?.workshop?.cuit}</p>
          </div>
        </div>
        <div className='flex flex-col bg-[#DBDCF7] rounded-lg p-4 shadow-[0px_4px_4px_0px_#00000040] max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:gap-2 max-lg:text-center text-[#2E353A]'>
          <p className="flex gap-4 items-center">Administrador: {userData?.fullName}</p>
          <p className="flex gap-4 items-center">Email: {userData?.email}</p>
        </div>
      </div>
    </div>
  ) : (
    "No hay un taller asociado a esta cuenta"
  );
}