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

    return { ok: true, technician }
  } catch (error) {
    return { ok: false, technician: null }
  }
}