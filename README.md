# express-mountables

Complements for express framework: controller, middleware, template and page.

## Installation

`$ npm i -s express-mountables`

## Why?

To have a set of utilities that can easily complement `express` framework.

## Usage

The usage is always the same:

```js
const express = require("express");
const app = express();
const mount = require("express-mountables").mount;

mount.Controller({ app, ...});
mount.ControllerFactory({ app, ...});
mount.Middleware({ app, ...});
mount.MiddlewareFactory({ app, ...});
mount.Template({ app, ...});
mount.Page({ app, ...});

app.listen(8000);
```

Each mountable behaves differently, you only need to know which is more appropiate for each situation.

## Theory

This is a basic vocabulary to understand some differences between some of the controllers.

**Mounting time**: the moment in which a controller is mounted on the app.

**Dispatching time**: the moment in which a controller is dispatching a request.

## Mountables

This is the list of mountables that offers this package:

### Controller

**Description:**

- The `action` or `file` is a function that receives: `request`, `response`, `next`.
- Cannot see parameters provided at **mounting time**.

**Possible parameters:**

- `app`: `Object|Function`, express application or router.
- `method`: `String|Array<String>`, HTTP method(s) covered by the handler. It defaults to `"GET"`.
- `route`: `String|Array<String>`, URL route(s) covered by the handler. It defaults to `"*"`.
- `middleware`: `Function|Array<Function>`, the middleware(s) attached to this controller. It defaults to `[]`.
- `file`: `String`, a `*.js` file that contains the handler. 
- `action`: `Function` that works as the handler. If it is present, it takes preference over `file`.

**Example:**

```js
mount.Controller({
	app,
	method: ["GET", "POST"],
	route: "/",
	middleware: [],
	action: function(request, response, next) {
		response.send("Hi!");
	}
});
```

### ControllerFactory

**Description:**

- The `action` or `file` generates a controller at **mounting time**.
- Can see parameters provided at **mouting time**.

