import zod from "zod";
import { passingSchema } from "./Schema";

export type PassingSchemaType = zod.infer<typeof passingSchema>;
