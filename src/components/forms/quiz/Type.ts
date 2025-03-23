import zod from "zod";
import { quizSchema } from "./Schema";

export type QuizSchemaType = zod.infer<typeof quizSchema>;
