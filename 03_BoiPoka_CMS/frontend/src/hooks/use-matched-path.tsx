import { navItems } from "@/constants/data";
export const useMatchedPath = (pathname: string) => {
  const matchedPath =
    navItems.find((item) => item.href === pathname) ||
    navItems.find(
      (item) => pathname.startsWith(item.href + "/") && item.href !== "/"
    );
  return matchedPath?.title || "";
};
