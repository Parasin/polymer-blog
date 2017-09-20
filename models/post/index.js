const mongoose = require( 'mongoose' );

let postSchema = mongoose.Schema( {
	user : {
		type      : String,
		required  : true,
		lowercase : true

	},

	content: {
		type: String,
		required: true
	},

	createdOn : {
		type: Date,
		default: Date.now()
	},

	lastUpdatedOn : {
		type: Date,
		default: Date.now()
	},

	likes : {
		type: Number,
		default: 0
	}
} );

postSchema.methods.toJSON = function () {
	let obj = this.toObject();
	delete obj.__v;
	return obj;
};

module.exports = mongoose.model( 'Post', postSchema );
