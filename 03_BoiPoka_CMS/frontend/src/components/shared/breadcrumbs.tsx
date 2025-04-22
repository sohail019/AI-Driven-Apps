import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/contexts";
import { useLocation } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";

export default function Breadcrumbs() {
  const { items, setItems } = useBreadcrumb();
  const location = useLocation();
  const [dynamicTitles, setDynamicTitles] = useState<Record<string, string>>(
    {}
  );
  // console.log("dynamicTitles", dynamicTitles);

  // Map to define API routes for specific path segments
  // const fetchRoutes: Record<string, (id: string) => Promise<string>> = {
  //   admins: async (id) => {
  //     const response = await axiosInstance.get(`/superadmin/getAdmin/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     console.log("Admin Response:", response.data);
  //     return response.data.admin.fullName || "Unknown Admin";
  //   },
  //   users: async (id) => {
  //     const response = await axiosInstance.get(`/admin/getUser/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     return response.data.user.fullName || "Unknown User";
  //   },
  // };

  // const fetchFullName = async (path: string, id: string) => {
  //   try {
  //     console.log("Path:", path);
  //     console.log("ID:", id);

  //     const response = await axiosInstance.get(
  //       `/admin/getUserFullNameById/${id}`
  //     );
  //     console.log(response);
  //   } catch (error) {
  //     console.error("dkfg", error);
  //   }
  //   return "Unknown";
  // try {
  //   let response;
  //   if (path === "admins") {
  //     response = await axiosInstance.get(
  //       `/superadmin/getAdminFullNameById/${id}`
  //     );
  //     console.log("Admin Response:", response.data);
  //     return 'dddjjj';
  //   } else if (path === "users") {
  //     response = await axiosInstance.get(`/admin/getUserFullNameById/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     console.log("User Response:", response.data);
  //     return "dkjfkjdfhg";
  //   }
  // } catch (error) {
  //   console.error("Error fetching full name:", error);
  //   return "Unknown";
  // }
  // };

  // Fetch dynamic titles based on path segments
  // const fetchDynamicTitles = async (pathnames: string[]) => {
  //   const dynamicData: Record<string, string> = {};
  //   console.log("dynamicData", dynamicData);
  //   const fullName = await fetchFullName(pathnames[0], pathnames[1]);
  //   console.log("Full Name:", fullName);

  // for (const segment of pathnames) {
  //   if (
  //     /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
  //       segment
  //     ) &&
  //     !dynamicTitles[segment]
  //   ) {
  //     const parentSegment = pathnames[pathnames.indexOf(segment) - 1];
  //     console.log("Parent Segment:", parentSegment);
  //     if (
  //       parentSegment &&
  //       (parentSegment === "update-admin" || parentSegment === "update-user")
  //     ) {
  //       // Fetch the full name for the user/admin
  //       // console.log("Fetching full name for:", segment);
  //       // console.log("Fetching full name for:", parentSegment);
  //       const fullName = await fetchFullName(segment, parentSegment);
  //       // console.log("Full Name:", fullName);
  //       dynamicData[segment] = fullName;
  //     }
  //   }
  // }

  //   if (Object.keys(dynamicData).length > 0) {
  //     setDynamicTitles((prev) => ({ ...prev, ...dynamicData }));
  //   }
  // };

  // Trigger dynamic title fetching when location changes
  // useEffect(() => {
  //   const pathnames = location.pathname.split("/").filter((x) => x);
  //   fetchDynamicTitles(pathnames);
  // }, [location.pathname]);

  // Build breadcrumb items dynamically
  useEffect(() => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    const breadcrumbItems = pathnames.map((value, index) => {
      const link = `/${pathnames.slice(0, index + 1).join("/")}`;
      const parentSegment = pathnames[index - 1]; // Get the preceding path segment

      // Check if the value is a UUID and the parent segment is `update-user` or `update-admin`
      const isUUID =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
          value
        );
      const title =
        isUUID &&
        (parentSegment === "update-user" || parentSegment === "update-admin")
          ? "" // Leave the title blank if it's a UUID in these cases
          : dynamicTitles[value] || // Use dynamic title if available
            value
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

      return { title, link };
    });

    setItems(breadcrumbItems);
  }, [location.pathname, dynamicTitles, setItems]);

  // Render breadcrumb
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {items.length > 2 && (
          <>
            <BreadcrumbSeparator>{">"}</BreadcrumbSeparator>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-foreground">
                  <BreadcrumbEllipsis />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {items.slice(1, -1).map((item) => (
                    <DropdownMenuItem asChild key={item.link}>
                      <a href={item.link}>{item.title}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}
        {items.length > 1 && <BreadcrumbSeparator>{">"}</BreadcrumbSeparator>}
        {items.length > 1 && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href={items[items.length - 2].link}>
                {items[items.length - 2].title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>{">"}</BreadcrumbSeparator>
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>{items[items.length - 1].title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
