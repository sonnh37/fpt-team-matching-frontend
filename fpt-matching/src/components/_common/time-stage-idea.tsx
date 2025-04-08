import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { StageIdea } from "@/types/stage-idea";
interface StageIdeaProps {
  stageIdea?: StageIdea | undefined;
}
const TimeStageIdea = ({ stageIdea }: StageIdeaProps) => {
  return (
    <div>
      <Card className={cn("w-[380px]")}>
        <CardHeader>
          <CardTitle>Stage {stageIdea?.stageNumber} idea</CardTitle>
          <CardDescription>You have new review stages.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {stageIdea ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Timeline:{" "}
                      {formatDate(stageIdea.startDate)}
                      {" "}-{" "}
                      {formatDate(stageIdea.endDate)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Date of results:{" "}
                      {formatDate(stageIdea.resultDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Không có thông báo mới.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeStageIdea;
