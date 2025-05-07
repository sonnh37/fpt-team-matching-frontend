import { projectService } from "@/services/project-service";
import { useQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import { blogCvService } from "@/services/blogcv-service";
import { BlogCvCommand } from "@/types/models/commands/blogcv/blogcv-create-command";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blogService } from "@/services/blog-service";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";
import { cloudinaryService } from "@/services/cloudinary-service";
import { BlogCvGetAllQuery } from "@/types/models/queries/blogcv/blogcv-get-all-query";
import { useCurrentRole } from "@/hooks/use-current-role";
import { ProjectStatus } from "@/types/enums/project";

const UploadCv = ({ blogId }: { blogId: string }) => {
    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };

    const {
        data: result,
        refetch,
    } = useQuery({
        queryKey: ["getBlogtInfo", blogId],
        queryFn: () => blogService.getById(blogId),
        refetchOnWindowFocus: false,
    });

    // const {
    //     data: prj,

    // } = useQuery({
    //     queryKey: ["getProjectInfo", result?.data?.projectId],
    //     queryFn: () => blogService.getById(blogId),
    //     refetchOnWindowFocus: false,
    // });
    const userIsExist = result?.data?.user?.id ?? ""
    const role = useCurrentRole()

    const prj = result?.data?.project?.status

    const submit = async () => {
        if (isSubmitting) return; // Nếu API đang chạy, không cho phép bấm tiếp
        setIsSubmitting(true); // Đánh dấu API đang chạy
    
        if (prj !== ProjectStatus.Pending) {
            // toast.dismiss(uploaddId);
            toast.error("Bạn không thể gửi vì nhóm này đang trong quá trình làm!")
            setIsSubmitting(false);
            return
        }
        if (user?.id == userIsExist) {
            // toast.dismiss(uploaddId);
            toast.error("Bạn không thể gửi vì đây bài viết của bạn!")
            setIsSubmitting(false);
            return
        }
        if (role !== "Student") {
            // toast.dismiss(uploaddId);
            toast.error("Bạn không thể gửi vì bạn không có quyền hạn")
            setIsSubmitting(false);
            return
        }

        const projectInfo = await projectService.getProjectInfo();

        //check xem người nộp có team chưa
        if (projectInfo.status === 1) {
            // toast.dismiss(uploaddId);
            toast.error("Bạn đã có team rồi không thể nộp ứng tuyển")
            setIsSubmitting(false);
            return
        } else {
            toast.error("Đã xảy ra lỗi, bạn đã nộp đơn thất bại!");
        }

        try {
            const uploaddId = toast.loading("⏳ Đang đợi nộp...");
            let checkCv: BlogCvGetAllQuery = {
                userId: user?.id,
                blogId: blogId,
                isDeleted: false,
                isPagination: false
            };

            const existUpload = await blogCvService.getAll(checkCv);


            if (existUpload?.data?.results?.length && existUpload.data.results.length > 0) {
                toast.dismiss(uploaddId);
                toast.error("Bạn đã đã nộp ứng tuyển cho nhóm này rồi");
                setIsSubmitting(false);
                return;
            }

            let fileurl = "";
            if (files?.length) {
                try {
                    fileurl = await cloudinaryService.uploadFile(files[0]) ?? "";
                } catch (error) {
                    toast.dismiss(uploaddId);
                    console.error("Upload failed:", error);
                    setIsSubmitting(false);
                    return
                }
            }

            let query: BlogCvCommand = {
                blogId: blogId,
                userId: user?.id ?? "",
                fileCv: fileurl
            };

            // if(query.fileCv)
            const result = await blogCvService.create(query);
            toast.dismiss(uploaddId);
            if (result.status == 1) {
                toast.success("Chúc mừng bạn đã nộp đơn thành công.");
                refetch();
            } else {
                toast.error("Đã xảy ra lỗi ,bạn đã nộp đơn thất bại!")
            }
            setIsSubmitting(false); // Hoàn tất, cho phép bấm tiếp
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi hệ thống xảy ra.");
        } finally {
            setIsSubmitting(false); // Đánh dấu API đang chạy
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div><span className="ml-2 text-[16px] ">{result?.data?.blogCvs.length} Uploads <FontAwesomeIcon icon={faPaperclip} /></span></div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[505px]  min-h-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-lg" >Nộp đơn ứng tuyển</DialogTitle>
                    <DialogDescription className="text-base">
                        Đây là nơi bạn sẽ nộp ứng tuyển vào {result?.data?.project?.teamName ?? "team"}
                    </DialogDescription>
                </DialogHeader>
                <div className="col-auto ">
                    <div className="grid grid-cols-1 gap-2 mt-3">
                        <div className="flex pt-3"><h3>Vui lòng nộp file CV   </h3> <span> </span><h3 className="text-red-500">(nếu có)</h3></div>
                        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                            <FileUpload onChange={handleFileUpload} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => submit()}>Ứng tuyển</Button>
                    {/* <Button type="cancel">Không, cảm ơn</Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadCv;