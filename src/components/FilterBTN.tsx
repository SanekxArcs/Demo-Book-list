
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useBookContext } from "./BookContext";


const FilterBTN = () => {
  const { filterBtn, setFilterBtn } = useBookContext();

  const handleShowAllClick = () => {
    setFilterBtn({
      all: true,
      active: false,
      deactivated: false,
    });
  };

  const handleShowActiveClick = () => {
    setFilterBtn({
      all: false,
      active: true,
      deactivated: false,
    });
  };

  const handleShowDeactivatedClick = () => {
    setFilterBtn({
      all: false,
      active: false,
      deactivated: true,
    });
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="p-0">
            <DropdownMenuCheckboxItem
              checked={filterBtn.all}
              onCheckedChange={handleShowAllClick}
            >
              Show All
            </DropdownMenuCheckboxItem>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <DropdownMenuCheckboxItem
              checked={filterBtn.active}
              onCheckedChange={handleShowActiveClick}
            >
              Show Active
            </DropdownMenuCheckboxItem>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <DropdownMenuCheckboxItem
              checked={filterBtn.deactivated}
              onCheckedChange={handleShowDeactivatedClick}
            >
              Show Deactivated
            </DropdownMenuCheckboxItem>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FilterBTN;
