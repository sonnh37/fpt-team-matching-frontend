"use client";
import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { Department } from "@/types/enums/user";
import { IdeaVersionRequest } from "@/types/idea-version-request";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ảnh đại diện" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user.firstName?.charAt(0)?.toUpperCase() ?? ""}${
        user.lastName?.charAt(0)?.toUpperCase() ?? ""
      }`;
      return (
        <Button variant="ghost" className="size-10 p-0 hover:bg-transparent">
          <Avatar className="size-10">
            <AvatarImage
              src={user.avatar?.trim() || undefined}
              alt={user.username || "User avatar"}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <AvatarFallback className="bg-muted">
              {initials || "US"}
            </AvatarFallback>
          </Avatar>
        </Button>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Họ và tên" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return `${user.lastName || ""} ${user.firstName || ""}`.trim() || "N/A";
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => row.getValue("email") || "N/A",
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Khoa/Bộ môn" />
    ),
    cell: ({ row }) => {
      const department: Department = row.getValue("department");
      return department ? Department[department] : "N/A";
    },
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã số" />
    ),
  },
  {
    accessorKey: "pendingRequests",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yêu cầu chờ duyệt" />
    ),
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const requests: IdeaVersionRequest[] =
        row.original.ideaVersionRequestOfReviewers?.filter(
          (req) => req.status === IdeaVersionRequestStatus.Pending
        ) || [];

      return (
        <>
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={() => requests.length > 0 && setIsDialogOpen(true)}
          >
            <Badge variant="outline">{requests.length}</Badge>
            {requests.length > 0 && (
              <Button variant="link" size="sm">
                Xem chi tiết
              </Button>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>
                  Chi tiết yêu cầu chờ duyệt ({requests.length})
                </DialogTitle>
                <DialogDescription>
                  Danh sách các ý tưởng đang chờ đánh giá từ{" "}
                  {row.original.lastName} {row.original.firstName}
                </DialogDescription>
              </DialogHeader>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đề tài</TableHead>
                      <TableHead>Tên ý tưởng</TableHead>
                      <TableHead>Phiên bản</TableHead>
                      <TableHead>Kì</TableHead>
                      <TableHead>Giai đoạn</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {request.ideaVersion?.topic?.topicCode || "-"}
                        </TableCell>
                        <TableCell>
                          {request.ideaVersion?.englishName || "-"}
                        </TableCell>
                        <TableCell>V{request.ideaVersion?.version}</TableCell>

                        <TableCell>
                          {request.ideaVersion?.stageIdea?.semester
                            ?.semesterName || "-"}
                        </TableCell>
                        <TableCell>
                          {request.ideaVersion?.stageIdea?.stageNumber || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Đóng</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thao tác" />
    ),
    cell: ({ row }) => {
      return (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/profile-detail/${row.original.id}`}>Xem hồ sơ</Link>
        </Button>
      );
    },
  },
];
