'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getUserSessionServer } from '@/actions'
import { Technician } from '@/interfaces'

interface TechnicianResponse {
  technicians: Technician[]
  ok: boolean
}

export const getTechnicians = async (query: string): Promise<TechnicianResponse> => {
  try {
    noStore()

    const user = await getUserSessionServer()

    if (!user) return { ok: false, technicians: [] }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })

    const technicians = await response.json();

    const filteredTechnicians = technicians.filter((technician: Technician) => technician.fullName.toLowerCase().includes(query.toLowerCase()) && technician.rol === 'technician' && technician.is_active)

    return { ok: true, technicians: filteredTechnicians }
  } catch (error) {
    return { ok: false, technicians: [] }
  }
}