const User        = require( '../../models/user/' ),
			AuthService = require( '../../lib/authService' ),
			tokenUtil   = require( '../../lib/token.js' ),
			_           = require( 'underscore' );

let express = require( 'express' ),
		router  = express.Router();

//POST
router.post( '/', ( req, res ) => {

	if ( !req.body ) {
		return res.status( 400 ).send( {
			error : 'Invalid request; missing user data'
		} );
	}

	let path          = 'auth',
			requestObject = {
				method  : 'POST',
				uri     : AuthService.computeUri( path ),
				json    : req.body,
				headers : { 'Content-Type' : 'application/json' }
			};
	AuthService.request( requestObject ).then( ( result ) => {
		if ( result ) {
			let token = tokenUtil.verify( result.body.token );
			res.send( { user: token, token: result.body.token } );
		}
	} ).catch( ( err ) => {
		res.status( err.statusCode ).send( err );
	} );

} );

module.exports = router;
