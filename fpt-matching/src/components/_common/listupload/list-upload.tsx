import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { blogService } from "@/services/blog-service";
import { useQuery } from "@tanstack/react-query";
import { Department } from "@/types/enums/user";
import { blogCvService } from "@/services/blogcv-service";
import { BlogCvGetAllQuery } from "@/types/models/queries/blogcv/blogcv-get-all-query";
import { toast } from "sonner";
import { useConfirm } from "../formdelete/confirm-context";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListUploadCv = ({ blogId }: { blogId: string }) => {


    let query: BlogCvGetAllQuery = {
        blogId: blogId,
        isPagination: false,
    }
    const {
        data: post,
        refetch
    } = useQuery({
        queryKey: ["getBlogCVAllById", query],
        queryFn: () => blogCvService.getAll(query),
        refetchOnWindowFocus: false,
    });



    //Đây là form delete trả về true false tái sử dụng được
    const confirm = useConfirm()


    const handleDelete = async (id: string) => {

        // Gọi confirm để mở dialog
        const confirmed = await confirm({
            title: "Xóa yêu cầu gia nhập",
            description: "Bạn có muốn xóa đơn này không?",
            confirmText: "Có,xóa nó đi",
            cancelText: "Không,cảm ơn",
        })
        if (confirmed) {
            const result = await blogCvService.deletePermanent(id)
            if (result.status == 1) {
                toast.success("Xóa thành công lời mời!")
                refetch();
            }
        } else {
            return
        }


    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="flex items-center mr-3">
                    <i className="fas fa-image text-red-500"></i>
                    <span className="ml-2 text-lg">{post?.data?.length ?? 0} Uploads <FontAwesomeIcon icon={faPaperclip}/> </span>
                </span>
            </DialogTrigger>
            <DialogContent className="max-w-max min-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-lg" >Danh sách nộp đơn ứng tuyển</DialogTitle>
                    <DialogDescription className="text-base">
                        Đây là nơi bạn sẽ sẽ xem danh sách học sinh đã nộp ứng tuyển vào team
                    </DialogDescription>
                </DialogHeader>
                <Table>
                    <TableCaption>Danh sách nộp ứng tuyển.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Số thứ tự</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>Tên người nộp</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="max-h-[500px] overflow-x-auto whitespace-nowrap">File CV</TableHead>
                            <TableHead className="text-center">Profile </TableHead>
                            <TableHead className="text-center">Action </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {post?.data?.map((cv, index) => (
                            <TableRow key={cv.id}>
                                <TableCell className="font-medium">{index}</TableCell>
                                <TableCell className="font-medium">{cv.createdDate ? new Date(cv.createdDate).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit"
                                })
                                    : "Không có ngày "}</TableCell>
                                <TableCell>{cv.user?.lastName} {cv.user?.firstName}  </TableCell>
                                <TableCell >{cv.user?.email}</TableCell>
                                <TableCell>{Department[cv.user?.department ?? 0]}</TableCell>
                                <TableCell className="max-w-[400px] overflow-x-auto whitespace-nowrap">{cv.fileCv && (
                                    <a href={cv.fileCv} className="border-b-2 border-blue-500 text-blue-500">
                                        Link Download
                                    </a>
                                )}</TableCell>
                                <TableCell >   <button className="p-2 bg-orange-400 ml-3 rounded-sm"><a href={`/social/blog/profile-social/${cv.user?.id}`}>Xem profile</a></button></TableCell>
                                <TableCell >   <button className="p-2 bg-red-600 ml-3 rounded-sm" onClick={() => handleDelete(cv.id ?? "")}> Xóa CV</button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>

                    </TableFooter>
                </Table>
                <DialogFooter>
                    {/* <Button onClick={() => submit()}>Ứng tuyển</Button> */}
                    {/* <Button type="cancel">Không, cảm ơn</Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
};

export default ListUploadCv;