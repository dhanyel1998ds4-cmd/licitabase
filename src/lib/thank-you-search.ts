import { z } from "zod";

export const thankYouSearchSchema = z.object({
  plano: z.string().optional().catch(undefined),
  plan: z.string().optional().catch(undefined),
  ciclo: z.string().optional().catch(undefined),
  billing: z.string().optional().catch(undefined),
  session_id: z.string().optional().catch(undefined),
});

export type ThankYouSearch = z.infer<typeof thankYouSearchSchema>;
