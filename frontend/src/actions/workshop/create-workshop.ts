'use server'

import { getUserSessionServer } from "../auth/getUserServerSession";

interface WorkshopForm {
  name: string;
  direction: string;
  city: string;
  phone: string;
  email: string;
  cuit: string;
  specializedField: string;
  logoImage?: string;
}

export const createWorkshop = async (data: WorkshopForm) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workshop`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        ownerId: user.id
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })

    if (!response.ok) return { ok: false }

    return { ok: true }
  } catch (error) {
    return { ok: false }
  }
}