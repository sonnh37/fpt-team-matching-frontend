import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {TeamMember} from "@/types/team-member";
import {MentorConclusionOptions, TeamMemberStatus} from "@/types/enums/team-member";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {
    TeamMemberUpdateDefenseCommand
} from "@/types/models/commands/team-members/team-member-update-defense";
import React, {useEffect, useState} from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Loader2} from "lucide-react";
import {teammemberService} from "@/services/team-member-service";
import { toast } from "sonner";
import {useCurrentRole} from "@/hooks/use-current-role";

function DialogSaveChange({teamMemberUpdateDefense, stage} : {teamMemberUpdateDefense: TeamMemberUpdateDefenseCommand[], stage:number}) {
    const [loading, setLoading] = useState(false);
    const handleSaveChange = async () => {
        setLoading(true)
        const response = await teammemberService.updateDefenseByManager({teamMemberUpdate: teamMemberUpdateDefense, stage})
        if (response && response.status == 1){
            toast.success("Successfully updated");
        } else{
            toast.error(response.message);
        }
        setLoading(false)
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"w-[10vw]"} variant="default">Lưu thông tin</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật thông tin bảo vệ đồ án</DialogTitle>
                    <DialogDescription>
                        Hãy kiểm tra lại dữ liệu chính xác trước khi tiếp tục lưu.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {loading ? (
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button>
                        ) : (
                        <Button onClick={()=> {handleSaveChange()}}>Tiếp tục lưu</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function DefenseTeamMembersTable({sinhViens, stage}: {sinhViens: TeamMember[], stage: number}) {
    const [teamMemberUpdateDefense, setTeamMemberUpdateDefense] = useState<TeamMemberUpdateDefenseCommand[]>();
    const [dictionary, setDictionary] = useState<Record<string, TeamMemberUpdateDefenseCommand> | null>(null)
    const currentRole = useCurrentRole()
    useEffect(() => {
        const listTeamMemberUpdateDefense :TeamMemberUpdateDefenseCommand[] = [] as TeamMemberUpdateDefenseCommand[];
        sinhViens.map((x) => {
            listTeamMemberUpdateDefense.push({
                id: x.id,
                commentDefense: stage == 1 ? x.commentDefense1 : x.commentDefense2,
                status: x.status,
            })
        })


        setTeamMemberUpdateDefense(listTeamMemberUpdateDefense)
    }, [sinhViens]);

    useEffect(() => {
       if (teamMemberUpdateDefense && teamMemberUpdateDefense.length > 0) {
           const newDictionary: Record<string, TeamMemberUpdateDefenseCommand> = teamMemberUpdateDefense.reduce(
               (acc, item) => {
                   acc[item.id!] = item;
                   return acc;
               },
               {} as Record<string, TeamMemberUpdateDefenseCommand>
           );
           setDictionary(newDictionary)
       }
    }, [teamMemberUpdateDefense])


    return dictionary && teamMemberUpdateDefense && teamMemberUpdateDefense.length > 0 &&(
        <>
            <div className="border rounded-lg p-4 shadow-sm bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={"text-center"}>#</TableHead>
                            <TableHead className={"text-center"}>MSSV</TableHead>
                            <TableHead className={"text-center"}>Tên</TableHead>
                            <TableHead className={"text-center"}>Quyết định của mentor</TableHead>
                            <TableHead className={"text-center"}>Thái độ</TableHead>
                            <TableHead className={"text-center"}>Note của mentor</TableHead>
                            <TableHead className={"text-center"}>Note của bảo vệ lần {stage}</TableHead>
                            <TableHead className={"text-center"}>Quyết định của bảo vệ lần {stage}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sinhViens.map((sinhVien, index) => (
                            <TableRow className={"items-center"} key={sinhVien.id}>
                                <TableCell aria-readonly={true} className={"text-center"}>{index + 1}</TableCell>
                                <TableCell aria-readonly={true} className={"text-center"}>{sinhVien.user?.code}</TableCell>
                                <TableCell aria-readonly={true} className={"text-center"}>{sinhVien.user && sinhVien.user.firstName! + sinhVien.user.lastName}</TableCell>
                                <TableCell aria-readonly={true} className="text-center">
                                    {MentorConclusionOptions[sinhVien.mentorConclusion!]?.replaceAll("_", " ")}
                                </TableCell>

                                <TableCell>
                                    <Textarea
                                        readOnly={true}
                                        defaultValue={sinhVien.attitude ?? ""}
                                        className={"border-2 border-gray-400"}  />
                                </TableCell>
                                <TableCell>
                                    <Textarea
                                        readOnly={true}
                                        defaultValue={sinhVien.note ?? ""}
                                        className={"border-2 border-gray-400"}  />
                                </TableCell>
                                <TableCell>
                                    <Textarea
                                        disabled={currentRole == "Student"}
                                        onChange={(e) => {
                                            setTeamMemberUpdateDefense((prev) => {
                                                return prev!.map(x =>
                                                    x.id === sinhVien.id
                                                        ? {...x, commentDefense: e.target.value}
                                                        : x)
                                            })
                                        }}
                                        value={dictionary[sinhVien.id!].commentDefense ?? undefined}
                                        className={"border-2 border-gray-400"}  />
                                </TableCell>
                                <TableCell>
                                    {currentRole == "Student" ? (
                                        <RadioGroup
                                            disabled={true}
                                            aria-readonly={true}
                                            className={"flex flex-row items-center justify-center"}
                                            defaultValue={dictionary[sinhVien.id!].status ? dictionary[sinhVien.id!].status!.toString() : undefined }
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value={stage == 1 ? TeamMemberStatus.Pass1.toString() : TeamMemberStatus.Pass2.toString()}
                                                    id="r1" />
                                                <Label htmlFor="r1">Pass</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value={stage == 1 ? TeamMemberStatus.Fail1.toString() : TeamMemberStatus.Fail2.toString()}
                                                    id="r2" />
                                                <Label htmlFor="r2">Fail</Label>
                                            </div>
                                        </RadioGroup>
                                        ) : (
                                        <RadioGroup
                                            className={"flex flex-row items-center justify-center"}
                                            defaultValue={dictionary[sinhVien.id!].status ? dictionary[sinhVien.id!].status!.toString() : undefined }
                                            onValueChange={(e) => {
                                                setTeamMemberUpdateDefense((prev) => {
                                                    return prev!.map(x =>
                                                        x.id === sinhVien.id
                                                            ? {...x, status: parseInt(e)}
                                                            : x)
                                                })
                                            }}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value={stage == 1 ? TeamMemberStatus.Pass1.toString() : TeamMemberStatus.Pass2.toString()}
                                                    id="r1" />
                                                <Label htmlFor="r1">Pass</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value={stage == 1 ? TeamMemberStatus.Fail1.toString() : TeamMemberStatus.Fail2.toString()}
                                                    id="r2" />
                                                <Label htmlFor="r2">Fail</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {currentRole == "Student" ? <div></div> :  <DialogSaveChange stage={stage} teamMemberUpdateDefense={teamMemberUpdateDefense} />}
        </>
    );
}
