"use client";

// import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
//
// import { topicService } from "@/services/topic-service";
// import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
// import { TopicVersionRequest } from "@/types/topic-version-request";
//
// import { useQuery } from "@tanstack/react-query";
// import { ColumnDef, Row } from "@tanstack/react-table";
//
// import { TopicDetailForm } from "@/components/sites/topic/detail";
// import { Button } from "@/components/ui/button";
// import { formatDate } from "@/lib/utils";
// import SamilaritiesProjectModels from "@/types/models/samilarities-project-models";
// import {Brain, Eye, ListChecks} from "lucide-react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Topic } from "@/types/topic";
// import { useSelectorUser } from "@/hooks/use-auth";
// import { LoadingComponent } from "@/components/_common/loading-page";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { apiHubsService } from "@/services/api-hubs-service";
// import { Label } from "@/components/ui/label";
//
// export const columns: ColumnDef<Topic>[] = [
//   {
//       accessorKey: "topicCode",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Mã đề tài" />
//       ),
//       cell: ({ row }) => {
//         const topic = row.original;
//         // const highestVersion =
//         //   topic.topicVersions.length > 0
//         //     ? topic.topicVersions.reduce((prev, current) =>
//         //         (prev.version ?? 0) > (current.version ?? 0) ? prev : current
//         //       )
//         //     : undefined;
//         return highestVersion?.topic?.topicCode || "-";
//       },
//     },
//
//     {
//       accessorKey: "vietNamName",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Tên đề tài" />
//       ),
//       cell: ({ row }) => {
//         const topic = row.original;
//         const highestVersion =
//           topic.topicVersions.length > 0
//             ? topic.topicVersions.reduce((prev, current) =>
//                 (prev.version ?? 0) > (current.version ?? 0) ? prev : current
//               )
//             : undefined;
//         return highestVersion?.englishName || "-";
//       },
//     },
//     {
//       accessorKey: "mentorId",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Giảng viên hướng dẫn" />
//       ),
//       cell: ({ row }) => {
//         const topic = row.original;
//         return topic?.mentor?.email || "-";
//       },
//     },
//     {
//       accessorKey: "actions",
//       header: "Tùy chọn",
//       cell: ({ row }) => {
//         return <Actions row={row} />;
//       },
//     },
// ];
//
// interface ActionsProps {
//   row: Row<Topic>;
// }
// const Actions: React.FC<ActionsProps> = ({ row }) => {
//   const [dialogOpen, setDialogOpen] = useState(false);
//
//   const topic = row.original;
//
//   const user = useSelectorUser();
//   if (!user) return;
//
//   const highestVersion =
//     topic.topicVersions.length > 0
//       ? topic.topicVersions.reduce((prev, current) =>
//           (prev.version ?? 0) > (current.version ?? 0) ? prev : current
//         )
//       : undefined;
//
//   const mentorRequest = highestVersion?.topicVersionRequests.find(
//     (m) =>
//       m.role === "Mentor" &&
//       m.status === TopicVersionRequestStatus.Pending &&
//       m.reviewerId === user.id
//   );
//
//   const councilRequest = highestVersion?.topicVersionRequests.find(
//     (m) =>
//       m.role === "Council" &&
//       m.status === TopicVersionRequestStatus.Pending &&
//       m.reviewerId === user.id
//   );
//
//   const [loadingAI, setLoadingAI] = useState<boolean>(false);
//   const [samilaritiesProject, setSamilaritiesProject] = useState<
//     SamilaritiesProjectModels[]
//   >([]);
//
//   // Load similar projects khi tab active
//   useEffect(() => {
//     const loadSimilarProjects = async () => {
//       if (highestVersion?.description) {
//         setLoadingAI(true);
//         try {
//           const response = await apiHubsService.getSimilaritiesProject(
//             highestVersion.description
//           );
//           if (response) {
//             setSamilaritiesProject(
//               (response as { similar_capstone: SamilaritiesProjectModels[] })
//                 .similar_capstone
//             );
//           }
//           setLoadingAI(false);
//         } catch (error) {
//           console.error("Failed to load similar projects", error);
//         } finally {
//           setLoadingAI(false);
//         }
//       }
//     };
//
//     loadSimilarProjects();
//   }, [highestVersion]);
//
//   return (
//     <div className="flex flex-row gap-2">
//       {/* Nút xem nhanh trong dialog */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button size="icon" variant="outline">
//             <Eye className="h-4 w-4" />
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
//           <div className="grid gap-4 grid-cols-3">
//             {topic && (
//               <div className="col-span-2">
//                 <TopicDetailForm topicId={topic.id} />
//               </div>
//             )}
//             {loadingAI ? (
//               <LoadingComponent />
//             ) : (
//                 <div className="flex flex-col gap-10 h-screen overflow-auto">
//                   <div className="text-lg font-semibold flex gap-2">
//                     <Brain className="h-5 w-5" />
//                     <h3>Các đề tài tương đồng đã tồn tại</h3>
//                   </div>
//                   {samilaritiesProject && samilaritiesProject.length > 0 ? (
//                       samilaritiesProject.map((project, index) => (
//                           <Card key={index}>
//                             <CardHeader>
//                               <CardTitle>{project.name}</CardTitle>
//                               <CardDescription>
//                                 Độ tương đồng:{" "}
//                                 {(Number(project.similarity.toFixed(2)) ?? 0) * 100}%
//                               </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                               <div className="space-y-2">
//                                 <div className={"flex gap-4"}>
//                                   <Label className="font-bold">Mã đề tài:</Label>
//                                   <p>{project.project_code}</p>
//                                 </div>
//                                 <div>
//                                   <Label className={"font-bold"}>Mô tả:</Label>
//                                   <p>{project.context}</p>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                       ))
//                   ) : (
//                       <p>No similar projects found</p>
//                   )}
//                 </div>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//       {/* <Tooltip>
//         <TooltipTrigger asChild>
//           <Link href={`/topic/reviews/${councilRequest?.id}`} passHref>
//             <Button size="icon" variant="default">
//               <ListChecks className="h-4 w-4" />
//             </Button>
//           </Link>
//         </TooltipTrigger>
//         <TooltipContent>
//           <p>Đánh giá</p>
//         </TooltipContent>
//       </Tooltip> */}
//     </div>
//   );
// };