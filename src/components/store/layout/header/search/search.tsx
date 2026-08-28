import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  return (
    <div className="relative lg:w-full flex-1">
      <form className="h-10 rounded-3xl bg-muted relative border-none flex">
        <input
          type="text"
          placeholder="Search..."
          className="bg-muted text-secondary-foreground flex-1 border-none pl-2.5 m-2.5 outline-none"
        />
        <button
          type="submit"
          className="border rounded-3xl w-14 h-8 mt-1 mr-1 mb-0 ml-0 bg-gradient-to-r from-primary-light to bg-primary-light-shade grid place-items-center cursor-pointer"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
}
