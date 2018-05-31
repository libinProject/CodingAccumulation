; (function (exports, global) {
	var array = [], forEach = array.forEach, window = global.window, document = window.document, html = document.documentElement,
		msPointerEnabled = window.navigator.msPointerEnabled,
		elementPrototype = Element.prototype,
		htmlPrototype, HTMLElement = window.HTMLElement || Element;
	htmlPrototype = HTMLElement.prototype;

	// 空函数，用于默认回调。
	function empty() { }

	// 类似 jQuery 的 each 方法。
	function each(fn) {
		Function.isFunction(fn) && this.forEach(fn.call, fn);
	}

	// extend
	// extend 函数，来自 zepto。
	function extend(target, source, deep) {
		for (key in source)
			if (deep && (isPlainObject(source[key]) || Array.isArray(source[key]))) {
				if (isPlainObject(source[key]) && !isPlainObject(target[key]))
					target[key] = {};
				if (Array.isArray(source[key]) && !Array.isArray(target[key]))
					target[key] = [];
				extend(target[key], source[key], deep);
			}
			else if (source[key] !== undefined) target[key] = source[key];
	}
	exports.extend = function (target) {
		var deep, args = array.slice.call(arguments, 1);
		if (typeof target === 'boolean') {
			deep = target;
			target = args.shift();
		}
		args.forEach(function (arg) {
			extend(target, arg, deep);
		});
		return target;
	};

	// 用于向对象添加只读的属性。
	function defineReadOnlyProperties(target, properties, setOnFailed) {
		var property;
		if (arguments.length < 3) setOnFailed = true;
		Array.isArray(target) || (target = [target]);
		for (var k in properties) {
			property = { value: properties[k], writable: false };
			target.forEach(function (item) {
				try {
					Object.defineProperty(item, k, property);
				} catch (error) {
					setOnFailed && (item[k] = properties[k]);
				}
			});
		}
	}

	// 扩展原型。此方法可以避免被扩展的属性被 for...in... 循环读取。
	function extendPrototype(target, values) {
		target = target.prototype || target;
		if (target instanceof Object) {
			for (var key in values) {
				try {
					Object.defineProperty(target, key, { value: values[key], enumerable: false });
				} catch (ex) {
					target[key] = values[key];
				}
			}
		}
	}

	// 扩展 Element 原型的方法，同时会扩展到 document 上。
	function extendElementPrototype(properties) {
		exports.extend(elementPrototype, properties);
		exports.extend(document, properties);
	}

	// NodeList
	// 要为 NodeList 扩展的 Element 的方法。
	['addEventListener', 'removeEventListener', 'fireEvent', 'trigger', 'remove', 'render', 'fetch', 'delegate', 'undelegate'].forEach(function (k) {
		HTMLCollection.prototype[k] = NodeList.prototype[k] = function () {
			var args = arguments;
			return this.forEach(function (item) {
				item[k].apply(item, args);
			});
		};
	});
	// 为 NodeList 扩展数组的方法。
	var nodeListExtends = {
		forEach: forEach,
		every: array.every,
		indexOf: array.indexOf,
		lastIndexOf: array.lastIndexOf,
		each: each,
		contains: function (item) {
			return this.indexOf(item) >= 0;
		}
	};

	exports.extend(HTMLCollection.prototype, nodeListExtends);
	exports.extend(NodeList.prototype, nodeListExtends);
	nodeListExtends = {
		firstItem: {
			get: function () {
				return this[0];
			},
			set: empty
		},
		lastItem: {
			get: function () {
				return this[this.length - 1];
			},
			set: empty
		}
	};
	Object.defineProperties(HTMLCollection.prototype, nodeListExtends);
	Object.defineProperties(NodeList.prototype, nodeListExtends);

	// Global
	// type 返回对象的准确类型。
	exports.type = function (e, t) {
		var type = typeof (e);
		if (type === 'object') {
			if (e && undefined !== e.nodeType) {
				type = 3 === e.nodeType ? 'text' : 'element';
			} else {
				type = Object.prototype.toString.call(e).slice(8, -1).toLowerCase();
			}
		}
		return t ? (t.test ? t.test(type) : t === type) : type;
	};


	// 为下列原生对象提供 is 类型判断，如 Function.isFunction；此方式参考了 Array.isArray 格式。
	//		String.isString			$.isString
	//		Number.isNumber			$.isNumber
	//		Function.isFunction		$.isFunction
	//		Boolean.isBoolean		$.isBoolean
	//		RegExp.isRegExp			$.isRegExp
	//		Element.isElement		$.isElement
	//		Text.isText				$.isText
	//		Object.isObject			$.isObject
	//		Object.isPlainObject	$.isPlainObject
	//		Object.isNull			$.isNull
	//		Array.isArray			$.isArray
	['String', 'Number', 'Function', 'Boolean', 'RegExp', 'Element', 'Text'].forEach(function (n) {
		exports['is' + n] = global[n]['is' + n] || (global[n]['is' + n] = function (value) {
			return exports.type(value, n.toLocaleLowerCase());
		});
	}, exports);
	exports.isObject = Object.isObject = function (value) {
		return typeof value === 'object' && !Array.isArray(value);
	};
	var isPlainObject = exports.isPlainObject = Object.isPlainObject = function (value) {
		return exports.type(value, 'object');
	};
	exports.isNull = Object.isNull = function (value) { return typeof value === 'undefined' || value === null; };
	exports.isArray = Array.isArray;



	// prototype
	// 扩展字符串的原型。
	extendPrototype(String, {
		// 左对齐。
		padLeft: function (c, l) { var s = this; while (s.length < l) { s += c; } return s; },
		// 右对齐。
		padRight: function (c, l) { var s = this; while (s.length < l) { s = c + s; } return s; },
		// 判断字符串是否以另一个字符串开始。
		startsWith: function (s) { s += ''; return !s || this.indexOf(s) === 0; },
		// 判断字符串是否以另一个字符串结束。
		endsWith: function (s) { s += ''; return !s || this.indexOf(s) === (this.length - s.length); },
		// 判断字符串是否相等；此方法主要是提供了不区分大小写的匹配方式。
		equals: function (s, ignoreCase) { return !!(s === this + '' || (ignoreCase && this.toLowerCase() === (s + '').toLowerCase())); }
	});

	// 字节长度。
	Object.defineProperty(String.prototype, 'bytes', {
		get: function () { var a = this.match(/[^\x00-\xff]/ig); return this.length + (a ? a.length : 0); },
		set: empty
	});

	// 扩展数组的原型。
	extendPrototype(Array, {
		each: each,
		// 判断数组是否包含指定的元素。
		contains: function (item) {
			return this.indexOf(item) >= 0;
		},
		// 从数组中删除指定的元素。如果多个元素都引用了此元素，则都将被删除。
		remove: function (item) {
			for (var i = this.length - 1, removed = 0; i >= 0; i--) {
				this[i] === item && (this.splice(i, 1), removed++);
			}
			return removed;
		},
		// 添加指定的元素到数组，除非数组中已经包含了此元素。
		add: function (item) {
			if (!this.contains(item)) {
				return this.push(item);
			}
		}
	});
	exports.likeArray = Array.likeArray = function (value) {
		return typeof value === 'object' && typeof value.length === 'number';
	};
	// BOM:
	// Location.query
	// 为 window.location 添加了 query 属性，包含查询字符串的键值对
	// 为 window.location 添加了 path 属性，包含当前脚本的 path 和最后一个外联 css 的路径
	//		location.path.site:		当前脚本路径的站点根目录
	//		location.path.script:	当前脚本路径
	//		location.path.style:	最后一个外联 css 的路径
	(function (l) {
		var s = l.search, m, k, v, n, q = {};
		if (s) {
			if (s[0] === '?') s = s.substr(1);
			if (s) {
				m = s.split('&');
				for (var i in m) {
					s = m[i] + ''; n = s.indexOf('=');
					if (n >= 0) { k = s.substr(0, n); v = s.substr(n + 1); }
					else { k = null; v = s; }
					if (q[k]) { q[k] += "," + v; }
					else { q[k] = v; }
				}
			}
		}
		var target = [(location instanceof Object ? location : Location.prototype), exports];
		location.getpath = function () {
			var root = this.protocol + '//' + this.host + ((this.port && this.port != '80') ? (':' + this.port) : ''), getSource = function (tag, attributeName) {
				var i, path;
				if ((tag = document.getElementsByTagName(tag).lastItem) && (tag = tag[attributeName])) {
					tag = tag.replace(/\\/g, "/");
					i = tag.lastIndexOf("/");
					path = (i < 0) ? "." : tag.substr(0, i);
					return path.startsWith(root) ? path.substr(root.length) : path;
				}
			};
			return { site: root, script: getSource('script', 'src'), style: getSource('link', 'href') };
		};

		defineReadOnlyProperties(target, { query: q });
		defineReadOnlyProperties(target, { path: location.getpath() });
	})(this.location);

	// 浏览器侦测
	// exports.os 和 window.navigator.os 包含了当前操作系统的判断，如
	//		os.android / os.ios / os.windows / os.windowsphone / os.iphone / os.ipad / os.itouch / os.phone / os.pad
	//		os.version 是 os 的版本
	//	exports.browser 和 windows.navigator.browser 包含了当前浏览器的判断，如
	//		browser.webkit / browser.ie / browser.iemobile / browser.chrome / browser.firefox / browser.opera
	//		browser.version 是 browser 的版本
	var userAgent = window.navigator.userAgent;
	var browserinfo = {
		webkit: userAgent.match(/WebKit\/([\d.]+)/),
		ie: userAgent.match(/MSIE\s([\d.]+)/),
		iemobile: userAgent.match(/IEMobile\/([\d.]+)/),
		chrome: userAgent.match(/Chrome\/([\d.]+)/) || userAgent.match(/CriOS\/([\d.]+)/),
		firefox: userAgent.match(/Firefox\/([\d.]+)/),
		opera: userAgent.match(/Opera\/([\d.]+)/)
	};
	var platforminfo = {
		android: userAgent.match(/(Android)\s+([\d.]+)/),
		ipad: userAgent.match(/(iPad).*OS\s([\d_]+)/),
		windowsphone: userAgent.match(/(Windows\sPhone)[\sOS]*([\d\.]+)/),
		windows: userAgent.match(/(Windows)\sNT\s([\d\.]+)/)
	};
	platforminfo.ipod = platforminfo.itouch = !platforminfo.ipad && userAgent.match(/(iPod\s?[Ttouch]{5})[a-zA-Z\s;]*([\d_]+)/);
	platforminfo.iphone = !platforminfo.ipad && !platforminfo.itouch && userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
	var browser = {}, platform = {};

	for (var key in browserinfo) {
		browserinfo[key] && (browser[key] = true, browser.version = browserinfo[key][1], browser.majorVersion = parseInt(browser.version) || 0);
	}
	for (var key in platforminfo) {
		platforminfo[key] && (platform[key] = true, platform.version = platforminfo[key][2].replace(/_/g, '.'), platform.majorVersion = parseInt(platform.version) || 0);
	}
	var ios = !!(platform.iphone || platform.itouch || platform.ipad);
	var pad = !!(platform.ipad || (platform.android && !userAgent.match(/Mobile/)));
	var phone = !!(!pad && platform.android || platform.iphone || platform.windowsphone) || /meizu|lephone|xiaomi|mui|mobile|coolpad|zte|huawei/i.test(userAgent);
	// 某些手机可能不会传递完整的操作系统字符串，特定的 Android 判断。
	if (phone && /safari|webkit/i.test(userAgent) && !/OS\s?X/i.test(userAgent) && !ios) {
		platform.android = true;
		browser.webkit = true;
	}
	
	ios && (platform.ios = ios);
	pad && (platform.pad = pad);
	phone && (platform.phone = phone);
	//webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
	//touchpad = webos && userAgent.match(/TouchPad/),
	//kindle = userAgent.match(/Kindle\/([\d.]+)/),
	//silk = userAgent.match(/Silk\/([\d._]+)/),
	//blackberry = userAgent.match(/(BlackBerry).*Version\/([\d.]+)/),
	//bb10 = userAgent.match(/(BB10).*Version\/([\d.]+)/),
	//rimtabletos = userAgent.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
	//playbook = userAgent.match(/PlayBook/),

	defineReadOnlyProperties([exports, navigator], {
		os: platform,
		browser: browser
	});


	// CSS3 Transform/Transition 支持判断
	function getPropertyName(a) {
		for (var i = 0, l = a.length; i < l; i++) {
			if (a[i] in html.style) {
				return a[i];
			}
		};
	}
	// 判断浏览器支持的 CSS3 Transform/Transition 的属性的名称。
	var transform = getPropertyName(['webkitTransform', 'msTransform', 'mozTransform', 'OTransform', 'transform']),
	prefix = (transform || '').slice(0, -9).toLowerCase();

	defineReadOnlyProperties([exports, Element], {
		transform: transform,
		translate3d: !!(transform && prefix !== 'o'),	// opera 目前不支持 translate3d
		CSSTransform: transform ? (prefix ? ('-' + prefix + '-transform') : 'transform') : '',
		transition: getPropertyName(['webkitTransition', 'msTransition', 'mozTransition', 'OTransition', 'transition']),
		prefix: prefix
	});


	// DOM
	// 定义一个快速从 DOM 树删除自身的方法。
	extendElementPrototype({
		remove: function () {
			return this.parentNode && this.parentNode.removeChild(this);
		}
	});
	'scrollY' in window || Object.defineProperties(window, {
		scrollX: { get: function () { return html.scrollLeft || document.body.scrollLeft; }, set: function (value) { window.scrollTo(value, window.scrollY); } },
		scrollY: { get: function () { return html.scrollTop || document.body.scrollTop; }, set: function (value) { window.scrollTo(this.scrollX, value); } }
	});
	// ready
	// 如果页面已经载入完成，则直接执行函数；否则，将函数添加到 document.onDOMContentLoaded 事件。
	exports.ready = function (fn, thisArg) {
		if (!Function.isFunction(fn)) return;
		switch (document.readyState) {
			case 'complete':
			case 'loaded':
			case 'interactive':
				fn.call(thisArg, exports);
				break;
			default:
				ready(function () { fn.call(thisArg, exports); });
				break;
		}
	};
	function ready(fn) {
		document.addEventListener('DOMContentLoaded', fn, false);
	}

	// classList
	// 支持 HTMLElement classList 属性。
	if (!('classList' in html)) {
		// 定义一个非公开类型 ClassList，继承自数组。原生支持使用的是 DOMTokenList。
		function ClassList(element) {
			this.element = element;
			var classList = (element.className + '').split(' ');
			for (var i = 0, l = classList.length; i < l; i++) {
				/^\S+$/.test(classList[i]) && this.push(classList[i]);
			}
		}
		ClassList.prototype = array;
		ClassList.toString = ClassList.valueOf = function () { return 'ClassList'; };
		// 为 classList 重写 add/remove 方法，以在被改变时作用到元素的 className 上。
		// 实现 toggle 方法。
		exports.extend(ClassList.prototype, {
			add: function (item) {
				if (item) {
					item += '';
					this.contains(item) || this.push(item);
					this.element.className = this.join(' ');
				}
				return this;
			},
			remove: function (item) {
				if (item) {
					item += '';
					for (var i = this.length - 1; i >= 0; i--) {
						this[i] === item && this.splice(i, 1);
					}
					this.element.className = this.join(' ');
				}
				return this;
			},
			toggle: function (name) {
				return name ? (this.contains(name) ? this.remove(name) : this.add(name)) : this;
			},
			valueOf: function () { return this.join(' '); },
			toString: function () { return this.join(' '); }
		});
		// 为所有 HTMLElement 添加 classList 属性。
		// 如果为 classList 赋值，则支持字符串和数组。
		Object.defineProperty(htmlPrototype, 'classList', {
			get: function () {
				return new ClassList(this);
			},
			set: function (value) {
				if (typeof value === 'string') {
					this.element.className = value;
				} else if (Array.isArray(value)) {
					this.element.className = value.join(' ');
				}
			}
		});
	}
	
	// 支持 HTMLSelectElement selectedOptions
	if (!document.createElement('select').selectedOptions) {
		Object.defineProperty(HTMLSelectElement.prototype, 'selectedOptions', {
			get: function () {
				var selectedOptions = [];
				forEach.call(this.options, function (option) {
					if (option.selected) selectedOptions.push(option);
				});
				return selectedOptions;
			},
			set: empty
		});
	}
	
	
	// 支持 HTMLElement currentStyle 属性。
	// set 时将不起任何作用。
	'currentStyle' in html || Object.defineProperty(htmlPrototype, 'currentStyle', {
		get: function () { return document.defaultView.getComputedStyle(this); },
		set: empty
	});

	'labels' in document.createElement('input') || Object.defineProperty(htmlPrototype, 'labels', {
		get: function () {
			try {
				return document.querySelectorAll('label[for="' + this.id + '"]');
			} catch (error) {
				console.error(error);
				return [];
			}
		},
		set: empty
	});

	// 为 Form 提供一个 data 属性，用于获取或设置表单元素的数据。
	Object.defineProperty(HTMLFormElement.prototype, 'data', {
		get: function () {
			var data = {};
			this.elements.forEach(function (element) {
				if (Array.likeArray(element)) {
					var i, l = element.length, name, value;
					for (i = 0; i < l; i++) {
						if (element[i].checked) {
							name = element[i];
							if (value) {
								if (!Array.isArray(value))
									value = [value];
								value.push(element[i].value);
							} else {
								value = element[i].value;
							}
						}
					}
					if (Array.isArray(value))
						value = value.join(',');
					name && (data[element.name] = value);
				} else if(element.name) {
					if (element.type !== 'radio' || element.type !== 'checkbox' || element.checked) {
						data[element.name] = element.value;
					}
				}
			});
			return data;
		},
		set: function (data) {
			if (!data) return;
			var key, value, elements;
			for (key in data) {
				value = data[key];
				if (elements = this.elements[key]) {
					if (Array.likeArray(elements)) {
						elements.forEach(function (element, index) {
							if ((element.type === 'radio' || element.type === 'checkbox')) {
								if(element.value == value || (Array.isArray(value) && value.contains(element.value))) {
									element.checked = true;
								}
							} else if(Array.isArray(value) && index in value) {
								element.value = value[index];
							}
						});
					} else if((elements.type === 'radio' || elements.type === 'checkbox') && (element.value == value || (Array.isArray(value) && value.contains(element.value)))) {
						elements.checked = true;
					} else if(elements.tagName === 'SELECT') {
						elements.options.forEach(function (option) {
							if (option.value == value || (Array.isArray(value) && value.contains(option.value))) {
								option.selected = true;
							}
						});
					} else {
						elements.value = value;
					}
				}
			}
		}
	});

	// event
	// 提供事件 delegate/undelegate 支持。
	// 不计划提供 live 支持。
	extendElementPrototype({
		delegate: function (selector, type, listener) {
			if (typeof selector === 'string') {
				var handler = listener;
				if (selector && selector !== '*') {
					this[[type, selector, listener].join(',')] = handler = function (e) {
						array.contains.call(this.querySelectorAll(selector), e.target) && listener.call(e.target, e);
					};
				}
				return this.addEventListener(type, handler);
			}
		},
		undelegate: function (selector, type, listener) {
			var id = [type, selector, listener].join(',');
			var handler = this[id] || listener;
			this.removeEventListener(type, handler);
			delete this[id];
		}
	});
	var specialEvents = {};
	specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';
	// 事件的创建和触发。
	var eventExtend = {
		// 创建指定类型的事件。
		create: function (type, props) {
			if (typeof type !== 'string') {
				props = type; type = props.type;
			}
			var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
			if (props) {
				for (var name in props)
					(name === 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
			}
			event.initEvent(type, bubbles, true);//, null, null, null, null, null, null, null, null, null, null, null, null);
			event.isDefaultPrevented = function () { return this.defaultPrevented; };
			return event;
		},
		// 支持 defaultPrevented。
		fix: function (event) {
			if (!('defaultPrevented' in event)) {
				event.defaultPrevented = false;
				var prevent = event.preventDefault;
				event.preventDefault = function () {
					this.defaultPrevented = true;
					prevent.call(this);
				};
			}
		},
		// 阻止默认事件。
		preventDefault: function (e) {
			if (e) {
				//Movable.log(e.type);
				e.preventDefault && e.preventDefault();
				e.preventManipulation && e.preventManipulation();
				e.preventMouseEvent && e.preventMouseEvent();
				e.returnValue = false;
				return false;
			}
		}
	};
	exports.extend(Event, eventExtend);
	exports.extend(exports.event = {}, eventExtend);
	var fireEvent = elementPrototype.fireEvent;
	// 事件触发。
	window.fireEvent = window.trigger =
		document.fireEvent = document.trigger = elementPrototype.trigger = elementPrototype.fireEvent = function (type, eventObject) {
			if (fireEvent && typeof type === 'string' && exports.type(eventObject) === 'MSEventObj')
				fireEvent.call(this, type, eventObject);
			var event = eventObject;
			if (!exports.type(eventObject).endsWith('event')) {
				event = Event.create(type, event);
			}
			Event.fix(event);
			//isPlainObject(eventObject) && (event.data = eventObject);
			'dispatchEvent' in this && this.dispatchEvent(event);
			return event;
		};

	// AJAX，采用 zepto 的实现，并针对上下文进行适当修改，因此将不作注释。

	// 定义向外暴露的 AJAX 对象。
	var ajaxExports = exports;// global;
	// ajax
	//     from Zepto.js
	//     (c) 2010-2012 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.
	ajaxExports.ajax = (function () {
		var jsonpID = new Date().getTime(),
			key,
			name,
			//rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
			scriptTypeRE = /^(?:text|application)\/javascript/i,
			xmlTypeRE = /^(?:text|application)\/xml/i,
			jsonType = 'application/json',
			htmlType = 'text/html',
			blankRE = /^\s*$/;



		// Number of active Ajax requests
		var active = 0;

		var ajax = function (options) {
			var settings = exports.extend({}, options || {});
			for (key in ajaxSettings) if (settings[key] === undefined) settings[key] = ajaxSettings[key];

			ajaxStart(settings);

			if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
			  RegExp.$2 !== window.location.host;

			if (!settings.url) settings.url = window.location.toString();
			serializeData(settings);
			if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now());

			var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
			var domain = settings.url.match(/^\w+:\/\/[^\/$]+/);
			// console.log(domain, location.host);
			if (domain && !settings.crossDomain && settings.type.toUpperCase() === 'GET' && domain[0] !== location.host && domain[0] !== location.protocol+  '//' + location.host)
				dataType = 'jsonp';
			if (dataType === 'jsonp' || hasPlaceholder) {
				if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?');
				return ajaxExports.ajaxJSONP(settings);
			}

			var mime = settings.accepts[dataType],
				baseHeaders = {},
				protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
				xhr = settings.xhr(), abortTimeout;

			if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
			if (mime) {
				baseHeaders['Accept'] = mime;
				if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
				xhr.overrideMimeType && xhr.overrideMimeType(mime);
			}
			if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() !== 'GET'))
				baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded');
			settings.headers = exports.extend(baseHeaders, settings.headers || {});

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					xhr.onreadystatechange = empty;
					clearTimeout(abortTimeout);
					var result, error = false;
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol === 'file:')) {
						dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
						result = xhr.responseText;

						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							if (dataType === 'script') (1, eval)(result);
							else if (dataType === 'xml') result = xhr.responseXML;
							else if (dataType === 'json') result = blankRE.test(result) ? null : JSON.parse(result);
						} catch (e) { error = e; }

						if (error) ajaxError(error, 'parsererror', xhr, settings);
						else ajaxSuccess(result, xhr, settings);
					} else {
						ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings);
					}
				}
			};

			var async = 'async' in settings ? settings.async : true;
			xhr.open(settings.type, settings.url, async);

			for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
			if (ajaxBeforeSend(xhr, settings) === false) {
				xhr.abort();
				return false;
			}
			if (settings.timeout > 0) abortTimeout = setTimeout(function () {
				xhr.onreadystatechange = empty;
				xhr.abort();
				ajaxError(null, 'timeout', xhr, settings);
			}, settings.timeout);

			// avoid sending empty string (#319)
			xhr.send(settings.data ? settings.data : null);
			return xhr;
		};

		//var ajaxExports = ajax;

		function ajaxStart(settings) { active++; }
		function ajaxStop(settings) { active--; }

		// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
		function ajaxBeforeSend(xhr, settings) {
			return settings.beforeSend.call(settings.context, xhr, settings) !== false;
		}
		function ajaxSuccess(data, xhr, settings) {
			var context = settings.context, status = 'success';
			settings.success.call(context, data, status, xhr);
			ajaxComplete(status, xhr, settings);
		}
		// type: "timeout", "error", "abort", "parsererror"
		function ajaxError(error, type, xhr, settings) {
			var context = settings.context;
			settings.error.call(context, xhr, type, error);
			ajaxComplete(type, xhr, settings);
		}
		// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
		function ajaxComplete(status, xhr, settings) {
			var context = settings.context;
			settings.complete.call(context, xhr, status);
			ajaxStop(settings);
		}


		ajaxExports.ajaxJSONP = function (options) {
			if (!('type' in options)) return ajax(options);

			var callbackName = 'jsonp' + (++jsonpID),
			  script = document.createElement('script'),
			  cleanup = function () {
			  	clearTimeout(abortTimeout);
			  	script.remove();
			  	delete window[callbackName];
			  },
			  abort = function (type) {
			  	cleanup();
			  	// In case of manual abort or timeout, keep an empty function as callback
			  	// so that the SCRIPT tag that eventually loads won't result in an error.
			  	if (!type || type === 'timeout') window[callbackName] = empty;
			  	ajaxError(null, type || 'abort', xhr, options);
			  },
			  xhr = { abort: abort }, abortTimeout;
			
			if (ajaxBeforeSend(xhr, options) === false) {
				abort('abort');
				return false;
			};

			window[callbackName] = function (data) {
				cleanup();
				ajaxSuccess(data, xhr, options);
			};

			script.onerror = function () { abort('error'); };

			script.src = options.url.replace(/=\?/, '=' + callbackName);
			document.head.appendChild(script);

			if (options.timeout > 0) abortTimeout = setTimeout(function () {
				abort('timeout');
			}, options.timeout);

			return xhr;
		};

		var ajaxSettings = {
			// Default type of request
			type: 'GET',
			// Callback that is executed before request
			beforeSend: empty,
			// Callback that is executed if the request succeeds
			success: empty,
			// Callback that is executed the the server drops error
			error: empty,
			// Callback that is executed on request complete (both: error and success)
			complete: empty,
			// The context for the callbacks
			context: null,
			// Whether to trigger "global" Ajax events
			global: true,
			// Transport
			xhr: function () {
				return new window.XMLHttpRequest();
			},
			// MIME types mapping
			accepts: {
				script: 'text/javascript, application/javascript',
				json: jsonType,
				xml: 'application/xml, text/xml',
				html: htmlType,
				text: 'text/plain'
			},
			// Whether the request is to another domain
			crossDomain: false,
			// Default timeout
			timeout: 0,
			// Whether data should be serialized to string
			processData: true,
			// Whether the browser should be allowed to cache GET responses
			cache: true
		};

		function mimeToDataType(mime) {
			if (mime) mime = mime.split(';', 2)[0];
			return mime && (mime === htmlType ? 'html' :
			  mime === jsonType ? 'json' :
			  scriptTypeRE.test(mime) ? 'script' :
			  xmlTypeRE.test(mime) && 'xml') || 'text';
		}

		function appendQuery(url, query) {
			return (url + '&' + query).replace(/[&?]{1,2}/, '?');
		}

		// serialize payload and append it to the URL for GET requests
		function serializeData(options) {
			if (options.processData && options.data && typeof (options.data) !== "string")
				options.data = param(options.data, options.traditional);
			if (options.data && (!options.type || options.type.toUpperCase() === 'GET'))
				options.url = appendQuery(options.url, options.data);
		}


		// handle optional data/success arguments
		function parseArguments(url, data, success, dataType) {
			var hasData = !Function.isFunction(data);
			return {
				url: url,
				data: hasData ? data : undefined,
				success: !hasData ? data : Function.isFunction(success) ? success : undefined,
				dataType: hasData ? dataType || success : success
			};
		}

		ajaxExports.get = function (url, data, success, dataType) {
			return ajax(parseArguments.apply(null, arguments));
		};

		ajaxExports.post = function (url, data, success, dataType) {
			var options = parseArguments.apply(null, arguments);
			options.type = 'POST';
			return ajax(options);
		};

		ajaxExports.getJSON = function (url, data, success) {
			var options = parseArguments.apply(null, arguments);
			options.dataType = 'json';
			return ajax(options);
		};

		htmlPrototype.load = function (url, data, success) {
			var self = this,
				options = parseArguments(url, data, success),
				callback = options.success;
			options.success = function (response) {
				self.innerHTML = response;
				callback && callback.apply(self, arguments);
			};
			ajax(options);
			return this;
		};

		var escape = encodeURIComponent;

		function serialize(params, obj, traditional, scope) {
			var type, array = Array.isArray(obj);
			function fn(value, key) {
				type = exports.type(value);
				if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
				// handle data in serializeArray() format
				if (!scope && array) params.addParameter(value.name, value.value);
					// recurse into nested objects
				else if (type === "array" || (!traditional && type === "object"))
					serialize(params, value, traditional, key);
				else params.addParameter(key, value);
			}
			if (array) {
				obj.forEach(fn);
			} else {
				for (var k in obj) {
					fn(obj[k], k);
				}
			}
		};

		function param(obj, traditional) {
			var params = [];
			params.addParameter = function (k, v) { this.push(escape(k) + '=' + escape(v)); };
			serialize(params, obj, traditional);
			return params.join('&').replace(/%20/g, '+');
		}

		return ajax;
	})();

	function recon(s) { for (var t = ['\\', '$', '.', '+', '(', ')', '*', '[', '?', '^', '{', '|'], i = 0, l = t.length; i < l; i++) { s = s.replace(t[i], '\\' + t[i]); }; return s; }

	// 实现简单的 JavaScript 模版。
	// 对模版中的判断语句进行处理。
	function renderCondition(r, f) {
		if (f) {
			var l = (f + '').toLowerCase(), i, n, t, s = '';
			while ((i = l.indexOf('@if') >= 0)) {
				n = l.indexOf('@endif', i);
				if (n < 0) { s += f; break; }
				s += f.substr(0, i);
				t = f.substr(i, n - i + 6);
				n += 6;
				f = f.substr(n);
				l = l.substr(n);
				s += t.replace(/\@IF{([\w\-]+)}([\s\S]*)\@ELSE([\s\S]*)\@ENDIF/ig, function ($0, $1, $2, $3) { return (r[$1]) ? $2 : ($3 || ''); }).replace(/\@IF{([\w\-]+)}([\s\S]*)\@ENDIF/ig, function ($0, $1, $2) { return (r[$1]) ? $2 : ''; });
			}
			f = s + f;
		}
		return f;
	}
	// 模板
	exports.template = {
		// 渲染一个数组。
		// 参数选项：
		//		container:	要被渲染的 Element。
		//		data:		用于渲染的数据，应该是一个数组。
		//		template:	用于渲染的模板代码；使用 {DataField} 作为数据占位符。
		//		append:		指示是否将结果添加到 Element 末尾，还是直接覆盖。
		//		key:		搜索关键字；配合 keyField/keyLeft/keyRight 以实现搜索关键字高亮显示的功能。
		//		keyField:	要被当作关键字的字段；配合 key/keyLeft/keyRight 以实现搜索关键字高亮显示的功能。
		//		keyLeft:	当渲染关键字时，被放置在关键字值左边的代码；配合 key/keyField/keyRight 以实现搜索关键字高亮显示的功能。
		//		keyRight:	当渲染关键字时，被放置在关键字值右边的代码；配合 key/keyField/keyLeft 以实现搜索关键字高亮显示的功能。
		//		replace:	每一行数据进行渲染后，要进行的补充操作。
		//		preRepalce:	每一行数据进行渲染前，要事先进行的预处理操作。
		//		id:			参数用于处理树形结构的数据。
		//		tree:		参数用于处理树形结构的数据。
		//		treeId:		参数用于处理树形结构的数据。
		fetch: function (container, data, template, append, key, keyField, keyLeft, keyRight, replace, preRepalce, id, tree, treeId) {
			var a;

			// 参数封装
			if (exports.isPlainObject(container)) {
				a = container;
			} else if (Element.isElement(container)) {
				a = {
					container: container,
					data: data,
					template: template,
					append: append,
					key: key,
					keyField: keyField,
					keyLeft: keyLeft,
					keyRight: keyRight,
					replace: replace,
					preRepalce: preRepalce,
					id: id,
					tree: tree,
					treeId: treeId
				};
			} else {
				return;
			}

			var e = a.container || a.list, d = a.data, t = a.template, P = 'replace', m = a.id, f = a.treeId, n = a.tree, w, g = (f && n), K = a.key, KF = a.keyField, LK = a.keyLeft, RK = a.keyRight, l, b, x = [], s = [], r, i = 0, KE = 0, KR = 0, F, PR = a.preRepalce;
			Array.isArray(d) || (d = [d]);

			if (d) {
				// 生成关键字匹配正则表达式。
				if (K && (K = recon(K)) && KF) {
					KR = new RegExp("(>|^)([^<\"']*)(" + K + ")([^>\"']*)($|<)", "gi");
					LK = exports.isNull(LK) ? '<span class="key">' : LK;
					RK = exports.isNull(RK) ? '</span>' : RK;
					K = LK + K + RK;
				}
				// 渲染循环。
				for (b = d.length; i < b; i++) {
					r = {};
					for (var k in d[i]) {
						// 处理特殊 { 和 } 字符。 || (typeof (d[i][k]) === 'number' && d[i][k] = d[i][k] + ''))
						if (d[i] && d[i][k] && (typeof d[i][k] === 'string' || (d[i][k] = typeof d[i][k] === 'number' ? d[i][k] + '' : d[i][k]))){
							r[k] = d[i][k].replace(/{/g, '&#123;').replace(/}/g, '&#125;');
						}
					}
					// 当没有序号字段时，为数据额外添加一个 ROWINDEX 字段，用于序号显示
					('ROWINDEX' in r) || (r['ROWINDEX'] = i);
					// 数据预处理。
					Function.isFunction(PR) && (r = PR.call(a, r));
					// 处理关键字。
					if (KE || (KF && K && (KF in r))) {
						KE = 1;
						(F = r[KF]) && (r[KF] = F[P](KR, "$1$2" + LK + "$3" + RK + "$4$5"));
					}
					// 渲染单行数据。
					l = this.replace(r, t, a);
					// 后期处理。
					Function.isFunction(a.replace) && (l = a.replace.call(a, l, r));
					x[r] = l;
					g && x.push({ i: r[m], t: r[f], s: l });
					// 添加到结果。
					s.push(l);
				}
				if (g) {
					w = {};
					// 处理树形结构的数据：使用递归。
					function z(i) {
						var j, k, s = "", l;
						for (j = 0; j < x.length; j++) {
							k = x[j];
							if (k.t === i && !(w[k.i])) {
								l = k.s; w[k.i] = 1;
								if (l.indexOf(n) >= 0)
									l = l.replace(n, z(k.i));
								s += l;
							}
						}
						return s;
					}
					s = z(0);
				} else {
					s = s.join("");
				}
			}
			if (e) {
				s === "" && a.empty && (s = a.empty);
				// 显示渲染结果
				a.append ? (e.insertAdjacentHTML ? e.insertAdjacentHTML('beforeEnd', s) : (e.innerHTML += s)) : (e.innerHTML = '', e.innerHTML = s);
			};
			return i;
		},
		// 单行数据替换函数。
		replace: function (r, f, options) {
			return f ? renderCondition(r, f).replace(/{([a-z_][\w\.]*)(:[\"\w\-\s\:\",]+)?}/gi, function ($0, $1, $2) {
				var f, s, a, v, i, l, o;
				// 如果是函数调用
				if (s = $2) {
					// 处理函数调用： {func:NAME}，将会把 NAME 字段的值作为参数调用 func 函数，并使用结果。
					// 其中，func 先查找对象参数中是否此名称的函数；否则，查找全局对象是否有此名称的函数。
					s = s.substr(1);
					if (Function.isFunction(options[$1])) {
						f = options[$1];
						o = options;
					} else if (Function.isFunction(global[$1])) {
						f = global[$1];
						o = global;
					}
					//console.log(f);
					if (o) {
						a = [];

						if (s) {
							s = s.split(',');
							l = s.length;
							for (i = 0; i < l; i++) {
								v = s[i];
								if (v.startsWith('"') || v.startsWith("'")) {
									a[i] = v.substr(1, v.length - 2);
								} else {
									a[i] = (v in r) ? r[v] : null;
								}
							}
						}
						v = f.apply(o, a);
					} else {
						v = s;
					}
				} else {
					// 否则，直接使用字段的值。
					v = ($1 in r) ? r[$1] : '';
				}
				return v;
			}) : '';
		}
	};
	// 为 HTMLElement 添加一个渲染方法。
	exports.extend(htmlPrototype, {
		render: function (data, template) {
			var args;
			if (Object.isObject(data) && ('template' in data) && ('data' in data)) {
				exports.extend(args = {}, data);
				template = data.template;
			} else {
				args = { data: data, template: template };
			}
			args.container = this;
			return template && String.isString(template) ? exports.template.fetch(args) : data;
		},
		fetch: function (options) {
			var element = this, options, success;
			if (String.isString(options)) {
				return exports.get(options, {}, function (r) { element.innerHTML = r; }, 'html');
			} else if (isPlainObject(options)) {
				success = options.success;
				options.success = Function.isFunction(success) ? (function (r) { success.apply(this, arguments) === false || (options.data = r, element.render(options)); }) : function (r) { options.data = r; element.render(options); };
				return ajaxExports.ajax(options);
			}
		}
	});

	// 图片延迟加载。
	HTMLImageElement.prototype.lazyLoad = function () {
		var src = this.getAttribute('src'), rel = this.getAttribute('.src') || this.getAttribute('itemref') || this.getAttribute('rel');
		if (rel && src !== rel) { this.setAttribute('src', rel); return rel; }
		else return rel;
	};


	// Touch
	// 触摸事件支持。
	var touch = {}, touchTimeout, tapTimeout, swipeTimeout,
		longTapDelay = 750,		// 长按延迟。
		longTapTimeout,
		pressedAnchor;			// 当前被按住的链接
	var touchEvent = {
		// 如果是 IE，而且不是主要的触摸点（多点触摸），则返回 false。
		isMsPrimary: function (e) {
			return !e || !msPointerEnabled || e.isPrimary;
		}
	};

	// 获取触摸事件的名称。
	if (msPointerEnabled) {
		defineReadOnlyProperties(touchEvent, {
			down: 'MSPointerDown', move: 'MSPointerMove', up: 'MSPointerUp', cancel: 'MSPointerCancel'
		});
	} else if ('ontouchstart' in document) {
		defineReadOnlyProperties(touchEvent, {
			down: 'touchstart', move: 'touchmove', up: 'touchend', cancel: 'touchcancel'
		});
	} else {
		defineReadOnlyProperties(touchEvent, {
			down: 'mousedown', move: 'mousemove', up: 'mouseup', cancel: null
		});
	}


	function parentIfText(node) {
		return 'tagName' in node ? node : node.parentNode;
	}
	function parentAnchor(node) {
		while(node && node.tagName !== 'A') { node = node.parentNode; }
		return node;
	}
	
	function hasParentNode(node, tags) {
		while(node && !tags.contains(node.tagName)) { node = node.parentNode; }
		return node && tags.contains(node.tagName);
	}
	
	function swipeDirection(x1, x2, y1, y2) {
		var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
		return xDelta >= yDelta ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down');
	}

	function longTap() {
		longTapTimeout = null;
		if (touch.last) {
			touch.target.trigger('longtap', { pageX: touch.x1, pageY: touch.y1 });
			touch = {};
		}
	}

	function cancelLongTap() {
		if (longTapTimeout) clearTimeout(longTapTimeout);
		longTapTimeout = null;
	}

	function cancelAll() {
		if (touchTimeout) clearTimeout(touchTimeout);
		if (tapTimeout) clearTimeout(tapTimeout);
		if (swipeTimeout) clearTimeout(swipeTimeout);
		if (longTapTimeout) clearTimeout(longTapTimeout);
		touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
		touch = {};
		pressedAnchor && pressedAnchor.removeAttribute('aria-pressed');
	}
	
	document.addEventListener(touchEvent.down, function (e) {
		if (e.button || !touchEvent.isMsPrimary(e)) return;
		now = Date.now();
		delta = now - (touch.last || now);
		var t = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e;
		touch.target = parentIfText(t.target);
		//console.log(touch.target);
		touchTimeout && clearTimeout(touchTimeout);
		touch.x1 = touch.x2 = t.pageX;
		touch.y1 = touch.y2 = t.pageY;
		if (delta > 0 && delta <= 250) {
			touch.isDoubleTap = true;
		}
		touch.last = now;
		//touch.event = e;
		longTapTimeout = setTimeout(longTap, longTapDelay);
		(pressedAnchor = parentAnchor(touch.target)) && pressedAnchor.setAttribute('aria-pressed', 'true');
	});
	document.addEventListener(touchEvent.move, function (e) {
		if (e.button || !touchEvent.isMsPrimary(e)) return;
		var t = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e;
		if (touch.x2 != t.pageX || touch.y2 != t.pageY) {
			touch.x2 = t.pageX;
			touch.y2 = t.pageY;
			cancelLongTap();
			//if (Math.abs(touch.x1 - touch.x2) > 10)
			//	Event.preventDefault(e);
		}
		//delete touch.last;
	});
	
	/**/
	document.addEventListener(touchEvent.up, function (e) {
		pressedAnchor && pressedAnchor.removeAttribute('aria-pressed');
		if (e.button || !touchEvent.isMsPrimary(e)) return;
		var target = touch.target, data, tapEvent, anchor = parentAnchor(target);;
		var t = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : e;
		cancelLongTap();
		anchor && anchor.removeAttribute('aria-pressed');
		// swipe
		if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
			(touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
			//Event.preventDefault(e);
			data = { direction: swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2), start: { x: touch.x1, y: touch.y1 }, end: { x: touch.x2, y: touch.y2 } };

			swipeTimeout = setTimeout(function () {
				target.trigger('swipe', data);
				target.trigger('swipe' + data.direction, data);
			}, 0);
			touch = {};

			// normal tap
		} else if ('last' in touch) {
			
			// delay by one tick so we can cancel the 'tap' event if 'scroll' fires
			// ('tap' fires before 'scroll')
			tapTimeout = setTimeout(function () {
				data = { pageX: touch.x1, pageY: touch.y1, offsetX: t.offsetX, offsetY: t.offsetY, cancelTouch: cancelAll, time: Date.now() };
				// trigger universal 'tap' with the option to cancelTouch()
				// (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
				
				tapEvent = target.trigger('tap', data);
				if (tapEvent.defaultPrevented) {
					target.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
					touch = {};
					cancelAll();
					//Event.preventDefault(e);
				} else {
					if (touchEvent.up !== 'mouseup') {
						if (!hasParentNode(target, ['INPUT', 'TEXTAREA', 'SELECT', 'LABEL']) && lightTap) {
							target.trigger('click', data);
						}
					}
					//touch.target.dispatchEvent(event);
					// trigger double tap immediately
					if (touch.isDoubleTap) {
						target.trigger('doubletap', data);
						touch = {};
					} else {// trigger single tap after 250ms of inactivity
						touchTimeout = setTimeout(function () {
							touchTimeout = null;
							target.trigger('singletap', data);
							touch = {};
						}, 250);
						touch = {};
					}
				}

			}, 0);
		} else {
			//Event.preventDefault(e);
		}

	});

	
	if (msPointerEnabled) {
		var originalAddEventListener = elementPrototype.addEventListener;
		elementPrototype.addEventListener = function (type, listener, userCapture) {
			var dir;
			if (type.endsWith('tap') && this.tagName === 'A') {
				this.addEventListener('click', Event.preventDefault);
			}
			if ((dir = type.match(/^swipe(\w*)$/i)) && this.style) {
				this.style.msTouchAction = (dir = dir[1]) ? ((dir === 'left' || dir === 'right') ? 'pan-y' : 'pan-x') : 'none';
			}
			originalAddEventListener.call(this, type, listener, userCapture);
		};
	};
	touchEvent.cancel && document.addEventListener(touchEvent.cancel, cancelAll);
	msPointerEnabled || window.addEventListener('scroll', cancelAll);
	/**/
	// 判断是否支持触摸。
	var touchEnabled = msPointerEnabled || 'ontouchstart' in document;

	defineReadOnlyProperties([Event, exports], { Touch: touchEvent, touchEnabled: touchEnabled });

	var options = document.getElementsByTagName('script').lastItem;
	var lightTap = options ? options.getAttribute('data-light-tap') : false;
	lightTap = lightTap && lightTap !== 'no' && lightTap !== 'false' && lightTap !== 'disabled' && lightTap !== '0';
	// 获取或设置是否在轻触时触发点击事件。
	Object.defineProperty(exports, 'lightTap', {
		get: function () { return lightTap; },
		set: function (value) { lightTap = !!value; }
	});
	// 当没有使用 seajs 等方式加载时，提供一个简单的模块的加载工具。
	if (typeof global.define !== 'function') {

		function Module(name) {
			this.path = Module.getpath(name);
			this.status = Module.states.NONE;
		}
		Module.states = {
			READY: 3,
			LOADED: 2,
			LOADING: 1,
			NONE: 0
		};
		Module.prototype.load = function () {
			Module.current = this;
			//console.log('load: ', this.path);
			this.status = Module.states.LOADING;
			var script = document.createElement('script');
			script.src = this.path;// + '?' + (new Date().getTime());
			script.onload = function () {
				Module.current = 0;
				//Module.queue.remove(Module.current);
				Module.checkqueue();
				this.parentNode.removeChild(this);
			};
			var parent = (document.body || document.head);
			//parent.insertBefore(script, parent.firstChild);
			parent.appendChild(script);
		};
		Module.load = function (names) {
			if (!Array.isArray(names))
				names = [names];
			for (var i = 0, l = Module.queue.length; i < l; i++) {
				names.remove(Module.queue[i].path);
			}
			forEach.call(names, function (name) {
				var module = new Module(name);
				module.load();
			});
		};
		Module.checkqueue = function () {
			if (Module.current)
				return;
			for (var i = 0, l = Module.queue.length; i < l; i++) {
				if (Module.queue[i].status === Module.states.NONE) {
					Module.queue[i].load();
					break;
				}
			}
		};
		Module.require = function (name) {
			var module = new Module(name);
			for (var i = 0, l = Module.queue.length; i < l; i++) {
				if (module.path === Module.queue[i].path) {
					return;
				}
			}
			//console.log('require: ', module);
			Module.queue.push(module);
			Module.checkqueue();
		};
		Module.Modules = {
			z: exports,
			Z: exports,
			$: exports,
			'': exports
		};
		Module.queue = [];

		Module.getpath = function (name) {
			var path = name + '';
			if (path.indexOf('/') === -1) {
				path = location.path.script + '/' + path;
				if (!/\.js($|\?)/.test(path)) {
					path += '.js';
				}
			}
			return path;
		};
		Module.isReady = function (name) {
			return name in Module.Modules || Module.getpath(name) in Module.Modules;
		};
		Module.loadedModule = function (name) {
			if (name in Module.Modules)
				return Module.Modules[name];
			if (Module.getpath(name) in Module.Modules)
				return Module.Modules[Module.getpath(name)];
		};
		Module.check = function (require) {
			//console.log('check:', require);
			Module.queue.forEach(function (module) {
				if (module.status === Module.states.LOADED && Array.isArray(module.requires)) {
					module.requires.remove(require);
					if (module.requires.length === 0) {
						module.status = Module.states.READY;
						Function.isFunction(module.onReady) ? module.onReady() : Module.check(module.path);
					}
				}
			});
		};
		Module.index = 0;
		Module.inlineIndex = 0;
		function require(names) {
			if (Array.likeArray(names)) {
				var modules = [];
				forEach.call(names, function (item) {
					modules.push(Module.loadedModule(item));
				});
				return modules;
			} else {
				return Module.loadedModule(names);
			}
		}
		global.define = function (name, fn) {
			if (typeof (name) === 'function') {
				var temp = fn;
				fn = name;
				name = temp;
			}
			if (typeof (fn) === 'function') {

				var code = fn + '', count = 0;
				var matches = code.match(/[^;\s]*require\s*\(\s*['"]([^'"]*)['"]\s*\)/gm);
				var requires, module, modules = {};

				//console.log(Module.current, code.substr(0,255), matches);
				if (matches && matches.length) {
					forEach.call(matches, function (match) {
						var match = match.match(/['"]([^"']*)['"]/m);
						if (match && match.length > 1 && (match = match[1]) && !Module.isReady(match)) {
							modules[match] = 1;
							count++;
						}
					});
				}
				var tag = document.getElementsByTagName('script').lastItem;
				if (tag && !tag.src) {
					var module = new Module('zModule-inline-' + (Module.inlineIndex++) + '.js');
					Module.queue.push(module);
					module.inline = true;
					Module.current = module;
				}
				//console.log('loaded:', Module.current, count);
				Module.current && (Module.current.onReady = function () {
					this.status = Module.states.READY;
					//console.log('ready:', this);
					Module.Modules[this.path] = fn(require, exports, module);
					Module.check(this.path);
				});
				
				if (count) {
					requires = [];
					for (var k in modules) {
						requires.push(Module.getpath(k));
					}
					if (Module.current) {
						Module.current.requires = requires;
						Module.current.status = Module.states.LOADED;
						//console.log('loaded:', Module.current);
						if (Module.current.inline)
							Module.current = 0;
					}
					requires.forEach(function (name) {
						Module.require(name);
					});
				} else if (Module.current) {
					Module.current.onReady();
				} else {
					fn(require, exports, module);
				}
			}
		};
	
		if (options && (options = options.getAttribute('data-options'))) {
			options = options.split(',');
			//Module.load(options);
			options.forEach(function (option) {
				Module.require(option);
			});
		}
		
		
		//global.Module = Module;
	}
	return exports;
})((this.$ = this.$ || (function (selector) { return typeof (selector) === 'function' ? $.ready(selector) : document.querySelectorAll(selector); })), this);