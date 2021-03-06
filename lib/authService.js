const request = require( 'request' ),
			config  = require( '../config' );

let auth = {
	computeUri : ( path ) => {
		return config.authServiceUrl + path;
	},

	request : ( requestObject ) => {
		return new Promise( ( resolve, reject ) => {
			request( requestObject, ( err, response ) => {
				if ( err ) {
					reject( {
						success : false,
						error   : err
					} );
				} else if ( ( response.statusCode === 400 ) || ( response.statusCode === 404 ) || ( response.statusCode === 500 ) ) {
					reject( {
						success    : false,
						statusCode : response.statusCode,
						error      : response.body
					} );
				}
				resolve( {
					success : true,
					body    : response.body
				} );
			} );
		} );
	}
};

module.exports = auth;

