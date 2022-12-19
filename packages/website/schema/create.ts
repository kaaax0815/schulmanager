import { z } from 'zod';

export const createSchema = z.object({
  sub: z.string(),
  jwt: z.string()
});

export type CreateSchema = z.infer<typeof createSchema>;

export type CreateResponse =
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
