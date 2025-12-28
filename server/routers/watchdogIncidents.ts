import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";

export const watchdogIncidentsRouter = router({
  list: publicProcedure.query(async () => {
    return [];
  }),

  submit: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
    }))
    .mutation(async ({ input }) => {
      return { success: true, id: Date.now() };
    }),
});
