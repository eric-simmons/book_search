const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express')
// const { expressMiddleware } = require('@apollo/server/express4')
const typeDefs = require('./schemas/typeDefs')
const resolvers = require('./schemas/resolvers')
const { authMiddleware } = require('./utils/auth');
const connection = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3002;
const apolloServer = new ApolloServer({ typeDefs, resolvers, context: authMiddleware })

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//serve static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/'))
})

// Apollo Server with GraphQL Schema
const startApolloServer = async (typeDefs, resolvers) => {
  await apolloServer.start()
  apolloServer.applyMiddleware({app})
  connection.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Use graphql at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    })
  })
}

startApolloServer(typeDefs, resolvers)

