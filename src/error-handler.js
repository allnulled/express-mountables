module.exports = function(error, request, response, next) {
	if(process.env.NODE_ENV === "production") {
		return response.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<meta charset="utf8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Sorry</title>
				</head>
				<body>
					<header>
						<h1>Sorry...</h1>
						<h3>This is a bit embarrassing.</h3>
					</header>
					<main>
						<p>The machine has had problems processing this request.</p>
						<p>Please, contact to the administrator if the problem remains.</p>
						<p>Thank you for your comprehension.</p>
					</main>
					<footer>
						<p style="font-size:9px;">Machines sometimes fail, and so do humans. Please, be comprehensive. Thank you.</p>
					</footer>
				</body>
			</html>
		`);
	} else {
		return response.send(error);
	}
}