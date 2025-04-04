import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {TeamMember} from "@/types/team-member";
import {Dispatch, SetStateAction} from "react";
import {MentorConclusionOptions} from "@/types/enums/team-member";

export default function SupervisorComment({sinhViens, setSinhViens}: {sinhViens: TeamMember[], setSinhViens: Dispatch<SetStateAction<TeamMember[]>>}) {
    return (
        <div className="border mt-8 rounded-lg p-4 shadow-sm bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Roll</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className={""} >Agree to Defense</TableHead>
                        <TableHead className={""}>Revised for Second Defense</TableHead>
                        <TableHead className={""}>Disagree to Defense</TableHead>
                        <TableHead>Attitude</TableHead>
                        <TableHead>Note</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sinhViens.map((sinhVien, index) => (
                        <TableRow key={sinhVien.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{sinhVien.user?.code}</TableCell>
                            <TableCell>{sinhVien.user && sinhVien.user.firstName! + sinhVien.user.lastName}</TableCell>
                            <TableCell className={""}>
                                <input
                                    onClick={() => {
                                        setSinhViens((prev) => {
                                            prev.filter(x =>x.id == sinhVien.id)[0].mentorConclusion = MentorConclusionOptions.Agree_to_defense
                                            return prev
                                        })
                                    }}
                                    type={"radio"} name={`${sinhVien.id}`} className={" border-2 border-gray-400"} />
                            </TableCell>
                            <TableCell>
                                <input
                                    onClick={() => {
                                        setSinhViens((prev) => {
                                            prev.filter(x =>x.id == sinhVien.id)[0].mentorConclusion = MentorConclusionOptions.Revised_for_the_second_defense
                                            return prev
                                        })
                                    }}
                                    type={"radio"}  name={`${sinhVien.id}`} className={" border-2 border-gray-400"} />
                            </TableCell>
                            <TableCell>
                                <input
                                    onClick={() => {
                                        setSinhViens((prev) => {
                                            prev.filter(x =>x.id == sinhVien.id)[0].mentorConclusion = MentorConclusionOptions.Disagree_to_defense
                                            return prev
                                        })
                                    }}
                                    type={"radio"}  name={`${sinhVien.id}`} className={" border-2 border-gray-400"} />
                            </TableCell>
                            <TableCell>
                                <Input
                                    onChange={(e) => {
                                        setSinhViens((prev) => {
                                            prev.filter(x =>x.id == sinhVien.id)[0].attitude = e.target.value
                                            return prev
                                        })
                                    }}
                                    type={"text"} className={"border-2 border-gray-400"}  />
                            </TableCell>
                            <TableCell>
                                <Input
                                    onChange={(e) => {
                                        setSinhViens((prev) => {
                                            prev.filter(x =>x.id == sinhVien.id)[0].note = e.target.value
                                            return prev
                                        })
                                    }}
                                    type={"text"} className={"border-2 border-gray-400"}  />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
