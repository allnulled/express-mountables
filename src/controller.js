const controllerHandler = require(__dirname + "/handler/controller.js");

module.exports = function mountController(parameters) {
	const {
		app = false,
		method = "get",
		route = "*",
		middleware = [],
	} = parameters;
	if(!app) {
		throw new Error("Required parameter <app>");
	}
	const methods = [].concat(method);
	const controller = controllerHandler(parameters);
	for (let index = 0; index < methods.length; index++) {
		const routeMethod = methods[index];
		app[routeMethod.toLowerCase()](route, middleware, controller);
	}
	return;
};