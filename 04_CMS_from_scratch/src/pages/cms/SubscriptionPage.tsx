import React from "react";
import SubscriptionManager from "@/components/SubscriptionManager";
import { Toaster } from "sonner";

const SubscriptionPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      <SubscriptionManager />
      <Toaster />
    </div>
  );
};

export default SubscriptionPage;
