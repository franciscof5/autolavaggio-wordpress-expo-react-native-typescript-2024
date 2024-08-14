module.exports = function(api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
  };
};

// module.exports = function(api) {
//   api.cache(false);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       [
//         'module:react-native-dotenv',{
//           "moduleName": "@env",
//           "path": ".env",
//         }
//       ]
//     ]
//   };
// };

// module.exports = function(api) {
//   api.cache(false);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       [
//         'module:react-native-dotenv',
//         {
//           moduleName: 'react-native-dotenv',
//           verbose: false,
//         },
//       ],
//     ],
//   };
// };
// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     ["module:react-native-dotenv", {
//       "envName": "APP_ENV",
//       "moduleName": "@env",
//       "path": ".env",
//       "safe": false,
//       "allowUndefined": true,
//       "verbose": false
//     }]
//   ]
// };

// module.exports = function(api) {
//   api.cache(false);
//   return {
//     presets: ['babel-preset-expo'],
//     env: {
//       production: {
//         plugins: ['react-native-paper/babel', 'module:react-native-dotenv',
//         {
//           envName: 'APP_ENV',
//           moduleName: '@env',
//           path: '.env',
//           blocklist: null,
//           allowlist: null,
//           blacklist: null, // DEPRECATED
//           whitelist: null, // DEPRECATED
//           safe: false,
//           allowUndefined: true,
//           verbose: false,
//         },],
//       },
//     },
//   };
// };

