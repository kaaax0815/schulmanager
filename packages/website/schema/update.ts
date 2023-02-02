import { z } from 'zod';

export const UpdateSchema = z.object({
  sub: z.string(),
  jwt: z.string().optional(),
  settings: z
    .object({
      nextLessonEnabled: z.boolean(),
      nextLessonPosition: z.number(),
      lettersEnabled: z.boolean(),
      lettersPosition: z.number(),
      eventsEnabled: z.boolean(),
      eventsPosition: z.number(),
      examsEnabled: z.boolean(),
      examsPosition: z.number()
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
