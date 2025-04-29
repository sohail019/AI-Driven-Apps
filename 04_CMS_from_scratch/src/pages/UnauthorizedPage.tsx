import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
            {t("errors.unauthorized")}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t("errors.unauthorizedMessage")}
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            {t("common.goBack")}
          </Button>
          <Button onClick={() => navigate("/")}>{t("common.goToHome")}</Button>
        </div>
      </div>
    </div>
  );
}
