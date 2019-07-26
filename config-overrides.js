class FixWebWorkerHMRPlugin {
    apply(compiler) {
        console.log("Inside plugin");
        compiler.options.output.globalObject = '(typeof self !== "undefined" ? self : this)';
    }
}

module.exports = function override(config, env) {
    config.module.rules.push(
        {
            test: /\.worker\.(js|ts)$/,
            use: { loader: "worker-loader?inline=true" }
        }/*{ test: /\.worker\.(js|ts)$/, loader: 'worker-loader', options: { inline: true } })*/;
    config.output.globalObject = '(typeof self !== "undefined" ? self : this)';
    config.plugins.push(new FixWebWorkerHMRPlugin());
    return config;
};
