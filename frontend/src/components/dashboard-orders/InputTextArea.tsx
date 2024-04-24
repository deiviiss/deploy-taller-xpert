import { ChangeEvent } from "react";

interface InputTextAreaProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const InputTextArea = ({ label, id, name, value, onChange }: InputTextAreaProps) => {
    return (
        <div className="flex flex-col w-full items-start gap-2">
            <label htmlFor={id}>{label}</label>
            <textarea id={id} name={name} value={value} onChange={onChange} className="h-16 w-full rounded bg-secondary pl-3" />
        </div>
    )
}