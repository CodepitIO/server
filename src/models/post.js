const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

var postSchema = mongoose.Schema({
	author: {
		type: ObjectId,
		ref: 'User'
	},
	title: String,
	body: String,
	tags: [String],
	home: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

postSchema.index({
	author: 1,
	createdAt: -1
});

module.exports = mongoose.model('Post', postSchema);
