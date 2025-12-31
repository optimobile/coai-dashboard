/**
 * Email Automation Scheduler
 * Manages automated email sequences for user onboarding
 */

import { getDb } from "../db";
import { emailSequences, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { renderEmailTemplate } from "./emailTemplates";

export interface EmailSequenceConfig {
  sequenceType: "welcome" | "course_recommendation" | "exam_prep" | "success_stories" | "certification_path";
  delayDays: number;
  templateId: string;
  enabled: boolean;
}

// Default email sequence configuration
export const defaultSequenceConfig: Record<string, EmailSequenceConfig[]> = {
  welcome: [
    {
      sequenceType: "welcome",
      delayDays: 0,
      templateId: "welcome",
      enabled: true,
    },
    {
      sequenceType: "welcome",
      delayDays: 1,
      templateId: "course_recommendation",
      enabled: true,
    },
    {
      sequenceType: "welcome",
      delayDays: 3,
      templateId: "exam_prep",
      enabled: true,
    },
    {
      sequenceType: "welcome",
      delayDays: 7,
      templateId: "success_stories",
      enabled: true,
    },
    {
      sequenceType: "welcome",
      delayDays: 14,
      templateId: "certification_path",
      enabled: true,
    },
  ],
};

/**
 * Send email (mock implementation - replace with actual email service)
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // TODO: Integrate with Resend, SendGrid, or other email service
    // For now, this is a mock implementation
    console.log(`📧 Email sent to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML: ${htmlContent.substring(0, 100)}...`);
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Trigger email sequence for a user
 */
export async function triggerEmailSequence(
  userId: number,
  sequenceType: "welcome" | "course_recommendation" | "exam_prep" | "success_stories" | "certification_path",
  metadata?: Record<string, any>
): Promise<{ success: boolean; sequenceId?: number; error?: string }> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get user details
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!userRecord.length) {
      return { success: false, error: "User not found" };
    }

    const user = userRecord[0];

    // Create email sequence record
    const result = await db.insert(emailSequences).values({
      userId,
      sequenceType,
      status: "active",
      currentStep: 1,
      metadata: JSON.stringify(metadata || {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Send first email in sequence
    const config = defaultSequenceConfig[sequenceType];
    if (config && config.length > 0) {
      const firstEmail = config[0];
      if (firstEmail.enabled) {
        const rendered = renderEmailTemplate(firstEmail.templateId, {
          firstName: user.name?.split(" ")[0] || "there",
          dashboardUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/dashboard`,
          coursesUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/courses`,
          communityUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/community`,
        });

        if (rendered) {
          await sendEmail(user.email, rendered.subject, rendered.html, rendered.text);
        }
      }
    }

    return {
      success: true,
      sequenceId: result.insertId,
    };
  } catch (error) {
    console.error("Failed to trigger email sequence:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process scheduled emails (call this periodically from a cron job)
 */
export async function processScheduledEmails(): Promise<{
  processed: number;
  failed: number;
  errors: string[];
}> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    // Get all active sequences
    const activeSequences = await db
      .select()
      .from(emailSequences)
      .where(eq(emailSequences.status, "active"));

    for (const sequence of activeSequences) {
      try {
        const sequenceType = sequence.sequenceType as keyof typeof defaultSequenceConfig;
        const config = defaultSequenceConfig[sequenceType];

        if (!config) continue;

        // Get the next email to send
        const nextEmail = config[sequence.currentStep];
        if (!nextEmail) {
          // Sequence complete
          await db
            .update(emailSequences)
            .set({ status: "completed", updatedAt: new Date().toISOString() })
            .where(eq(emailSequences.id, sequence.id));
          continue;
        }

        // Check if it's time to send this email
        const createdDate = new Date(sequence.createdAt);
        const scheduledDate = new Date(createdDate.getTime() + nextEmail.delayDays * 24 * 60 * 60 * 1000);

        if (new Date().toISOString() >= scheduledDate && nextEmail.enabled) {
          // Get user details
          const userRecord = await db
            .select()
            .from(users)
            .where(eq(users.id, sequence.userId));

          if (userRecord.length > 0) {
            const user = userRecord[0];
            const rendered = renderEmailTemplate(nextEmail.templateId, {
              firstName: user.name?.split(" ")[0] || "there",
              dashboardUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/dashboard`,
              coursesUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/courses`,
              communityUrl: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/community`,
            });

            if (rendered) {
              const result = await sendEmail(
                user.email,
                rendered.subject,
                rendered.html,
                rendered.text
              );

              if (result.success) {
                // Update sequence to next step
                await db
                  .update(emailSequences)
                  .set({
                    currentStep: sequence.currentStep + 1,
                    updatedAt: new Date().toISOString(),
                  })
                  .where(eq(emailSequences.id, sequence.id));

                processed++;
              } else {
                failed++;
                errors.push(`Failed to send email for sequence ${sequence.id}: ${result.error}`);
              }
            }
          }
        }
      } catch (error) {
        failed++;
        errors.push(
          `Error processing sequence ${sequence.id}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return { processed, failed, errors };
  } catch (error) {
    console.error("Failed to process scheduled emails:", error);
    return {
      processed: 0,
      failed: 0,
      errors: [error instanceof Error ? error.message : "Unknown error"],
    };
  }
}

/**
 * Cancel email sequence for a user
 */
export async function cancelEmailSequence(sequenceId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    await db
      .update(emailSequences)
      .set({ status: "cancelled", updatedAt: new Date().toISOString() })
      .where(eq(emailSequences.id, sequenceId));

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get sequence status
 */
export async function getSequenceStatus(
  sequenceId: number
): Promise<{
  success: boolean;
  sequence?: any;
  error?: string;
}> {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const sequence = await db
      .select()
      .from(emailSequences)
      .where(eq(emailSequences.id, sequenceId));

    if (!sequence.length) {
      return { success: false, error: "Sequence not found" };
    }

    return {
      success: true,
      sequence: sequence[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
