'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getUserSessionServer } from '@/actions'
import { Supplier } from '@/interfaces'

interface SupplierResponse {
  suppliers: Supplier[]
  ok: boolean
}

export const getSuppliers = async (): Promise<SupplierResponse> => {
  try {
    noStore()
    const user = await getUserSessionServer()

    if (!user) return { ok: false, suppliers: [] }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })

    const suppliers = await response.json();

    return { ok: true, suppliers }
  } catch (error) {
    return { ok: false, suppliers: [] }
  }
}