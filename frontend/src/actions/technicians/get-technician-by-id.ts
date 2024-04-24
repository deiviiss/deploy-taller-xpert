'use server'

import { getUserSessionServer } from "@/actions";

export const getTechnicianById = async (id: string) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false, technicians: [] }

    const responseUser = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      }
    );

    if (!responseUser.ok) return { ok: false }

    const technician = await responseUser.json()

    if (!technician) return { ok: false, technician: null }

    //! AQUI SOLO TENGO EL ID DEL TECNICO, NECESITO OBTENER EL PROFILE DEL TECNICO, PERO EL ENDPOINT DE PROFILE NECESITA EL ID DEL PROFILE, NO DEL USUARIO
    // const responseProfile = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/${id}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${user.token}`,
    //     }
    //   }
    // );

    return { ok: true, technician }
  } catch (error) {
    return { ok: false, technician: null }
  }
}