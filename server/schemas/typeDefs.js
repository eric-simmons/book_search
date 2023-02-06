const typeDefs = `
type User{
    _id:ID!
    username: String!
    email: String! 
    password: String! 
    savedBooks: [Book]
}

type Book{
    _id: ID!
    authors: [Author]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type Author{
    _id: ID!
    name: String
}

type Query{
    users: [User]
    books: [Book]
}
`;

module.exports = typeDefs