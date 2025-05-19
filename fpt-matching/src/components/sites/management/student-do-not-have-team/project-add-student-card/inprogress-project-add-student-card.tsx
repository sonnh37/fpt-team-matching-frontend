import React, {Dispatch, SetStateAction} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,} from "@/components/ui/table"

import {Button} from "@/components/ui/button";
import {Project} from "@/types/project";

import {User} from '@/types/user';
import {
    CancelProjectAddTeamDialog
} from "@/components/sites/management/student-do-not-have-team/project-add-student-card/cancel-project-add-team-dialog";
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

const InprogressProjectAddStudentCard = ({setStudents, projects, project, setProject, updatedTeamMembers, semester}: {
    projects: Project[],
    project: Project | null,
    setProject: Dispatch<SetStateAction<Project | null>>,
    setStudents: Dispatch<SetStateAction<User[]>>,
    updatedTeamMembers: TeamMember[]
    semester: Semester
}) => {
    const [addTeam, setAddTeam] = React.useState(false);
    return (
        <Card className="w-[30vw]">
            <CardHeader>
                <CardTitle>Nhóm đã chốt</CardTitle>
                <CardDescription>Thêm sinh viên vào nhóm đã chốt tại đây</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="pb-4">
                    <Label>Chọn nhóm để thêm sinh viên</Label>
                    <Select
                        onValueChange={(value) => {
                            const selectedProject = projects.find((selectedProject) => selectedProject.id === value);
                            if (selectedProject) {
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
                                    project.status == ProjectStatus.InProgress && project.topic && (
                                        <SelectItem key={project.teamCode} value={project.id!}>
                                            {project.teamCode}
                                        </SelectItem>
                                    )
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
                                            project?.teamMembers != null && project?.teamMembers.map((member, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{member.user?.code}</TableCell>
                                                    <TableCell>{member.user?.firstName} {member.user?.lastName}</TableCell>
                                                    <TableCell>{member.user?.email}</TableCell>
                                                    <TableCell><Badge variant={member.role == TeamMemberRole.Leader ? "default" : "outline"}>{TeamMemberRole[member.role!]}</Badge></TableCell>
                                                    <TableCell>
                                                        {
                                                            updatedTeamMembers.some(x => x.userId == member.userId) ? <Button onClick={(e) => {
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
                                                            }} variant={"destructive" }>Huỷ</Button> : null
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                    <TableFooter>

                                    </TableFooter>
                                </Table>
                                <div className={"mt-6"}>
                                    <h2 className={"font-bold text-sm"}>Đề tài của nhóm: </h2>
                                    {/*<SelectTopic />*/}
                                </div>
                                <div className={"mt-8 flex gap-4"}>
                                    <SaveChangeExistingProjectAddTeamDialog updatedTeamMember={updatedTeamMembers} project={project} />
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

export default InprogressProjectAddStudentCard;