import { VendorStatus } from './database';

export interface UpdateVendorPayload {
  businessName?: string;
  phoneNumber?: string;
  businessRegistrationNumber?: string;
  certificateOfRegistration?: string;
  taxIdentificationNumber?: string;
  sector?: string;
  description?: string;
  logo?: string;
  status?: VendorStatus;
}
