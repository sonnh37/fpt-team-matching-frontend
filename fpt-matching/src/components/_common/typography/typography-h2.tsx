import { cn } from "@/lib/utils";

interface TypographyH2Props {
  children: React.ReactNode;
  className?: string;
}

export const TypographyH2 = ({ children, className }: TypographyH2Props) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {children}
    </h2>
  );
};
