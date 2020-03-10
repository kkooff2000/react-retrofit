"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListWithAPI = exports.List = void 0;

var _axios = _interopRequireWildcard(require("axios"));

var _reactNative = require("react-native");

var _react = _interopRequireWildcard(require("react"));

var _retrofit = require("./retrofit");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var List = function List(componentName, url, ListItem, config) {
  var _dec, _class;

  var _config = _objectSpread({
    axiosConfig: {}
  }, config);

  var API = (_dec = (0, _retrofit.Get)(url, _config.axiosConfig), (_class =
  /*#__PURE__*/
  function () {
    function API() {
      _classCallCheck(this, API);
    }

    _createClass(API, [{
      key: "fetchData",
      value: function fetchData(data) {
        return data;
      }
    }]);

    return API;
  }(), (_applyDecoratedDescriptor(_class.prototype, "fetchData", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "fetchData"), _class.prototype)), _class));
  var api = new API();
  return _List(api.fetchData, undefined, componentName, ListItem, config);
};
/**
    * @param {React.Component} component
    * @param {function name(data) {}} fetchAPI
    * @param {function name(data) {}} fetchNextAPI
    * @param {React.Component} listItem
    * @param {RetrofitConfig} config
    */


exports.List = List;

var ListWithAPI = function ListWithAPI(componentName, fetchAPI, fetchNextAPI, ListItem, config) {
  return _List(fetchAPI, fetchNextAPI, componentName, ListItem, config);
};

exports.ListWithAPI = ListWithAPI;

var _List = function _List(fetchAPI, fetchNextAPI, componentName, ListItem, config) {
  return function (target, name, descriptor) {
    var _config = _objectSpread({
      axiosConfig: {},
      flatListProps: {}
    }, config);

    var component = function component() {
      var _React$useState = _react["default"].useState([]),
          _React$useState2 = _slicedToArray(_React$useState, 2),
          res = _React$useState2[0],
          setRes = _React$useState2[1];

      var _React$useState3 = _react["default"].useState(false),
          _React$useState4 = _slicedToArray(_React$useState3, 2),
          refreshing = _React$useState4[0],
          setRefresh = _React$useState4[1];

      _react["default"].useEffect(function () {
        fetchAPI().then(setRes);
      }, [0]);

      return res !== undefined && res.length > 0 ? _react["default"].createElement(_reactNative.FlatList, _extends({
        refreshing: refreshing,
        onRefresh: function onRefresh() {
          setRefresh(true);
          fetchAPI().then(function (data) {
            setRefresh(false);
            setRes(data);
          });
        },
        keyExtractor: function keyExtractor(item, index) {
          return index.toString();
        },
        data: res,
        renderItem: function renderItem(_ref) {
          var item = _ref.item;
          return _react["default"].createElement(ListItem, item);
        },
        onEndReachedThreshold: 0.1,
        onEndReached: function onEndReached() {
          if (fetchNextAPI !== undefined) {
            setRefresh(true);
            fetchNextAPI().then(function (data) {
              setRefresh(false);
              setRes(res.concat(data));
            });
          }
        }
      }, _config.flatListProps)) : _config.indicator !== undefined ? _config.indicator : _react["default"].createElement(_reactNative.ActivityIndicator, {
        size: "large",
        color: "#CCC"
      });
    };

    target[componentName] = component;
  };
};
/**
 * @typedef {Object} RetrofitConfig
 * @property {AxiosRequestConfig} axiosConfig
 * @property {FlatListProps} flatListProps
 * @property {React.Component} indicator
 */
//# sourceMappingURL=flatList.js.map