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

const UploadCv = ({  blogId }: {  blogId: string }) => {
    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)

    const {
        data: result,
        refetch,
    } = useQuery({
        queryKey: ["getBlogtInfo", blogId],
        queryFn: () => blogService.fetchById(blogId),
        refetchOnWindowFocus: false,
    });
    console.log("resu",result?.data)

    // const {
    //     data: projectInfo,
    // } = useQuery({
    //     queryKey: ["getProjecttInfo", blogId],
    //     queryFn: () => projectService.getProjectInfo(),
    //     refetchOnWindowFocus: false,
    // });
   

    const submit = async () => {

        const projectInfo = await projectService.getProjectInfo();
        console.log("Check prj",projectInfo)
        //check xem người nộp có team chưa
        if (projectInfo.status === 1) {
            toast("Bạn đã có team rồi không thể nộp ứng tuyển")
            return
        }
        let query: BlogCvCommand = {
            blogId: blogId,
            userId: user?.id ?? ""
            // fileCv: ""
        }
        // if(query.fileCv)
        const result = await blogCvService.create(query);
        if (result.status == 1) {
            toast.success("Chúc mừng bạn đã nộp đơn thành công.");
            refetch();
        } else {
            toast.error("Đã xảy ra lỗi ,bạn đã nộp đơn thất bại!")
        }

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div><span className="ml-2 text-lg ">{result?.data?.blogCvs.length} Uploads <FontAwesomeIcon icon={faPaperclip} /></span></div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-lg" >Nộp đơn ứng tuyển</DialogTitle>
                    <DialogDescription className="text-base">
                        Đây là nơi bạn sẽ nộp ứng tuyển vào {result?.data?.project?.teamName ?? "team"}
                    </DialogDescription>
                </DialogHeader>
                <div className="col-auto ">
                    <div className="grid grid-cols-1 gap-2 mt-3">
                        <div className="flex pt-3"><h3>Vui lòng nộp file CV   </h3> <span> </span><h3 className="text-red-500">(nếu có)</h3></div>
                        <Input type="file" className="w-full mb-2" />
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