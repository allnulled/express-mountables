module.exports = function mountControllerFactory(parameters, others = {}) {
	const {
		app = false,
		method = "get",
		route = "*",
		middleware = [],
		file = false,
		action = false,
	} = parameters;
	if(!app) {
		throw new Error("Required parameter <app>");
	}
	if(!(action || file)) {
		throw new Error("Required parameter <action> or <file>.");
	}
	const controllerFactory = action ? action : require(file);
	const methods = [].concat(method);
	for (let index = 0; index < methods.length; index++) {
		const routeMethod = methods[index];
		const controller = controllerFactory(parameters, others);
		app[routeMethod.toLowerCase()](route, middleware, controller);
	}
	return;
};