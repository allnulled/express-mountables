const { expect } = require("chai");
const express = require("express");
const app = express();
const { mount } = require(__dirname + "/../index.js");
const axios = require("axios");

describe("Express mountables", function() {
	
	this.timeout(1000 * 5);

	let counter = 0;
	let server = undefined;

	const increaseCounter = function(request, response, next) {
		counter++;
		next();
	};

	before(function() {
		
		mount.Controller({
			app,
			route: "/controller",
			middleware: [increaseCounter],
			action: function(request, response, next) {
				return response.send("ok.1");
			}
		});
		
		mount.ControllerFactory({
			app,
			route: "/controller-factory",
			middleware: [increaseCounter],
			action: function(parameters, others) {
				return function(request, response, next) {
					return response.send("ok." + others.index);
				}
			}
		}, { index: 100 });
		
		mount.Middleware({
			app,
			route: "/middleware",
			middleware: [increaseCounter],
			action: function(request, response, next) {
				return response.send("ok.2");
			}
		});
		
		mount.MiddlewareFactory({
			app,
			route: "/middleware-factory",
			middleware: [increaseCounter],
			action: function(parameters, others) {
				return function(request, response, next) {
					return response.send("ok." + others.index);
				}
			}
		}, { index: 200 });
		
		mount.Template({
			app,
			method: ["GET", "POST"],
			route: "/template",
			middleware: [increaseCounter],
			template: "ok.<%-others.index%>"
		}, { index: 300 });
		
		mount.Page({
			app,
			method: ["GET", "POST"],
			route: "/page",
			dependencies: {
				helloTitle: "<title>Hello</title>"
			},
			middleware: [increaseCounter],
			template: "<% Object.assign(pageDependencies, { helloTitle: true }) %>ok.<%-others.index%>"
		}, { index: 400 });

		server = app.listen(8008);
		
	});

	after(function() {
		server.close();
	});

	it("mount.Controller", function(done) {
		axios.get("http://127.0.0.1:8008/controller").then(function({ data }) {
			expect(data).to.equal("ok.1");
			done();
		}).catch(done);
	});

	it("mount.ControllerFactory", function(done) {
		axios.get("http://127.0.0.1:8008/controller-factory").then(function({ data }) {
			expect(data).to.equal("ok.100");
			done();
		}).catch(done);
	});

	it("mount.Middleware", function(done) {
		axios.post("http://127.0.0.1:8008/middleware").then(function({ data }) {
			expect(data).to.equal("ok.2");
			done();
		}).catch(error => {
			console.log(error);
		});
	});

	it("mount.MiddlewareFactory", function(done) {
		axios.post("http://127.0.0.1:8008/middleware-factory").then(function({ data }) {
			expect(data).to.equal("ok.200");
			done();
		}).catch(done);
	});

	it("mount.Template", function(done) {
		axios.post("http://127.0.0.1:8008/template").then(function({ data }) {
			expect(data).to.equal("ok.300");
			done();
		}).catch(done);
	});

	it("mount.Page", function(done) {
		axios.post("http://127.0.0.1:8008/page").then(function({ data }) {
			expect(data.indexOf("<title>Hello</title>")).to.not.equal(-1);
			expect(data.indexOf("ok.400")).to.not.equal(-1);
			done();
		}).catch(done);
	});

	it("worked with middleware", function(done) {
		expect(counter).to.equal(6);
		done();
	});

});