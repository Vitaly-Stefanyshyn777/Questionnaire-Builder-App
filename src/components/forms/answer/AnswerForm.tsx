import { Button } from "@/components/ui/Button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { defaultAnswer } from "@/constants/data";
import { PlusCircle, Trash } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import { QuizSchemaType } from "../quiz/Type";

const AnswersForm = ({
  control,
  index,
  loading,
}: {
  control: Control<QuizSchemaType>;
  index: number;
  loading: boolean;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.answers`,
  });

  const addAnswerField = () => {
    if (fields.length < 4) append(defaultAnswer);
  };

  const removeAnswerField = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  return (
    <div className="space-y-5">
      {fields.map((field, ansIndex) => (
        <div key={field.id} className="flex items-end gap-5">
          <FormField
            control={control}
            name={`questions.${index}.answers.${ansIndex}.text`}
            render={({ field }) => (
              <FormItem className="basis-2xs">
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    {...field}
                    placeholder="Answer text..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.length > 1 && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeAnswerField(ansIndex)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        size="sm"
        variant="ghost"
        onClick={addAnswerField}
        disabled={loading}
        type="button"
      >
        <PlusCircle className="h-4 w-4" />
        Add answer
      </Button>
    </div>
  );
};

export default AnswersForm;
