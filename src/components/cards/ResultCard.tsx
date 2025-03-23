import { ResultWithQuiz } from "@/server/database/result.schema";
import { formatTime } from "@/utils/helpers";
import Link from "next/link";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";

interface IProps {
  data: ResultWithQuiz;
}

const ResultCard = (props: IProps) => {
  const { data } = props;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between gap-1">
        <div className="space-y-3">
          <CardTitle>{data.quizId.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {data.quizId.description}
          </CardDescription>
          <CardDescription>
            Time spent: {formatTime(data.duration)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-base">
        <div>
          <ul>
            {data.answers.map((answer, index) => (
              <li key={answer._id}>
                {index + 1}. {answer.selectedAnswers?.join(", ")}
                {answer.answerText}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <Link href="/quiz">
          <Button>Go home</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResultCard;
