const templateHandler = require(__dirname + "/handler/template.js");

module.exports = function mountTemplate(parameters, others = {}) {
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
	const controller = templateHandler(parameters, others);
	for (let index = 0; index < methods.length; index++) {
		const routeMethod = methods[index];
		app[routeMethod.toLowerCase()](route, middleware, controller);
	}
	return;
};