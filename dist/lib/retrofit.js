"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Token = exports.OnRefreshToken = exports.Auth = exports.Delete = exports.Update = exports.Put = exports.Post = exports.Get = void 0;

var _axios = _interopRequireWildcard(require("axios"));

var _asyncStorage = _interopRequireDefault(require("@react-native-community/async-storage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var KEY_ACCESS_TOKEN = "KEY_ACCESS_TOKEN";
var KEY_REFRESH_TOKEN = "KEY_REFRESH_TOKEN";
/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/

var Get = function Get(url, config) {
  return axiosDecorator('get', url, config);
};
/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/


exports.Get = Get;

var Post = function Post(url, config) {
  return axiosDecorator('post', url, config);
};
/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/


exports.Post = Post;

var Put = function Put(url, config) {
  return axiosDecorator('put', url, config);
};
/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/


exports.Put = Put;

var Update = function Update(url, config) {
  return axiosDecorator('update', url, config);
};
/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/


exports.Update = Update;

var Delete = function Delete(url, config) {
  return axiosDecorator('delete', url, config);
};
/**
  * @param {string} url
  * @param {AxiosRequestConfig} config
*/


exports.Delete = Delete;

var Auth = function Auth(url, config) {
  return function (target, name, descriptor) {
    var oldVal = descriptor.value;

    descriptor.value = function () {
      var _this = this;

      target.auth_url = url;
      (0, _axios["default"])(_objectSpread({
        method: 'post',
        url: url
      }, config)).then(function (result) {
        var _oldVal$call = oldVal.call(_this, result.data),
            access_token = _oldVal$call.access_token,
            refresh_token = _oldVal$call.refresh_token;

        _asyncStorage["default"].setItem(KEY_ACCESS_TOKEN, access_token);

        _asyncStorage["default"].setItem(KEY_REFRESH_TOKEN, refresh_token);
      });
    };
  };
};

exports.Auth = Auth;

var OnRefreshToken = function OnRefreshToken() {
  return function (target, name, descriptor) {
    var oldVal = descriptor.value;
    target.haveRefresh = true;
    target.onRefreshToken = descriptor.value;
  };
};

exports.OnRefreshToken = OnRefreshToken;

var Token = function Token(target, name, descriptor) {
  descriptor.useToken = true;
};

exports.Token = Token;

var axiosDecorator = function axiosDecorator(method, url, config) {
  return function (target, name, descriptor) {
    var oldVal = descriptor.value;
    var re = /.*{([\w]+)}.*/;

    descriptor.value = function () {
      var result = url.match(re);
      var newUrl = url;

      if (result && result.length > 1) {
        newUrl = newUrl.replace('{' + result[1] + '}', target[result[1]]);
      }

      return _url(newUrl, descriptor.useToken === true).then(function (url) {
        var apiCall = function apiCall(newUrl) {
          return (0, _axios["default"])(_objectSpread({
            method: method,
            url: newUrl
          }, config)).then(function (result) {
            return oldVal.call(target, result.data);
          });
        };

        return apiCall(newUrl)["catch"](function (error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            if (error.response.status === 401 && target.onRefreshToken !== undefined) {
              var _result = refreshTokenAndRetry(target.onRefreshToken, apiCall, newUrl);

              return _result;
            }
          }
        });
      });
    };
  };
};

var refreshTokenAndRetry = function refreshTokenAndRetry(onRefreshToken, apiCall, url) {
  return refreshToken().then(function (refreshToken) {
    return onRefreshToken(refreshToken);
  }).then(function (_ref) {
    var access_token = _ref.access_token,
        refresh_token = _ref.refresh_token;
    if (refreshToken) _asyncStorage["default"].setItem(KEY_REFRESH_TOKEN, refresh_token);
    return _asyncStorage["default"].setItem(KEY_ACCESS_TOKEN, access_token);
  }).then(function () {
    return _url(url, true);
  }).then(function (url) {
    return apiCall(url);
  });
};

var refreshToken = function refreshToken() {
  return _asyncStorage["default"].getItem(KEY_REFRESH_TOKEN);
};

var _url = function _url(url, attach) {
  if (attach) {
    return _asyncStorage["default"].getItem(KEY_ACCESS_TOKEN).then(function (token) {
      return url.includes('?') ? url + '&access_token=' + token : url + '?access_token=' + token;
    });
  } else {
    return new Promise(function (resolve) {
      return resolve(url);
    });
  }
};
//# sourceMappingURL=retrofit.js.map