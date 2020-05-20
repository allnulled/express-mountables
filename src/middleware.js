const middlewareHandler = require(__dirname + "/handler/middleware.js");

module.exports = function mountMiddleware(parameters) {
	const {
		app = false,
		route = "*",
		middleware = [],
	} = parameters;
	if(!app) {
		throw new Error("Required parameter <app>");
	}
	const controller = middlewareHandler(parameters);
	app.use(route, middleware, controller);
	return;
};