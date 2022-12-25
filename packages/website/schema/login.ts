import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string()
});

export type LoginSchema = z.infer<typeof LoginSchema>;

export type LoginResponse =
  | {
      status: 'success';
      data: {
        token: string;
      };
    }
  | {
      status: 'error';
      message: string;
    };
