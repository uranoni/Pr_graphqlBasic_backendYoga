import { GraphQLServer } from 'graphql-yoga'

const users = [
    {
        id:'1',
        name:'Roni',
        email:"roni@gmail.com",
        age:'24'
    },
    {
        id:'2',
        name:"Kao",
        email:"Kao@gmail.com"
    },
    {
        id:'3',
        name:"Mike",
        email:"mike@gmail.com"
    }
]
const typeDefs = `
    type Query {
        users(query:String):[User!]!
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
        // each object match schema type
        users(parent,args,ctx,info){
            if(!args.query){
                return users
            }
            return users.filter((user)=>{
                return user.name.toLowerCase().includes(args.query.toLowerCase())
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