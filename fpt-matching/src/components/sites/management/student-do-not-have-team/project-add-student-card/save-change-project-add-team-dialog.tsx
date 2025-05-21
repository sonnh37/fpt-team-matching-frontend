import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Project} from "@/types/project";
import {projectService} from "@/services/project-service";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

const SaveChangeProjectAddTeamDialog = ({project}:{project:Project | null}) => {
    const [loading, setLoading] = React.useState(false);
    const handleSaveChange = async () => {
        try {
            setLoading(true);
            if (!project) {
                toast.info("Project not found.");
                return;
            }
            if (!project.teamMembers || project.teamMembers.length == 0){
                toast.error("Số lượng thành viên không hợp lệ");
                return;
            }
            const response = await projectService.createProjectByManager({project: project})
            if (response.status != 1)
            {
                toast.error(response.message)
                return;
            }
            else {
                toast.success(response.message)
                window.location.reload();
            }
        } catch (e: Error) {
            toast.error(e.message);
        }
        finally {
            setLoading(false);
        }

    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Lưu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo nhóm</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc sẽ tạo nhóm này ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Đang xử lí
                        </Button> :
                        <Button onClick={(event) => {
                            event.preventDefault()
                            handleSaveChange()
                        }}  type="submit">Đồng ý</Button>
                    }
                    <DialogClose>

                        <Button variant={"outline"} type="submit">Huỷ</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SaveChangeProjectAddTeamDialog;