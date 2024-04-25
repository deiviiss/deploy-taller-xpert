'use server'

import { Technician } from "@/interfaces";
import { revalidatePath } from "next/cache";
import { getUserSessionServer } from "@/actions";

type TechnicianWithoutId = Omit<Technician, 'id' | 'rol' | 'is_active'>

export const editTechnician = async (data: TechnicianWithoutId, id: string) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email
        }),
      }
    );

    if (!response.ok) return { ok: false }
    //! AQUI SOLO TENGO EL ID DEL TECNICO, NECESITO EDITAR EL PROFILE DEL TECNICO, PERO EL ENDPOINT DE PROFILE NECESITA EL ID DEL PROFILE, NO DEL USUARIO
    // const responseProfile = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile/${id}`,
    //   {
    //     method: "PATCH",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${user.token}`,
    //     },
    //    body: JSON.stringify({
    //      phone: data.phone,
    //      address: data.address
    //    }),
    //   }
    // );

    revalidatePath('/dashboard/technicians')
    return { ok: true }
  } catch (error) {
    return { ok: false }
  }
}