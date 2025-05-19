import React, {Dispatch, SetStateAction} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {Button} from "@/components/ui/button";
import {Project} from "@/types/project";
import {Plus} from "lucide-react";

import {User} from '@/types/user';
import {
    CancelProjectAddTeamDialog
} from "@/components/sites/management/student-do-not-have-team/project-add-student-card/cancel-project-add-team-dialog";
import {TeamMemberRole} from "@/types/enums/team-member";
import {Badge} from "@/components/ui/badge";
import SaveChangeProjectAddTeamDialog
    from "@/components/sites/management/student-do-not-have-team/project-add-student-card/save-change-project-add-team-dialog";
import {Semester} from "@/types/semester";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {toast} from "sonner";
import {Topic} from "@/types/topic";

function SelectTopic({topics, setProject} : {topics: Topic[], setProject: Dispatch<SetStateAction<Project | null>>}) {
    return (
        <Select onValueChange={(value) => {
            setProject((prevState) => {
                const updatedTopic = {...prevState ?? {} as Project};
                updatedTopic.topicId = value;
                return updatedTopic;
            })
        }}>
            <SelectTrigger className="w-[20rem]">
                <SelectValue placeholder="Chọn đề tài" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Đề tài</SelectLabel>
                    {topics.map((topic, index) => (
                        <SelectItem key={index} value={topic.id ?? ""}>{topic.englishName}  - {topic.topicCode}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const ProjectAddStudentCard = ({setStudents,numberOfTeam, projects, setCountProjects, project, setProject, semester, topics}: {
    numberOfTeam: number,
    projects: Project[],
    setCountProjects: Dispatch<SetStateAction<number>>,
    project: Project | null,
    setProject: Dispatch<SetStateAction<Project | null>>,
    setStudents: Dispatch<SetStateAction<User[]>>
    semester: Semester,
    topics: Topic[],
}) => {
    const [addTeam, setAddTeam] = React.useState(false);
    return (
        <Card className="w-[30vw]">
            <CardHeader>
                <CardTitle>Nhóm</CardTitle>
                <CardDescription>Thêm sinh viên vào nhóm tại đây</CardDescription>
                <CardDescription className={"text-red-500"}>Sinh viên đầu tiên trong danh sách sẽ là leader của nhóm</CardDescription>
            </CardHeader>
            <CardContent>
                <div className={"pb-4"}>
                    <h2 className={"font-bold text-sm"}>Số lượng nhóm còn lại: <span
                        className={"font-medium"}>{numberOfTeam}</span></h2>
                </div>
                <form>
                    <div className="grid w-full items-center gap-4">
                        {
                            !addTeam && <Button onClick={(e) => {
                                e.preventDefault();


                                setCountProjects(() => {
                                    if(numberOfTeam === 0) {
                                        toast.error("Số lượng nhóm đã tới giới hạn")
                                        return 0;
                                    }
                                    setAddTeam(true);
                                    setProject({} as Project);
                                    return numberOfTeam - 1
                                });
                            }} size={"sm"} className={"w-1/3"} variant={"default"}><Plus/> Tạo nhóm</Button>
                        }
                        {
                            addTeam &&
                            <div>
                                <Table className={`min-h-[${semester.maxTeamSize * 6}vh]`}>
                                    {/*<TableCaption>Danh sách thành viên trong nhóm</TableCaption>*/}
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Mã số</TableHead>
                                            <TableHead>Họ và tên</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Vai trò</TableHead>
                                            <TableHead>Rời nhóm</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            project?.teamMembers != null && project?.teamMembers.map((member, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{member.user?.code}</TableCell>
                                                    <TableCell>{member.user?.firstName} {member.user?.lastName}</TableCell>
                                                    <TableCell>{member.user?.email}</TableCell>
                                                    <TableCell><Badge variant={member.role == TeamMemberRole.Leader ? "default" : "outline"}>{TeamMemberRole[member.role!]}</Badge></TableCell>
                                                    <TableCell>
                                                        <Button onClick={(e) => {
                                                            e.preventDefault();
                                                           setProject((prevState) => {
                                                               if (!prevState) {
                                                                   return prevState;
                                                               }
                                                               const memberRemove = project.teamMembers.find(member => member.userId == member.userId);
                                                               if (!memberRemove) {
                                                                   return prevState;
                                                               }
                                                               setStudents((prevState) => {
                                                                   const updatedTeamMembers = [...(prevState || [])];
                                                                   if (memberRemove.user)
                                                                    updatedTeamMembers.push(memberRemove.user)
                                                                   return updatedTeamMembers;
                                                               })
                                                               const remaining = project?.teamMembers.filter(student => student.userId != member.userId);

                                                               return {
                                                                   ...prevState,
                                                                   teamMembers: remaining,
                                                               };
                                                           })
                                                        }} variant={"destructive" }>Huỷ</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                    <TableFooter>

                                    </TableFooter>
                                </Table>
                                <div className={"mt-6 flex flex-col gap-2"}>
                                    {
                                        project != null && (
                                           <>
                                               <h2 className={"font-bold text-sm"}>Chọn đề tài cho nhóm: </h2>
                                               <SelectTopic setProject={setProject} topics={topics} />
                                           </>
                                        )
                                    }
                                </div>
                                <div className={"mt-8 flex gap-4"}>
                                    <SaveChangeProjectAddTeamDialog project={project} />
                                    <CancelProjectAddTeamDialog />
                                </div>
                            </div>

                        }
                    </div>
                </form>

            </CardContent>
            <CardFooter className="flex justify-between">

            </CardFooter>
        </Card>
    );
};

export default ProjectAddStudentCard;