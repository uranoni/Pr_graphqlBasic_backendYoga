import { GraphQLServer } from 'graphql-yoga'

//Type definitions (Schema)
// type first letter use upper case 
//reference it by its name  User(Query)  in custom type (User) 
// custom type cab be use nullable when you decide
// argument can be array can allow represent complex data not sclar type
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        add(numbers:[Float!]!): Float!
        grades:[Int!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`
// Resolvers 
const resolvers = {
    Query: {
        // parents is root query 
        //args is client data across 
        //ctx 
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello, ${args.name}! You are my favoriate ${args.position}.`
            } else {
                return 'Hello!'
            }
        },
        add(parent, args, ctx, info) {
            // return args.a + args.b
            if(args.numbers.length == 0){
                return 0
            }
            // reduce array add
            //[1,5,10,2]
            return args.numbers.reduce((accumulator,currentvalue)=>{
                return accumulator+currentvalue
            })

        },
        me: () => {
            return {
                id: "M0724001",
                name: "Kevin",
                email: "Kevin@gmail.com",
                age: 24
            }
        },
        grades(parent,args,ctx,info){
            return [90,80,88]
        },
        post: () => {
            return {
                id: "01",
                title: "hello GraphQL",
                body: "test GraphQL",
                published: true
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