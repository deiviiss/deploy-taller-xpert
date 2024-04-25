'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getUserSessionServer } from '@/actions'
import { Order } from '@/interfaces'

interface OrderResponse {
  orders: Order[]
  ok: boolean
}

export const getOrders = async (): Promise<OrderResponse> => {
  try {
    noStore()
    const user = await getUserSessionServer()

    if (!user) return { ok: false, orders: [] }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })

    const orders = await response.json();

    return { ok: true, orders }
  } catch (error) {
    return { ok: false, orders: [] }
  }
}

export const getCountOrders = async () => {
  try {
    const user = await getUserSessionServer()
    if (!user) return { ok: false, orders: [] }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const orders = await response.json();
    return orders.length

  } catch (error) {
    return { ok: false, orders: [] }
  }
}