module.exports = {
	mount: {
		Controller: require(__dirname + "/src/controller.js"),
		ControllerFactory: require(__dirname + "/src/controller-factory.js"),
		Middleware: require(__dirname + "/src/middleware.js"),
		MiddlewareFactory: require(__dirname + "/src/middleware-factory.js"),
		Template: require(__dirname + "/src/template.js"),
		Page: require(__dirname + "/src/page.js"),
	},
	createParameters: require(__dirname + "/src/create-parameters.js"),
	errorHandler: require(__dirname + "/src/error-handler.js"),
	wrapPage: require(__dirname + "/src/wrap-page.js"),
};