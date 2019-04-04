import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import { composeTransforms } from 'graphql-tools/dist/transforms/transforms';
import db from './db'


// Resolvers 
const resolvers = {
    Query: {

        users(parent, args, {db}, info) {
            if (!args.query) {
                return db.users
            }
            return db.users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, {db}, info) {
            if (!args.query) {
                return db.posts
            }

            return db.posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                return isTitleMatch || isBodyMatch
            })
        },
        comments(parent,args,{db},info){
            return db.comments
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
        createUser(parent,args,{db},info){
            const emailTaken = db.users.some( (user)=>  user.email === args.data.email )
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

            db.users.push(user)
            return user
        },
        deleteUser(parent,args,{db},info){
            const userIndex = db.users.findIndex((user)=> user.id === args.id )

            if(userIndex === -1){
                throw new Error("User not found")
            }

            const deleUsers = db.users.splice(userIndex, 1)

            db.posts = posts.filter((post)=>{
                const match = post.author === args.id
                
                if(match){
                    db.comments = db.comments.filter((comment)=> comment.post !== post.id)
                }
                return !match
            })
            db.comments = db.comments.filter((comment)=>comment.author !== args.id)

            return deleUsers[0]
        },
        createPost(parent,args,{db},info){
            const userExists = db.users.some((user) => {

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

            db.posts.push(post)
            return post;
        },
        deletePost(parent,args,{db},info){
            const postIndex = db.posts.findIndex((post)=> post.id === args.id)

            if(postIndex === -1){
                throw new Error("post not found")
            }

            const deletedPosts = db.posts.splice(postIndex, 1)

            db.comments = db.comments.filter((comment)=> comment.post !== args.id)
            return deletedPosts[0]
        },
        // return post.id === args.post && post.published === true
        createComment(parent,args,{db},info){
            const userExists = db.users.some((user)=> user.id === args.data.author)
            const postExists = db.posts.some((post)=>post.id === args.data.post && post.published)

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

            db.comments.push(comment)

            return comment
        },
        deleteComment(parent,args,{db},info){
            const commentIndex = db.comments.findIndex((comment)=> comment.id === args.id)

            if(commentIndex === -1 ){
                throw new Error('Comment not found')
            }

            const deleteComments = db.comments.splice(commentIndex,1)

            return deleteComments[0]
        }
    },
    Post: {
        author(parent, args, {db}, info) {
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent,args,{db},info){
            return db.comments.filter((comment)=>{
                return comment.post ===parent.id
            })
        }
    },
    Comment:{
        author(parent,args,{db},info){
            return db.users.find((user)=>{
                return user.id === parent.author
            })
        },
        post(parent,args,{db},info){
            return db.posts.find((post)=>{
                return post.id === parent.post
            })
        }
    },
    User: {
        posts(parent, args, {db}, info) {
            return db.posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent,args,{db},info){
            return db.comments.filter((comment)=>{
                return comment.author === parent.id
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql'
    , resolvers,
    context:{
        db
    }
})

server.start(() =>
    console.log('Server is running on localhost:4000')
)