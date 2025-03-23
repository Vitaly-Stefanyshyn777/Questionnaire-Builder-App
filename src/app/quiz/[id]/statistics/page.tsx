// src/app/quiz/[id]/statistics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import { getQuizStatistics } from "@/server/actions";
// import { QuizStatistics } from "@/server/database/quiz.schema";
import {
  LineChart,
  PieChart,
  Line,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getQuizStatistics } from "@/server/actions";
import { QuizStatistics } from "@/server/database/quiz.schema";

export default function QuizStatisticsPage() {
  const { id } = useParams(); // Отримуємо id анкети з URL
  const [statistics] = useState<QuizStatistics | null>(null);

  // Завантаження статистики при першому рендері
  useEffect(() => {
    const fetchStatistics = async () => {
      const data = await getQuizStatistics(id as string);
      if (data.success) {
      }
    };
    fetchStatistics();
  }, [id]);

  if (!statistics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-bold">
        Статистика анкети: {statistics.quizTitle}
      </h1>

      {/* Середній час виконання */}
      <div>
        <h2 className="text-xl font-semibold">Середній час виконання</h2>
        <p>{statistics.averageTime} секунд</p>
      </div>

      {/* Кількість виконань за день/тиждень/місяць */}
      <div>
        <h2 className="text-xl font-semibold">Кількість виконань</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={statistics.completionsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Секторна діаграма для кожного запитання */}
      <div>
        <h2 className="text-xl font-semibold">Відповіді на запитання</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statistics.questions.map((question, index) => (
            <div key={index}>
              <h3 className="text-lg font-medium">{question.text}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={question.answers}
                    dataKey="count"
                    nameKey="option"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
