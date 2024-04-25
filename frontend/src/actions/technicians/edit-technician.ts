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
          email: data.email,
          phone: data.phone,
          address: data.address,
        }),
      }
    );

    if (!response.ok) return { ok: false }

    revalidatePath('/dashboard/technicians')
    return { ok: true }
  } catch (error) {
    return { ok: false }
  }
}