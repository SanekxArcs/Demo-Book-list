import { Trash2, EyeOff, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChangeBookState from "@/components/ChangeBookState";
import { useBookContext } from "./BookContext";
import Loading from "./loading";


const Main = () => {
  const {
    books,
    filteredBooks,
    handleDeleteClick,
    handleToggleActiveClick,
  } = useBookContext();

  return (
    <>
      <main>
        <ScrollArea className="rounded-md border w-[100svw] h-[74svh]">
          {Array.isArray(books) ? (
            <Table>
              <TableCaption>End list of books from fake DB.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-start">Modified At</TableHead>
                  <TableHead className="text-center w-44">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(filteredBooks) &&
                  filteredBooks.map((books) => (
                    <TableRow className="text-xs md:text-sm" key={books.id}>
                      <TableCell className="font-medium">
                        {books.title ? books.title : "-"}
                      </TableCell>
                      <TableCell>{books.author ? books.author : "-"}</TableCell>
                      <TableCell>
                        {books.category ? books.category : "-"}
                      </TableCell>
                      <TableCell>{books.isbn ? books.isbn : "-"}</TableCell>
                      <TableCell>
                        {books.createdAt ? books.createdAt : "-"}
                      </TableCell>
                      <TableCell className="text-start">
                        {books.modifiedAt ? books.modifiedAt : "-"}
                      </TableCell>
                      <TableCell className="grid gap-1 place-items-center grid-cols-3 min-w-[160px]">
                        <ChangeBookState book={books} typeOfDialog={"edit"} />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() =>
                                  handleToggleActiveClick(books.id)
                                }
                                className="hover:text-yellow-200"
                                variant="outline"
                                size="icon"
                              >
                                {books.isActive ? (
                                  <Eye className={`h-4 w-4 text-yellow-400`} />
                                ) : (
                                  <EyeOff className={`h-4 w-4`} />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {books.isActive ? "Delete from " : "Add to "}
                                active
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {books.isActive ? (
                          <Button disabled variant="outline" size="icon">
                            <Trash2 className="w-4 h-4 " />
                          </Button>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className="text-red-200 hover:text-red-500"
                                  onClick={() => {
                                    handleDeleteClick(books.id);
                                  }}
                                  variant="outline"
                                  size="icon"
                                >
                                  <Trash2 className="w-4 h-4 " />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete book</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                {}
              </TableBody>
            </Table>
          ) : (
            <Loading />
          )}
        </ScrollArea>

        <Dialog />
      </main>
    </>
  );
};

export default Main;
