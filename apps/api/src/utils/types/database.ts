import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const UserStatus = {
  unverified: 'unverified',
  active: 'active',
  deactivated: 'deactivated',
  deleted: 'deleted',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export const VendorStatus = {
  inactive: 'inactive',
  active: 'active',
  deactivated: 'deactivated',
} as const;
export type VendorStatus = (typeof VendorStatus)[keyof typeof VendorStatus];
export const InviteStatus = {
  pending: 'pending',
  used: 'used',
} as const;
export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus];
export const ProposalStatus = {
  open: 'open',
  closed: 'closed',
} as const;
export type ProposalStatus =
  (typeof ProposalStatus)[keyof typeof ProposalStatus];
export const ProposalRequestStatus = {
  submitted: 'submitted',
  accepted: 'accepted',
  rejected: 'rejected',
} as const;
export type ProposalRequestStatus =
  (typeof ProposalRequestStatus)[keyof typeof ProposalRequestStatus];
export const TaskStatus = {
  todo: 'todo',
  inProgres: 'inProgres',
  completed: 'completed',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export const ProcurementStatus = {
  created: 'created',
  pending: 'pending',
  approved: 'approved',
  declined: 'declined',
} as const;
export type ProcurementStatus =
  (typeof ProcurementStatus)[keyof typeof ProcurementStatus];
export type CartItem = {
  id: Generated<string>;
  userId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Department = {
  id: Generated<string>;
  organizationId: string;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Invite = {
  id: Generated<string>;
  organizationId: string;
  email: string;
  roleId: string;
  departmentId: string;
  status: Generated<InviteStatus>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Organization = {
  id: Generated<string>;
  name: string;
  companySize: string | null;
  sector: string | null;
  logo: string | null;
  companyId: string | null;
  description: string | null;
  websiteUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  isDeleted: Generated<boolean>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Permission = {
  id: Generated<string>;
  name: string;
  description: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Procurement = {
  id: Generated<string>;
  userId: string;
  organizationId: string;
  itemDetails: string;
  amount: string;
  status: Generated<ProcurementStatus>;
  requiredDate: Timestamp;
  justification: string;
  paymentTerms: string;
  documents: string[];
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type ProcurementItem = {
  id: Generated<string>;
  procurementId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Product = {
  id: Generated<string>;
  categoryId: string;
  vendorId: string;
  name: string;
  basePrice: string;
  quantity: Generated<number>;
  description: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type ProductCategory = {
  id: Generated<string>;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type ProductImage = {
  id: Generated<string>;
  productId: string;
  imageUrl: string;
  isPrimary: Generated<boolean>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type ProductSpecification = {
  id: Generated<string>;
  productId: string;
  title: string;
  value: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type ProductVariant = {
  id: Generated<string>;
  productId: string;
  name: string;
  quantity: number;
  price: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Proposal = {
  id: Generated<string>;
  organizationId: string;
  categoryId: string;
  title: string;
  dateRequired: Timestamp;
  budgetAmount: string;
  description: string;
  termsAndCondition: string;
  additionalDocument: string | null;
  evaluationCriteria: string[];
  eligibilityCriteria: string[];
  status: Generated<ProposalStatus>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type ProposalCategory = {
  id: Generated<string>;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type ProposalRequest = {
  id: Generated<string>;
  proposalId: string;
  vendorId: string;
  title: string;
  summary: string;
  attachments: string[];
  status: Generated<ProposalRequestStatus>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Role = {
  id: Generated<string>;
  name: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type RolePermission = {
  roleId: string;
  permissionId: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Task = {
  id: Generated<string>;
  assigneeId: string;
  assignerId: string;
  organizationId: string | null;
  title: string;
  priority: string;
  status: Generated<TaskStatus>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type User = {
  id: Generated<string>;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  status: Generated<UserStatus>;
  organizationId: string | null;
  vendorId: string | null;
  departmentId: string | null;
  isDeleted: Generated<boolean>;
  profileImage: string | null;
  title: string | null;
  biography: string | null;
  phoneNumber: string | null;
  address: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type UserRole = {
  userId: string;
  roleId: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type Vendor = {
  id: Generated<string>;
  name: string;
  sector: string | null;
  logo: string | null;
  description: string | null;
  taxIdentificationNumber: string | null;
  certificateOfRegistration: string | null;
  businessRegistrationNumber: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  status: Generated<VendorStatus>;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type DB = {
  CartItem: CartItem;
  Department: Department;
  Invite: Invite;
  Organization: Organization;
  Permission: Permission;
  Procurement: Procurement;
  ProcurementItem: ProcurementItem;
  Product: Product;
  ProductCategory: ProductCategory;
  ProductImage: ProductImage;
  ProductSpecification: ProductSpecification;
  ProductVariant: ProductVariant;
  Proposal: Proposal;
  ProposalCategory: ProposalCategory;
  ProposalRequest: ProposalRequest;
  Role: Role;
  RolePermission: RolePermission;
  Task: Task;
  User: User;
  UserRole: UserRole;
  Vendor: Vendor;
};
