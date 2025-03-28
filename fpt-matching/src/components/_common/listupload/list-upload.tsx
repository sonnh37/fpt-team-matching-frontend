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

const ListUploadCv = ({ blogId }: { blogId: string }) => {

    
    let query: BlogCvGetAllQuery ={
        blogId: blogId
    }
    const {
        data: post,
    } = useQuery({
        queryKey: ["getBlogCVAllById", query],
        queryFn: () => blogCvService.fetchAll(query),
        refetchOnWindowFocus: false,
    });



    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="flex items-center mr-3">
                    <i className="fas fa-image text-red-500"></i>
                    <span className="ml-2">{post?.data?.length ?? 0} Nộp CV </span>
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
                            <TableHead>File CV</TableHead>
                            <TableHead className="text-center">Profile </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {post?.data?.map((cv,index) => (
                            <TableRow key={cv.id}>
                                <TableCell className="font-medium">{index}</TableCell>
                                <TableCell className="font-medium">{cv.createdDate  ? new Date(cv.createdDate).toLocaleString("vi-VN", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                })
                                                                : "Không có ngày "}</TableCell>
                                <TableCell>{cv.user?.lastName} {cv.user?.firstName}  </TableCell>
                                <TableCell>{cv.user?.email}</TableCell>
                                <TableCell>{Department[cv.user?.department ?? 0]}</TableCell>
                                <TableCell>{cv.fileCv}</TableCell>
                                <TableCell >   <button className="p-1 bg-orange-400 ml-3"><a href={`social/blog/profile-social/${cv.user?.id}`}>Xem profile</a></button></TableCell>
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