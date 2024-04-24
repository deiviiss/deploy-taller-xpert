'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { authenticate } from '@/actions'
import Image from "next/image";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [errorMessage, setErrorMessage] = useState<{ [key: string]: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    handleSubmit,
    register,
    formState: {isValid},
    formState: {errors},
  } = useForm<LoginForm>({
    defaultValues: {},
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorMessage({});
    setIsSubmitting(true);

    try {
      const response = await authenticate(data);

      if (response === 'SuccessSignin') {
        setShowSuccessModal(true); // Mostrar el modal de éxito

        setTimeout(() => {
          window.location.replace(redirectTo)
        }, 2000);
      }

      if (response === 'CredentialsSigninFail') {

        setErrorMessage({ general: "Credenciales invalidas" });
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrorMessage({ general: "Error al iniciar sesión" });
    }
  };

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (field: keyof LoginForm | 'general') => {
    if (errorMessage[field]) {
      return <span className='text-red-500'>{errorMessage[field]}</span>;
    }
    return null;
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-8 w-[480px] max-md:w-full mx-auto max-md:p-4 h-[500px]'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 gap-4 h-full'>
        <div>
          <label htmlFor='email'>E-mail</label>
          <input
            className={clsx(
              "w-full h-12 p-3 rounded-lg border border-solid focus:outline-none mb-2",
              {
                'border-red-500': errors.email || errorMessage.email,
              }
            )}
            type='email'
            placeholder='TallerXpert@gmail.com'
            {...register('email', {required: true, pattern: /^\S+@\S+$/i})}
          />
          {errors.email?.type === "required" && (
            <span className="text-red-500 mt-2">
              * El correo electrónico es requerido
            </span>
          )}
          {errors.email?.type === 'pattern' && (
            <span className='text-red-500'>
              * Ingrese un correo electrónico válido
            </span>
          )}
          {renderErrorMessage('email')}
        </div>

        <div>
          <label htmlFor='password'>Contraseña</label>
          <input
            className={clsx(
              "w-full h-12 p-3 rounded-lg border border-solid focus:outline-none mb-2",
              {
                'border-red-500': errors.password || errorMessage.password,
              }
            )}
            type="password"
            placeholder="**********"
            {...register("password", { required: true })}
          />
          {errors.password?.type === 'required' && (
            <span className='text-red-500'>* La contraseña es requerida</span>
          )}
          {renderErrorMessage("password")}
        </div>

        {renderErrorMessage("general")}

        <button
          disabled={isSubmitting}
          type="submit"
          className={clsx({
            "btn-primary w-full ": !isValid || !isSubmitting,
            "btn-disable": isSubmitting,
          })}
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <button className=" w-full h-12 rounded-lg border-[1px] border-[#6264D5] hover:opacity-70 flex justify-center items-center bg-[#fff] gap-4">
          Iniciar sesión con Google <Image width={20}
            height={20} src="/google.svg" alt="google" />
        </button>

        <div className='text-center'>
          No tienes una cuenta?
          <Link
            href={'/auth/new-account'}
            className='text-blue-500 ml-2 border-b-[1px] border-b-blue-500'>
            Crear una cuenta
          </Link>
        </div>
      </form>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-8 rounded-lg'>
            <h2 className='text-lg font-bold mb-4'>
              ¡Inicio de sesión exitoso!
            </h2>
            <p>Ha iniciado sesión correctamente.</p>
          </div>
        </div>
      )}
    </div>
  );
};
