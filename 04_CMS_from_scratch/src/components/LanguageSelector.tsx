import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoLanguage } from "react-icons/io5";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LanguageOption {
  code: string;
  name: string;
}

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en"
  );

  const languages: LanguageOption[] = [
    { code: "en", name: t("languages.en") },
    { code: "hi", name: t("languages.hi") },
    { code: "ar", name: t("languages.ar") },
    { code: "fr", name: t("languages.fr") },
    { code: "de", name: t("languages.de") },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setSelectedLanguage(code);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === selectedLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-white">
          <IoLanguage className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={selectedLanguage === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
