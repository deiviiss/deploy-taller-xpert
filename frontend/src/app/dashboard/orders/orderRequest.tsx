'use server'

import { getUserSessionServer } from "@/actions";
import { Order } from "@/interfaces";
import { Product } from "@/interfaces/order/order.interface";

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

    const orders: Order[] = await response.json();

    orders.sort((a: Order, b: Order) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return  dateB.getTime() - dateA.getTime();
    });
    return orders;

  } catch (error) {
    console.log(error)
  }
};

export const createReparation = async (client: any, products: any) => {
  
  const user = await getUserSessionServer()
  console.log('user create', user)
  if (!user) return []
  
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
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

export const deleteReparation = async (id: string) => {
  const user = await getUserSessionServer()
  if (!user) return []
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })
  } catch (error) {
    console.log(error)
  }
};

export const editReparation = async (id: string) => {
  const user = await getUserSessionServer()
  if (!user) return []
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }
    })
  } catch (error) {
    console.log(error)
  }
};

export const getOrder = async (orderId: string) => {
  const user = await getUserSessionServer()
  if (!user) return []
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error)
  }
}

export const getProduct = async (productId: string) => {
  const user = await getUserSessionServer()
  if (!user) return []
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${productId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error)
  }
}

export const updateProduct = async (product: Product) => {

  console.log(product, "product modificado")

  const user = await getUserSessionServer()
  if (!user) return []
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${product.id}`,
    // await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product/${productId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...product
        })
      }
    );
    const data = await response.json();
    console.log("data", data);
      
    return data
  } catch (error) {
    console.error(error)
  }
}

export const getCountSuppliers = async () => {
  try {
    const user = await getUserSessionServer();
    if (!user) return { ok: false, suppliers: [] };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const suppliers = await response.json();
    return suppliers.length;
  } catch (error) {
    return { ok: false, suppliers: [] };
  }
};

export const getCountProducts = async () => {
  try {
    const user = await getUserSessionServer();
    if (!user) return { ok: false, products: [] };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/product`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const products = await response.json();
    return products.length;
  } catch (error) {
    return { ok: false, products: [] };
  }
};