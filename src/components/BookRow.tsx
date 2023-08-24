import React from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  createdAt: string;
  modifiedAt: string | null;
  isActive: boolean;
};

type Props = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (bookId: number) => void;
  onToggleActive: (bookId: number) => void;
};

const BookRow: React.FC<Props> = ({
  book,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <tr className={!book.isActive ? "bg-gray-200" : ""}>
      {/* ... other table data columns ... */}

      <td className="p-2 border">
        <button
          onClick={() => onEdit(book)}
          className="bg-blue-500 text-white p-1 rounded mr-2"
        >
          Edit
        </button>
        {book.isActive ? (
          <button
            onClick={() => onToggleActive(book.id)}
            className="bg-yellow-400 text-white p-1 rounded mr-2"
          >
            Deactivate
          </button>
        ) : (
          <>
            <button
              onClick={() => onToggleActive(book.id)}
              className="bg-green-500 text-white p-1 rounded mr-2"
            >
              Re-Activate
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default BookRow;

// import React from "react";

// type Book = {
//   id: number;
//   title: string;
//   author: string;
//   category: string;
//   isbn: string;
//   createdAt: string;
//   modifiedAt: string | null;
//   isActive: boolean;
// };

// type Props = {
//   book: Book;
//   onEdit: (book: Book) => void;
//   onDelete: (bookId: number) => void;
//   onToggleActive: (bookId: number) => void;
// };

// const BookRow: React.FC<Props> = ({
//   book,
//   onEdit,
//   onDelete,
//   onToggleActive,
// }) => {
//   return (
//     <tr className={!book.isActive ? "bg-gray-200" : ""}>
//       <td className="p-2 border">{book.title}</td>
//       <td className="p-2 border">{book.author}</td>
//       <td className="p-2 border">{book.category}</td>
//       <td className="p-2 border">{book.isbn}</td>
//       <td className="p-2 border">
//         {new Intl.DateTimeFormat("en-US", {
//           day: "numeric",
//           month: "long",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         }).format(new Date(book.createdAt))}
//       </td>
//       <td className="p-2 border">
//         {book.modifiedAt
//           ? new Intl.DateTimeFormat("en-US", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//               hour: "2-digit",
//               minute: "2-digit",
//               hour12: true,
//             }).format(new Date(book.modifiedAt))
//           : "--"}
//       </td>
//       <td className="p-2 border">
//         <button
//           onClick={() => onEdit(book)}
//           className="bg-blue-500 text-white p-1 rounded mr-2"
//         >
//           Edit
//         </button>
//         {book.isActive ? (
//           <button
//             onClick={() => onToggleActive(book.id)}
//             className="bg-yellow-400 text-white p-1 rounded mr-2"
//           >
//             Deactivate
//           </button>
//         ) : (
//           <>
//             <button
//               onClick={() => onToggleActive(book.id)}
//               className="bg-green-500 text-white p-1 rounded mr-2"
//             >
//               Re-Activate
//             </button>
//             <button
//               onClick={() => onDelete(book.id)}
//               className="bg-red-500 text-white p-1 rounded"
//             >
//               Delete
//             </button>
//           </>
//         )}
//       </td>
//     </tr>
//   );
// };

// export default BookRow;
