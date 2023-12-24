const express = require("express");
const app = express();
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");
const db = require("./db");
const PORT = 3305;
// a. express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());

// b. express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Hello! this is the backend");
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});

//GET/books=> return all the books
//GET/books/:id=>return specific book
//POST/books=>create a book
//Delete/books/:id=>delete a book
//PUT/books/:id=> update a book
//------------------------------------(Get Books)-------------------------------------
app.get("/books", (req, res) => {
  const books = "SELECT * FROM books";
  db.query(books, (data, err) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
//------------------------------------(Post Book)-------------------------------------
app.post("/books", (req, res) => {
  const id = uuidv4(); //random Unique id created
  const books =
    //"INSERT INTO books (`title`,`description`,`cover`) VALUES(?)";//if auto integer id created from mysql database
    "INSERT INTO books (`id`,`title`,`description`,`price`,`cover`) VALUES(?)";
  // const values = [
  //   "title from backend",
  //   "desc from backend",
  //   "cover pic from backed",
  // ]; if you send data from backend
  const values = [
    id,
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ]; //send data from client or postman.
  db.query(books, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json({ message: `Books are created `, data });
  });
});
//----------------------------------(Delete Book)-------------------------------------
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id=?";
  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been deleted successfully");
  });
});
//----------------------------------(Update Book)-------------------------------------
app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q =
    "UPDATE books SET `title`=?,`description`=?,`price`=?,`cover`=? WHERE id=?";

  const values = [
    req.body.title,
    req.body.description,
    req.body.price,
    req.body.cover,
  ];
  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been updated successfully");
  });
});
//....................................................................................

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await pool.query("SELECT * FROM book where id=$1", [id]);
    res.status(200).json({
      message: `specific user is returned with id: ${id}`,
      data: book.rows,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = uuidv4();

    //inserting book into database;
    const newBook = await pool.query(
      "INSERT INTO book(id,name,description) VALUES ($1,$2,$3) RETURNING *",
      [id, name, description]
    );
    res.status(201).json({ message: `Books are created `, data: newBook.rows });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM book where id=$1", [id]);
    res.status(200).json({ message: `Book are deleted with id:${id}` });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// app.put("/books/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description } = req.body;
//     const updatedBook = await pool.query(
//       "UPDATE book SET name=$1,description=$2 where id=$3 RETURNING*",
//       [name, description, id]
//     );
//     res.status(200).json({
//       message: `Books are updated ${name},${description}`,
//       data: updatedBook.rows,
//     });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// })
