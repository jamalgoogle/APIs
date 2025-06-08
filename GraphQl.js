
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

// Sample data
let books = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: '2', title: '1984', author: 'George Orwell', year: 1949 },
];

// Define schema
const schema = buildSchema(`
  type Book {
    id: ID!
    title: String!
    author: String!
    year: Int!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!, year: Int!): Book
    updateBook(id: ID!, title: String, author: String, year: Int): Book
    deleteBook(id: ID!): String
  }
`);

// Define resolvers
const root = {
  books: () => books,
  
  book: ({ id }) => {
    return books.find(book => book.id === id);
  },
  
  addBook: ({ title, author, year }) => {
    const newBook = {
      id: String(books.length + 1),
      title,
      author,
      year
    };
    books.push(newBook);
    return newBook;
  },
  
  updateBook: ({ id, title, author, year }) => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) return null;
    
    const updatedBook = {
      ...books[bookIndex],
      title: title || books[bookIndex].title,
      author: author || books[bookIndex].author,
      year: year || books[bookIndex].year
    };
    
    books[bookIndex] = updatedBook;
    return updatedBook;
  },
  
  deleteBook: ({ id }) => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) return "Book not found";
    
    books = books.filter(book => book.id !== id);
    return "Book deleted successfully";
  }
};

// Create Express server
const app = express();

// Enable CORS
app.use(cors());

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true // Enable GraphiQL interface for testing
}));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL server is running on http://localhost:${PORT}/graphql`);
});
