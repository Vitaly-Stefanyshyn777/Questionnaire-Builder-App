import mongoose, { Document } from 'mongoose';

import { SerializableDocumentPOJO } from '@/server/database/types';
import { AnswerOutput, answerSchema } from './answer.schema';

const { Schema } = mongoose;

export type QuestionType = 'text' | 'single_choice' | 'multiple_choice';

export interface QuestionInput {
 text: string;
 type: QuestionType;
 answers?: AnswerOutput[];
}

export interface QuestionOutput
 extends QuestionInput,
  SerializableDocumentPOJO {}

export interface QuestionDocument
 extends Omit<QuestionOutput, '_id'>,
  Document {}

export const questionSchema = new Schema(
 {
  text: {
   type: String,
   required: true,
  },
  type: {
   type: String,
   enum: ['text', 'single_choice', 'multiple_choice'],
   required: true,
  },
  answers: [answerSchema],
 },
 { timestamps: true }
);
