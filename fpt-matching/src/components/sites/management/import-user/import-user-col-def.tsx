import { ColumnDef } from "@tanstack/react-table"
import ImportUserModels from "@/types/models/import-user-models";
export const ImportUserColDef: ColumnDef<ImportUserModels>[] = [
    {
        accessorKey: "STT",
        header: "STT",
    },
    {
        accessorKey: "Code",
        header: "Mã người dùng",
    },
    {
        accessorKey: "Email",
        header: "Email",
    },
    {
        accessorKey: "First name",
        header: "Họ",
    },
    {
        accessorKey: "Last name",
        header: "Tên",
    },
]