import uuidv4 from 'uuid/v4'
import { type } from 'os';
const Mutation = {
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
  updateUser(parent,args,{db},info){
        const {id,data} = args
        const user = db.users.find((user)=>user.id === id)

        if(!user){
            throw new Error("User not found")
        }

        if(typeof data.email === "string"){
            const emailTaken = db.users.some((user)=>user.email === data.email)

            if(emailTaken){
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if(typeof data.name === 'string'){
            user.name = data.name
        }

        if(typeof data.age !== 'undefined'){
            user.age = data.age
        }

        return user
  },
  createPost(parent,args,{db,pubsub},info){
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

      if(args.data.published){
          pubsub.publish('post',{
              post:{
                  mutation:"CREATED",
                  data:post
              }
            })
      }
      return post;
  },
  deletePost(parent,args,{db,pubsub},info){
      const postIndex = db.posts.findIndex((post)=> post.id === args.id)

      if(postIndex === -1){
          throw new Error("post not found")
      }

    //   const deletedPosts = db.posts.splice(postIndex, 1)
      const [post] = db.posts.splice(postIndex, 1)

      db.comments = db.comments.filter((comment)=> comment.post !== args.id)

      if(post.published){
          pubsub.publish('post',{
              post:{
                  mutation: "DELETED",
                  data: post
              }
          })
      }
      return post
  },
  updatePost(parent,args,{db,pubsub},info){
      const {id, data}=args
      const post = db.posts.find((post) => post.id === id)
      const orginalpost = {...post}
      if(!post){
          throw new Error("unable to find user and post")
      }

      if(typeof data.title === 'string'){
          post.title =data.title
      }

      if(typeof data.body === 'string'){
          post.body = data.body
      }

      if(typeof data.published === 'boolean'){
          post.published = data.published

          if(orginalpost.published && !post.published){
              pubsub.publish('post',{
                  post:{
                      mutation:"DELETE",
                      data:orginalpost
                  }
              })
          } else if(!orginalpost.published && post.published){
            pubsub.publish('post',{
                post:{
                    mutation:"CREATED",
                    data:post
                }
            })
          }
      }else if(post.published){
          pubsub.publish("post",{
              post:{
                  mutation: "UPDATED",
                  data: post
              }
          })
      }

      return post
  },
  // return post.id === args.post && post.published === true
  createComment(parent,args,{db,pubsub},info){
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
      pubsub.publish(`comment ${args.data.post}`,{
          comment:{
              mutation: "CREATED",
              data: comment
          }
        })
      return comment
  },
  deleteComment(parent,args,{db,pubsub},info){
      const commentIndex = db.comments.findIndex((comment)=> comment.id === args.id)

      if(commentIndex === -1 ){
          throw new Error('Comment not found')
      }

      const [deleteComment] = db.comments.splice(commentIndex,1)

      pubsub.publish(`comment ${deleteComment.post}`,{
          comment:{
              mutation: 'DELETED',
              data: deleteComment
          }
      })
      return deleteComment
  },
  updateComment(parent,args,{db,pubsub},info){
      const {id,data} = args
      const comment = db.comments.find((comment)=> comment.id === id )

      if(!comment){
          throw new Error("comment not found")
      }

      if(typeof data.text === 'string'){
          comment.text = data.text
      }

      pubsub.publish(`comment ${comment.post}`,{
          comment:{
              mutation: "UPDATE",
              data: comment
          }
      })
      return comment
  }
}

export {Mutation as default}