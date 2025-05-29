import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {SemesterStatus} from "@/types/enums/semester";
import React from "react";
import {semesterService} from "@/services/semester-service";
import {toast} from "sonner";
import {Loader2} from "lucide-react";
import {useCurrentSemester} from "@/hooks/use-current-role";
import {Semester} from "@/types/semester";

export function UpdateStatusDialog({semester} : {semester: Semester}) {
    const [loading , setLoading] = React.useState(false);
    const currentSemester = useCurrentSemester().currentSemester
    if (!currentSemester) {
        return null;
    }
    const handleSaveChange = async () => {
        try {
            setLoading(true);
            const response = await semesterService.updateStatus({status: semester.status + 1})
            if (response.status != 1) {
                toast.error(response.message);
                return;
            }
            toast.success(response.message);
            window.location.reload();
            return;
        }
        catch (error: any) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }

    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={currentSemester.id != semester.id} variant="default">Cập nhật sang giai đoạn tiếp theo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận cập nhật giao đoạn của kỳ</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn cập nhật sang giai đoạn {SemesterStatus[semester.status + 1]}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {!loading ? <Button onClick={handleSaveChange} variant={"default"} type="submit">Cập nhật</Button>
                        : (
                            <Button disabled>
                                <Loader2 className="animate-spin" />
                                Đang xử lí
                            </Button>
                        )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
