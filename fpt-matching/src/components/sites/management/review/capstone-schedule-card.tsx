import {usePathname, useRouter} from "next/navigation";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {CapstoneSchedule} from "@/types/capstone-schedule";
import {Badge} from "@/components/ui/badge";
import {TeamMemberStatus} from "@/types/enums/team-member";

export function CapstoneScheduleCard({capstoneSchedule} : {capstoneSchedule: CapstoneSchedule}) {
    const pathName = usePathname()
    const router = useRouter()
    console.log(capstoneSchedule)
    console.log(capstoneSchedule.project?.teamMembers.some(x => x.status == TeamMemberStatus.Pending || x.status == TeamMemberStatus.InProgress || TeamMemberStatus.Fail1 || TeamMemberStatus.Pass1))
    return (
        <Card className="w-[25vw]">
            <CardHeader className={"flex flex-row justify-between items-center"}>
                <CardTitle>Defense {capstoneSchedule.stage}</CardTitle>
                <div>
                    {capstoneSchedule.stage === 1 ? (
                        capstoneSchedule.project?.teamMembers.some(
                            x =>
                                x.status === TeamMemberStatus.Pending ||
                                x.status === TeamMemberStatus.InProgress
                        ) ? (
                            <Badge variant="outline">Not yet</Badge>
                        ) : capstoneSchedule.project?.teamMembers.some(
                            x => x.status !== TeamMemberStatus.Pass1
                        ) ? (
                            <Badge variant="destructive">Fail</Badge>
                        ) : (
                            <Badge className="bg-green-500" variant="outline">Pass</Badge>
                        )
                    ) : capstoneSchedule.stage === 2 ? (
                        capstoneSchedule.project?.teamMembers.some(
                            x =>
                                x.status === TeamMemberStatus.Pending ||
                                x.status === TeamMemberStatus.InProgress ||
                                x.status === TeamMemberStatus.Fail1
                                // x.status === TeamMemberStatus.Pass1
                        ) ? (
                            <Badge variant="outline">Not yet</Badge>
                        ) : capstoneSchedule.project?.teamMembers.some(
                            x => x.status !== TeamMemberStatus.Pass2
                        ) ? (
                            <Badge variant="destructive">Fail</Badge>
                        ) : (
                            <Badge className="bg-green-500" variant="outline">Pass</Badge>
                        )
                    ) : (
                        <div></div>
                    )}

                    {/*{capstoneSchedule.project?.teamMembers.some(x => x.status == TeamMemberStatus.Fail1) || capstoneSchedule.project?.teamMembers.some(x => x.status == TeamMemberStatus.Fail2)*/}
                    {/*    ? <Badge variant={"destructive"}>Fail</Badge>  : capstoneSchedule.project?.teamMembers.some(x => x.status == TeamMemberStatus.Pass1 || x.status == TeamMemberStatus.Pass2) ? <Badge className={"bg-green-500"} variant={"outline"}>Pass</Badge> : <Badge  variant={"outline"}>Not yet</Badge>}*/}
                </div>
            </CardHeader>
            <CardContent className={"flex flex-col gap-2"}>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Date: </div>
                    {capstoneSchedule.date ? <span className={"font-medium"}>{new Date(capstoneSchedule.date).toLocaleDateString("en-GB")}</span> : <Badge variant={"destructive"}>Not yet</Badge>}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Hall name: </div>
                    {capstoneSchedule.hallName ? <span className={"font-medium"}>{capstoneSchedule.hallName}</span> : <Badge variant={"destructive"}>Not yet</Badge>}
                </div>
                <div className={"flex"}>
                    <div className={"pr-2 min-w-16 font-bold"}>Time: </div>
                    {capstoneSchedule.time? <span className={"font-medium"}>{capstoneSchedule.time}</span> :  <Badge variant={"destructive"}>Not yet</Badge>}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={() => {
                    router.push(`${pathName}/defense-details?defenseId=${capstoneSchedule.id}`)
                }}>View details</Button>
            </CardFooter>
        </Card>
    )
}