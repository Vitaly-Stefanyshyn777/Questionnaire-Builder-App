import { nonemptyString } from "@/lib/validations/pipelines";
import zod from "zod";
import { questionSchema } from "../question/Schema";

export const quizSchema = zod.object({
  title: zod
    .string({ required_error: "Enter a title" })
    .pipe(nonemptyString("Title cannot be empty")),
  description: zod
    .string({ required_error: "Enter a description" })
    .pipe(nonemptyString("Description cannot be empty")),
  questions: zod
    .array(questionSchema)
    .default([])
    .refine((questions) => questions.length, "Add at least one question"),
});
