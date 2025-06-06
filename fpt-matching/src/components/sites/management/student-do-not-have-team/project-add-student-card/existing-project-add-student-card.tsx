import React, {Dispatch, SetStateAction} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

import {Button} from "@/components/ui/button";
import {Project} from "@/types/project";

import {User} from '@/types/user';

import {TeamMemberRole} from "@/types/enums/team-member";
import {Badge} from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Label} from '@/components/ui/label';
import SaveChangeExistingProjectAddTeamDialog
    from "@/components/sites/management/student-do-not-have-team/project-add-student-card/save-change-existing-project-add-team-dialog";
import {TeamMember} from "@/types/team-member";
import {Semester} from "@/types/semester";
import {ProjectStatus} from "@/types/enums/project";
import {Topic} from '@/types/topic';
import {ViewTopicDetail} from "@/components/sites/management/student-do-not-have-team/view-detail/view-topic-detail";
import {
    CancelExistingProjectDialog
} from "@/components/sites/management/student-do-not-have-team/project-add-student-card/cancel-existing-project-dialog";
import {toast} from "sonner";
import {teammemberService} from "@/services/team-member-service";
import {projectService} from "@/services/project-service";
import {ProjectUpdateCommand} from "@/types/models/commands/projects/project-update-command";

function SelectTopic({topics, setProject, project, setTopics} : {topics: Topic[], setProject: Dispatch<SetStateAction<Project | null>>, project: Project, setTopics: Dispatch<SetStateAction<Topic[]>>}) {
    return (
        <Select value={project.topicId ?? undefined} onValueChange={(value) => {
            setProject((prevState) => {
                const updatedProject = {...prevState ?? {} as Project};
                updatedProject.topicId = value;

                const foundTopic = topics.find(x => x.id === value)
                if (foundTopic) {
                    updatedProject.topic = foundTopic;
                }

                return updatedProject;
            })
        }}>
            <SelectTrigger className="w-[20rem]">
                <SelectValue placeholder="Chọn đề tài" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Đề tài</SelectLabel>
                    {topics.map((topic, index) => (
                        <SelectItem disabled={topic.isExistedTeam} key={index} value={topic.id ?? ""}>{topic.englishName}  - {topic.topicCode}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
const ExistingProjectAddStudentCard = ({setStudents, projects, project, setProject, updatedTeamMembers, semester, topics, setTopics}: {
    projects: Project[],
    project: Project | null,
    setProject: Dispatch<SetStateAction<Project | null>>,
    setStudents: Dispatch<SetStateAction<User[]>>,
    updatedTeamMembers: TeamMember[]
    semester: Semester,
    topics: Topic[],
    setTopics: Dispatch<SetStateAction<Topic[]>>
}) => {
    const [addTeam, setAddTeam] = React.useState(false);

    const handleRemoveTeamMember = async (member: TeamMember) => {
        if (!project)
            return;
        const foundExistingStudent = updatedTeamMembers.some(x => x.userId == member.userId);
        console.log(foundExistingStudent)

        if (member.role == TeamMemberRole.Leader) {
            toast.error("Bạn không thể huỷ nhóm trưởng của nhóm")
            return;
        }

        if (foundExistingStudent) {
            setProject((prevState) => {
                console.log(prevState)
                if (prevState == null) {
                    return prevState;
                }

                // Sửa lại logic tìm member - đang bị trùng tên biến
                const memberRemove = prevState.teamMembers.find(teamMember => teamMember.userId == member.userId);
                console.log(memberRemove)
                if (memberRemove == null) {
                    return prevState;
                }

                // Cập nhật students list
                setStudents((prevStudents) => {
                    console.log("Previous students:", prevStudents);
                    console.log("Adding user:", memberRemove.user);

                    if (memberRemove.user != null) {
                        const updatedStudents = [...(prevStudents || []), memberRemove.user];
                        console.log("Updated students:", updatedStudents);
                        return updatedStudents;
                    }
                    return prevStudents;
                });

                // Remove từ team members
                const remaining = prevState.teamMembers.filter(student => student.userId != member.userId);

                return {
                    ...prevState,
                    teamMembers: remaining,
                };
            });

            toast.success("Xoá thành viên thành công");
            return;
        } else {
            member.leaveDate = new Date(Date.now());
            const response = await teammemberService.update(member);
            const response2 = await projectService.update({
                ...project,
                teamSize: (project.teamSize ?? 0) - 1
            } as ProjectUpdateCommand)
            if (response.status != 1){
                toast.error(response.message);
                return;
            }

            setStudents((prevStudents) => {
                console.log("Previous students (else block - API success):", prevStudents);
                console.log("Adding user (else block - API success):", member.user);

                if (member.user != null) {
                    const updatedStudents = [...(prevStudents || []), member.user];
                    console.log("Updated students (else block - API success):", updatedStudents);
                    return updatedStudents;
                }
                return prevStudents;
            });

            toast.success(response.message);
            return;
        }
    }
    return (
        <Card className="w-[30vw]">
            <CardHeader>
                <CardTitle>Nhóm chưa chốt</CardTitle>
                <CardDescription>Thêm sinh viên vào nhóm chưa chốt tại đây</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="pb-4">
                    <Label>Chọn nhóm để thêm sinh viên</Label>
                    <Select
                        onValueChange={(value) => {
                            const selectedProject = projects.find((selectedProject) => selectedProject.id == value);
                            if (selectedProject != null) {
                                setProject(selectedProject);
                            }
                            setAddTeam(true);
                        }}
                    >
                        <SelectTrigger className="w-[70%]">
                            <SelectValue placeholder="Chọn nhóm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Nhóm</SelectLabel>
                                {projects.map((project) => (
                                    (project.status == ProjectStatus.Pending || project.status == ProjectStatus.Forming) &&
                                    <SelectItem key={project.teamCode} value={project.id!}>
                                        {project.teamCode}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <form>
                    <div className="grid w-full items-center gap-4">
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
                                            project?.teamMembers != null && project?.teamMembers.filter((x => x.leaveDate== null )).map((member, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{member.user?.code}</TableCell>
                                                    <TableCell>{member.user?.firstName} {member.user?.lastName}</TableCell>
                                                    <TableCell>{member.user?.email}</TableCell>
                                                    <TableCell><Badge variant={member.role == TeamMemberRole.Leader ? "default" : "outline"}>{TeamMemberRole[member.role!]}</Badge></TableCell>
                                                    <TableCell>
                                                        {
                                                            <Button onClick={(e) => {
                                                                e.preventDefault();
                                                                handleRemoveTeamMember(member)
                                                            }} variant={"destructive" }>Huỷ</Button>
                                                        }
                                                    </TableCell>
                                                    {/*<TableCell>*/}
                                                    {/*    {updatedTeamMembers?.some(student => student.id === member.userId || student.userId === member.userId) && (*/}
                                                    {/*        <Button onClick={(e) => {*/}
                                                    {/*            e.preventDefault();*/}
                                                    {/*            setProject((prevState) => {*/}
                                                    {/*                if (!prevState) {*/}
                                                    {/*                    return prevState;*/}
                                                    {/*                }*/}
                                                    {/*                const memberRemove = project.teamMembers.find(teamMember => teamMember.userId == member.userId);*/}
                                                    {/*                if (!memberRemove) {*/}
                                                    {/*                    return prevState;*/}
                                                    {/*                }*/}
                                                    {/*                setStudents((prevState) => {*/}
                                                    {/*                    const updatedTeamMembers = [...(prevState || [])];*/}
                                                    {/*                    if (memberRemove.user)*/}
                                                    {/*                        updatedTeamMembers.push(memberRemove.user)*/}
                                                    {/*                    return updatedTeamMembers;*/}
                                                    {/*                })*/}
                                                    {/*                const remaining = project?.teamMembers.filter(student => student.userId != member.userId);*/}

                                                    {/*                return {*/}
                                                    {/*                    ...prevState,*/}
                                                    {/*                    teamMembers: remaining,*/}
                                                    {/*                };*/}
                                                    {/*            })*/}
                                                    {/*        }} variant={"destructive"}>*/}
                                                    {/*            Huỷ*/}
                                                    {/*        </Button>*/}
                                                    {/*    )}*/}
                                                    {/*</TableCell>*/}
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                    <TableFooter>

                                    </TableFooter>
                                </Table>
                                <div className={"mt-6"}>
                                    <h2 className={"font-bold text-sm mb-2"}>Chọn đề tài cho nhóm: </h2>
                                    <div className={"flex gap-3"}>
                                        {
                                            project && <SelectTopic setTopics={setTopics} project={project} topics={topics} setProject={setProject} />
                                        }
                                        {project?.topic &&  <ViewTopicDetail topic={project.topic}  />}
                                    </div>
                                </div>
                                <div className={"mt-8 flex gap-4"}>
                                    <SaveChangeExistingProjectAddTeamDialog updatedTeamMember={updatedTeamMembers} project={project} />
                                    {/*<CancelProjectAddTeamDialog />*/}
                                    {project && <CancelExistingProjectDialog projectId={project.id!} />}
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

export default ExistingProjectAddStudentCard;