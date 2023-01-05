import { z } from 'zod';

export const UpdateSchema = z.object({
  sub: z.string(),
  jwt: z.string().optional(),
  settings: z
    .object({
      lettersEnabled: z.boolean(),
      eventsEnabled: z.boolean(),
      examsEnabled: z.boolean()
    })
    .optional()
});

export type UpdateSchema = z.infer<typeof UpdateSchema>;

export type UpdateResponse =
  | {
      status: 'success';
      data: {
        id: string;
      };
    }
  | {
      status: 'error';
      message: string;
      nachricht?: string;
    };
