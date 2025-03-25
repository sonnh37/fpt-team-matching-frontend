// TextInputField.tsx
import { PhoneInput } from "@/components/_common/phone-input";
import {
  SelectV2,
  SelectV2Content,
  SelectV2Item,
  SelectV2Trigger,
  SelectV2Value,
} from "@/components/_common/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input"; // Đảm bảo đúng đường dẫn
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactElement, useRef, useState } from "react";
import {
  FieldPath,
  FieldValues,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";

interface FormInputProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentPropsWithoutRef<"input">, "form"> {
  label?: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  form: UseFormReturn<TFieldValues>;
}

interface BaseProps<TFieldValues extends FieldValues> {
  label?: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
  form: UseFormReturn<TFieldValues>;
}
export const FormInput = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  ...props
}: FormInputProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...props} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface FormInputTextAreaProps<TFieldValues extends FieldValues>
  extends Omit<React.ComponentPropsWithoutRef<"textarea">, "form"> {
  label?: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  form: UseFormReturn<TFieldValues>;
}

export const FormInputTextArea = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  ...props
}: FormInputTextAreaProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...field} {...props} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// export const FormInputEditor = <TFieldValues extends FieldValues>({
//   name,
//   form,
//   label = "",
//   className = "",
// }: FormInputProps<TFieldValues>) => {
//   const editorRef = useRef<Editor | null>(null);

//   const handleCreate = useCallback(
//     ({ editor }: { editor: Editor }) => {
//       const initialValue = form.getValues(name); // Lấy giá trị từ form
//       if (initialValue && editor.isEmpty) {
//         editor.commands.setContent(initialValue); // Đặt nội dung khởi tạo
//       }
//       editorRef.current = editor;
//     },
//     [form, name]
//   );

//   // #IMPORTANT Thêm useEffect để đồng bộ giá trị từ form với editor khi có sự thay đổi
//   useEffect(() => {
//     if (
//       editorRef.current &&
//       form.getValues(name) !== editorRef.current.getHTML()
//     ) {
//       editorRef.current.commands.setContent(form.getValues(name));
//     }
//   }, [form.getValues(name)]);
//   return (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => {
//         return (
//           <FormItem>
//             <FormLabel className="sr-only">{label}</FormLabel>
//             <FormControl>
//               <div className="flex h-screen overflow-hidden">
//                 <MinimalTiptapEditor
//                   {...field}
//                   className={cn("w-full max-h-full overflow-y-auto", {
//                     "border-destructive focus-within:border-destructive":
//                       form.formState.errors.description,
//                   })}
//                   editorContentClassName="some-class"
//                   output="html"
//                   placeholder="Type your description here..."
//                   onCreate={handleCreate}
//                   autofocus={true}
//                   immediatelyRender={true}
//                   editable={true}
//                   injectCSS={true}
//                   editorClassName="focus:outline-none p-5"
//                 />
//               </div>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         );
//       }}
//     />
//   );
// };

interface FormSelectEnumProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  form: UseFormReturn<TFieldValues>;
  enumOptions: { label: string; value: number | string }[]; // Các tùy chọn enum
  placeholder?: string;
  disabled?: boolean;
}

export const FormSelectEnum = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  enumOptions,
  placeholder = "Select an option",
  disabled = false,
}: FormSelectEnumProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(Number(value));
              }}
              value={field.value?.toString()}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {enumOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormRadioGroup = <TFieldValues extends FieldValues>({
  label,
  name,
  placeholder = "",
  description,
  form,
  enumOptions,
  disabled = false,
}: FormSelectEnumProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(Number(value));
              }}
              value={field.value?.toString()}
              className="flex flex-col space-y-1"
            >
              {enumOptions.map((option) => {
                const value_ = option.value.toString();
                return (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={value_} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface InputNumberBaseProps<TFieldValues extends FieldValues> {
  label?: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
  form: UseFormReturn<TFieldValues>;
  min?: number;
  max?: number;
  step?: string;
  decimalScale?: number;
}

export const FormInputNumber = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  min = 0,
  max,
  step = "1",
  decimalScale = 0,
  ...props
}: InputNumberBaseProps<TFieldValues>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form?.control || control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              ref={inputRef}
              {...props}
              type="number"
              min={min}
              max={max}
              step={step}
              value={field.value ?? ""}
              onChange={(e) => {
                let value = e.target.value;

                // Xử lý số thập phân nếu cần
                if (decimalScale > 0) {
                  const regex = new RegExp(
                    `^-?\\d*\\.?\\d{0,${decimalScale}}$`
                  );
                  if (!regex.test(value)) return;
                } else {
                  // Chỉ cho phép số nguyên
                  value = value.replace(/[^0-9]/g, "");
                }

                // Chuyển đổi sang number
                const numValue =
                  value === ""
                    ? null
                    : decimalScale > 0
                    ? parseFloat(value)
                    : parseInt(value);

                field.onChange(numValue);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormInputNumberCurrency = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  ...props
}: FormInputProps<TFieldValues>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              ref={inputRef}
              {...props}
              min="0"
              value={
                field.value !== undefined ? formatCurrency(field.value) : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, "");
                const parsedValue = parseFloat(rawValue) || 0;

                // Update the field value
                field.onChange(parsedValue);

                // Preserve cursor position
                if (inputRef.current) {
                  const cursorPosition = e.target.selectionStart || 0;
                  setTimeout(() => {
                    inputRef.current?.setSelectionRange(
                      cursorPosition,
                      cursorPosition
                    );
                  }, 0);
                }
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormInputPhone = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  ...props
}: FormInputProps<TFieldValues>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              placeholder="Placeholder"
              {...field}
              defaultCountry="VN"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormSwitch = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  disabled = false,
  form,
}: BaseProps<TFieldValues>) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">{label}</FormLabel>
              {description && <FormDescription>{description}</FormDescription>}
            </div>
            <FormControl>
              <Switch
                disabled={disabled}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

interface FormSelectObjectProps<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  options: any[];
  form: UseFormReturn<TFieldValues>;
  selectValue: string;
  selectLabel: string;
  placeholder?: string;
}

