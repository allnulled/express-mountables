const ejs = require("ejs");
const createParameters = require(__dirname + "/../create-parameters.js");
const errorHandler = require(__dirname + "/../error-handler.js");

module.exports = function templateHandler(parameters, others = {}) {
	const {
		file = false,
		template = false,
		options = {},
		onRenderError = errorHandler,
	} = parameters;
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
		});
		if(file) {
			ejs.renderFile(file, templateParameters, options, function(error, output) {
				if(error) {
					onRenderError(error, request, response, next);
					return;
				}
				response.send(output);
				return;
			});
			return;
		} else if(options.async) {
			ejs.render(template, templateParameters, options)
				.then(function(output) {
					response.send(output);
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
				response.send(output);
				return;
			} catch(error) {
				onRenderError(error, request, response, next);
				return;
			}
		}
	}
	return controller;
};