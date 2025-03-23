import { SerializableDocumentPOJO } from '@/server/database/types';
import mongoose, { Document } from 'mongoose';

const { Schema } = mongoose;

export interface AnswerInput {
 text: string;
}

export interface AnswerOutput extends AnswerInput, SerializableDocumentPOJO {}

export interface AnswerDocument extends Omit<AnswerOutput, '_id'>, Document {}

export const answerSchema = new Schema(
 {
  text: {
   type: String,
   required: true,
  },
 },
 { timestamps: true }
);
