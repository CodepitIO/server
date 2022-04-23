const Post = require(`../../common/models/post`);

const POSTS_PER_PAGE = 10;

exports.post = async (req, res) => {
  const data = {
    ...req.body,
    author: req.user._id,
    published: true,
    blog: `home`,
  };
  const post = new Post(data);
  await post.save();
  return res.json(post);
};

exports.remove = async (req, res) => {
  try {
    const post = await Post.removeOne({ _id: req.body.id });
    return res.status(200).json({});
  } catch (err) {
    return res.sendStatus(500);
  }
};

exports.getByUser = async (req, res) => {
  const { id } = req.params;
  const page = req.query.page || 1;
  const responses = await Post.find({
    author: id,
    $or: [{ published: true }, { publish_on: { $lt: new Date() } }],
  })
    .populate({
      path: `author`,
      select: `username`,
    })
    .sort(`-createdAt`)
    .limit(POSTS_PER_PAGE)
    .skip((page - 1) * POSTS_PER_PAGE);
  return res.status(200).json({ responses });
};

exports.getByBlog = async (req, res) => {
  const name = req.params.name || ``;
  const page = req.query.page || 1;
  const responses = await Post.find({
    blog: name,
    $or: [{ published: true }, { publish_on: { $lt: new Date() } }],
  })
    .populate({
      path: `author`,
      select: `username`,
    })
    .sort(`-createdAt`)
    .limit(POSTS_PER_PAGE)
    .skip((page - 1) * POSTS_PER_PAGE);
  return res.status(200).json({ responses });
};

exports.getBlogCount = async (req, res) => {
  const name = req.params.name || ``;
  try {
    const count = await Post.count({ blog: name, published: true });
    return res.status(200).json({
      count,
    });
  } catch (err) {
    return res.sendStatus(500);
  }
};
