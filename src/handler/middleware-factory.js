module.exports = function middlewareFactoryHandler(parameters, others = {}) {
	const {
		file = false,
		action = false,
	} = parameters;
	if(!(action || file)) {
		throw new Error("Required parameter <action> or <file>.");
	}
	const middlewareFactory = action ? action : require(file);
	const controller = middlewareFactory(parameters, others);
	return controller;
};