const config = require( '../config' ),
			User   = require( './user' ),
			Post   = require( './post' ),
			Auth   = require( './auth' ),
			Base   = require( './base' );

let routes = ( app ) => {
	app.use( ( req, res, next ) => {
		res.setHeader( 'Access-Control-Allow-Origin', '*' );
		res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE' );
		res.setHeader( 'Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token' );
		res.setHeader( 'Access-Control-Allow-Credentials', true );
		res.removeHeader( 'X-Powered-By' );
		next();
	} );

	if ( process.env.ENV === 'Production' ) {
		app.use( `${config.appRoot}`, ( req, res, next ) => {
			return next();
		}, Base );

		app.use( `${config.appRoot}user`, ( req, res, next ) => {
			return next();
		}, User );

		app.use( `${config.appRoot}post`, ( req, res, next ) => {
			return next();
		}, Post );

		app.use( `${config.appRoot}auth`, ( req, res, next ) => {
			return next();
		}, Auth );
	} else {
		app.use( `${config.appRoot}`, secureRequest, ( req, res, next ) => {
			return next();
		}, Base );

		app.use( `${config.appRoot}user`, secureRequest, ( req, res, next ) => {
			return next();
		}, User );

		app.use( `${config.appRoot}post`, secureRequest, ( req, res, next ) => {
			return next();
		}, Post );

		app.use( `${config.appRoot}auth`, secureRequest, ( req, res, next ) => {
			return next();
		}, Auth );
	}
};

function secureRequest( req, res, next ) {
	if( req.headers['x-forwarded-proto'] === 'https' ) {
		// OK, continue
		return next( );
	}

	if ( req.baseUrl === '/metrics' ) {
		res.redirect( 'https://' + req.headers.host + '/metrics' );
	} else {
		res.redirect( 'https://' + req.headers.host + '/assess' + req.path );
	}

}

module.exports = routes;
