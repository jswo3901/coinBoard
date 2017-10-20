const User = require('db/models/user')
const Discussion = require('db/models/discussion')

exports.login = (req, res, next) => {
  return res.status(200).json({
    result: true,
    msg: '접근성공!'
  })
}

const createDiscussion = (discussion) => {
  return new Promise((resolve, reject) => {
    const newDiscussion = new Discussion({
      // forum_id: discussion.forumId,
      // forum: discussion.forumId,
      // user_id: discussion.userId,
      // user: discussion.userId,
      // // discussion_slug: generateDiscussionSlug(discussion.title) 
      // date: new Date(),
      title: discussion.title,
      content: discussion.content
    })

    newDiscussion.save((error) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(newDiscussion)
    })
  })
}


exports.myRoom = (req, res, next) => {
  // console.log('myroom:'+ req.body.title)
  // if (req.userId) {
  //   createDiscussion(req.body)
  //   console.log('success')
  // } else {
  //   res.send({ postCreated: false })
  // }
  createDiscussion(req.body)
}