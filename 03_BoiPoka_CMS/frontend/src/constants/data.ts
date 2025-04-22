import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Profile",
    href: "/profile",
    icon: "user",
    label: "Profile",
  },
  {
    title: "Users API",
    href: "/users-api",
    icon: "users",
    label: "Users",
  },
  {
    title: "Users",
    href: "/users",
    icon: "users",
    label: "Users",
  },
  {
    title: "Form Page",
    href: "/form-page",
    icon: "users",
    label: "Users",
  },
  {
    title: "Books",
    href: "/books",
    icon: "book",
    label: "Books",
  },
];

export const users = [
  {
    id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

export const dashboardCard = [
  {
    date: "Today",
    total: 2000,
    role: "Students",
    color: "bg-[#EC4D61] bg-opacity-40",
  },
  {
    date: "Today",
    total: 2000,
    role: "Teachers",
    color: "bg-[#FFEB95] bg-opacity-100",
  },
  {
    date: "Today",
    total: 2000,
    role: "Parents",
    color: "bg-[#84BD47] bg-opacity-30",
  },
  {
    date: "Today",
    total: 2000,
    role: "Schools",
    color: "bg-[#D289FF] bg-opacity-30",
  },
];

export type Admin = {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  accessTo: string[];
  isActive: boolean;
};
export type User = {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  userBookCount: number;
};

export type Book = {
  _id: string;
  isbn: string[];
  title: string;
  coverImage: string;
  description?: string;
  author: string[];
  genre: string[];
  rating?: number;
  languages?: string[];
  createdAt?: string;
  updatedAt?: string;
  bookData?: {
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    maturityRating?: string;
    previewLink?: string;
    infoLink?: string;
  };
};
