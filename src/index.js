import { GraphQLServer } from 'graphql-yoga'

//Type definitions (Schema)
// type first letter use upper case 
//reference it by its name  User(Query)  in custom type (User) 
// custom type cab be use nullable when you decide
const typeDefs = `
  type Query {
        me:User
    }

    type User{
        id:ID!
        name:String!
        email:String!
        age:Int
    }
`
// Resolvers 
const resolvers = {
    Query: {
        // match up me return object to user
        // in this case resolver not a Scalar va;ue use curly bracket
        me: () => {
            return {
                id: "M0724001",
                name: "Kevin",
                email: "Kevin@gmail.com",
                age: 24
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})
server.start(() =>
    console.log('Server is running on localhost:4000')
)