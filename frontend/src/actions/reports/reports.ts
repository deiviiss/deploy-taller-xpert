'use server'

export const sendReport = async (orderId: string) => {
  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/reparation/sendPdf/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return {
      ok: true
    }
  } catch (error) {
    return {
      ok: false
    }
  }
}