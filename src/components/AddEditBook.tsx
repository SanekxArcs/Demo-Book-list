import React, { useState, useEffect } from "react";

type Props = {
  mode: "add" | "edit";
  book?: {
    id: number;
    title: string;
    author: string;
    category: string;
    isbn: string;
  };
  onSubmit: (data: any) => void;
};

const AddEditBook: React.FC<Props> = ({ mode, book, onSubmit }) => {
  const [title, setTitle] = useState<string>(book?.title || "");
  const [author, setAuthor] = useState<string>(book?.author || "");
  const [category, setCategory] = useState<string>(book?.category || "");
  const [isbn, setIsbn] = useState<string>(book?.isbn || "");

  const [errors, setErrors] = useState({
    title: false,
    author: false,
    category: false,
    isbn: false,
  });

  const validate = () => {
    const newErrors = {
      title: !title.trim(),
      author: !author.trim(),
      category: !category,
      isbn: !isbn.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      const formData = { title, author, category, isbn };
      onSubmit(formData);
    }
  };

  return (
    <div className="container mx-auto py-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Book Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`mt-1 p-2 w-full border ${
              errors.title ? "border-red-500" : ""
            }`}
            required
          />
        </div>

        {/* ... similarly for other fields ... */}

        <div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {mode === "add" ? "Add Book" : "Edit Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditBook;

// import React, { useState, useEffect } from "react";

// type Props = {
//   mode: "add" | "edit";
//   book?: {
//     id: number;
//     title: string;
//     author: string;
//     category: string;
//     isbn: string;
//   };
//   onSubmit: (data: any) => void;
// };

// const AddEditBook: React.FC<Props> = ({ mode, book, onSubmit }) => {
//   const [title, setTitle] = useState<string>(book?.title || "");
//   const [author, setAuthor] = useState<string>(book?.author || "");
//   const [category, setCategory] = useState<string>(book?.category || "");
//   const [isbn, setIsbn] = useState<string>(book?.isbn || "");

//   const [errors, setErrors] = useState({
//     title: false,
//     author: false,
//     category: false,
//     isbn: false,
//   });

//   const validate = () => {
//     const newErrors = {
//       title: !title.trim(),
//       author: !author.trim(),
//       category: !category,
//       isbn: !isbn.trim(),
//     };

//     setErrors(newErrors);
//     return !Object.values(newErrors).some((error) => error);
//   };

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     if (validate()) {
//       const formData = { title, author, category, isbn };
//       onSubmit(formData);
//     }
//   };

//   return (
//     <div className="container mx-auto py-4">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Book Title
//           </label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className={`mt-1 p-2 w-full border ${
//               errors.title ? "border-red-500" : ""
//             }`}
//             required
//           />
//         </div>

//         {/* ... similarly for other fields ... */}

//         <div>
//           <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//             {mode === "add" ? "Add Book" : "Edit Book"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddEditBook;
