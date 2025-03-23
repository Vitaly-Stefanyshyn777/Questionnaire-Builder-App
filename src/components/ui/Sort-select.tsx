// src/components/ui/sort-select.tsx
"use client";

import { useRouter } from "next/navigation";

interface SortSelectProps {
  selected: string;
  search?: string;
}

export default function SortSelect({ selected, search = "" }: SortSelectProps) {
  const router = useRouter();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    router.push(
      `/?page=1&sort=${newSort}&search=${encodeURIComponent(search)}`
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Пошук за назвою */}
      <div>
        <label className="block mb-1 font-semibold">Search by name</label>
        <input
          type="text"
          placeholder="Enter quiz name..."
          value={search}
          onChange={(e) =>
            router.push(
              `/?page=1&sort=${selected}&search=${encodeURIComponent(
                e.target.value
              )}`
            )
          }
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Сортування */}
      <div>
        <label className="block mb-1 font-semibold">Sort by</label>
        <select
          value={selected}
          onChange={handleSortChange}
          className="border p-2 rounded w-full"
        >
          <option value="title">Name</option>
          <option value="questions">Questions count</option>
          <option value="completions">Completions</option>
        </select>
      </div>
    </div>
  );
}
