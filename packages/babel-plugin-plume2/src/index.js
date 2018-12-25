const debug = require("debug")("babel-plugin-plume2");
const isProd = (process.env.BABEL_ENV || process.env.NODE_ENV) === "production";

debug("production env? ", isProd);

/**
 * 判断当前的call-expression是不是require('react-dom')
 * @param {*} t
 * @param {*} path
 */
function isRequireReactDOM(t, path) {
  return (
    t.isIdentifier(path.node.callee, { name: "require" }) &&
    path.get("arguments.0").isStringLiteral({ value: "react-dom" })
  );
}

function isPlume2QL(t, path) {
  return t.isIdentifier(path.node.callee, { name: "QL" });
}

function isStoreProvider(t, path) {
  return t.isIdentifier(path.node.callee, { name: "StoreProvider" });
}

module.exports = function(babel) {
  var t = babel.types;

  return {
    visitor: {
      /**
       * if current env is react-native
       * import ReactDOM from 'react-dom' => import ReactDOM from 'react-native'
       * @param {*} path
       * @param {*} param1
       */
      ImportDeclaration(path, { opts }) {
        if (
          opts.reactnative &&
          t.isStringLiteral(path.node.source, {
            value: "react-dom"
          })
        ) {
          path.node.source = t.StringLiteral("react-native");
        }
      },

      /**
       * @param {*} path
       * @param {*} param1
       */
      CallExpression(path, { opts }) {
        /**
         * if current env is react-native
         * var ReactDOM = require('react-dom') => var ReactDOM = require('react-native');
         */
        if (opts.reactnative && isRequireReactDOM(t, path)) {
          debug(`react-native env replace react-dom -> react-native`);
          path.node.arguments[0] = t.StringLiteral("react-native");
          return;
        }

        /**
         * if current env is production
         * transform
         * const helloQL = QL('helloQL', [...])
         * to =>
         * const helloQL = QL('', [....])
         * reduce javascript size
         */
        // if (isProd && isPlume2QL(t, path)) {
        //   const qlName = path.get('arguments.0').node.value;
        //   if (qlName) {
        //     debug(`optimize %s to empty str`, qlName);
        //     //assign empty string
        //     path.get('arguments.0').node.value = '';
        //   }
        //   return;
        // }

        /**
         * if current env is production
         * transform
         * StoreProvider(AppStore, {debug: true})
         * to =>
         * StoreProvider(AppStore)
         */
        if (isProd && isStoreProvider(t, path)) {
          if (path.get("arguments") && path.get("arguments").length > 1) {
            //get opts arguments
            const opts = path.get("arguments.1");
            opts && opts.remove();
            debug(`optimize StoreProvider opts`);
            return;
          }
        }
      }
    }
  };
};
