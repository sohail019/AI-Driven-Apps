import axiosInstance from "@/utils/axios-instance";
import { useState, useEffect } from "react";

export const useBreadcrumbTitle = (id: string, fetchUrl: string) => {
  const [breadcrumbTitle, setBreadcrumbTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await axiosInstance.get(fetchUrl);
        const fullName = response.data.admin?.fullName || "Unknown Admin";
        setBreadcrumbTitle(fullName);
      } catch (error) {
        console.error("Error fetching breadcrumb title:", error);
        setBreadcrumbTitle("Unknown Admin");
      }
    };

    if (id) fetchTitle();
  }, [id, fetchUrl]);

  return breadcrumbTitle;
};
