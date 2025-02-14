import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

export function Search() {
  return (
    <div className="relative flex items-center">
      <SearchIcon className="absolute left-3 text-gray-500" />
      <Input
        type="text"
        className="pl-10 border-none"
        placeholder="Search..."
      />
    </div>
  );
}
