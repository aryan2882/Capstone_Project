export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  fatherName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  idProofType: string;
  idProofNumber: string;
  password: string;
  confirmPassword: string;
}

// Updated to match your actual API response
export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;  // API returns role as string like "Admin", "BillingOfficer", etc.
  consumerId: number | null;
}

// For admin assigning roles (uses numbers 2, 3, 4)
export interface AssignRoleRequest {
  role: number;
}