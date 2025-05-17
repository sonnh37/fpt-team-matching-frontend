import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { StageTopic } from "@/types/stage-topic";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Info, CalendarDays, Clock, Award } from "lucide-react";
import { Separator } from "../ui/separator";

interface StageTopicProps {
  stageTopic?: StageTopic | undefined;
}

const TimeStageTopic = ({ stageTopic }: StageTopicProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span>Thông tin Giai đoạn Đánh giá Ý tưởng</span>
          </CardTitle>
          <Separator />
        </CardHeader>
        
        <CardContent className="space-y-4">
          {stageTopic ? (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Timeline Item 1 */}
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50">
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Thời gian đánh giá</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-sm font-normal">
                      {formatDate(stageTopic.startDate)}
                    </Badge>
                    <span className="text-muted-foreground">đến</span>
                    <Badge variant="secondary" className="text-sm font-normal">
                      {formatDate(stageTopic.endDate)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Thời gian nộp và đánh giá ý tưởng
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/50">
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Công bố kết quả</h3>
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-sm font-normal">
                      {formatDate(stageTopic.resultDate)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ngày công bố kết quả đánh giá cuối cùng
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Alert variant="default" className="border-primary/20 bg-primary/5">
              <Info className="h-5 w-5 text-primary" />
              <AlertTitle>Không có giai đoạn đánh giá</AlertTitle>
              <AlertDescription>
                Hiện tại không có giai đoạn đánh giá nào đang diễn ra. Vui lòng kiểm tra lại sau.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeStageTopic;