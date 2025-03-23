// src/components/cards/quiz-card.tsx
import { QuizOutput } from "@/server/database/quiz.schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { CellAction } from "./CellAction";

interface IProps {
  data: QuizOutput;
}

const QuizCard = (props: IProps) => {
  const { data } = props;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          <CardTitle className="text-lg font-semibold">{data.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {data.description}
          </CardDescription>
        </div>
        <CellAction id={data._id} />
      </CardHeader>
      <CardContent className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="font-medium">Questions:</span>
          <span>{data.questions?.length || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Completions:</span>
          <span>{data.completions || 0}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
