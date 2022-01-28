const Book = require("../models/Book");

exports.list = async (req, res) => {
  try {
    console.log(req.query)
    const message = req.query.message;
    const books = await Book.find({});
    res.render("books", { books: books, message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list books" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    await Taster.findByIdAndRemove(id);
    res.redirect("/books");
  } catch (e) {
    res.status(404).send({
      message: `could not delete book ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

  try {
    const book = new Book({ title: req.body.title, author: req.body.author });
    await book.save();
    res.redirect('/books/?message=book has been added')
  } catch (e) {
    if (e.errors) {
      console.log('here are our errors');
      console.log(e.errors);
      res.render('create-book', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Book.findById(id);
    res.render('update-book', { title: title, author: author });
  } catch (e) {
    res.status(404).send({
      message: `could find book ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const taster = await Taster.updateOne({ _id: id }, req.body);
    res.redirect('/books/?message=book has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find book ${id}.`,
    });
  }
};
