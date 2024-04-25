export interface Reparation {
    id: string;
    ot_number: string;
    client: {
        id: string;
        fullName: string;
    }
}

export interface Client {
    fullName: string;
    dni: string;
    address: string;
    city: string;
    phone: string;
    email: string;
}

export interface Products {
    product_name: string;
    product_category: string;
    brand: string;
    model: string;
    serial_number: string;
    issue_detail: string;
    note: string;
    warranty_date?: string;
    warranty_invoice_number?: string;
    revision_cost: string;
}