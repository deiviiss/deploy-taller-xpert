export interface Client {
  id: string
  fullName: string
  dni: number
  address: string
  city: string
  phone: number
  email: string
}


export interface Product {
  id: string;
  product_name: string;
  product_category: string;
  brand: string;
  model: string;
  serial_number: string;
  detail: null | string;
  workshop: null;
  issue_detail: string;
  note: null;
  diagnostic: null | string;
  state: null | string;
  is_paid: boolean | null;
  total_cost: null;
  revision_cost: string;
  reparation_cost: null;
  warranty_date: Date;
  warranty_invoice_number: string;
  entry_date: Date;
  exit_date: Date;
  uriMercadoPago: string;
  updatedA: string;
  reparation_id: string;
  client_id: string;
}

export interface Order {
  id: string;
  ot_number: string;
  client_id: string;
  created_at: Date;
  updated_at: Date;
  assigned_user: null;
  client: Client;
  products: Product[];
  user: null;
  state: string;
}
