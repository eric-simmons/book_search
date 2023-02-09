const {gql} = require('apollo-server-express')

const typeDefs = gql `
type User{
    _id:ID!
    username: String!
    email: String! 
    password: String! 
    savedBooks: [Book]
}

type Book{
    bookId: String!
    authors: [Author]
    description: String!
    image: String
    link: String
    title: String!
}

type Author{
    _id: ID!
    name: String
}

type Auth{
    token: String!
    user: User
}

type Query{
    me(_id: ID!): User
}

type Mutation{
    login(
        email: String!,
        password: String!
        ) : Auth
        addUser(
            username: String!,
            email: String!,
            password: String!
        ) : Auth
        saveBook(bookData:String!): User
        removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs