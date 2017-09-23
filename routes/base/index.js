let express = require( 'express' ),
		router  = express.Router();

//POST
router.get( '/', ( req, res ) => {
	res.render( 'index' );
} );

module.exports = router;
