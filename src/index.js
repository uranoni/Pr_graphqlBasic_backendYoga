import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import { composeTransforms } from 'graphql-tools/dist/transforms/transforms';


let users = [
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

let posts = [{
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

let comments = [
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
       createUser(data: CreateUserInput!):User!
       deleteUser(id: ID!): User! 
       createPost(data: CreatePostInput!):Post!
       deletePost(id: ID!): Post!
       createComment(data: CreateCommentInput!): Comment!
       deleteComment(id: ID!): Comment!
    }

    input CreateUserInput{
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput{
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput{
        text: String! 
        author: ID!
        post: ID!
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
            const emailTaken = users.some( (user)=>  user.email === args.data.email )
            if(emailTaken){
                throw new Error('Email taken')
            }

            const user = {
                id:uuidv4(),
                // name:args.name,
                // email:args.email,
                // age:args.age
                ...args.data
            }

            users.push(user)
            return user
        },
        deleteUser(parent,args,ctx,info){
            const userIndex = users.findIndex((user)=> user.id === args.id )

            if(userIndex === -1){
                throw new Error("User not found")
            }

            const deleUsers = users.splice(userIndex, 1)

            posts = posts.filter((post)=>{
                const match = post.author === args.id
                
                if(match){
                    comments = comments.filter((comment)=> comment.post !== post.id)
                }
                return !match
            })
            comments = comments.filter((comment)=>comment.author !== args.id)

            return deleUsers[0]
        },
        createPost(parent,args,ctx,info){
            const userExists = users.some((user) => {

                return user.id === args.data.author
            })
           
            if(!userExists){
                throw new Error('User is not found')
            }

            const post = {
                id: uuidv4(),
                // title: args.title,
                // body: args.body,
                // published: args.published,
                // author: args.author
                ...args.data
            }

            posts.push(post)
            return post;
        },
        deletePost(parent,args,ctx,info){
            const postIndex = posts.findIndex((post)=> post.id === args.id)

            if(postIndex === -1){
                throw new Error("post not found")
            }

            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter((comment)=> comment.post !== args.id)
            return deletedPosts[0]
        },
        // return post.id === args.post && post.published === true
        createComment(parent,args,ctx,info){
            const userExists = users.some((user)=> user.id === args.data.author)
            const postExists = posts.some((post)=>post.id === args.data.post && post.published)

            if(!userExists || !postExists){
                throw new Error("Unable to find user and post")
            }

            const comment = {
                id:uuidv4(),
                // text:args.text,
                // author:args.author,
                // post:args.post
                ...args.data
            }

            comments.push(comment)

            return comment
        },
        deleteComment(parent,args,ctx,info){
            const commentIndex = comments.findIndex((comment)=> comment.id === args.id)

            if(commentIndex === -1 ){
                throw new Error('Comment not found')
            }

            const deleteComments = comments.splice(commentIndex,1)

            return deleteComments[0]
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