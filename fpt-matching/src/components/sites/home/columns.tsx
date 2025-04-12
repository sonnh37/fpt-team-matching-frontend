"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { ProjectStatus } from "@/types/enums/project";
import { Idea } from "@/types/idea";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "projectInfo",
    header: "Dự án tham khảo",
    cell: ({ row }) => {
      const project = row.original;
      const idea = project.idea ?? {} as Idea;
      const leader = project.idea?.owner ?? {} as User;
      
      const initials = `${leader.firstName?.charAt(0) ?? ''}${leader.lastName?.charAt(0) ?? ''}`.toUpperCase();
      
      const statusConfig = {
        [ProjectStatus.Pending]: {
          label: "Chờ xử lý",
          class: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
        },
        [ProjectStatus.InProgress]: {
          label: "Đang thực hiện",
          class: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
        },
        [ProjectStatus.Completed]: {
          label: "Hoàn thành",
          class: "bg-orange-200 text-orange-900 dark:bg-orange-800/30 dark:text-orange-200 border border-orange-300 dark:border-orange-700"
        },
        [ProjectStatus.Canceled]: {
          label: "Đã hủy",
          class: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-400 line-through"
        }
      };

      const currentStatus = statusConfig[project.status as ProjectStatus] || statusConfig[ProjectStatus.Pending];

      return (
        <Card className="hover:shadow-lg transition-shadow border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className={cn(
                "text-xs font-medium tracking-wide",
                currentStatus.class
              )}>
                {currentStatus.label}
              </Badge>
              <div className="flex items-center space-x-1 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="text-orange-500">👥</span>
                <span>{project.teamSize} thành viên</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-4">
              <Avatar className="h-14 w-14 rounded-lg border-2 shadow-sm">
                <AvatarImage src={leader.avatar} alt={`${leader.firstName} ${leader.lastName}`} />
                <AvatarFallback className="rounded-lg ">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <Link href={`/team-detail/${project.id}`} className="group block">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {idea.englishName}
                  </h3>
                  {idea.vietNamName && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {idea.vietNamName}
                    </p>
                  )}
                </Link>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <span className="mr-1.5 text-orange-500">👤</span>
                    <span>{leader.firstName} {leader.lastName || "Ẩn danh"}</span>
                  </div>
                  <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                    <span className="mr-1.5 text-orange-500">📅</span>
                    <span>{formatDate(idea.createdDate)}</span>
                  </div>
                </div>

                {idea.description && (
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 mt-2">
                    {idea.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    },
  },
];
