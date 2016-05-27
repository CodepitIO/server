var Tag = require('../models/tag')

var allTags = []

Tag.find(function (err, tags) {
  allTags = tags.map(function (obj) {
    return {
      id: obj._id,
      name: obj.name
    }
  })
})

exports.getTags = function (req, res, next) {
  return res.json({
    tags: allTags
  })
}

exports.createTag = function (req, res, next) {
  Tag.findOne({
    name: req.params.name
  })
    .exec()
    .then(function (tag, b) {
      if (!tag) {
        var tag = new Tag({
          author: req.user._id,
          name: req.params.name
        })
        tag.save(function (err, tag) {
          if (err) {
            return res.json({
              error: 'Algum erro ocorreu.'
            })
          }
          allTags.push(tag)
          return res.json({
            id: tag._id,
            name: tag.name
          })
        })
      } else {
        return res.json({
          id: tag._id,
          name: tag.name
        })
      }
    })
}
