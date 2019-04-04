const Query = {

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
}

export {Query as default}