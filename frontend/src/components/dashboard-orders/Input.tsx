import { error } from "console";
import { ChangeEvent } from "react";

interface InputProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    errorMessage?: string;
    showErrorMessage?: boolean
}

export const Input = ({ label, id, name, value, onChange, placeholder, errorMessage, showErrorMessage = false }: InputProps) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center gap-8">
                <label htmlFor={id}>{label}</label>
                <input type="text" id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} className="h-8 w-72 rounded bg-secondary pl-3" />
            </div>
            {showErrorMessage && errorMessage && value.trim() === '' && (
                <p className="text-red-500 text-xs">{errorMessage}</p>
            )}
        </div>
    )
}