import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";



export function Search() {
  const [inputValue, setInputValue] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Chặn reload trang
    window.location.href = `/social/blog/search/${inputValue}`;
  };
  return (
    <div className="relative flex items-center justify-center">
      <SearchIcon className="absolute left-3 text-gray-500" />
      <form onSubmit={handleSubmit} className="w-full">
      <Input
        type="text"
        className="pl-10 border-none"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </form>
    </div>
  );
}
