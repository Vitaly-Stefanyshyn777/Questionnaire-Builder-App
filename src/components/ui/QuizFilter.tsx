"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface QuizFilterProps {
  initialSort: string;
  initialSearch: string;
}

const QuizFilter: React.FC<QuizFilterProps> = ({
  initialSort,
  initialSearch,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const router = useRouter();

  const handleApply = () => {
    // Оновлюємо URL з параметрами для серверного рендерингу
    router.push(`/?page=1&sort=${sort}&search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div>
        <label className="block mb-1 font-semibold">Search by name</label>
        <input
          type="text"
          placeholder="Enter quiz name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Sort by</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="title">Name</option>
          <option value="questions">Questions count</option>
          <option value="completions">Completions</option>
        </select>
      </div>
      <button
        onClick={handleApply}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Apply
      </button>
    </div>
  );
};

export default QuizFilter;
