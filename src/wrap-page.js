module.exports = function(contents, dependencies, headDependencies = {}, bodyDependencies = {}) {
	let headText = "";
	let bodyText = "";
	for(const dependencyID in dependencies) {
		if(dependencies[dependencyID] === true) {
			if(dependencyID in headDependencies) {
				headText += headDependencies[dependencyID];
			} else if(dependencyID in bodyDependencies) {
				bodyText += bodyDependencies[dependencyID];
			} else {
				headText += "<!-- Dependency not found: " + dependencyID + " -->";
			}
		} else if(typeof dependencies[dependencyID] === "string") {
			headText += dependencies[dependencyID];
		}
	}
	return `<!DOCTYPE html>
	<html>
		<head>
			${headText}
		</head>
		<body>
			${contents}
			${bodyText}
		</body>
	</html>`
};