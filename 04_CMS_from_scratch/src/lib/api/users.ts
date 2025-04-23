import axiosInstance from "../axios";

export interface User {
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

// Mock user data for testing purposes
const mockUsers: User[] = [
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
];

// Flag to toggle between mock data and real API
const USE_MOCK_DATA = true;

// Get all users
export const getUsers = async (): Promise<User[]> => {
  if (USE_MOCK_DATA) {
    // Return mock data with a simulated delay
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockUsers]), 500);
    });
  }

  try {
    const response = await axiosInstance.get("/super-admin/users");
    console.log("API Response:", response);

    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // If response.data has a data property that's an array (common API pattern)
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // If response.data has a users property that's an array
    if (response.data && Array.isArray(response.data.users)) {
      return response.data.users;
    }

    // If we can't find an array, return an empty array and log an error
    console.error("API response doesn't contain user array:", response.data);
    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return empty array on error
  }
};

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
  if (USE_MOCK_DATA) {
    const user = mockUsers.find((u) => u._id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...user }), 300);
    });
  }

  const response = await axiosInstance.get(`/super-admin/users/${id}`);
  return response.data;
};

// Create a new user
export const createUser = async (userData: Partial<User>): Promise<User> => {
  if (USE_MOCK_DATA) {
    const newUser: User = {
      _id: Date.now().toString(),
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      mobile: userData.mobile || "",
      profileUrl: userData.profileUrl || "",
      gender: userData.gender || "",
      address: userData.address || "",
      state: userData.state || "",
      pincode: userData.pincode || "",
      isEmailVerified: userData.isEmailVerified || false,
      isMobileVerified: userData.isMobileVerified || false,
      isDeleted: false,
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...newUser }), 500);
    });
  }

  const response = await axiosInstance.post("/super-admin/users", userData);
  return response.data;
};

// Update a user
export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  if (USE_MOCK_DATA) {
    const index = mockUsers.findIndex((u) => u._id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser = {
      ...mockUsers[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    mockUsers[index] = updatedUser;

    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...updatedUser }), 500);
    });
  }

  const response = await axiosInstance.put(
    `/super-admin/users/${id}`,
    userData
  );
  return response.data;
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    const index = mockUsers.findIndex((u) => u._id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  await axiosInstance.delete(`/super-admin/users/${id}`);
};

// Activate/Deactivate a user
export const toggleUserStatus = async (
  id: string,
  isActive: boolean
): Promise<User> => {
  if (USE_MOCK_DATA) {
    const index = mockUsers.findIndex((u) => u._id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    mockUsers[index] = {
      ...mockUsers[index],
      isActive,
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...mockUsers[index] }), 500);
    });
  }

  const response = await axiosInstance.patch(
    `/super-admin/users/${id}/status`,
    { isActive }
  );
  return response.data;
};
