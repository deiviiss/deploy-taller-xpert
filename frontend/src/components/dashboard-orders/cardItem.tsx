import { Products } from "@/app/dashboard/orders/interface"
import { Delete } from "../icons/Delete"
import { Edit } from "../icons/Edit"
import ReactDOMServer from "react-dom/server";
import Swal from "sweetalert2";
import { Alert } from "../icons/Alert";

export const CardItem = ({ product, onDelete, onEdit }: { product: Products, onDelete: (product: Products) => void, onEdit: (product: Products) => void }) => {

    const handleEdit = () => {
        onEdit(product)
    }

    const handleDelete = async () => {
        const titleContent = ReactDOMServer.renderToString(<div className="flex flex-row items-center gap-2 justify-center"><Alert /> ATENCION!</div>);
        const result = await Swal.fire({
            title: titleContent,
            text: "¿Está seguro que desea eliminar el artículo?",
            showCancelButton: true,
            confirmButtonColor: "#6264D5",
            cancelButtonColor: "#4F3E9C",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar"
        })
        if (result.isConfirmed) {
            try {
                onDelete(product)
                Swal.fire({
                    title: "Eliminada",
                    text: "La orden fue eliminada correctamente",
                    confirmButtonText: "Aceptar"
                });
            } catch (error) {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error al eliminar la orden",
                    confirmButtonText: "Aceptar"
                });
            }
        }
    }

    return (
        <div className="grid grid-cols-3 items-center justify-between px-6 py-5 rounded-lg bg-secondary shadow-md ">
            <p className="text-sm ">{product.product_name}</p>
            <p className="text-sm bg-[#F1CC5B] w-28 py-1 text-center rounded-full">PENDIENTE</p>
            <div className="flex flex-row gap-6 justify-center">
                <button className="h-6" onClick={handleEdit}>
                    <Edit width={24} height={24}/>
                </button>
                <button className="h-6" onClick={handleDelete}>
                    <Delete width={24} height={24} />
                </button>
            </div>
        </div>
    )
}
