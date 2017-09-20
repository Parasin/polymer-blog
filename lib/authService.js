const request = require( 'request' );

let auth = {
	computeUri : ( path ) => {
		return 'http://localhost:3000/' + path;
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
						error      : typeof(response.body) === 'string' ? JSON.parse( response.body ) : response.body
					} );
				}
				resolve( {
					success : true,
					body    : typeof (response.body) === 'string' ? JSON.parse( response.body ) : response.body
				} );
			} );
		} );
	}
};

module.exports = auth;

