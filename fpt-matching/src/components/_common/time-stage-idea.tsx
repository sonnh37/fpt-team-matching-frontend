import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { StageIdea } from "@/types/stage-idea";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Info } from "lucide-react";
interface StageIdeaProps {
  stageIdea?: StageIdea | undefined;
}
const TimeStageIdea = ({ stageIdea }: StageIdeaProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Thông tin Giai đoạn Đánh giá
          </CardTitle>
          <CardDescription>
            Các yêu cầu ý tưởng đang chờ phê duyệt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stageIdea ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-full w-px bg-border" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Thời gian đánh giá:{" "}
                    <Badge variant="outline" className="ml-2">
                      {formatDate(stageIdea.startDate)} -{" "}
                      {formatDate(stageIdea.endDate)}
                    </Badge>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Ngày công bố kết quả:{" "}
                    <Badge variant="outline" className="ml-2">
                      {formatDate(stageIdea.resultDate)}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Không có thông tin</AlertTitle>
              <AlertDescription>
                Hiện không có giai đoạn đánh giá nào đang diễn ra.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
   
    </div>
  );
};

export default TimeStageIdea;
