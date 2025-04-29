import axios from "axios";

const API_URL = "http://localhost:3000/api";

export interface SubscriptionPlan {
  _id?: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  durationMonths: number;
  userCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const subscriptionService = {
  // Get all subscription plans
  getAllPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await axios.get(`${API_URL}/subscriptions`);
    return response.data;
  },

  // Get a single subscription plan
  getPlan: async (id: string): Promise<SubscriptionPlan> => {
    const response = await axios.get(`${API_URL}/subscriptions/${id}`);
    return response.data;
  },

  // Create a new subscription plan
  createPlan: async (
    plan: Omit<SubscriptionPlan, "_id">
  ): Promise<SubscriptionPlan> => {
    const response = await axios.post(`${API_URL}/subscriptions`, plan);
    return response.data;
  },

  // Update a subscription plan
  updatePlan: async (
    id: string,
    plan: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan> => {
    const response = await axios.put(`${API_URL}/subscriptions/${id}`, plan);
    return response.data;
  },

  // Delete a subscription plan
  deletePlan: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/subscriptions/${id}`);
  },
};
