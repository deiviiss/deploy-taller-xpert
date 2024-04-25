export interface Technician {
  id: string
  fullName: string
  address: string
  phone: string
  email: string
  password: string
  rol: string
  photo_url?: string
  is_active: boolean
  profile: {
    id: string
    userId: string
    fullName: string
    address: string
    phone: string
    photo_url?: string
  }
}