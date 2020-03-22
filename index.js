const escapeRegExp = require('lodash/escapeRegExp');
const semver = require('semver');
const webpack = require('webpack');

const getReplacePlugin = (module) => {
  try {
    const modPath = require.resolve(module);
    const segment = escapeRegExp(modPath.slice(modPath.indexOf(module)));
    return new webpack.NormalModuleReplacementPlugin(
      new RegExp(segment, 'i'),
      `${__dirname}/shims/${module}.js`,
    );
  } catch (err) {
    return { apply() {} };
  }
};

class UnpolyfillPlugin {
  constructor({ reactVersion = '16.0.0' }) {
    this.reactVersion = reactVersion;

    this.replaceContext = getReplacePlugin('create-react-context');
    this.replacePolyfill = getReplacePlugin('react-lifecycles-compat');
  }

  apply(compiler) {
    if (semver.gte(this.reactVersion, '16.3.0')) {
      this.replaceContext.apply(compiler);
      this.replacePolyfill.apply(compiler);
    }
  }
}

module.exports = UnpolyfillPlugin;
