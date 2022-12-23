import { z } from 'zod';

export const UpdateSchema = z.object({
  sub: z.string(),
  jwt: z.string()
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
    };