**Possible parameters:** the same as [`Controller`](#controller).

**Example:**

```js
mount.ControllerFactory({
	app,
	method: ["GET", "POST"],
	route: "/",
	middleware: [],
	action: function(parameters, others) {
		return function(request, response, next) {
			response.send("Hi!");
		};
	}
});
```

### Middleware

**Description:**

- The `action` or `file` is a function that receives: `request`, `response`, `next`.
- Cannot see parameters provided at **mounting time**.

**Possible parameters:** the same as [`Controller`](#controller), except `method` (it always uses the method `app.use(...)`).

**Example:**

```js
mount.Middleware({
	app,
	route: "/",
	action: function(parameters, others) {
		return function(request, response, next) {
			response.send("Hi!");
		};
	}
});
```

### MiddlewareFactory

**Description:**

- The `action` or `file` generates a middleware at **mounting time**.
- Can see parameters provided at **mouting time**.

**Possible parameters:** the same as [`Middleware`](#middleware).

**Example:**

```js
mount.MiddlewareFactory({
	app,
	route: "/",
	action: function(parameters, others) {
		return function(request, response, next) {
			response.send("Hi!");
		};
	}
});
```

### Template

**Description:**

- The `template` or `file` provides or points to an `ejs` template that receives: `request`, `response`, `next`, and other parameters too (see below).
- Can see parameters provided at **mounting time**.

**Possible parameters:**

- `app`: the same as [`Controller`](#controller).
- `method`: the same as [`Controller`](#controller).
- `route`: the same as [`Controller`](#controller).
- `middleware`: the same as [`Controller`](#controller).
- `file`: `*.ejs` file that contains a template. 
- `template`: `String`, `ejs` template source code. If it is present, it takes preference over `file`.
- `options`: `Object`, `ejs` render options. You can set the `async` flag to `true` to handle asynchronous templates.
- `onRenderError`: `Function`, function that receives: `error`, `request`, `response`, `next`. It should handle the request, when an error on render arises. There is a default handler that, in `process.env.NODE_ENV === "production"` will show a clean page, but in other cases, it will respond the error as it is.

**Template parameters:**

- `parameters`: the parameters provided to the template mountable.
- `others`: the optional parameters provided to the template mountable.
- `process`: the current node `process` object.
- `require`: the `require` function.
- `request`: the express `request` object.
- `response`: the express `response` object.
- `next`: the express `next` function.
- `all`: all these parameters, for you to find things easily, or continue passing parameters templates down.

**Considerations:**

- When `template` is provided, `ejs` will use the `render` method.
- When `file` is provided (and `template` is not), `ejs` will use the `renderFile` method.
- The default error handler depends on `process.env.NODE_ENV === "production"` boolean.
   - on `production`, the response will be an HTML page hiding the details of the error.
   - on other environments, the response will be the error as it is.
- When you use the `async: true` flag for `ejs`, do `include`s with the `await` keyword.
- When you use the `cache: false` flag for `ejs`, your file will be read in every request.
   - To clear the `ejs` cache, use the method `ejs.clearCache`.
   - Take into account that using this method implies calls to `fs.readFileSync`.

**Example:**

```js
mount.Template({
	app,
	route: "/",
	template: "<div>Hello, <%-request.query.user || others.user %>!</div>",
	options: { async: true, cache: false }
}, {
	user: "anonymous user"
});
```

### Page

**Description:**

- The `template` or `file` provides or points to an `ejs` template that receives: `request`, `response`, `next`, and other parameters too (see below).
- Can see parameters provided at **mounting time**.
- They are rendered as `HTML5` pages.

**Possible parameters:** the same as [`Template`](#template), and also:

- `dependencies`: `Object`. This object represents the known dependencies that a template can include. For example, to include `jQuery` from its CDN, we can do this:

```js
mount.Page({
	app,
	route: "/",
	template: "<% Object.assign(pageDependencies, { jQuery: true }); %><p>Hello, <%-request.query.user || others.user %>!</p>",
	options: { async: true, cache: false },
	dependencies: {
		jQuery: '<script src="https://code.jquery.com/jquery-3.5.1.min.js" defer></script>'
	}
}, { user: "anonymous user" });
```

The `pageDependencies` is a special parameter injected purposedly to the templates that are `Page`s, and not mere `Template`s.

In the **Page parameters** of this section, it is better explained what it is and what it does.

Take into account that the order of the `dependencies` matters: first tags are rendered before.

Use the attribute `defer` to load `<script>` tags asynchronously, but keeping the order in which they are printed.

- `bodyDependencies`: `Object`. The same as the `dependencies` parameter, but instead of inserting them on the `head` of the HTML document, they are inserted in the `body`.


**Page parameters:**

The templates for a `Page` takes the same parameters of a standard [`Template`](#template), but also:

- `pageDependencies`: `Object`. Empty object that the template can extend to include tags in the `head` (or `body`) of the page.

**How does `pageDependencies` template parameter works?**

- The keys of this object **must match** the keys of `dependencies` or `bodyDependencies` objects passed to the `Page` mountable.
- The values **must be** a simple `true` or `false`.
- The values can also be direct `String`s: in that case, the code provided in that `String` is directly injected. In this case, the keys **do not need to match** the  keys at `dependencies` or `bodyDependencies`.
- This object should be passed across all the templates that are being rendered by a specific `Page`, for them to put in `true` their dependencies.
- This way, on the top of each template, we can set to this object the resources that we need for that specific template to render adecuatedly.
- This way, we can define the dependencies (`css`, `js`, `meta` tags, etc.) per each template, and reuse that templates without caring about its dependencies.

## Handlers API

The `Handlers API` lets you reuse the code of the mountables without mounting: you pass the parameters, and you get the controller: the function that can handle (`request`, `response`, `next`) parameters.

Every `mountable` has its `handler` defined separatedly.

You only need to access to it, and instantiate it the same way you would do with the `mountable`.

The only difference between the `mountables` and the `handlers` are the parameters that are not required by the handler specifically.

For example, the handlers do not require:

  - `app`: a `handler` does not need to know about the `app` or `router` used to mount itself.
  - `method`: a `handler` does not need to know which is the method of the request.
  - `route`: a `handler` does not need to know the route in which, as `mountable`, it used be restricted to.
  - `middleware`: a `handler` does not need to know the middlewares that, as `mountable`, it should apply before the handler to be executed.

## Utilities API

The following methods are also available from the package to reuse them at convenience:

  - `mountables.createParameters(params = {})`. Method to create the parameters used by the templates.
  - `mountables.wrapPage(contents = "", dependencies = {}, headDeps = {}, bodyDeps = {})`. Method to wrap the contents of an HTML5 document.
  - `mountables.errorHandler(error, request, response, next)`. Method to handle errors in production or non-production environments.

## License

This project is licensed under [WTFPL or What The Fuck Public License](https://en.wikipedia.org/wiki/WTFPL), which means, in short terms, *do what you want*.

## Issues

Please, address issues [here](https://github.com/allnulled/express-mountables/issues).