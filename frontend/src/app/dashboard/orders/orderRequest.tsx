'use server'

import { getUserSessionServer } from "@/actions";

export const getAllReparation = async () => {
  const user = await getUserSessionServer()

  if (!user) return []

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })

    const orders = await response.json();
    return orders;

  } catch (error) {
    console.log(error)
  }
};

export const createReparation = async (session : any, client : any, products : any) => {
    try{
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user?.token}`,
            },
            body: JSON.stringify({
                client: client,
                products: products
            })
        })

  } catch (error) {
    console.log(error)
  }
};

export const deleteReparation = async (id: string, session: any) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.token}`,
      }
    })
  } catch (error) {
    console.log(error)
  }
};

export const editReparation = async (id: string, session: any) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.token}`,
      }
    })
  } catch (error) {
    console.log(error)
  }
};