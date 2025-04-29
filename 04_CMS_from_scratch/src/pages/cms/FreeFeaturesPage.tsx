import React from "react";
import FreeFeaturesManager from "@/components/FreeFeaturesManager";
import { Toaster } from "sonner";

const FreeFeaturesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Free Features Management</h1>
      <FreeFeaturesManager />
      <Toaster />
    </div>
  );
};

export default FreeFeaturesPage;
