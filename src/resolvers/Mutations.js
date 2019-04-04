import uuidv4 from 'uuid/v4'
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
}

export {Mutation as default}