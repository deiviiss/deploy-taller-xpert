import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useMemo, useState } from "react"
import { Button } from "../button/Button"
import { Input } from "./Input"
import { Products } from "@/app/dashboard/orders/interface"
import { InputTextArea } from "./InputTextArea"

interface NewItemProps {
    setProducts: Dispatch<SetStateAction<Products[]>>;
    selectedProduct: Products | null;
    setSelectedProduct: Dispatch<SetStateAction<Products | null>>;
}

export const NewItem = ({ setProducts, selectedProduct, setSelectedProduct }: NewItemProps) => {

    const initialDataProduct =  useMemo(() => ({
        product_name: '',
        product_category: '',
        brand: '',
        model: '',
        serial_number: '',
        issue_detail: '',
        note: '',
        warranty_date: '',
        warranty_invoice_number: '',
        revision_cost: '',
    }), []);

    const [formDataItem, setFormDataItem] = useState<Products>(initialDataProduct)

    const [shouldShowErrorMessage, setShouldShowErrorMessage] = useState(false)

    useEffect(() => {
        if (selectedProduct) {
            setFormDataItem(selectedProduct);
        } else {
            setFormDataItem(initialDataProduct);
        }
    }, [selectedProduct, initialDataProduct]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setFormDataItem((prevProducts) => ({ ...prevProducts, [name]: value }))
    }

    const handleChangeText = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setFormDataItem((prevProducts) => ({ ...prevProducts, [name]: value }))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    const createProduct = () => {
        if (
            formDataItem.product_name.trim() === '' ||
            formDataItem.product_category.trim() === '' ||
            formDataItem.brand.trim() === '' ||
            formDataItem.model.trim() === '' ||
            formDataItem.serial_number.trim() === '' ||
            formDataItem.issue_detail.trim() === '' ||
            formDataItem.note.trim() === '' ||
            formDataItem.revision_cost.trim() === ''
        ) {
            setShouldShowErrorMessage(true);
            return;
        }
        if (selectedProduct) {
            const updatedProduct: Products = {
                ...selectedProduct,
                ...formDataItem,
            };
            setProducts(prevProducts =>
                prevProducts.map(prevProduct => (prevProduct === selectedProduct ? updatedProduct : prevProduct))
            );
            setSelectedProduct(null);
        } else {
            const newProduct: Products = {
                product_name: formDataItem.product_name,
                product_category: formDataItem.product_category,
                brand: formDataItem.brand,
                model: formDataItem.model,
                serial_number: formDataItem.serial_number,
                issue_detail: formDataItem.issue_detail,
                note: formDataItem.note,
                ...(formDataItem.warranty_date && { warranty_date: formDataItem.warranty_date }),
                ...(formDataItem.warranty_invoice_number && { warranty_invoice_number: formDataItem.warranty_invoice_number }),
                revision_cost: formDataItem.revision_cost,
            }
            setProducts((prevProducts) => [...prevProducts, newProduct])
        }
        setFormDataItem(initialDataProduct);
        setShouldShowErrorMessage(false);
    }



    return (
        <div className="bg-[#ffffff] shadow-md rounded-lg  px-4 py-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-3">
                <Input
                    label="Articulo"
                    id="product_name"
                    name="product_name"
                    value={formDataItem.product_name}
                    onChange={handleChange}
                    placeholder="Articulo"
                    errorMessage="Falta completar el nombre"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="Categoría"
                    id="product_category"
                    name="product_category"
                    value={formDataItem.product_category}
                    onChange={handleChange}
                    placeholder="Categoría"
                    errorMessage="Falta completar la categoría"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="Marca"
                    id="brand"
                    name="brand"
                    value={formDataItem.brand}
                    onChange={handleChange}
                    placeholder="Marca"
                    errorMessage="Falta completar la marca"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="Modelo"
                    id="model"
                    name="model"
                    value={formDataItem.model}
                    onChange={handleChange}
                    placeholder="Modelo"
                    errorMessage="Falta completar el modelo"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <Input
                    label="N° Serie"
                    id="serial_number"
                    name="serial_number"
                    value={formDataItem.serial_number}
                    onChange={handleChange}
                    placeholder="N° Serie"
                    errorMessage="Falta completar el numero de serie"
                    showErrorMessage={shouldShowErrorMessage}
                />
                <InputTextArea
                    label="Daño reportado"
                    id="issue_detail"
                    name="issue_detail"
                    value={formDataItem.issue_detail}
                    onChange={handleChangeText}
                />
                <div className="flex flex-col w-full items-start gap-2">
                    <InputTextArea
                        label="Notas"
                        id="note"
                        name="note"
                        value={formDataItem.note}
                        onChange={handleChangeText}
                    />
                </div>
                <p className="text-base font-bold">Datos de garantía</p>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row justify-between gap-6">
                        <div className="flex flex-row items-center gap-4">
                            <label>Fecha</label>
                            <input
                                type="date"
                                placeholder=""
                                id="warranty_date"
                                name="warranty_date"
                                value={formDataItem.warranty_date ?? ''}
                                onChange={handleChange}
                                className="h-8 w-36 pl-2 rounded bg-secondary" />
                        </div>
                        <div className="flex flex-row items-center gap-4">
                            <label>Factura N°</label>
                            <input
                                id="warranty_invoice_number"
                                name="warranty_invoice_number"
                                value={formDataItem.warranty_invoice_number ?? ''}
                                onChange={handleChange}
                                placeholder="Factura N°"
                                className="h-8 pl-2 rounded bg-secondary" />
                        </div>
                    </div>
                    <Input
                        label="Costo de Revisión"
                        id="revision_cost"
                        name="revision_cost"
                        value={formDataItem.revision_cost}
                        onChange={handleChange}
                        placeholder="Costo de Revisión"
                        errorMessage="Falta completar el costo"
                        showErrorMessage={shouldShowErrorMessage}
                    />
                </div>
            </form>

            <Button title={selectedProduct ? "Editar " : "Crear Articulo"} onClick={createProduct} />
        </div>
    )
}
