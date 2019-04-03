time log 2019 04 02 Roni's note 
This is Andrew course in Udemy
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

### GraphQL Shape Data
GrqphQL 's Client is who dictates what data comes back and as we can see this is 
actually useful.

### Query complete 
query is only read

---

## Mutation
then the server needs to respond accordingly.

ex:validation on that data dor expamle making sure the email


### CRUD
we're concerned with actually creating updating or deleting some data
and then responding accordingly

get some values passed in via that args


04/02

### know how to relate to type comment to user and post

bablel preset is nothing more than a collection of plugin all group
together to provide some sort of cohesive behavior

### spread operator
have slightly easier ways to maintain our code something
that scales a bit better args are more properties on it

### type input for mutation
we now have these input types which can be reused across other operations creating

separately from the operation definition itself.