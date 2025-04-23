// Define the User type directly here to avoid circular dependencies
export interface MockUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  profileUrl: string;
  gender: string;
  address: string;
  state: string;
  pincode: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock user data for testing
export const mockUsers: MockUser[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    mobile: "1234567890",
    profileUrl: "",
    gender: "male",
    address: "123 Main St",
    state: "California",
    pincode: "90210",
    isEmailVerified: true,
    isMobileVerified: true,
    isDeleted: false,
    isActive: true,
    createdAt: "2023-05-01T00:00:00.000Z",
    updatedAt: "2023-05-15T00:00:00.000Z",
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    mobile: "0987654321",
    profileUrl: "",
    gender: "female",
    address: "456 Elm St",
    state: "New York",
    pincode: "10001",
    isEmailVerified: true,
    isMobileVerified: false,
    isDeleted: false,
    isActive: true,
    createdAt: "2023-04-10T00:00:00.000Z",
    updatedAt: "2023-05-10T00:00:00.000Z",
  },
  {
    _id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    mobile: "5554443333",
    profileUrl: "",
    gender: "male",
    address: "789 Oak St",
    state: "Texas",
    pincode: "75001",
    isEmailVerified: false,
    isMobileVerified: true,
    isDeleted: false,
    isActive: false,
    createdAt: "2023-03-20T00:00:00.000Z",
    updatedAt: "2023-04-25T00:00:00.000Z",
  },
  {
    _id: "4",
    firstName: "Alice",
    lastName: "Williams",
    email: "alice@example.com",
    mobile: "1112223333",
    profileUrl: "",
    gender: "female",
    address: "101 Pine St",
    state: "Florida",
    pincode: "33101",
    isEmailVerified: true,
    isMobileVerified: true,
    isDeleted: false,
    isActive: true,
    createdAt: "2023-02-15T00:00:00.000Z",
    updatedAt: "2023-04-15T00:00:00.000Z",
  },
  {
    _id: "5",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    mobile: "9998887777",
    profileUrl: "",
    gender: "male",
    address: "202 Cedar St",
    state: "Washington",
    pincode: "98101",
    isEmailVerified: true,
    isMobileVerified: false,
    isDeleted: false,
    isActive: false,
    createdAt: "2023-01-10T00:00:00.000Z",
    updatedAt: "2023-03-20T00:00:00.000Z",
  },
];
