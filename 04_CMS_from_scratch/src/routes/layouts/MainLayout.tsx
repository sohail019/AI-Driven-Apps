import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { toggleSidebar } from "../../store/slices/settingsSlice";

// You will need to create these components
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

const MainLayout = () => {
  const { sidebarCollapsed } = useSelector(
    (state: RootState) => state.settings
  );
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="flex h-screen  overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Main Content */}
      <div className="flex w-0 flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header onToggleSidebar={handleToggleSidebar} />

        {/* Main Content Area */}
        <main className="relative flex-1 overflow-y-auto">
          <div className="mx-2 my-3 mr-2  ml-2 rounded-xl  p-4">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
