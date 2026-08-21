import { Search as SearchIcon } from "lucide-react";
export default function Search() {
  return (
    <div className="relative lg:w-full flex-1">
      <form className="h-10 rounded-3xl bg-secondary relative border-none flex">
        <input
          type="text"
          placeholder="Search..."
          className="bg-secondary flex-1 border-none pl-2.5 m-2.5 outline-none"
        />
        <button
          type="submit"
          className="border-[1px] rounded-[20px] w-[56px] h-8 mt-1 mr-1 mb-0 ml-0 bg-gradient-to-l from-primary-light to-bg-primary/60 grid place-items-center cursor-pointer"
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
}
