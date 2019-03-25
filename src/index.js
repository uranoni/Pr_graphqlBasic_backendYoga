import { GraphQLServer } from 'graphql-yoga'

//Type definitions (Schema)

// hello(name: String): String!  Can put arg in side
const typeDefs = `
  type Query {
   
    hello:String!
  }
`
// Resolvers 
const resolvers = {
  Query: {
    // hello: (_, { name }) => `Hello ${name || 'World'}`,
    // hello: () => "hello world"
    hello() { return "hello world" }
  },
}

const server = new GraphQLServer({
  typeDefs, resolvers
})
server.start(() =>
  console.log('Server is running on localhost:4000')
)