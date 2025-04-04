import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {TeamMember} from "@/types/team-member";

export default function SupervisorComment({sinhViens}: {sinhViens: TeamMember[]}) {
    return (
        <div className="border mt-8 rounded-lg p-4 shadow-sm bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Roll</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead >Agree to Defense</TableHead>
                        <TableHead >Revised for Second Defense</TableHead>
                        <TableHead >Disagree to Defense</TableHead>
                        <TableHead>Attitude</TableHead>
                        <TableHead>Note</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sinhViens.map((sinhVien, index) => (
                        <TableRow key={sinhVien.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="text-blue-600">{sinhVien.user?.code}</TableCell>
                            <TableCell>{sinhVien.user && sinhVien.user.firstName! + sinhVien.user.lastName}</TableCell>
                            <TableCell className={""}>
                                <Input type={"checkbox"} className={"w-[1.5vw] h-[1.5vw]"} />
                            </TableCell>
                            <TableCell>
                                <Input type={"checkbox"} className={"w-[1.5vw] h-[1.5vw]"} />
                            </TableCell>
                            <TableCell>
                                <Input type={"checkbox"} className={"w-[1.5vw] h-[1.5vw]"} />
                            </TableCell>
                            <TableCell>
                                <Input type={"text"}  />
                            </TableCell>
                            <TableCell>
                                <Input type={"text"}  />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
