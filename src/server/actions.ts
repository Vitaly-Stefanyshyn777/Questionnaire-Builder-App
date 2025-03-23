// src/server/actions.ts
"use server";

import { passingSchema } from "@/components/forms/passing/Schema";
import { PassingSchemaType } from "@/components/forms/passing/Type";
import { quizSchema } from "@/components/forms/quiz/Schema";
import { QuizSchemaType } from "@/components/forms/quiz/Type";
import { connectDb } from "@/utils/middleware/connect";
import { allowedSortFields } from "@/utils/sortFields";
import Quiz, {
  QuizOutput,
  QuizyWithPagination,
  QuizStatistics,
} from "./database/quiz.schema";
import Result, { ResulOutput, ResultWithQuiz } from "./database/result.schema";

export type Response<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

// Оголошуємо тип для matchStage
interface MatchStage {
  title?: { $regex: string; $options: string };
  questionsCount?: { $gt: number };
  completions?: { $gt: number };
}

export const getAllQuizzes = async (
  page: number,
  sort: string,
  filters?: {
    search?: string;
    hasQuestions?: boolean;
    hasCompletions?: boolean;
  }
): Promise<Response<QuizyWithPagination>> => {
  try {
    await connectDb();

    const matchStage: MatchStage = {}; // Використовуємо конкретний тип
    if (filters?.search) {
      matchStage.title = { $regex: filters.search, $options: "i" };
    }
    if (filters?.hasQuestions) {
      matchStage.questionsCount = { $gt: 0 };
    }
    if (filters?.hasCompletions) {
      matchStage.completions = { $gt: 0 };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $addFields: {
          questionsCount: { $size: "$questions" },
        },
      },
    ];

    const sortOption = allowedSortFields[sort] || { title: 1 };

    const options = {
      page,
      limit: 6,
      sort: sortOption,
    };

    const aggregateQuery = Quiz.aggregate(pipeline);
    const quizzes = await Quiz.aggregatePaginate(aggregateQuery, options);

    const processedQuizzes = JSON.parse(JSON.stringify(quizzes));
    return { success: true, data: processedQuizzes };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return {
      success: false,
      message: "Something went wrong while getting the quiz",
    };
  }
};

// Решта функцій залишаються незмінними...

export const updateQuiz = async (
  id: string,
  quiz: QuizSchemaType
): Promise<Response<QuizOutput>> => {
  try {
    const parsedQuiz = quizSchema.safeParse(quiz);

    if (!parsedQuiz.success) {
      return {
        success: false,
        message: "The quiz data is invalid or incomplete.",
      };
    }
    await connectDb();
    const newQuiz = await Quiz.updateOne({ _id: id }, parsedQuiz.data);
    const quizData = JSON.parse(JSON.stringify(newQuiz));
    return { success: true, data: quizData };
  } catch (error) {
    console.error("Error updating quiz:", error);
    return {
      success: false,
      message: "Something went wrong while updating the quiz",
    };
  }
};

export const createQuiz = async (
  quiz: QuizSchemaType
): Promise<Response<QuizOutput>> => {
  try {
    // Валідація вхідних даних
    const parsedQuiz = quizSchema.safeParse(quiz);

    if (!parsedQuiz.success) {
      return {
        success: false,
        message: "The quiz data is invalid or incomplete.",
      };
    }

    // Підключення до бази даних
    await connectDb();

    // Створення нової анкети
    const newQuiz = await Quiz.create(parsedQuiz.data);

    // Повернення результату
    const quizData = JSON.parse(JSON.stringify(newQuiz));
    return { success: true, data: quizData };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return {
      success: false,
      message: "Something went wrong while creating the quiz",
    };
  }
};

export const getQuizById = async (
  id: string
): Promise<Response<QuizOutput>> => {
  try {
    await connectDb();
    const quizzes = await Quiz.findOne({
      _id: id,
    });
    const processedQuizzes = JSON.parse(JSON.stringify(quizzes));
    return { success: true, data: processedQuizzes };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return {
      success: false,
      message: "Something went wrong while getting quiz by id",
    };
  }
};

export const deleteQuizById = async (
  id: string
): Promise<Response<QuizOutput>> => {
  try {
    await connectDb();
    const quizzes = await Quiz.findByIdAndDelete({
      _id: id,
    });
    const processedQuizzes = JSON.parse(JSON.stringify(quizzes));
    return { success: true, data: processedQuizzes };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the quiz",
    };
  }
};

// src/server/actions.ts
export const getResultById = async (
  id: string
): Promise<Response<ResultWithQuiz>> => {
  try {
    await connectDb();

    // Знаходимо результат за ID і популюємо поле quizId
    const result = await Result.findById(id).populate("quizId");

    if (!result) {
      return { success: false, message: "Result not found" };
    }

    const processedResult = JSON.parse(JSON.stringify(result));
    return { success: true, data: processedResult };
  } catch (error) {
    console.error("Error fetching result:", error);
    return {
      success: false,
      message: "Something went wrong while fetching the result",
    };
  }
};

export const passingQuiz = async (
  quizId: string,
  answer: PassingSchemaType,
  duration: number
): Promise<Response<ResulOutput>> => {
  try {
    const resultQuiz = passingSchema.safeParse(answer);

    if (!resultQuiz.success) {
      return { success: false };
    }
    await connectDb();

    const newResult = await Result.create({
      quizId,
      answers: resultQuiz.data.answers,
      duration,
    });
    await Quiz.updateOne({ _id: quizId }, { $inc: { completions: 1 } });
    const processedResult = JSON.parse(JSON.stringify(newResult));
    return { success: true, data: processedResult };
  } catch (error) {
    console.error("Error creating result:", error);
    return {
      success: false,
      message: "Something went wrong while passing the quiz",
    };
  }
};

// src/server/actions.ts
export const getQuizStatistics = async (
  quizId: string
): Promise<Response<QuizStatistics>> => {
  try {
    await connectDb();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return { success: false, message: "Quiz not found" };
    }

    // Середній час виконання
    const averageTime = await Result.aggregate([
      { $match: { quizId } },
      { $group: { _id: null, averageTime: { $avg: "$duration" } } },
    ]);

    // Кількість виконань за день/тиждень/місяць
    const completionsOverTime = await Result.aggregate([
      { $match: { quizId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ]);

    const questions = await Promise.all(
      quiz.questions.map(async (question) => {
        const answers = await Result.aggregate([
          { $match: { quizId } },
          { $unwind: "$answers" },
          { $match: { "answers.questionId": question._id } },
          {
            $group: {
              _id: "$answers.option",
              count: { $sum: 1 },
            },
          },
          { $project: { option: "$_id", count: 1, _id: 0 } },
        ]);
        return {
          text: question.text,
          answers,
        };
      })
    );

    const statistics: QuizStatistics = {
      quizTitle: quiz.title,
      averageTime: averageTime[0]?.averageTime || 0,
      completionsOverTime,
      questions,
    };

    console.log("Statistics data:", statistics); // Перевірка даних
    return { success: true, data: statistics };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {
      success: false,
      message: "Something went wrong while fetching statistics",
    };
  }
};
