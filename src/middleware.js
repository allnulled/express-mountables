module.exports = function mountMiddleware(parameters) {
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
	const specificMiddleware = action ? action : require(file);
	app.use(route, middleware, specificMiddleware);
	return;
};