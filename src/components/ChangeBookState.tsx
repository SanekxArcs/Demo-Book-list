import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, ChevronLeft, Save, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogClose } from "@radix-ui/react-dialog";
import { useBookContext } from "@/components/BookContext";
import { ChangeEvent } from "react";

interface ChangeBookStateProps {
  typeOfDialog: "edit" | "add";
  book?:
    | {
        id: string;
        title: string;
        author: string;
        category: string;
        isbn: number;
        createdAt: string;
        modifiedAt: string | null;
        isActive: boolean;
      }
    | undefined;
}

const ChangeBookState: React.FC<ChangeBookStateProps> = ({book, typeOfDialog }) => {
  const {
    categories,
    bookState,
    setBookState,
    btnDisabled,
    bookErrors,
    setBookErrors,
    handleAddClick,
    handleEditClick,
  } = useBookContext();

  const handleAddOrEditBook = () => {
    typeOfDialog === "edit" ? handleEditClick() : handleAddClick();};

  const handleStateChange = (name: string, value: string | number) => {
    setBookState((prev) => {
      return { ...prev, [name]: value };
    });

    setBookErrors((prev) => {
      const isError = !value || value.toString().length <= 3;
      return { ...prev, [`${name}Error`]: isError };
    });
  };

  const handleChangeEditBookState = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleStateChange(name, value);
  };

  const handleEditCategory = (e: string) => {
    console.log(e)
    handleStateChange("category", e);
  };

  const handleEditState = () => {
    setBookState({
      id: book?.id || "",
      title: book?.title || "",
      author: book?.author || "",
      category: book?.category || "",
      isbn: book?.isbn || 0,
      createdAt: book?.createdAt || "",
      modifiedAt: book?.modifiedAt || "",
      isActive: book?.isActive || false,
    });
    setBookErrors({
      titleError: false,
      authorError: false,
      categoryError: false,
      isbnError: false,
    });
  }

    const handleAddState = () => {
      setBookErrors({
        titleError: true,
        authorError: true,
        categoryError: true,
        isbnError: true,
      });
    };


  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {typeOfDialog === "edit" ? (
                <Button
                  onClick={() => handleEditState()}
                  className="hover:text-blue-400"
                  variant="outline"
                  size="icon"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => handleAddState()}
                  className="hover:text-blue-400"
                >
                  <Plus className="pr-1" /> Add book
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{typeOfDialog === "edit" ? "Edit book" : "Add new Book"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {typeOfDialog === "edit"
              ? "Are you sure absolutely sure?"
              : "This action will add new book on our servers."}
          </DialogTitle>
          {typeOfDialog === "edit" ? (
            <DialogDescription>
              This action cannot be undone. This will permanently change your
              book on our servers.
            </DialogDescription>
          ) : (
            ""
          )}
        </DialogHeader>
        <div className="grid items-center grid-cols-4 gap-4">
          <Label
            htmlFor="title"
            className={`${
              bookErrors.titleError ? "text-red-500" : ""
            } text-right`}
            title="Please write at least a 3 characters"
          >
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={bookState.title}
            className="col-span-3"
            onChange={(e) => handleChangeEditBookState(e)}
          />
        </div>
        <div className="grid items-center grid-cols-4 gap-4">
          <Label
            htmlFor="author"
            className={`${
              bookErrors.authorError ? "text-red-500" : ""
            } text-right`}
            title="Please write at least a 3 characters"
          >
            Author
          </Label>
          <Input
            id="author"
            name="author"
            value={bookState.author}
            className="col-span-3"
            onChange={(e) => handleChangeEditBookState(e)}
          />
        </div>
        <div className="grid items-center grid-cols-4 gap-4">
          <Label
            htmlFor="category"
            className={`${
              bookErrors.categoryError ? "text-red-500" : ""
            } text-right`}
            title="Chose one from list"
          >
            Category
          </Label>
          <Select
            onValueChange={(e) => handleEditCategory(e)}
            defaultValue={bookState.category}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Chose one from list" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="rounded-md  w-full h-[30svh]">
                <SelectGroup>
                  {Object.entries(categories).map(
                    ([categoryName, subCategories]) => {
                      return (
                        <SelectLabel
                          className="text-muted-foreground"
                          key={categoryName}
                        >
                          {categoryName}
                          {subCategories.map((subCategory) => (
                            <SelectItem
                              className="text-foreground"
                              key={subCategory}
                              value={subCategory}
                            >
                              {subCategory}
                            </SelectItem>
                          ))}
                        </SelectLabel>
                      );
                    }
                  )}
                </SelectGroup>
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        <div className="grid items-center grid-cols-4 gap-4">
          <Label
            htmlFor="isbn"
            className={`${
              bookErrors.isbnError ? "text-red-500" : ""
            } text-right`}
            title="Please enter 13 numbers of ISBN number"
          >
            ISBN
          </Label>
          <Input
            type="number"
            id="isbn"
            name="isbn"
            value={bookState.isbn !== null ? bookState.isbn : 0}
            className="col-span-3"
            onChange={(e) => handleChangeEditBookState(e)}
          />
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <DialogClose>
              <Button variant="secondary">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to dashboard
              </Button>
            </DialogClose>
            {!btnDisabled ? (
              <Button variant="ghost" disabled type="submit">
                <Save className="w-4 h-4 mr-2" />
                {typeOfDialog === "edit" ? "Save changes" : "Add book"}
              </Button>
            ) : (
              <DialogClose>
                <Button onClick={() => handleAddOrEditBook()} type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {typeOfDialog === "edit" ? "Save changes" : "Add book"}
                </Button>
              </DialogClose>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeBookState;
