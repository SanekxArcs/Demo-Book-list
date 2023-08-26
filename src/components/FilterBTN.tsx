
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterBTNProps {
  all: boolean;
  active: boolean;
  deactivated: boolean;
  handleShowAllClick: () => void;
  handleShowActiveClick: () => void;
  handleShowDeactivatedClick: () => void;
}

const FilterBTN: React.FC<FilterBTNProps> = ({
  all,
  active,
  deactivated,
  handleShowAllClick,
  handleShowActiveClick,
  handleShowDeactivatedClick,
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DropdownMenuCheckboxItem
              checked={all}
              onCheckedChange={handleShowAllClick}
            >
              Show All
            </DropdownMenuCheckboxItem>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuCheckboxItem
              checked={active}
              onCheckedChange={handleShowActiveClick}
            >
              Show Active
            </DropdownMenuCheckboxItem>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DropdownMenuCheckboxItem
              checked={deactivated}
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
