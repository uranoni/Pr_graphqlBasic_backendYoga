import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import { composeTransforms } from 'graphql-tools/dist/transforms/transforms';
import db from './db'
import Query from "./resolvers/Query";
import  Mutation  from "./resolvers/Mutations";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment"

const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql', 
    resolvers:{
        Query,Mutation,User,Post,Comment
    },
    context:{
        db
    }
})

server.start(() =>
    console.log('Server is running on localhost:4000')
)