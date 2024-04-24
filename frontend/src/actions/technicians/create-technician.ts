'use server'

import { Technician } from "@/interfaces";
import { revalidatePath } from "next/cache";
import { getUserSessionServer } from "@/actions";

type TechnicianWithoutId = Omit<Technician, 'id' | 'rol' | 'is_active'>

export const createTechnician = async (data: TechnicianWithoutId) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          rol: 'technician',
          address: data.address,
          phone: data.phone,
          photo_url: data.photo_url,
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
