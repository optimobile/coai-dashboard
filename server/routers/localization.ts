import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { LocalizationService } from "../services/localization";

export const localizationRouter = router({
  /**
   * Get all supported languages
   */
  getSupportedLanguages: publicProcedure.query(async () => {
    return LocalizationService.getSupportedLanguages();
  }),

  /**
   * Get language configuration
   */
  getLanguageConfig: publicProcedure
    .input(
      z.object({
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return LocalizationService.getLanguageConfig(input.languageCode);
    }),

  /**
   * Detect language from Accept-Language header
   */
  detectLanguage: publicProcedure
    .input(
      z.object({
        acceptLanguage: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        detectedLanguage: LocalizationService.detectLanguage(
          input.acceptLanguage
        ),
      };
    }),

  /**
   * Format date according to language
   */
  formatDate: publicProcedure
    .input(
      z.object({
        date: z.date(),
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        formatted: LocalizationService.formatDate(input.date, input.languageCode),
      };
    }),

  /**
   * Format time according to language
   */
  formatTime: publicProcedure
    .input(
      z.object({
        date: z.date(),
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        formatted: LocalizationService.formatTime(input.date, input.languageCode),
      };
    }),

  /**
   * Format currency according to language
   */
  formatCurrency: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        formatted: LocalizationService.formatCurrency(
          input.amount,
          input.languageCode
        ),
      };
    }),

  /**
   * Format number according to language
   */
  formatNumber: publicProcedure
    .input(
      z.object({
        number: z.number(),
        languageCode: z.string(),
        decimals: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return {
        formatted: LocalizationService.formatNumber(
          input.number,
          input.languageCode,
          input.decimals
        ),
      };
    }),

  /**
   * Get text direction for language
   */
  getTextDirection: publicProcedure
    .input(
      z.object({
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        direction: LocalizationService.getTextDirection(input.languageCode),
      };
    }),

  /**
   * Get compliance framework translations
   */
  getFrameworkTranslations: publicProcedure
    .input(
      z.object({
        framework: z.string(),
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return LocalizationService.getComplianceFrameworkTranslations(
        input.framework,
        input.languageCode
      );
    }),

  /**
   * Get UI translations for a language
   */
  getUITranslations: publicProcedure
    .input(
      z.object({
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return LocalizationService.getUITranslations(input.languageCode);
    }),

  /**
   * Validate language code
   */
  validateLanguage: publicProcedure
    .input(
      z.object({
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      return {
        isValid: LocalizationService.isValidLanguage(input.languageCode),
      };
    }),

  /**
   * Get default language
   */
  getDefaultLanguage: publicProcedure.query(async () => {
    return {
      defaultLanguage: LocalizationService.getDefaultLanguage(),
    };
  }),

  /**
   * Get all framework translations for a language
   */
  getAllFrameworkTranslations: publicProcedure
    .input(
      z.object({
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      const frameworks = [
        "EU AI Act",
        "NIST AI RMF",
        "TC260",
        "ISO 42001",
      ];
      const translations: Record<string, Record<string, string>> = {};

      for (const framework of frameworks) {
        translations[framework] =
          LocalizationService.getComplianceFrameworkTranslations(
            framework,
            input.languageCode
          );
      }

      return translations;
    }),

  /**
   * Get localization data for frontend
   */
  getLocalizationData: protectedProcedure
    .input(
      z.object({
        languageCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      const config = LocalizationService.getLanguageConfig(input.languageCode);
      const uiTranslations = LocalizationService.getUITranslations(
        input.languageCode
      );
      const direction = LocalizationService.getTextDirection(input.languageCode);

      return {
        config,
        uiTranslations,
        direction,
        languageCode: input.languageCode,
      };
    }),
});
