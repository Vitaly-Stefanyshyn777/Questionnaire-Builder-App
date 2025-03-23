import { nonemptyString } from '@/lib/validations/pipelines';
import zod from 'zod';

export const questionSchema = zod.object({
 text: zod
  .string({ required_error: 'Enter a question' })
  .pipe(nonemptyString('Question cannot be empty')),
 type: zod.string().min(1, { message: 'Choose a type' }),
 answers: zod
  .array(
   zod.object({
    text: zod
     .string({ required_error: 'Enter an answer' })
     .pipe(nonemptyString('Answer cannot be empty')),
   })
  )
  .optional()
});
