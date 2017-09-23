let configs = {
	dbUrl          : process.env.DBURL || 'mongodb://localhost:27017/blog',
	appRoot        : process.env.APPROOT || '/',
	authServiceUrl : process.env.AUTHSERVICEURL || 'http://localhost:3000/',
	env            : process.env.ENV || 'dev',
	secret         : process.env.SECRET || 'superSecret',
	port           : process.env.PORT || 3001,
	token          : ''
};

module.exports = configs;