export const FormSelectObject = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  options,
  selectLabel,
  selectValue,
  placeholder = "Select an option",
}: FormSelectObjectProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option[selectValue]}
                    value={option[selectValue]}
                  >
                    {option[selectLabel]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormSelectColor = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  options,
  selectLabel,
  selectValue,
  placeholder = "Select an option",
}: FormSelectObjectProps<TFieldValues>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value ?? undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option[selectValue]}
                    value={option[selectValue]}
                  >
                    <div className="flex items-center space-x-2">
                      {/* Hiển thị ô màu */}
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: option[selectLabel],
                        }}
                      ></span>
                      {/* Hiển thị tên màu */}
                      <span>{option[selectLabel]}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface DateBaseProps<TFieldValues extends FieldValues> {
  label?: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
  form: UseFormReturn<TFieldValues>;
  pattern?: string;
}

interface FormInputDateProps<TFieldValues extends FieldValues> {
  label?: string;
  name: FieldPath<TFieldValues>;
  description?: string;
  form: UseFormReturn<TFieldValues>;
  min?: string;
  max?: string;
}

export const FormInputDate = <TFieldValues extends FieldValues>({
  label,
  name,
  description,
  form,
  min,
  max,
  ...props
}: FormInputDateProps<TFieldValues>) => {
  const { control } = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form?.control || control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              {...props}
              type="date"
              min={min}
              max={max}
              value={
                field.value
                  ? new Date(field.value).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                field.onChange(date);
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export const FormInputDateRangePicker = <TFieldValues extends FieldValues>({
  label,
  name,
  form,
  placeholder,
  disabled = false,
}: BaseProps<TFieldValues>) => {
  return (
    <div className="flex justify-start gap-3">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label ? <FormLabel>{label}</FormLabel> : <></>}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value?.from ? (
                    field.value?.to ? (
                      <>
                        {format(field.value.from, "LLL dd, y")} -{" "}
                        {format(field.value.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(field.value.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={field.value?.from}
                  selected={{
                    from: field.value?.from!,
                    to: field.value?.to,
                  }}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const FormInputDateTimePicker = <TFieldValues extends FieldValues>({
  label,
  name,
  form,
  placeholder = "",
  disabled = false,
  isShowTimePicker = false,
}: FormInputProps<TFieldValues> & { isShowTimePicker?: boolean }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const [time, setTime] = useState<string>("05:00");
        const [date, setDate] = useState<Date | null>(null);

        return (
          <FormItem className="flex flex-col w-full">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      `${formatDate(field.value, false)}${
                        isShowTimePicker ? ", " + time : ""
                      }`
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 flex items-start"
                align="start"
              >
                <Calendar
                  mode="single"
                  showOutsideDays={false}
                  captionLayout="dropdown-buttons"
                  selected={date || field.value}
                  onSelect={(selectedDate) => {
                    if (isShowTimePicker) {
                      const [hours, minutes] = time.split(":");
                      selectedDate?.setHours(
                        parseInt(hours),
                        parseInt(minutes)
                      );
                    }
                    setDate(selectedDate!);
                    field.onChange(selectedDate);
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
                {isShowTimePicker && (
                  <Select
                    defaultValue={time}
                    onValueChange={(newTime) => {
                      setTime(newTime);
                      if (date) {
                        const [hours, minutes] = newTime.split(":");
                        const newDate = new Date(date.getTime());
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setDate(newDate);
                        field.onChange(newDate);
                      }
                    }}
                  >
                    <SelectTrigger className="font-normal focus:ring-0 w-[120px] my-4 mr-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-none shadow-none mr-2 fixed top-2 left-0">
                      <div className="overflow-hidden">
                        <ScrollArea>
                          {Array.from({ length: 96 }).map((_, i) => {
                            const hour = Math.floor(i / 4)
                              .toString()
                              .padStart(2, "0");
                            const minute = ((i % 4) * 15)
                              .toString()
                              .padStart(2, "0");
                            return (
                              <SelectItem key={i} value={`${hour}:${minute}`}>
                                {hour}:{minute}
                              </SelectItem>
                            );
                          })}
                        </ScrollArea>
                      </div>
                    </SelectContent>
                  </Select>
                )}
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
  redirectUrl?: string;
}

const ConfirmationDialog = ({
  isOpen,
  onConfirm,
  title,
  onClose,
  description,
  confirmText,
  cancelText,
  isLoading = false,
  redirectUrl,
}: ConfirmationDialogProps) => {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open}>
      <DialogContent className="overflow-hidden shadow-lg">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} onClick={onClose} variant="secondary">
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
