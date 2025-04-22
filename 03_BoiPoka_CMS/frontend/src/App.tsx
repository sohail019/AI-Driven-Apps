import AppRouter from "@/routes/index";
import AppProvider, { BreadcrumbProvider } from "./contexts";

function App() {
  return (
    <AppProvider>
      <BreadcrumbProvider>
        <AppRouter />
      </BreadcrumbProvider>
    </AppProvider>
  );
}

export default App;
