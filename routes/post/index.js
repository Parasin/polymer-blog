const Post      = require( '../../models/post/' ),
			tokenUtil = require( '../../lib/token.js' ),
			_         = require( 'underscore' );

let express = require( 'express' ),
		router  = express.Router();

/************************
 * AUTHENTICATED ROUTES *
 ***********************/

//POST
router.post( '/', tokenUtil.isAuthenticated, ( req, res ) => {

	if ( !req.body ) {
		return res.status( 400 ).send( {
			error : 'Invalid request; missing post data'
		} );
	}

	let post = new Post( _.pick( req.body, 'userName', 'content', 'createdOn', 'lastUpdatedOn', 'likes' ) );

	post.save( ( err, result ) => {
		if ( err ) {
			return res.status( 500 ).send( err );
		} else if ( !result ) {
			return res.status( 404 ).send( { error : 'No post found' } );
		}
		return res.send( result );
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

	let post           = _.pick( body, 'userName', 'content', 'createdOn', 'lastUpdatedOn', 'likes' );
	post.lastUpdatedOn = Date.now();

	Post.update( { _id : req.params.id }, post, ( err, result ) => {
		if ( err ) {
			return res.status( 500 ).send( err );
		} else if ( !result ) {
			return res.status( 404 ).send( { error : 'No post found' } );
		}

		return res.send( result );
	} );
} );

//DELETE :id
router.delete( '/:id', tokenUtil.isAuthenticated, ( req, res ) => {
	Post.remove( { _id : req.params.id }, ( err, post ) => {
		if ( err ) {
			return res.status( 500 ).send( err );
		} else if ( !post ) {
			return res.status( 404 ).send( { error : 'No post found' } );
		}

		return res.send( post );
	} );
} );


/***************
 * OPEN ROUTES *
 **************/

//GET /user/:userName
router.get( '/user/:userName', ( req, res ) => {
	Post.find( { userName : req.params.userName }, ( err, post ) => {
		if ( err ) {
			return res.status( 500 ).send( { error : 'Problem finding post' } );
		} else if ( !post ) {
			return res.status( 404 ).send( { error : 'No post found' } );
		}

		return res.send( post );
	} ).catch( ( err ) => {
		res.status( err.statusCode ).send( err );
	} );
} );

//GET :id
router.get( '/:id', ( req, res ) => {
	Post.findById( { _id : req.params.id }, ( err, post ) => {
		if ( err ) {
			return res.status( 500 ).send( { error : 'Problem finding post' } );
		} else if ( !post ) {
			return res.status( 404 ).send( { error : 'No post found' } );
		}

		return res.send( post );
	} );
} );

//GET
router.get( '/', ( req, res ) => {
	Post.find( ).sort( { createdOn : -1 } ).limit( 10 ).then( ( docs ) => {
		if ( !docs ) {
			return res.status( 404 ).send( { error : 'No post found' } );
		}

		return res.send( docs );
	} ).catch( ( err ) => {
		return res.status( 500 ).send( { error : 'Problem finding post', err: err } );
	} );

} );

module.exports = router;
