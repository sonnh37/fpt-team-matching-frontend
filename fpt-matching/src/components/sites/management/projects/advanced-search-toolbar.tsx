import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterEnum } from "@/types/models/filter-enum";
import { Search, X } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { ProjectStatus } from "@/types/enums/project";
import { getEnumOptions } from "@/lib/utils";

interface AdvancedSearchToolbarProps<TData> {
  form: ReturnType<typeof useForm>;
  onSubmit: (values: any) => void;
  onReset: () => void;
  filterEnums?: FilterEnum[];
  table: Table<TData>;
}

export function AdvancedSearchToolbar<TData>({
  form,
  onSubmit,
  onReset,
  filterEnums,
  table,
}: AdvancedSearchToolbarProps<TData>) {
  const { register, handleSubmit, formState, setValue, watch } = form;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm nhanh..."
          className="w-[300px]"
          {...register("quickSearch")}
          onChange={(e) => {
            register("quickSearch").onChange(e);
            handleSubmit(onSubmit)();
          }}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Tìm kiếm nâng cao
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] space-y-4">
            <h4 className="font-medium leading-none">Tìm kiếm nâng cao</h4>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamCode">Mã nhóm</Label>
                  <Input
                    id="teamCode"
                    {...register("teamCode")}
                    onChange={(e) => {
                      register("teamCode").onChange(e);
                      handleSubmit(onSubmit)();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamName">Tên nhóm</Label>
                  <Input
                    id="teamName"
                    {...register("teamName")}
                    onChange={(e) => {
                      register("teamName").onChange(e);
                      handleSubmit(onSubmit)();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaderEmail">Email trưởng nhóm</Label>
                  <Input
                    id="leaderEmail"
                    {...register("leaderEmail")}
                    onChange={(e) => {
                      register("leaderEmail").onChange(e);
                      handleSubmit(onSubmit)();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topicName">Tên đề tài</Label>
                  <Input
                    id="topicName"
                    {...register("topicName")}
                    onChange={(e) => {
                      register("topicName").onChange(e);
                      handleSubmit(onSubmit)();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("status", value);
                      handleSubmit(onSubmit)();
                    }}
                    value={watch("status") || undefined}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {getEnumOptions(ProjectStatus).map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onReset}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Đặt lại
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      {filterEnums && filterEnums.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterEnums.map((filter) => (
            <div key={filter.columnId} className="flex items-center gap-2">
              <Label>{filter.title}</Label>
              <Select
                onValueChange={(value) => {
                  table
                    .getColumn(filter.columnId)
                    ?.setFilterValue(value === "all" ? undefined : [value]);
                  handleSubmit(onSubmit)();
                }}
                value={
                  (table
                    .getColumn(filter.columnId)
                    ?.getFilterValue() as string) || "all"
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
