import React from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="w-[140px] border-0 bg-transparent">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                {lang.nativeName}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
