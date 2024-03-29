import { z } from 'zod';

export const CreateSchema = z.object({
  sub: z.string(),
  jwt: z.string()
});

export type CreateSchema = z.infer<typeof CreateSchema>;

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
