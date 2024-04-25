import { getUserSessionServer } from '@/actions'

export const getAllSuppliers = async () => {
  const user = await getUserSessionServer()

  if (!user) return { ok: false, orders: [] }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getSupplierById = async (session: any, id: string) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false, orders: [] }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const createSupplier = async (session: any, supplier: any) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false, orders: [] }

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        name: supplier.name,
        address: supplier.address,
        phone: parseInt(supplier.phone),
        city: supplier.city,
        cuit: parseInt(supplier.cuit),
        email: supplier.email,
        seller_name: supplier.seller_name,
        categories: [supplier.categories]
      })
    })

    return {
      ok: true
    }
  } catch (error) {
    return {
      ok: error
    }
    console.log(error)
  }
}

export const deleteSupplier = async (id: string) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false, orders: [] }

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const editSupplier = async (supplier: any, id: string, session: any) => {
  try {
    const user = await getUserSessionServer()

    if (!user) return { ok: false, orders: [] }

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/supplier/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.token}`
      },
      body: JSON.stringify({
        name: supplier.name,
        address: supplier.address,
        phone: parseInt(supplier.phone),
        city: supplier.city,
        cuit: parseInt(supplier.cuit),
        email: supplier.email,
        seller_name: supplier.seller_name,
        categories: [supplier.categories]
      })
    })
    return {
      ok: true
    }
  } catch (error) {
    return {
      ok: true
    }
    console.log(error)
  }
}
