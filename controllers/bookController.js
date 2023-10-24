import Book from "../models/bookModel.js";
import mongoose from "mongoose";
import Author from "../models/authorModel.js";
import { upload } from "../middleware/multer.js";
// get all books

export const getBooks = async (req, res) => {
  const books = await Book.find({});

  res.status(200).json(books);
};

// get book by autherId

export const getBookByAutherId = async (req, res) => {
  const Id = req.params.id; // Assuming the author ID is passed as a URL parameter

  if (!mongoose.Types.ObjectId.isValid(Id)) {
    return res.status(404).json({ error: "No such Auther" });
  }

  const book = await Book.find({ authorId: Id });

  if (!book) {
    return res.status(404).json({ error: "No such a book" });
  }

  res.status(200).json(book);
};

// get book by categoryID

export const getBookByCategoryId = async (req, res) => {
  const Id = req.params.id; // Assuming the author ID is passed as a URL parameter

  if (!mongoose.Types.ObjectId.isValid(Id)) {
    return res.status(404).json({ error: "No such category" });
  }

  const book = await Book.find({ categoryId: Id });

  if (!book) {
    return res.status(404).json({ error: "No such a book" });
  }

  res.status(200).json(book);
};

// get a single book

export const getBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such book" });
  }

  const book = await Book.findById(id);

  if (!book) {
    return res.status(404).json({ error: "No such a book" });
  }

  res.status(200).json(book);
};

////// create new book

// export const createBook =  async (req, res) => {
//     const { title, ISBN, publicationDate, description, nbPages, author ,image , language, rating } = req.body

//     // add doc to db
//     try {
//         const book = await Book.create({ title, ISBN, publicationDate, description, nbPages,author ,image, language, rating })

//         res.status(200).json(book)
//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// }

// create a new book with upload image

export const createBook = async (req, res) => {
  upload.single("image")(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const {
      title,
      ISBN,
      publicationDate,
      description,
      nbPages,
      authorId,
      categoryId,
      language,
      rating,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    // Find the author using the provided author ID
    // const author = await Author.findById(authorId);

    const image = req.file.path;

    try {
      const book = await Book.create({
        title,
        ISBN,
        publicationDate,
        description,
        nbPages,
        authorId,
        categoryId,
        image,
        language,
        rating,
      });

      // // Push the book's ID to the author's books array
      // authorObj.books.push(book._id);
      // await authorObj.save();

      res.status(200).json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// delete a book

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such book" });
  }

  const book = await Book.findOneAndDelete({ _id: id });

  if (!book) {
    return res.status(400).json({ error: "No such a book" });
  }

  res.status(200).json(book);
};

// update a book

export const updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such book" });
  }

    const book = await Book.findOneAndUpdate({ _id: id }, {
        ...req.body
    })

    if (!book) {
        return res.status(404).json({ error: "No such a book" })
    }

  res.status(200).json(book);
};
