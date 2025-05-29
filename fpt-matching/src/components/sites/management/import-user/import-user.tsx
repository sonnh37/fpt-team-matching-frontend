import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {ImportOneCard} from "@/components/sites/management/import-user/import-one-card";
import ImportManyCard from "@/components/sites/management/import-user/import-many-card";
import {Semester} from "@/types/semester";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {semesterService} from "@/services/semester-service";
import {useCurrentSemester} from "@/hooks/use-current-role";
function DropdownSemester({semesters, currentSemester, setCurrentSemester}: {semesters: Semester[], currentSemester: Semester, setCurrentSemester: Dispatch<SetStateAction<Semester | undefined>>}) {
    if(!semesters) return;
    const dictionary: Record<string, Semester> = semesters.reduce(
        (acc, item) => {
            acc[item.id!] = item;
            return acc;
        },
        {} as Record<string, Semester>
    );

    const handleOnChange = (e: string) => {
        setCurrentSemester(dictionary[e])
    }

    return (
        // <DropdownMenu>
        //     <DropdownMenuTrigger value={currentSemester.id!}  className="flex items-center text-red-600 gap-1">
        //         {dictionary[currentSemester.id!].semesterCode} - {dictionary[currentSemester.id!].semesterName} <ChevronDown className="h-4 w-4" />
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align="start">
        //         <DropdownMenuLabel>Chọn kỳ</DropdownMenuLabel>
        //         <DropdownMenuRadioGroup onValueChange={handleOnChange} >
        //             {semesters.map(semester => (
        //                 <DropdownMenuRadioItem key={semester.semesterCode} value={semester.id!}>{semester.semesterCode} - {semester.semesterName}</DropdownMenuRadioItem>
        //             ))}
        //         </DropdownMenuRadioGroup>
        //     </DropdownMenuContent>
        // </DropdownMenu>
        <div className="flex items-center text-red-600 gap-1">
            {currentSemester.semesterCode} - {currentSemester.semesterName}
        </div>
    )
}
const ImportUser = ({role} : {role: string}) => {
    const [currentSemester, setCurrentSemester] = useState<Semester>();
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const wsSemester = useCurrentSemester().currentSemester
    useEffect(() => {

        const fetchData = async () => {
            const fetch_current_semester = await semesterService.getCurrentSemester();
            const fetch_all_semester = await semesterService.getAll();
            if (fetch_all_semester.data && fetch_all_semester.data.results) {
                setSemesters(fetch_all_semester.data.results)
            }
            setCurrentSemester(fetch_current_semester.data)
        }
        fetchData()
    }, []);
    console.log(semesters)
    return semesters.length > 0 && (
        <Tabs defaultValue="one" className="p-8 w-full">
            {
                role == "Student" ? <div className={"flex gap-2 justify-center items-center mb-8"}>
                    Kỳ hiện tại <DropdownSemester currentSemester={wsSemester ?? semesters[0]} setCurrentSemester={setCurrentSemester} semesters={semesters} />
                </div> : null
            }
            <div className={"w-full flex justify-center items-center"}>
                <TabsList className="grid w-1/2 grid-cols-2 items-center">
                    <TabsTrigger value="one">Thêm 1 tài khoản</TabsTrigger>
                    <TabsTrigger value="many">Thêm danh sách tài khoản</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent className={"flex flex-row justify-center items-center"} value="one">
                <ImportOneCard role={role} semesterId={currentSemester?.id ?? semesters[0].id} />
            </TabsContent>
            <TabsContent value="many">
               <ImportManyCard semesterId={currentSemester?.id ?? semesters[0].id} role={role} />
            </TabsContent>
        </Tabs>
    )
};

export default ImportUser;