const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express')
const { expressMiddleware } = require('@apollo/server/express4')
const typeDefs = require('./schemas/typeDefs')
const resolvers = require('./schemas/resolvers')
const { authMiddleware } = require('./utils/auth');
const apolloServer = new ApolloServer({ typeDefs, resolvers, context: authMiddleware })



const db = require('./config/connection');
// const routes = require('./routes');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);


const startApolloServer = async (typeDefs, resolvers) => {
  await apolloServer.start()
  apolloServer.applyMiddleware({app})
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Use graphql at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    })
  })
}

startApolloServer(typeDefs, resolvers)

// db.once('open', async () => {
//   await apolloServer.start()
//   app.use(expressMiddleware(apolloServer))
//   console.log(`Playground at http://localhost:${PORT}/graphql`)

//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
