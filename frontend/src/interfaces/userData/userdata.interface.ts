export interface UserData {
    id: string;
    fullName: string;
    email: string;
    password: string;
    rol: string;
    is_active: boolean;
    token: string;
    workshop?: {
      id: string;
      name: string;
      specializedField: string;
      city: string;
      direction: string;
      email: string;
      phone: string;
      cuit: string;
      logoImage: string;
      ownerId: string;
    }
  }