const mongoose = require( 'mongoose' );

let userSchema = mongoose.Schema( {
	userName : {
		type      : String,
		required  : true,
		unique    : true,
		lowercase : true,
		index     : true
	},

	email : {
		type      : String,
		required  : true,
		unique    : true,
		lowercase : true,
		index     : true
	},

	friends : {
		type    : Array,
		default : []
	},

	subscriptions : {
		type    : Array,
		default : []
	},

	_id : {
		type     : mongoose.Schema.Types.ObjectId,
		required : true,
		index    : true
	}
} );

userSchema.methods.toJSON = function () {
	let obj = this.toObject();
	delete obj.__v;
	return obj;
};

module.exports = mongoose.model( 'User', userSchema );
