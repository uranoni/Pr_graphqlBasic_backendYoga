import { GraphQLServer } from 'graphql-yoga'

const users = [
    {
        id: '1',
        name: 'Roni',
        email: "roni@gmail.com",
        age: '24'
    },
    {
        id: '2',
        name: "Kao",
        email: "Kao@gmail.com"
    },
    {
        id: '3',
        name: "Mike",
        email: "mike@gmail.com"
    }
]

const posts = [{
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '1'
}, {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1'
}, {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2'
}]

// setting up a filed whose value is anoter custom type
// if one of filed is not scalar type
// we have to set up custom resolver
// to teach graphql how to get correct data
const typeDefs = `
    type Query {
        users(query:String):[User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts:[Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`
// Resolvers 
const resolvers = {
    Query: {
        // if this fuction return 6 users
        // it is going to call this method(under post function) six times
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
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
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },
    // each time ti calls it will be calling it 
    // with different value for parent
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs, resolvers
})
server.start(() =>
    console.log('Server is running on localhost:4000')
)