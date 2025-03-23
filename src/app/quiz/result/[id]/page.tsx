import NotFound from "@/app/not-found";
import ResultCard from "@/components/cards/ResultCard";
import PageTitle from "@/components/layout/Page-title";
import { getResultById } from "@/server/actions";

export default async function ResultQuiz({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getResultById(id);

  if (!data.data) {
    return <NotFound />;
  }

  return (
    <div className="space-y-4">
      <PageTitle>Quiz result</PageTitle>
      <div className="grid justify-items-center">
        <ResultCard data={data.data} />
      </div>
    </div>
  );
}
