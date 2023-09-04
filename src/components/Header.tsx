import { useBookContext } from "@/components/BookContext";
import FilterBTN from "./FilterBTN";
import { ModeToggle } from "./ui/mode-toggle";
import ChangeBookState from "./ChangeBookState";

const Header = () => {
  const { filteredNumber, booksNumber} =
    useBookContext();
  return (
    <>
      <header className="flex items-center justify-between gap-2 px-2 md:py-5 md:px-10 md:flex-row">
        <div>
          <h1 className="text-xl font-bold md:text-3xl">Demo Book List</h1>
          <p>
            Showing {filteredNumber || 0} of
            <span> {booksNumber || 0}</span>
          </p>
        </div>
        <div className="flex flex-col justify-end gap-5 smxl:flex-row">
          <FilterBTN />
          <ChangeBookState typeOfDialog={"add"} />
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
