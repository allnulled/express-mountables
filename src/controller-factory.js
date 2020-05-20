const controllerFactoryHandler = require(__dirname + "/handler/controller-factory.js");

module.exports = function mountControllerFactory(parameters, others = {}) {
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
	const controller = controllerFactoryHandler(parameters, others);
	for (let index = 0; index < methods.length; index++) {
		const routeMethod = methods[index];
		app[routeMethod.toLowerCase()](route, middleware, controller);
	}
	return;
};