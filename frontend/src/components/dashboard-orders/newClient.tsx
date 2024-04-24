import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { Input } from "./Input"
import { Client } from "@/app/dashboard/orders/interface"

interface NewClientProps {
    // setClient: Dispatch<SetStateAction<Client>>
    setClient: (client: Client) => void
}

export const NewClient = ({ setClient }: NewClientProps) => {

    const [formDataClient, setFormDataClient] = useState({
        fullName: '',
        dni: '',
        address: '',
        city: '',
        phone: '',
        email: ''
    })

    const [shouldShowErrorMessage, setShouldShowErrorMessage] = useState(false)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormDataClient((prevClient) => ({ ...prevClient, [name]: value }))
    }

    useEffect(() => {
        const isValid = Object.values(formDataClient).every(value => value.trim() !== '')
        if (isValid) {
            setClient(formDataClient);
        }
    }, [formDataClient, setClient])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return (
        <div className="bg-[#ffffff] shadow-md rounded-lg flex flex-col  px-4 py-6">
            <div>
                <p className="font-bold">Datos de Cliente</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-6">
                <Input
                    label="Nombre y Apellido"
                    id="fullName"
                    name="fullName"
                    value={formDataClient.fullName}
                    onChange={handleChange}
                    placeholder="Nombre y Apellido"
                    errorMessage="Falta completar el nombre"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="DNI"
                    id="dni"
                    name="dni"
                    value={formDataClient.dni}
                    onChange={handleChange}
                    placeholder="DNI"
                    errorMessage="Falta completar el DNI"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="Dirección"
                    id="address"
                    name="address"
                    value={formDataClient.address}
                    onChange={handleChange}
                    placeholder="Dirección"
                    errorMessage="Falta completar la dirección"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="Ciudad"
                    id="city"
                    name="city"
                    value={formDataClient.city}
                    onChange={handleChange}
                    placeholder="Ciudad"
                    errorMessage="Falta completar la ciudad"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="Telefono"
                    id="phone"
                    name="phone"
                    value={formDataClient.phone}
                    onChange={handleChange}
                    placeholder="Telefono"
                    errorMessage="Falta completar el telefono"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="Email"
                    id="email"
                    name="email"
                    value={formDataClient.email}
                    onChange={handleChange}
                    placeholder="Email"
                    errorMessage="Falta completar el email"
                    showErrorMessage={shouldShowErrorMessage}
                />
            </form>
        </div>
    )
}
