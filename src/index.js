import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'


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

const comments = [
    { 
        id:'102',
        text:"This worked will for me . Thanks!",
        author:'3',
        post:"10"
    },
    {
        id:'103',
        text:"See you !!",
        author:'1',
        post:"10"
    },
    {
        id:'104',
        text:"This did not work",
        author:'2',
        post:"12"
    },
    {
        id:'105',
        text:"Nevermind. I got it to work",
        author:'3',
        post:"12"
    }
]

const typeDefs = `
    type Query {
        users(query:String):[User!]!
        posts(query: String): [Post!]!
        comments:[Comment!]!
        me: User!
        post: Post!
    }
    type Mutation {
       createUser(name: String!,email: String!,age: Int):User! 
       createPost(title: String!, body: String! , published: Boolean!,author: ID!):Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments:[Comment!]!
    }

    type Comment{
        id:ID!
        text:String!
        author:User!
        post:Post!
    }
`
// Resolvers 
const resolvers = {
    Query: {

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
        comments(parent,args,ctx,info){
            return comments
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
    Mutation:{
        createUser(parent,args,ctx,info){
            const emailTaken = users.some( (user)=>  user.email === args.email )
            if(emailTaken){
                throw new Error('Email taken')
            }

            const user = {
                id:uuidv4(),
                name:args.name,
                email:args.email,
                age:args.age

            }

            users.push(user)
            return user
        },
        createPost(parent,args,ctx,info){
            const userExists = users.some((user) => {

                return user.id === args.author
            })
           
            if(!userExists){
                throw new Error('User is not found')
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            }

            posts.push(post)
            return post;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.post ===parent.id
            })
        }
    },
    Comment:{
        author(parent,args,ctx,info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        post(parent,args,ctx,info){
            return posts.find((post)=>{
                console.log(post)
                console.log(parent)
                return post.id === parent.post
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent,args,ctx,info){
            return comments.filter((comment)=>{
                return comment.author === parent.id
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