const middlewareFactoryHandler = require(__dirname + "/handler/middleware-factory.js");

module.exports = function mountMiddlewareFactory(parameters, others = {}) {
	const {
		app = false,
		route = "*",
		middleware = [],
	} = parameters;
	if(!app) {
		throw new Error("Required parameter <app>");
	}
	const controller = middlewareFactoryHandler(parameters, others);
	app.use(route, middleware, controller);
	return;
};