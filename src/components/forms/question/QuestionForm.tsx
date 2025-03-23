import { Button } from "@/components/ui/Button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Draggable } from "@hello-pangea/dnd";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { questionTypes } from "@/constants/data";
import { Grip, Trash } from "lucide-react";
import { useEffect } from "react";
import { Control, useFormContext } from "react-hook-form";
import AnswersForm from "../answer/AnswerForm";
import { QuizSchemaType } from "../quiz/Type";

interface IProps {
  index: number;
  control: Control<QuizSchemaType>;
  loading: boolean;
  remove: (index: number) => void;
}

const QuestionForm = (props: IProps) => {
  const { control, index, loading, remove } = props;
  const { watch, setValue } = useFormContext<QuizSchemaType>();
  const questionType = watch(`questions.${index}.type`);

  useEffect(() => {
    if (questionType === "text") {
      setValue(`questions.${index}.answers`, []);
    }
  }, [questionType, index, setValue]);

  return (
    <Draggable draggableId={`question-${index}`} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div className="py-3 flex gap-6 items-center">
            <div {...provided.dragHandleProps}>
              <Grip className="h-4 w-4" />
            </div>
            <FormField
              control={control}
              name={`questions.${index}.text`}
              render={({ field }) => (
                <FormItem className="basis-2xs">
                  <FormLabel>Question title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`questions.${index}.type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Choose type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.id} value={type.value}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {index > 0 && (
              <div className="flex items-end pt-3.5">
                <Button size="sm" variant="ghost" onClick={() => remove(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="ml-10 mt-2">
            {(questionType === "single_choice" ||
              questionType === "multiple_choice") && (
              <AnswersForm control={control} index={index} loading={loading} />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default QuestionForm;
