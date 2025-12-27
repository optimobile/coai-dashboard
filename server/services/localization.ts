export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  dateFormat: string;
  timeFormat: string;
  currencyCode: string;
}

export interface LocalizationStrings {
  [key: string]: string | LocalizationStrings;
}

export class LocalizationService {
  private static supportedLanguages: Map<string, LanguageConfig> = new Map([
    [
      "en",
      {
        code: "en",
        name: "English",
        nativeName: "English",
        direction: "ltr",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "USD",
      },
    ],
    [
      "fr",
      {
        code: "fr",
        name: "French",
        nativeName: "Français",
        direction: "ltr",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "EUR",
      },
    ],
    [
      "de",
      {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
        direction: "ltr",
        dateFormat: "DD.MM.YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "EUR",
      },
    ],
    [
      "es",
      {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        direction: "ltr",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "EUR",
      },
    ],
    [
      "it",
      {
        code: "it",
        name: "Italian",
        nativeName: "Italiano",
        direction: "ltr",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "EUR",
      },
    ],
    [
      "nl",
      {
        code: "nl",
        name: "Dutch",
        nativeName: "Nederlands",
        direction: "ltr",
        dateFormat: "DD-MM-YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "EUR",
      },
    ],
    [
      "pl",
      {
        code: "pl",
        name: "Polish",
        nativeName: "Polski",
        direction: "ltr",
        dateFormat: "DD.MM.YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "PLN",
      },
    ],
    [
      "pt",
      {
        code: "pt",
        name: "Portuguese",
        nativeName: "Português",
        direction: "ltr",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "EUR",
      },
    ],
    [
      "ru",
      {
        code: "ru",
        name: "Russian",
        nativeName: "Русский",
        direction: "ltr",
        dateFormat: "DD.MM.YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "RUB",
      },
    ],
    [
      "zh",
      {
        code: "zh",
        name: "Chinese",
        nativeName: "中文",
        direction: "ltr",
        dateFormat: "YYYY/MM/DD",
        timeFormat: "HH:mm:ss",
        currencyCode: "CNY",
      },
    ],
    [
      "ja",
      {
        code: "ja",
        name: "Japanese",
        nativeName: "日本語",
        direction: "ltr",
        dateFormat: "YYYY/MM/DD",
        timeFormat: "HH:mm:ss",
        currencyCode: "JPY",
      },
    ],
    [
      "ko",
      {
        code: "ko",
        name: "Korean",
        nativeName: "한국어",
        direction: "ltr",
        dateFormat: "YYYY.MM.DD",
        timeFormat: "HH:mm:ss",
        currencyCode: "KRW",
      },
    ],
    [
      "ar",
      {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
        direction: "rtl",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm:ss",
        currencyCode: "AED",
      },
    ],
  ]);

  private static translations: Map<string, LocalizationStrings> = new Map();

  /**
   * Get all supported languages
   */
  static getSupportedLanguages(): LanguageConfig[] {
    return Array.from(this.supportedLanguages.values());
  }

  /**
   * Get language configuration
   */
  static getLanguageConfig(languageCode: string): LanguageConfig | null {
    return this.supportedLanguages.get(languageCode) || null;
  }

