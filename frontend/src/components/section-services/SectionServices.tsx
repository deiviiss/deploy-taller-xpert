import { CardService, Title } from ".."

export const SectionServices = () => {

  const services = [
    {
      image: 'clientes.png',
      title: 'Administra tus Clientes y Reparaciones',
      description: 'Ingresa los datos de tus clientes, crea órdenes de trabajo, informes de reparación y más!'
    },
    {
      image: 'gestion.png',
      title: 'Gestiona tus datos de forma ágil y segura',
      description: 'Añade datos de tu taller, de tus técnicos y proveedores sin perder información.'
    },
    {
      image: 'comunicacion.png',
      title: 'Agiliza la comunicación con tus técnicos',
      description: 'Mantente informado en todo momento sobre el estado de tus reparaciones.'
    },
  ]

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center justify-center bg-gradient-to-t from-white to-[#DBDCF7] pt-16 pb-36">
      <Title title="¿Qué te ofrece TallerXpert?" className='text-2xl font-black text-center my-6 mb-16' />

      <div className='flex flex-col md:flex-row lg:flex-row justify-center items-center gap-4'>
        {
          services.map((service, index) => (
            <CardService key={index} service={service} />
          ))
        }
      </div>
    </section>
  )
}
