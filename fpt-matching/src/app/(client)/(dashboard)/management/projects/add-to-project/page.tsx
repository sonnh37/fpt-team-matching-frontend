'use client'
import React, {useEffect} from 'react';
import {toast} from "sonner";
import { useCurrentSemesterId} from "@/hooks/use-current-role";
import {userService} from "@/services/user-service";
import {User} from "@/types/user";
import {StudentTable} from "@/components/sites/management/student-do-not-have-team/table/student-table";
import {columnsStudentTable} from "@/components/sites/management/student-do-not-have-team/table/column-type-user-table";
import {Label} from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ProjectAddStudentCard
    from "@/components/sites/management/student-do-not-have-team/project-add-student-card/project-add-student-card";
const Page = () => {
    const [students, setStudents] = React.useState<User[]>([]);
    const semesterId = useCurrentSemesterId()

    useEffect(() => {
        const fetchStudentDoNotHaveTeam = async () => {
            if (!semesterId)
                return;
            const response = await userService.getStudentDoNotHaveTeam({semesterId: semesterId})
            if (response.status != 1) {
                toast.error(response.message)
            }
            if (response.data) {
                setStudents(response.data)
            }
        }
        fetchStudentDoNotHaveTeam()
    }, [semesterId]);
    if (!semesterId) {
        return null
    }
    return students.length > 0 && (
        <div className={"flex gap-8 w-full"}>
            <div className={"w-[70%]"}>
                <div className={"my-6"}>
                    <Label className={"font-bold text-xl "}>Danh sách sinh viên chưa có nhóm</Label>
                </div>
                <StudentTable columns={columnsStudentTable} data={students} />
            </div>
            <div className={"mt-[4.6rem]"}>
                <ProjectAddStudentCard />
            </div>
        </div>
    );
};

export default Page;