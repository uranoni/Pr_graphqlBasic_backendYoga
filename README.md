<!-- time log 2019 03 29 Roni's note -->
# Graphql course basic and notes
## type def
 ## setting up a filed whose value is anoter custom type
 1. if one of filed is not scalar type
 2. we have to set up custom resolver
 to teach graphql how to get correct data
 3. 
#### this is User type but add posts Post is not scalar type
 setting up a filed whose value is anoter custom type
 if one of filed is not scalar type
 we have to set up custom resolver
 to teach graphql how to get correct data

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
#### this is resolver below  root Query
         if this fuction return 6 users
         it is going to call this method(under post function) six times
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
        },
### this is resolver beside Query

    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        }
    },

    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        }
    }
### case 1

### users below query  and return not a scalar type 
when we set up each user have many posts belong author
we need to wirte to explain that and teach graphql

#### query (users object)
       users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
we saw that users will retun many user and each will retun many posts so when excute this function it will call Post function time

<!-- time log 2019-03-30 Roni -->
### between relation in comment

#### parent's argument is yout root type