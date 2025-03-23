import zod from 'zod';

export const nonemptyString = (errorMessage?: string) =>
 zod
  .string()
  .transform((text) => text?.trim())
  .pipe(zod.string().min(1, errorMessage));
