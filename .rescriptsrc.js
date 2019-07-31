// R CMD CHECK doesn't like filenames with tilde in them,
// so change build output to use underscore instead of tilde
//
// https://stackoverflow.com/questions/56203855/create-react-app-build-files-tilde-character
module.exports = config => {
	config.optimization.splitChunks.automaticNameDelimiter = '_';
		if (config.optimization.runtimeChunk) {
			config.optimization.runtimeChunk = {
				name: entrypoint => `runtime_${entrypoint.name}`
			};
		}
	return config;
};
