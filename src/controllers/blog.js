'use strict'

const Post = require('../models/post')

const POSTS_PER_PAGE = 10

exports.post = (req, res) => {
  let data = req.body
  data.author = req.user._id
  let post = new Post(data)
  post.save((err, post) => {
    return res.json(post)
  })
}

exports.remove = (req, res) => {
  Post.remove({
    _id: req.body.id
  }, (err) => {
    if (err) return res.status(500).send()
    return res.json({})
  })
}

exports.getByFilter = (req, res) => {
  let filter = req.body.filter
  let page = parseInt(req.body.page || 1)
  let skipCount = (page - 1) * POSTS_PER_PAGE
  Post.find(filter)
    .populate({
      path: 'author',
      select: 'local.username'
    })
    .sort('-createdAt')
    .limit(POSTS_PER_PAGE)
    .skip(skipCount)
    .exec((err, posts) => {
      if (err) return res.status(500).send()
      return res.json({
        posts: posts
      })
    })
}

exports.getCountByFilter = (req, res) => {
  let filter = req.body.filter
  Post.count(filter, (err, count) => {
    if (err) return res.status(500).send()
    return res.json({
      count: count
    })
  })
}
