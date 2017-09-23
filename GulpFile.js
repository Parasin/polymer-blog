const gulp        = require( 'gulp' ),
			$           = require( 'gulp-load-plugins' )(),
			uglify      = require( 'gulp-uglify' ),
			vulcanize   = require( 'gulp-vulcanize' ),
			crisper     = require( 'gulp-crisper' ),
			runSequence = require( 'run-sequence' ),
			htmlmin     = require( 'gulp-htmlmin' ),
			babel       = require( 'gulp-babel' ),
			polymerLint = require( 'polymer-lint/gulp' ),
			gzip        = require( 'gulp-gzip' ),
			finder      = require( 'findit' )( '.' );

gulp.task( 'default', function ( cb ) {
	runSequence(
			'lint',
			'build',
			'minify',
			cb );
} );

gulp.task( 'lint', function ( cb ) {
	runSequence(
			'jshint',
			'polymerlint',
			cb
	);
} );

gulp.task( 'compress', () => {
	gulp.src( 'public/components/prod/*.js' )
			.pipe( gzip() )
			.pipe( gulp.dest( 'public/components/prod/' ) );
} );

gulp.task( 'transpile', () => {
	return gulp.src( 'public/components/prod/*.js' )
			.pipe( babel( {
				presets : [ 'es2015' ]
			} ) )
			.pipe( gulp.dest( 'public/components/prod/' ) );
} );

gulp.task( 'compress', function () {
	gulp.src( [ 'public/components/prod/*.js' ] )
			.pipe( uglify() )
			.on( 'error', function ( err ) {
				console.log( err.toString() );
			} )
			.pipe( gulp.dest( 'public/components/prod/' ) );
} );

gulp.task( 'minify', function () {
	return gulp.src( 'public/components/prod/sus-app.html' )
			.pipe( htmlmin( { collapseWhitespace : true } ) )
			.pipe( gulp.dest( 'public/components/prod' ) );
} );

/* npm install -g vulcanize (will prodify polymer components)
   npm install -g gulp-crisper
   CLI: vlucanize dir/to/your/elements.html (will traverse the imports and concat them into a single file to reduce http requests)
   Manual way to output to file:
    mkdir -p a/new/path
    vulcanize dir/to/your/elements.html > a/new/path/elements.html 'OR'
    vulcanize dir/to/your/elements.html -o a/new/path/elements.html --inline-scripts --inline-css --strip-comments

   Through GULP
    npm install --save-dev gulp gulp-vulcanize
    */
gulp.task( 'build', function () {
	return gulp.src( [ 'public/src/blog-app.html' ] ).pipe( vulcanize( {
		stripComments : true,
		inlineScripts : true,
		inlineCss     : true
	} ) )
			.pipe( crisper() )
			.pipe( gulp.dest( 'public/components/prod/' ) );
} );

gulp.task( 'polymerlint', () => {
	return gulp.src( 'public/src/*.html' )
			.pipe( polymerLint() )
			.pipe( polymerLint.report() )
			.pipe( gulp.dest( './public/src' ) );
} );

gulp.task( 'jshint', [], () => {
	finder.on( 'file', ( file, stat, stop ) => {

		if ( !file.includes( 'node_modules' ) &&
				!file.includes( '.git' ) &&
				!file.includes( 'bower_components' ) &&
				!file.includes( 'prod' ) ) {

			if ( file.split( '.' ).pop() == 'js' ) {
				return gulp.src( file ).pipe( $.jshint( {
					'esversion' : 6
				} ) ).pipe( $.jshint.reporter( require( 'jshint-stylish' ) ) );
			}
		}
	} );
} );
