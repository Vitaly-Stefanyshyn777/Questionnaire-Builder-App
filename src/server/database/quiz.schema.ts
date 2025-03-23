import mongoose, { Document } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import { QuestionOutput, questionSchema } from "./question.schema";
import { SerializableDocumentPOJO } from "./types";

const { Schema } = mongoose;

export interface QuizInput {
  title: string;
  description: string;
  completions: number;
  questions: QuestionOutput[];
}

export interface QuizyWithPagination {
  docs: QuizOutput[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface QuizOutput extends QuizInput, SerializableDocumentPOJO {}

export interface QuizDocument extends Omit<QuizOutput, "_id">, Document {}

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    completions: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

quizSchema.plugin(aggregatePaginate);

const Quiz = mongoose.model("Quiz", quizSchema, "quiz");

export default Quiz;

export type QuizStatistics = {
  quizTitle: string;
  averageTime: number;
  completionsOverTime: { date: string; count: number }[];
  questions: {
    text: string;
    answers: { option: string; count: number }[];
  }[];
};
