module.exports = function controllerHandler(parameters) {
	const {
		file = false,
		action = false,
	} = parameters;
	if(!(action || file)) {
		throw new Error("Required parameter <action> or <file>.");
	}
	const controller = action ? action : require(file);
	return controller;
};