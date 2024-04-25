'use server'

import { signIn } from '@/auth.config'

interface LoginForm {
  email: string;
  password: string;
}

export async function authenticate(
  formData: LoginForm
) {
  try {
    await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    })

    return 'SuccessSignin'
  } catch (error) {
    console.error(error)
    return 'CredentialsSigninFail'
  }
}


export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password, redirect: false })

    return { ok: true, message: 'Inicio de sesión exitoso' }
  } catch (error) {
    return { ok: false, message: 'No se pudo iniciar sesión' }
  }
}
