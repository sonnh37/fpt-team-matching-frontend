import { Column } from "@tanstack/react-table";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, Circle, PlusCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type FilterOption = {
  label: string;
  value: any;
  icon?: React.ComponentType<{ className?: string }>;
};

interface DataTableFacetedFilter<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: FilterOption[];
  type?: "single" | "multiple";
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  type = "multiple",
}: DataTableFacetedFilter<TData, TValue>) {
  const filterValue = column?.getFilterValue();

  // Xử lý selectedValues để luôn là Set
  const selectedValues = React.useMemo(() => {
    if (type === "multiple") {
      return new Set(Array.isArray(filterValue) ? filterValue : []);
    } else {
      return new Set(filterValue !== undefined ? [filterValue] : []);
    }
  }, [filterValue, type]);

  const handleSelect = (value: any) => {
    if (type === "single") {
      // Single select: Gửi giá trị trực tiếp hoặc undefined khi bỏ chọn
      column?.setFilterValue(selectedValues.has(value) ? undefined : value);
    } else {
      // Multiple select: Xử lý mảng giá trị
      const newValues = new Set(selectedValues);
      if (selectedValues.has(value)) {
        newValues.delete(value);
      } else {
        newValues.add(value);
      }
      column?.setFilterValue(Array.from(newValues));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            className="border-none focus-visible:ring-0"
            placeholder={title}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                  >
                    {type === "multiple" ? (
                      <Checkbox
                        className={cn(
                          "",
                          isSelected
                            ? "border-primary"
                            : "border-muted-foreground"
                        )}
                        checked={isSelected}
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full border-2",
                          isSelected
                            ? "border-primary"
                            : "border-muted-foreground"
                        )}
                      >
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                    )}

                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
