import NotFound from "@/app/not-found";
import PassingForm from "@/components/forms/passing/PassingForm";
import PageTitle from "@/components/layout/Page-title";
import { getQuizById } from "@/server/actions";

export default async function PassQuiz({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getQuizById(id);

  if (!data.data) {
    return <NotFound />;
  }

  return (
    <div className="space-y-4">
      <PageTitle>Pass Quiz</PageTitle>
      <div className="grid justify-items-center">
        <PassingForm data={data.data} />
      </div>
    </div>
  );
}
