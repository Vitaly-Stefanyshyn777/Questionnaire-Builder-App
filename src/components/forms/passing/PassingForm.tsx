"use client";

import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";

import { Input } from "@/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/Radio-group";
import { QuizOutput } from "@/server/database/quiz.schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Checkbox } from "@/components/ui/Checkbox";
import { passingQuiz } from "@/server/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { passingSchema } from "./Schema";
import { PassingSchemaType } from "./Type";

interface IProps {
  data: QuizOutput;
}

const PassingForm = (props: IProps) => {
  const { data } = props;
  const [loading, setLoading] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const router = useRouter();

  const form = useForm<PassingSchemaType>({
    resolver: zodResolver(passingSchema),
    defaultValues: {
      answers:
        data?.questions.map(() => ({
          answerText: "",
          selectedAnswers: [],
        })) || [],
    },
  });

  useEffect(() => {
    const item = sessionStorage.getItem(`quiz-${data._id}`);
    if (item) {
      const parsedItem = JSON.parse(item);
      form.reset(parsedItem);
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const save = {
        answers: value.answers,
      };
      sessionStorage.setItem(`quiz-${data._id}`, JSON.stringify(save));
    });
    return () => subscription.unsubscribe();
  }, [data._id, form]);

  useEffect(() => {
    const interval = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (quiz: PassingSchemaType) => {
    try {
      setLoading(true);
      const result = await passingQuiz(data._id, quiz, timeSpent);
      router.push(`result/${result.data?._id}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-screen-lg">
      <CardHeader>
        <CardTitle>{data?.title}</CardTitle>
        <CardDescription>{data?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
            id="form-survey"
          >
            <div className="space-y-4">
              {data?.questions.map((question, index) => (
                <div key={question._id}>
                  <h3 className="mb-4">
                    {index + 1}. {question.text}
                  </h3>
                  {question.type === "text" && (
                    <FormField
                      control={form.control}
                      name={`answers.${index}.answerText`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              disabled={loading}
                              className="max-w-lg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {question.type === "single_choice" && (
                    <FormField
                      control={form.control}
                      name={`answers.${index}.selectedAnswers`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value?.[0]}
                              disabled={loading}
                              onValueChange={(value) => field.onChange([value])}
                            >
                              {question.answers?.map((answer) => (
                                <div key={answer._id}>
                                  <RadioGroupItem value={answer.text} />{" "}
                                  {answer.text}
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {question.type === "multiple_choice" && (
                    <FormField
                      control={form.control}
                      name={`answers.${index}.selectedAnswers`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div>
                              {question.answers?.map((answer) => (
                                <div key={answer._id}>
                                  <Checkbox
                                    disabled={loading}
                                    checked={field.value?.includes(answer.text)}
                                    onCheckedChange={(checked) =>
                                      field.onChange(
                                        checked
                                          ? [
                                              ...(field.value || []),
                                              answer.text,
                                            ]
                                          : (field.value || []).filter(
                                              (text) => text !== answer.text
                                            )
                                      )
                                    }
                                  />
                                  {answer.text}
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Button
          disabled={loading}
          className="ml-auto"
          type="submit"
          form="form-survey"
        >
          Send
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PassingForm;
