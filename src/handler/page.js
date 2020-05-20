const ejs = require("ejs");
const createParameters = require(__dirname + "/../create-parameters.js");
const errorHandler = require(__dirname + "/../error-handler.js");
const wrapPage = require(__dirname + "/../wrap-page.js")

module.exports = function pageHandler(parameters, others = {}) {
	const {
		app = false,
		method = "get",
		route = "*",
		middleware = [],
		file = false,
		template = false,
		options = {},
		onRenderError = errorHandler,
		dependencies = {},
		bodyDependencies = {},
	} = parameters;
	if(!app) {
		throw new Error("Required parameter <app>");
	}
	if(!(template || file)) {
		throw new Error("Required parameter <template> or <file>.");
	}
	const methods = [].concat(method);
	const controller = function(request, response, next) {
		const templateParameters = createParameters({
			parameters,
			others,
			request,
			response,
			next,
			pageDependencies: {},
		});
		if(file) {
			ejs.renderFile(file, templateParameters, options, function(error, output) {
				if(error) {
					onRenderError(error, request, response, next);
					return;
				}
				const page = wrapPage(output, templateParameters.pageDependencies, dependencies, bodyDependencies);
				response.send(page);
				return;
			});
			return;
		} else if(options.async) {
			ejs.render(template, templateParameters, options)
				.then(function(output) {
					const page = wrapPage(output, templateParameters.pageDependencies, dependencies, bodyDependencies);
					response.send(page);
					return;
				})
				.catch(function(error) {
					onRenderError(error, request, response, next);
					return;
				});
			return;
		} else {
			try {
				const output = ejs.render(template, templateParameters, options);
				const page = wrapPage(output, templateParameters.pageDependencies, dependencies, bodyDependencies);
				response.send(page);
				return;
			} catch(error) {
				onRenderError(error, request, response, next);
				return;
			}
		}
	}
	return controller;
};