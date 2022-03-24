"use strict";

const Post = require("../../common/models/post");

const POSTS_PER_PAGE = 10;

exports.post = (req, res) => {
  if (Post.validateChain(req).seeTitle().seeBody().notOk()) {
    return res.status(400).send();
  }
  let data = req.body;
  console.log(data);
  data.author = req.user._id;
  let post = new Post(data);
  post.save((err, post) => {
    return res.json(post);
  });
};

exports.remove = (req, res) => {
  Post.remove(
    {
      _id: req.body.id,
    },
    (err) => {
      if (err) return res.status(500).send();
      return res.json({});
    }
  );
};

function getPosts(query, req, res) {
  let page = parseInt(req.params.page || 1);
  let skipCount = (page - 1) * POSTS_PER_PAGE;
  query
    .populate({
      path: "author",
      select: "local.username",
    })
    .sort("-createdAt")
    .limit(POSTS_PER_PAGE)
    .skip(skipCount)
    .exec((err, posts) => {
      if (err) return res.status(500).send();
      return res.json({
        posts: posts,
      });
    });
}

exports.getByUser = (req, res) => {
  let id = req.params.id;
  let query = Post.find({ author: id });
  return getPosts(query, req, res);
};

exports.getBlog = (req, res) => {
  let name = req.params.name || "home";
  console.log(req.params, req.body);
  let query = Post.find({ page: name });
  return getPosts(query, req, res);
};

exports.getBlogCount = (req, res) => {
  let name = req.params.name || "home";
  Post.count({ page: name }, (err, count) => {
    console.log(count);
    if (err) return res.status(500).send();
    return res.json({
      count: count,
    });
  });
};