  /**
   * Format date based on language
   */
  static formatDate(date: Date, languageCode: string): string {
    const config = this.getLanguageConfig(languageCode);
    if (!config) {
      return date.toLocaleDateString();
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    switch (config.dateFormat) {
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "DD.MM.YYYY":
        return `${day}.${month}.${year}`;
      case "DD-MM-YYYY":
        return `${day}-${month}-${year}`;
      case "YYYY/MM/DD":
        return `${year}/${month}/${day}`;
      case "YYYY.MM.DD":
        return `${year}.${month}.${day}`;
      default:
        return date.toLocaleDateString();
    }
  }

  /**
   * Format time based on language
   */
  static formatTime(date: Date, languageCode: string): string {
    const config = this.getLanguageConfig(languageCode);
    if (!config) {
      return date.toLocaleTimeString();
    }

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * Format currency based on language
   */
  static formatCurrency(
    amount: number,
    languageCode: string
  ): string {
    const config = this.getLanguageConfig(languageCode);
    if (!config) {
      return `$${amount.toFixed(2)}`;
    }

    const formatter = new Intl.NumberFormat(languageCode, {
      style: "currency",
      currency: config.currencyCode,
    });

    return formatter.format(amount);
  }

  /**
   * Format number based on language
   */
  static formatNumber(
    number: number,
    languageCode: string,
    decimals: number = 2
  ): string {
    const formatter = new Intl.NumberFormat(languageCode, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return formatter.format(number);
  }

  /**
   * Get text direction for language
   */
  static getTextDirection(languageCode: string): "ltr" | "rtl" {
    const config = this.getLanguageConfig(languageCode);
    return config?.direction || "ltr";
  }

  /**
   * Detect language from browser locale
   */
  static detectLanguage(acceptLanguage: string): string {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().split("-")[0].toLowerCase());

    for (const lang of languages) {
      if (this.supportedLanguages.has(lang)) {
        return lang;
      }
    }

    return "en"; // Default to English
  }

  /**
   * Get compliance framework translations
   */
  static getComplianceFrameworkTranslations(
    framework: string,
    languageCode: string
  ): Record<string, string> {
    const translations: Record<string, Record<string, Record<string, string>>> =
      {
        "EU AI Act": {
          en: {
            title: "EU AI Act",
            description: "Regulation on Artificial Intelligence",
            riskAssessment: "Risk Assessment",
            humanOversight: "Human Oversight",
            transparency: "Transparency",
            documentation: "Documentation",
          },
          fr: {
            title: "Loi sur l'IA de l'UE",
            description: "Règlement sur l'Intelligence Artificielle",
            riskAssessment: "Évaluation des risques",
            humanOversight: "Surveillance humaine",
            transparency: "Transparence",
            documentation: "Documentation",
          },
          de: {
            title: "EU-KI-Verordnung",
            description: "Verordnung über künstliche Intelligenz",
            riskAssessment: "Risikobewertung",
            humanOversight: "Menschliche Aufsicht",
            transparency: "Transparenz",
            documentation: "Dokumentation",
          },
          zh: {
            title: "欧盟人工智能法案",
            description: "人工智能条例",
            riskAssessment: "风险评估",
            humanOversight: "人工监督",
            transparency: "透明度",
            documentation: "文档",
          },
        },
        "NIST AI RMF": {
          en: {
            title: "NIST AI Risk Management Framework",
            description: "AI Risk Management Framework",
            govern: "GOVERN",
            map: "MAP",
            measure: "MEASURE",
            manage: "MANAGE",
          },
          fr: {
            title: "Cadre de gestion des risques de l'IA du NIST",
            description: "Cadre de gestion des risques de l'IA",
            govern: "GOUVERNER",
            map: "CARTOGRAPHIER",
            measure: "MESURER",
            manage: "GÉRER",
          },
          zh: {
            title: "NIST人工智能风险管理框架",
            description: "人工智能风险管理框架",
            govern: "治理",
            map: "映射",
            measure: "测量",
            manage: "管理",
          },
        },
        TC260: {
          en: {
            title: "TC260 AI Safety Framework",
            description: "China's AI Safety Framework",
            dataGovernance: "Data Governance",
            algorithmGovernance: "Algorithm Governance",
            userRights: "User Rights Protection",
            securityCompliance: "Security Compliance",
          },
          zh: {
            title: "TC260人工智能安全框架",
            description: "中国人工智能安全框架",
            dataGovernance: "数据治理",
            algorithmGovernance: "算法治理",
            userRights: "用户权利保护",
            securityCompliance: "安全合规",
          },
        },
      };

    return (
      translations[framework]?.[languageCode] ||
      translations[framework]?.["en"] ||
      {}
    );
  }

  /**
   * Get common UI translations
   */
  static getUITranslations(languageCode: string): Record<string, string> {
    const translations: Record<string, Record<string, string>> = {
      en: {
        dashboard: "Dashboard",
        analytics: "Analytics",
        reports: "Reports",
        settings: "Settings",
        logout: "Logout",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        search: "Search",
        filter: "Filter",
        export: "Export",
        import: "Import",
        loading: "Loading...",
        error: "Error",
        success: "Success",
      },
      fr: {
        dashboard: "Tableau de bord",
        analytics: "Analytique",
        reports: "Rapports",
        settings: "Paramètres",
        logout: "Déconnexion",
        save: "Enregistrer",
        cancel: "Annuler",
        delete: "Supprimer",
        edit: "Modifier",
        add: "Ajouter",
        search: "Rechercher",
        filter: "Filtrer",
        export: "Exporter",
        import: "Importer",
        loading: "Chargement...",
        error: "Erreur",
        success: "Succès",
      },
      de: {
        dashboard: "Dashboard",
        analytics: "Analytik",
        reports: "Berichte",
        settings: "Einstellungen",
        logout: "Abmelden",
        save: "Speichern",
        cancel: "Abbrechen",
        delete: "Löschen",
        edit: "Bearbeiten",
        add: "Hinzufügen",
        search: "Suchen",
        filter: "Filtern",
        export: "Exportieren",
        import: "Importieren",
        loading: "Wird geladen...",
        error: "Fehler",
        success: "Erfolg",
      },
      zh: {
        dashboard: "仪表板",
        analytics: "分析",
        reports: "报告",
        settings: "设置",
        logout: "退出登录",
        save: "保存",
        cancel: "取消",
        delete: "删除",
        edit: "编辑",
        add: "添加",
        search: "搜索",
        filter: "筛选",
        export: "导出",
        import: "导入",
        loading: "加载中...",
        error: "错误",
        success: "成功",
      },
      ar: {
        dashboard: "لوحة التحكم",
        analytics: "التحليلات",
        reports: "التقارير",
        settings: "الإعدادات",
        logout: "تسجيل الخروج",
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        edit: "تحرير",
        add: "إضافة",
        search: "بحث",
        filter: "تصفية",
        export: "تصدير",
        import: "استيراد",
        loading: "جاري التحميل...",
        error: "خطأ",
        success: "نجح",
      },
    };

    return translations[languageCode] || translations["en"];
  }

  /**
   * Validate language code
   */
  static isValidLanguage(languageCode: string): boolean {
    return this.supportedLanguages.has(languageCode);
  }

  /**
   * Get default language
   */
  static getDefaultLanguage(): string {
    return "en";
  }
}
