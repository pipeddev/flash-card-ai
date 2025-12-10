import { z } from 'zod';

export type ZodFormErrors<TSchema extends z.ZodTypeAny> = Partial<
  Record<keyof z.infer<TSchema>, string>
>;
