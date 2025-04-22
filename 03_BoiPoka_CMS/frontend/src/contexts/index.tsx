import { Button } from "@/components/ui/button";
import { useRouter } from "@/routes/hooks";
import { createContext, useContext, useState, ReactNode } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import ThemeProvider from "./theme-context";
import { Provider } from "react-redux";
import store from "@/store";

type BreadcrumbItemProps = {
  title: string;
  link: string;
};

const BreadcrumbContext = createContext<{
  items: BreadcrumbItemProps[];
  setItems: (items: BreadcrumbItemProps[]) => void;
}>({
  items: [],
  setItems: () => {},
});

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BreadcrumbItemProps[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => useContext(BreadcrumbContext);

const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter();
  console.log("error", error);
  return (
    <div
      className="flex h-screen w-screen flex-col items-center  justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-2xl font-semibold">
        Ooops, something went wrong :({" "}
      </h2>
      <pre className="text-2xl font-bold">{error.message}</pre>
      <pre>{error.stack}</pre>
      <Button className="mt-4" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Provider store={store}>
              <BreadcrumbProvider>
                {/* <QueryClientProvider client={queryClient}> */}
                {/* <ReactQueryDevtools /> */}
                <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                  {children}
                  <Toaster />
                </ThemeProvider>
                {/* </QueryClientProvider> */}
              </BreadcrumbProvider>
            </Provider>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  );
}
