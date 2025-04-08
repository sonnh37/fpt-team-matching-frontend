import { cn } from "@/lib/utils";

interface TypographyPProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export const TypographyP = ({ children, className }: TypographyPProps) => {
    return (
      <p
        className={cn(
          "leading-7 [&:not(:first-child)]:mt-3",
          className
        )}
      >
        {children}
      </p>
    );
  };
  