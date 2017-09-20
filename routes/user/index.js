const User        = require( '../../models/user/' ),
			AuthService = require( '../../lib/authService' ),
			tokenUtil   = require( '../../lib/token.js' ),
			_           = require( 'underscore' );

let express = require( 'express' ),
		router  = express.Router();

/************************
 * AUTHENTICATED ROUTES *
 ***********************/

//GET
router.get( '/', tokenUtil.isAuthenticated, ( req, res ) => {
	let path          = 'user',
			token         = tokenUtil.verify( req.encodedToken ),
			requestObject = {
				method  : 'GET',
				uri     : AuthService.computeUri( path ),
				headers : { 'Content-Type' : 'application/json', 'x-access-token' : req.encodedToken }
			};

	AuthService.request( requestObject ).then( ( result ) => {
		User.findById( { _id : token._id }, ( err, user ) => {
			if ( err ) {
				return res.status( 500 ).send( { error : 'Problem finding user' } );
			} else if ( !user ) {
				return res.status( 404 ).send( { error : 'No user found' } );
			}

			result.body.friends       = user.friends;
			result.body.subscriptions = user.subscriptions;

			return res.send( result );
		} ).catch( ( err ) => {
			res.status( err.statusCode ).send( err );
		} );
	} );
} );

//GET :id
router.get( '/:id', tokenUtil.isAuthenticated, ( req, res ) => {
	let path          = 'user/' + req.params.id,
			requestObject = {
				method  : 'GET',
				uri     : AuthService.computeUri( path ),
				headers : { 'Content-Type' : 'application/json', 'x-access-token' : req.encodedToken },
				params  : req.params.id
			};

	AuthService.request( requestObject ).then( ( result ) => {
		User.findById( { _id : req.params.id }, ( err, user ) => {
			if ( err ) {
				return res.status( 500 ).send( { error : 'Problem finding user' } );
			} else if ( !user ) {
				return res.status( 404 ).send( { error : 'No user found' } );
			}

			result.body.friends       = user.friends;
			result.body.subscriptions = user.subscriptions;

			return res.send( result );
		} ).catch( ( err ) => {
			res.status( err.statusCode ).send( err );
		} );
	} );
} );

//PUT :id
router.put( '/:id', tokenUtil.isAuthenticated, ( req, res ) => {
	let body = req.body;

	if ( !body ) {
		return res.status( 400 ).send( {
			error : 'Invalid request; missing user data'
		} );
	}

	let path          = 'user/' + req.params.id,
			user          = _.pick( body, 'userName', 'email', 'friends', 'subscriptions' ),
			requestObject = {
				method  : 'PUT',
				uri     : AuthService.computeUri( path ),
				headers : { 'Content-Type' : 'application/json', 'x-access-token' : req.encodedToken },
				params  : req.params.id,
				json    : true,
				body    : _.pick( body, 'userName', 'email', 'primaryPhone', 'lastLogin', 'gender', 'age', 'firstName', 'lastName' )
			};

	User.update( { _id : req.params.id }, user, ( err, user ) => {
		if ( err ) {
			return res.status( 500 ).send( err );
		} else if ( !user ) {
			return res.status( 404 ).send( { error : 'No user found' } );
		}

		AuthService.request( requestObject ).then( ( result ) => {
			res.send( result );
		} ).catch( ( err ) => {
			console.log( err );
			res.status( err.statusCode ).send( err );
		} );
	} );
} );

//DELETE :id
router.delete( '/:id', tokenUtil.isAuthenticated, ( req, res ) => {
	let path          = 'user/' + req.params.id,
			requestObject = {
				method  : 'DELETE',
				uri     : AuthService.computeUri( path ),
				headers : { 'Content-Type' : 'application/json', 'x-access-token' : req.encodedToken },
				params  : req.params.id
			};

	AuthService.request( requestObject ).then( ( result ) => {
		User.remove( { _id : req.params.id }, ( err, user ) => {
			if ( err ) {
				return res.status( 500 ).send( err );
			} else if ( !user ) {
				return res.status( 404 ).send( { error : 'No user found' } );
			}
			result.body.friends       = user.friends;
			result.body.subscriptions = user.subscriptions;

			return res.send( result );
		} );
	} ).catch( ( err ) => {
		res.status( err.statusCode ).send( err );
	} );
} );


/***************
 * OPEN ROUTES *
 **************/

//POST
router.post( '/', ( req, res ) => {

	if ( !req.body ) {
		return res.status( 400 ).send( {
			error : 'Invalid request; missing user data'
		} );
	}

	let path          = 'user',
			requestObject = {
				method  : 'POST',
				uri     : AuthService.computeUri( path ),
				json    : req.body,
				headers : { 'Content-Type' : 'application/json' }
			};

	AuthService.request( requestObject ).then( ( result ) => {
		if ( result ) {
			let token = tokenUtil.verify( result.body.token ),
					user  = new User( token );

			user.save( ( err, user ) => {
				if ( err ) {
					return res.status( 500 ).send( err );
				} else if ( !user ) {
					return res.status( 404 ).send( { error : 'No user found' } );
				}
			} );

			result.body.friends       = user.friends;
			result.body.subscriptions = user.subscriptions;

			return res.send( result );
		}
	} ).catch( ( err ) => {
		res.status( err.statusCode ).send( err );
	} );

} );

module.exports = router;
