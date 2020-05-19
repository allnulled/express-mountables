module.exports = function(data) {
	const all = {
		process,
		require,
		...data,
	};
	all.all = all;
	return all;
};