'use client'
import React, {useEffect} from 'react';
import {toast} from "sonner";
import {useCurrentSemester, useCurrentSemesterId} from "@/hooks/use-current-role";
import {userService} from "@/services/user-service";
import {User} from "@/types/user";
import {StudentTable} from "@/components/sites/management/student-do-not-have-team/table/student-table";
import {columnsStudentTable} from "@/components/sites/management/student-do-not-have-team/table/column-type-user-table";

import ProjectAddStudentCard
    from "@/components/sites/management/student-do-not-have-team/project-add-student-card/project-add-student-card";
import {projectService} from "@/services/project-service";
import { Project } from '@/types/project';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ExistingProjectAddStudentCard
    from "@/components/sites/management/student-do-not-have-team/project-add-student-card/existing-project-add-student-card";
import { TeamMember } from '@/types/team-member';
import InprogressProjectAddStudentCard
    from "@/components/sites/management/student-do-not-have-team/project-add-student-card/inprogress-project-add-student-card";
import {Topic} from "@/types/topic";
import {topicService} from "@/services/topic-service";


const Page = () => {
    const [students, setStudents] = React.useState<User[]>([]);
    const [projects, setProjects] = React.useState<Project[]>([])
    const [countProject, setCountProject] = React.useState(0);
    const [project, setProject] = React.useState<Project | null>(null);
    const [teamMembersUpdated, setTeamMembersUpdated] = React.useState<TeamMember[]>([]);
    const [topics, setTopics] = React.useState<Topic[]>([]);

    const semester = useCurrentSemester()
    const semesterId = useCurrentSemesterId()
    useEffect(() => {
        if (!project?.teamMembers)
            return;
        const memberIds = project.teamMembers.map(member => member.userId);
        const remaining = students.filter(student => !memberIds.includes(student.id));

        setStudents(remaining);
    }, [project]);

    useEffect(() => {
        setTeamMembersUpdated([])
    }, [project?.id]);
    useEffect(() => {
        const fetchStudentDoNotHaveTeam = async () => {
            if (!semesterId)
                return;
            const response = await userService.getStudentDoNotHaveTeam({semesterId: semesterId})
            if (response.status != 1) {
                toast.error(response.message)
                return;
            }
            if (response.data) {
                setStudents(response.data)
            }
        }
        const fetchProjectNotCancel = async () => {
            const response = await projectService.getProjectNotCanceled()
            if (response.status != 1) {
                toast.error(response.message)
                return;
            }
            if (response.data) {
                setProjects(response.data)
                if (semester.currentSemester)
                    setCountProject(semester.currentSemester.numberOfTeam - response.data.length)
            }
        }
        const fetchTopic = async () => {
            const response = await topicService.getApprovedTopicsDoNotHaveTeam();
            if (response.status != 1){
                toast.error(response.message)
                return;
            }
            if (response.data) {
                setTopics(response.data)
            }
        }
        fetchProjectNotCancel()
        fetchStudentDoNotHaveTeam()
        fetchTopic();

    }, [semester.currentSemester, semester.currentSemester?.id, semesterId]);

    if (!semester.currentSemester?.id) {
        return null
    }
    return (
            <div className={"flex gap-8 w-full"}>
                <div className={"w-[70%]"}>
                    <div className={"my-6"}>
                        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
                            Danh sách sinh viên chưa có nhóm
                        </h1>
                    </div>
                    {semester &&  <StudentTable columns={columnsStudentTable({setProject, currentSemester: semester.currentSemester, setTeamMemberUpdated: setTeamMembersUpdated})} data={students} />}
                </div>
                <div className={"mt-[4.6rem]"}>
                    { (
                        <Tabs defaultValue="create-team" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="create-team">Tạo nhóm mới</TabsTrigger>
                                <TabsTrigger value="create-existing-team">Thêm vào nhóm chưa chốt</TabsTrigger>
                                <TabsTrigger value="create-inprogress-team">Thêm vào nhóm đã chốt</TabsTrigger>
                            </TabsList>
                            <TabsContent value="create-team">
                                <ProjectAddStudentCard topics={topics} semester={semester.currentSemester} setStudents={setStudents} projects={projects} numberOfTeam={countProject} setCountProjects={setCountProject} project={project} setProject={setProject}  />
                            </TabsContent>
                            <TabsContent value="create-existing-team">
                                <ExistingProjectAddStudentCard semester={semester.currentSemester} updatedTeamMembers={teamMembersUpdated}  project={project} setProject={setProject} setStudents={setStudents} projects={projects}  />
                            </TabsContent>
                            <TabsContent value="create-inprogress-team">
                                <InprogressProjectAddStudentCard semester={semester.currentSemester} updatedTeamMembers={teamMembersUpdated}  project={project} setProject={setProject} setStudents={setStudents} projects={projects}  />
                            </TabsContent>
                        </Tabs>
                        )}
                </div>
            </div>
    );
};

export default Page;