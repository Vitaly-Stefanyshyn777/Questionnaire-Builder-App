import mongoose, { Document, Schema } from 'mongoose';
import { QuizOutput } from './quiz.schema';
import { SerializableDocumentPOJO } from './types';

const { ObjectId } = Schema;

export interface ResultInput {
 answers: {
  _id: string;
  questionId: string;
  selectedAnswers?: string[];
  answerText?: string;
 }[];
 duration: number;
}

export interface ResulOutput extends ResultInput, SerializableDocumentPOJO {
 quizId: string;
}

export interface ResultWithQuiz extends ResultInput, SerializableDocumentPOJO {
 quizId: QuizOutput;
}

export interface ResultDocument extends Omit<ResulOutput, '_id'>, Document {}

export const resultSchema = new Schema(
 {
  quizId: {
   type: ObjectId,
   ref: 'Quiz',
  },
  answers: [
   {
    selectedAnswers: {
     type: [String],
     default: [],
    },
    answerText: {
     type: String,
     default: '',
    },
   },
  ],
  duration: {
   type: Number,
   required: true,
  },
 },
 { timestamps: true }
);

export default mongoose.models.Result<ResultDocument> ||
 mongoose.model<ResultDocument>('Result', resultSchema);
