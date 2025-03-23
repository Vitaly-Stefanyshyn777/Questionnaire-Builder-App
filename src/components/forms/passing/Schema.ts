import zod from 'zod';

export const passingSchema = zod.object({
 answers: zod.array(
  zod.object({
   selectedAnswers: zod.array(zod.string()).optional(),
   answerText: zod.string().optional(),
  })
 ),
});
