module.exports = function controllerFactoryHandler(parameters, others = {}) {
	const {
		file = false,
		action = false,
	} = parameters;
	if(!(action || file)) {
		throw new Error("Required parameter <action> or <file>.");
	}
	const controllerFactory = action ? action : require(file);
	const controller = controllerFactory(parameters, others);
	return controller;
};