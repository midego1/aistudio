export type UserRole = "owner" | "admin" | "member";
export type MemberStatus = "active" | "pending" | "inactive";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  orgNumber: string;
  contactEmail: string;
  contactPerson: string;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  status: MemberStatus;
  joinedAt: Date;
}

export const mockWorkspace: Workspace = {
  id: "ws_001",
  name: "Acme Real Estate",
  slug: "acme-real-estate",
  orgNumber: "912 345 678",
  contactEmail: "contact@acme-realestate.com",
  contactPerson: "John Smith",
  logo: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-12-15"),
};

export const mockMembers: TeamMember[] = [
  {
    id: "usr_001",
    name: "John Smith",
    email: "john@acme-realestate.com",
    image: null,
    role: "owner",
    status: "active",
    joinedAt: new Date("2024-01-01"),
  },
  {
    id: "usr_002",
    name: "Jane Doe",
    email: "jane@acme-realestate.com",
    image: null,
    role: "admin",
    status: "active",
    joinedAt: new Date("2024-02-15"),
  },
  {
    id: "usr_003",
    name: "Bob Wilson",
    email: "bob@acme-realestate.com",
    image: null,
    role: "member",
    status: "active",
    joinedAt: new Date("2024-03-20"),
  },
  {
    id: "usr_004",
    name: "Sarah Johnson",
    email: "sarah@acme-realestate.com",
    image: null,
    role: "member",
    status: "pending",
    joinedAt: new Date("2024-12-01"),
  },
  {
    id: "usr_005",
    name: "Mike Brown",
    email: "mike@external.com",
    image: null,
    role: "member",
    status: "pending",
    joinedAt: new Date("2024-12-10"),
  },
];

export function getWorkspace(): Workspace {
  return mockWorkspace;
}

export function getMembers(): TeamMember[] {
  return mockMembers;
}

export function getMembersByStatus(status: MemberStatus): TeamMember[] {
  return mockMembers.filter((m) => m.status === status);
}

export function getMembersByRole(role: UserRole): TeamMember[] {
  return mockMembers.filter((m) => m.role === role);
}

export const ALL_ROLES: UserRole[] = ["owner", "admin", "member"];
export const ASSIGNABLE_ROLES: UserRole[] = ["admin", "member"]; // Roles that can be assigned to new members
