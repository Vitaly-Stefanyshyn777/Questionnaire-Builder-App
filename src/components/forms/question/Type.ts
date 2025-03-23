import zod from "zod";
import { questionSchema } from "./schema";

export type QuestionSchemaType = zod.infer<typeof questionSchema>;
