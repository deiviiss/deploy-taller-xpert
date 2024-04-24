'use server'

import { revalidatePath } from "next/cache";
import { getUserSessionServer } from "@/actions";

export const deleteTechnician = async (id: string) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      }
    );

    if (!response.ok) return { ok: false }

    revalidatePath('/dashboard/technicians')
    return { ok: true }
  } catch (error) {
    return { ok: false }
  }
}