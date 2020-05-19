module.exports = function mountMiddlewareFactory(parameters, others = {}) {
	const {
		app = false,
		route = "*",
		file = false,
		middleware = [],
		action = false,
	} = parameters;
	if(!app) {
		throw new Error("Required parameter <app>");
	}
	if(!(action || file)) {
		throw new Error("Required parameter <action> or <file>.");
	}
	const middlewareFactory = action ? action : require(file);
	const specificMiddleware = middlewareFactory(parameters, others);
	app.use(route, middleware, specificMiddleware);
	return;
};