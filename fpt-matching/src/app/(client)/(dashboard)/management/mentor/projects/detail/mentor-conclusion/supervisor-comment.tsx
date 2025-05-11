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
                            <TableCell>{sinhVien.user && sinhVien.user.lastName! + " " + sinhVien.user.firstName}</TableCell>
                            <TableCell className={""}>
                                <input
                                    checked={MentorConclusionOptions[sinhVien.mentorConclusion!] == "Agree_to_defense" ? true : false}
                                    onChange={() => {
                                        setSinhViens((prev) => {
                                            return prev.map(x =>
                                                x.id === sinhVien.id
                                                    ? {...x, mentorConclusion: MentorConclusionOptions.Agree_to_defense}
                                                    : x)
                                        })
                                    }}
                                    type={"radio"} name={`${sinhVien.id}`} className={" border-2 border-gray-400"} />
                            </TableCell>
                            <TableCell>
                                <input
                                    checked={sinhVien.mentorConclusion ? sinhVien.mentorConclusion  as MentorConclusionOptions === MentorConclusionOptions.Revised_for_the_second_defense : false}
                                    onChange={() => {
                                        setSinhViens((prev) => {
                                            return prev.map(x =>
                                                x.id === sinhVien.id
                                                    ? {...x, mentorConclusion: MentorConclusionOptions.Revised_for_the_second_defense}
                                                    : x)
                                        })
                                    }}
                                    type={"radio"}  name={`${sinhVien.id}`} className={" border-2 border-gray-400"} />
                            </TableCell>
                            <TableCell>
                                <input
                                    checked={sinhVien.mentorConclusion ? sinhVien.mentorConclusion as MentorConclusionOptions === MentorConclusionOptions.Disagree_to_defense : false}
                                    onChange={() => {
                                        setSinhViens((prev) => {
                                            return prev.map(x =>
                                                x.id === sinhVien.id
                                                    ? {...x, mentorConclusion: MentorConclusionOptions.Disagree_to_defense}
                                                    : x)
                                        })
                                    }}
                                    type={"radio"}  name={`${sinhVien.id}`} className={" border-2 border-gray-400"} />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={sinhVien.attitude ?? ""}
                                    onChange={(e) => {
                                        setSinhViens((prev) => {
                                            return prev.map(x =>
                                                x.id === sinhVien.id
                                                    ? {...x, attitude: e.target.value}
                                                    : x)
                                        })
                                    }}
                                    type={"text"} className={"border-2 border-gray-400"}  />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={sinhVien.note ?? ""}
                                    onChange={(e) => {
                                        setSinhViens((prev) => {
                                            return prev.map(x =>
                                                x.id === sinhVien.id
                                                    ? {...x, note: e.target.value}
                                                    : x)
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
