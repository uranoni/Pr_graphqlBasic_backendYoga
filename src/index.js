import { GraphQLServer } from 'graphql-yoga'

//Type definitions (Schema)
// Scalar Type - String , Boolean,Float,ID,Int
const typeDefs = `
  type Query {
    title:String!
    price:Float!
    releaseYear:Int
    rating:Float
    isStock:Boolean!
    
  }
`
// Resolvers 
const resolvers = {
    Query: {
        title: () => "Harry potter",
        price: () => 12.99,
        releaseYear: () => null,
        rating: () => 5,
        isStock: () => true
    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})
server.start(() =>
    console.log('Server is running on localhost:4000')
)