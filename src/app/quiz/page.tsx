"use client";

import { useEffect, useState } from "react";
import QuizCard from "@/components/cards/QuizCard";
import { Button } from "@/components/ui/Button";
import SortSelect from "@/components/ui/Sort-select";
import { getAllQuizzes } from "@/server/actions";
import type { QuizOutput } from "@/server/database/quiz.schema";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

interface HomeClientProps {
  searchParams: {
    page?: string;
    sort?: string;
    search?: string;
  };
}

export default function HomeClient({ searchParams }: HomeClientProps) {
  const [page, setPage] = useState(parseInt(searchParams?.page || "1"));
  const [quizzes, setQuizzes] = useState<QuizOutput[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { sort = "title", search = "" } = searchParams;

  const loadMoreQuizzes = async () => {
    const nextPage = page + 1;
    const data = await getAllQuizzes(nextPage, sort, { search });

    if (data.data) {
      setQuizzes((prev) => [...prev, ...data.data.docs]);
      setPage(nextPage);
      setHasMore(data.data.hasNextPage);
    }
  };

  useEffect(() => {
    const fetchInitialQuizzes = async () => {
      const data = await getAllQuizzes(page, sort, { search });

      if (data.data) {
        setQuizzes(data.data.docs);
        setHasMore(data.data.hasNextPage);
      }
    };

    fetchInitialQuizzes();
  }, [sort, search, page]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center gap-y-7">
        <Link href="/quiz/manage">
          <Button>Add quiz</Button>
        </Link>
        <SortSelect selected={sort} search={search} />
      </div>

      <InfiniteScroll
        dataLength={quizzes.length}
        next={loadMoreQuizzes}
        hasMore={hasMore}
        loader={<div className="text-center p-4">Loading...</div>}
        endMessage={<p className="text-center p-4">No more quizzes to load</p>}
      >
        <div className="grid gap-7 grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz._id}
              data={quiz}
              questionsCount={quiz.questionsCount}
              completions={quiz.completions}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
