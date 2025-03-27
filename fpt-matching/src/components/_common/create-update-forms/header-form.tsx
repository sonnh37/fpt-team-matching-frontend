import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { ButtonLoading } from "../button-loading";
import { TypographyMuted } from "../typography/typography-muted";
import { BaseEntity } from "@/types/_base/base";

interface HeaderFormProps {
  previousPath: string;
  title: string;
  initialData?: BaseEntity | null;
  loading: boolean;
  action: string;
}

export const HeaderForm: React.FC<HeaderFormProps> = ({
  previousPath,
  title,
  initialData,
  loading,
  action,
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-4">
      <div className="flex flex-row items-center gap-4">
        <Link href={previousPath}>
          <Button type="button" variant="outline">
            <IoReturnUpBackOutline />
          </Button>
        </Link>
        <TypographyH3 className="tracking-normal font-thin">
          {title}
        </TypographyH3>
        <TypographyMuted>
          {initialData && initialData.updatedDate
            ? `Last Updated: ${new Date(initialData.updatedDate).toLocaleString()}`
            : null}
        </TypographyMuted>
      </div>
      <div className="flex justify-end">
        <ButtonLoading
          className="flex justify-center items-center"
          size="lg"
          type="submit"
          disabled={loading}
        >
          {action}
        </ButtonLoading>
      </div>
    </div>
  );
};
