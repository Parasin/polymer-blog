const jwt    = require( 'jsonwebtoken' ),
			config = require( '../config' );

const token = {
	verify : function ( token ) {
		return jwt.verify( token, config.secret, function ( err, result ) {
			if ( err ) {
				return { auth : false, message : 'Failed to authenticate token.' };
			}
			return result;
		} );
	},

	sign : function ( user, expiresIn ) {
		return jwt.sign( user, config.secret, {
			expiresIn : expiresIn
		} );
	},

	isAuthenticated : function ( req, res, next ) {
		let token = req.headers[ 'x-access-token' ];

		jwt.verify( token, config.secret, function ( err ) {
			if ( err ) {
				return res.status( 500 ).send( { auth : false, message : 'Failed to authenticate token.' } );
			}
			req.encodedToken = token;
			next();
		} );
	}
};

module.exports = token;
