/**
 * @name byAnDr3W
 * @author -AnDr3W
 * @authorId 278543574059057154
 * @version 2.3.9
 * @description Resursa pentru a pornii pluginurile
 * @invite Jx3TjNS
 * @donate https://www.paypal.me/MircoWittrien
 * @patreon https://www.patreon.com/MircoWittrien
 * @website https://mwittrien.github.io/
 * @source https://github.com/mwittrien/BetterDiscordAddons/tree/master/Library/
 * @updateUrl https://mwittrien.github.io/BetterDiscordAddons/Library/0byAnDr3W.plugin.js
 */

module.exports = (_ => {
	const BdApi = window.BdApi;
	
	const config = {
		"info": {
			"name": "by AnDr3W",
			"author": "-AnDr3W",
			"version": "2.3.9",
			"description": "Resursa pentru a pornii pluginurile"
		},
		"rawUrl": "https://mwittrien.github.io/BetterDiscordAddons/Library/0byAnDr3W.plugin.js"
	};
	
	const Cache = {data: {}, modules: {}};
	
	var libraryInstance;
	var changeLogs = {};
	
	if (window.byAnDr3W_Global && window.byAnDr3W_Global.PluginUtils && typeof window.byAnDr3W_Global.PluginUtils.cleanUp == "function") {
		window.byAnDr3W_Global.PluginUtils.cleanUp(window.byAnDr3W_Global);
	}
	
	const byAnDr3W = {
		started: true
	};
	for (let key in config) key == "info" ? Object.assign(byAnDr3W, config[key]) : (byAnDr3W[key] = config[key]);
	
	const Internal = Object.assign({}, byAnDr3W, {
		patchPriority: 0,
		forceSyncData: true,
		settings: {},
		defaults: {
			general: {
				shareData: {
					value: true,
					onChange: _ => Cache.data = {}
				},
				showToasts: {
					value: true,
					isDisabled: data => data.nativeValue,
					hasNote: data => data.disabled && data.value
				},
				showSupportBadges: {
					value: true
				},
				useChromium: {
					value: false,
					isHidden: data => !Internal.LibraryRequires.electron || !Internal.LibraryRequires.electron.remote,
					getValue: data => !data.disabled
				}
			},
			choices: {
				toastPosition: {
					value: "right",
					items: "ToastPositions"
				}
			}
		},
	});
	for (let key in Internal.defaults) Internal.settings[key] = {};
	
	const LibraryConstants = {
		ToastIcons: {
			info: "INFO",
			danger: "CLOSE_CIRCLE",
			success: "CHECKMARK_CIRCLE",
			warning: "WARNING"
		},
		ToastPositions: {
			center: "toastscenter",
			left: "toastsleft",
			right: "toastsright"
		}
	};
	
	const PluginStores = {
		loaded: {},
		delayed: {
			loads: [],
			starts: []
		},
		updateData: {
			plugins: {},
			timeouts: [],
			downloaded: [],
			interval: null
		},
		patchQueues: {},
		chunkObserver: {},
		contextChunkObserver: {}
	};
	const Plugin = function(config) {
		return class Plugin {
			getName () {return config.info.name;}
			getAuthor () {return config.info.author;}
			getVersion () {return config.info.version;}
			getDescription () {return config.info.description;}
			load () {
				this.loaded = true;
				this.defaults = {};
				this.labels = {};
				if (window.byAnDr3W_Global.loading) {
					if (!PluginStores.delayed.loads.includes(this)) PluginStores.delayed.loads.push(this);
				}
				else {
					Object.assign(this, config.info, byAnDr3W.ObjectUtils.exclude(config, "info"));
					byAnDr3W.TimeUtils.suppress(_ => {
						PluginStores.loaded[config.info.name] = this;
						byAnDr3W.PluginUtils.load(this);
						if (typeof this.onLoad == "function") this.onLoad();
					}, "Failed to load Plugin!", config.info)();
				}
			}
			start () {
				if (!this.loaded) this.load();
				if (window.byAnDr3W_Global.loading) {
					if (!PluginStores.delayed.starts.includes(this)) PluginStores.delayed.starts.push(this);
				}
				else {
					if (this.started) return;
					this.started = true;
					byAnDr3W.TimeUtils.suppress(_ => {
						byAnDr3W.PluginUtils.init(this);
						if (typeof this.onStart == "function") this.onStart();
					}, "Failed to start Plugin!", config.info)();
					delete this.stopping;
				}
			}
			stop () {
				if (window.byAnDr3W_Global.loading) {
					if (PluginStores.delayed.starts.includes(this)) PluginStores.delayed.starts.splice(PluginStores.delayed.starts.indexOf(this), 1);
				}
				else {
					if (this.stopping) return;
					this.stopping = true;
					byAnDr3W.TimeUtils.timeout(_ => {delete this.stopping;});
					
					byAnDr3W.TimeUtils.suppress(_ => {
						if (typeof this.onStop == "function") this.onStop();
						byAnDr3W.PluginUtils.clear(this);
					}, "Failed to stop Plugin!", config.info)();

					delete this.started;
				}
			}
		};
	};

	byAnDr3W.LogUtils = {};
	Internal.console = function (type, config = {}) {
		if (!console[type]) return;
		let name, version;
		if (typeof config.name == "string" && config.name) {
			name = config.name;
			version = typeof config.version == "string" ? config.version : "";
		}
		else {
			name = byAnDr3W.name;
			version = byAnDr3W.version;
		}
		console[type](...[[name && `%c[${name}]`, version && `%c(v${version})`].filter(n => n).join(" "), name && "color: #3a71c1; font-weight: 700;", version && "color: #666; font-weight: 600; font-size: 11px;", [config.strings].flat(10).filter(n => n).join(" ").trim()].filter(n => n));
	};
	byAnDr3W.LogUtils.log = function (strings, config = {}) {
		Internal.console("log", Object.assign({}, config, {name: typeof config == "string" ? config : config.name, strings}));
	};
	byAnDr3W.LogUtils.warn = function (strings, config = {}) {
		Internal.console("warn", Object.assign({}, config, {name: typeof config == "string" ? config : config.name, strings}));
	};
	byAnDr3W.LogUtils.error = function (strings, config = {}) {
		Internal.console("error", Object.assign({}, config, {name: typeof config == "string" ? config : config.name, strings: ["Fatal Error:", strings]}));
	};

	byAnDr3W.TimeUtils = {};
	byAnDr3W.TimeUtils.interval = function (callback, delay, ...args) {
		if (typeof callback != "function" || typeof delay != "number" || delay < 1) return;
		else {
			let count = 0, interval = setInterval(_ => byAnDr3W.TimeUtils.suppress(callback, "Interval")(...[interval, count++, args].flat()), delay);
			return interval;
		}
	};
	byAnDr3W.TimeUtils.timeout = function (callback, delay, ...args) {
		delay = parseFloat(delay);
		if (typeof callback != "function") return;
		if (isNaN(delay) || typeof delay != "number" || delay < 1) {
			let immediate = setImmediate(_ => byAnDr3W.TimeUtils.suppress(callback, "Immediate")(...[immediate, args].flat()));
			return immediate;
		}
		else {
			let start, paused = true, timeout = {
				pause: _ => {
					if (paused) return;
					paused = true;
					byAnDr3W.TimeUtils.clear(timeout.timer);
					delay -= performance.now() - start;
				},
				resume: _ => {
					if (!paused) return;
					paused = false;
					start = performance.now();
					timeout.timer = setTimeout(_ => byAnDr3W.TimeUtils.suppress(callback, "Timeout")(...[timeout, args].flat()), delay)
				}
			};
			timeout.resume();
			return timeout;
		}
	};
	byAnDr3W.TimeUtils.clear = function (...timeObjects) {
		for (let t of timeObjects.flat(10).filter(n => n)) {
			t = t.timer != undefined ? t.timer : t;
			if (typeof t == "number") {
				clearInterval(t);
				clearTimeout(t);
			}
			else if (typeof t == "object") clearImmediate(t);
		}
	};
	byAnDr3W.TimeUtils.suppress = function (callback, strings, config) {return function (...args) {
		try {return callback(...args);}
		catch (err) {byAnDr3W.LogUtils.error([strings, err], config);}
	}};

	byAnDr3W.LogUtils.log("Loading Library");

	byAnDr3W.sameProto = function (a, b) {
		if (a != null && typeof a == "object") return a.constructor && a.constructor.prototype && typeof a.constructor.prototype.isPrototypeOf == "function" && a.constructor.prototype.isPrototypeOf(b);
		else return typeof a == typeof b;
	};
	byAnDr3W.equals = function (mainA, mainB, sorted) {
		let i = -1;
		if (sorted === undefined || typeof sorted !== "boolean") sorted = false;
		return equal(mainA, mainB);
		function equal(a, b) {
			i++;
			let result = true;
			if (i > 1000) result = null;
			else {
				if (typeof a !== typeof b) result = false;
				else if (typeof a == "function") result = a.toString() == b.toString();
				else if (typeof a === "undefined") result = true;
				else if (typeof a === "symbol") result = true;
				else if (typeof a === "boolean") result = a == b;
				else if (typeof a === "string") result = a == b;
				else if (typeof a === "number") {
					if (isNaN(a) || isNaN(b)) result = isNaN(a) == isNaN(b);
					else result = a == b;
				}
				else if (!a && !b) result = true;
				else if (!a || !b) result = false;
				else if (typeof a === "object") {
					let keysA = Object.getOwnPropertyNames(a);
					let keysB = Object.getOwnPropertyNames(b);
					if (keysA.length !== keysB.length) result = false;
					else for (let j = 0; result === true && j < keysA.length; j++) {
						if (sorted) result = equal(a[keysA[j]], b[keysB[j]]);
						else result = equal(a[keysA[j]], b[keysA[j]]);
					}
				}
			}
			i--;
			return result;
		}
	};

	byAnDr3W.ObjectUtils = {};
	byAnDr3W.ObjectUtils.is = function (obj) {
		return obj && !Array.isArray(obj) && !Set.prototype.isPrototypeOf(obj) && (typeof obj == "function" || typeof obj == "object");
	};
	byAnDr3W.ObjectUtils.get = function (nodeOrObj, valuePath) {
		if (!nodeOrObj || !valuePath) return null;
		let obj = Node.prototype.isPrototypeOf(nodeOrObj) ? byAnDr3W.ReactUtils.getInstance(nodeOrObj) : nodeOrObj;
		if (!byAnDr3W.ObjectUtils.is(obj)) return null;
		let found = obj;
		for (const value of valuePath.split(".").filter(n => n)) {
			if (!found) return null;
			found = found[value];
		}
		return found;
	};
	byAnDr3W.ObjectUtils.extract = function (obj, ...keys) {
		let newObj = {};
		if (byAnDr3W.ObjectUtils.is(obj)) for (let key of keys.flat(10).filter(n => n)) if (obj[key] != null) newObj[key] = obj[key];
		return newObj;
	};
	byAnDr3W.ObjectUtils.exclude = function (obj, ...keys) {
		let newObj = Object.assign({}, obj);
		byAnDr3W.ObjectUtils.delete(newObj, ...keys)
		return newObj;
	};
	byAnDr3W.ObjectUtils.delete = function (obj, ...keys) {
		if (byAnDr3W.ObjectUtils.is(obj)) for (let key of keys.flat(10).filter(n => n)) delete obj[key];
	};
	byAnDr3W.ObjectUtils.sort = function (obj, sort, except) {
		if (!byAnDr3W.ObjectUtils.is(obj)) return {};
		let newObj = {};
		if (sort === undefined || !sort) for (let key of Object.keys(obj).sort()) newObj[key] = obj[key];
		else {
			let values = [];
			for (let key in obj) values.push(obj[key]);
			values = byAnDr3W.ArrayUtils.keySort(values, sort, except);
			for (let value of values) for (let key in obj) if (byAnDr3W.equals(value, obj[key])) {
				newObj[key] = value;
				break;
			}
		}
		return newObj;
	};
	byAnDr3W.ObjectUtils.group = function (obj, key) {
		if (!byAnDr3W.ObjectUtils.is(obj)) return {};
		if (typeof key != "string") return obj;
		return Object.entries(obj).reduce((newObj, objPair) => {
			if (!newObj[objPair[1][key]]) newObj[objPair[1][key]] = {};
			newObj[objPair[1][key]][objPair[0]] = objPair[1];
			return newObj;
		}, {});
	};
	byAnDr3W.ObjectUtils.reverse = function (obj, sort) {
		if (!byAnDr3W.ObjectUtils.is(obj)) return {};
		let newObj = {};
		for (let key of (sort === undefined || !sort) ? Object.keys(obj).reverse() : Object.keys(obj).sort().reverse()) newObj[key] = obj[key];
		return newObj;
	};
	byAnDr3W.ObjectUtils.filter = function (obj, filter, byKey = false) {
		if (!byAnDr3W.ObjectUtils.is(obj)) return {};
		if (typeof filter != "function") return obj;
		return Object.keys(obj).filter(key => filter(byKey ? key : obj[key])).reduce((newObj, key) => (newObj[key] = obj[key], newObj), {});
	};
	byAnDr3W.ObjectUtils.push = function (obj, value) {
		if (byAnDr3W.ObjectUtils.is(obj)) obj[Object.keys(obj).length] = value;
	};
	byAnDr3W.ObjectUtils.pop = function (obj, value) {
		if (byAnDr3W.ObjectUtils.is(obj)) {
			let keys = Object.keys(obj);
			if (!keys.length) return;
			let value = obj[keys[keys.length-1]];
			delete obj[keys[keys.length-1]];
			return value;
		}
	};
	byAnDr3W.ObjectUtils.map = function (obj, mapFunc) {
		if (!byAnDr3W.ObjectUtils.is(obj)) return {};
		if (typeof mapFunc != "string" && typeof mapFunc != "function") return obj;
		let newObj = {};
		for (let key in obj) if (byAnDr3W.ObjectUtils.is(obj[key])) newObj[key] = typeof mapFunc == "string" ? obj[key][mapFunc] : mapFunc(obj[key], key);
		return newObj;
	};
	byAnDr3W.ObjectUtils.toArray = function (obj) {
		if (!byAnDr3W.ObjectUtils.is(obj)) return [];
		return Object.entries(obj).map(n => n[1]);
	};
	byAnDr3W.ObjectUtils.deepAssign = function (obj, ...objs) {
		if (!objs.length) return obj;
		let nextObj = objs.shift();
		if (byAnDr3W.ObjectUtils.is(obj) && byAnDr3W.ObjectUtils.is(nextObj)) {
			for (let key in nextObj) {
				if (byAnDr3W.ObjectUtils.is(nextObj[key])) {
					if (!obj[key]) Object.assign(obj, {[key]:{}});
					byAnDr3W.ObjectUtils.deepAssign(obj[key], nextObj[key]);
				}
				else Object.assign(obj, {[key]:nextObj[key]});
			}
		}
		return byAnDr3W.ObjectUtils.deepAssign(obj, ...objs);
	};
	byAnDr3W.ObjectUtils.isEmpty = function (obj) {
		return !byAnDr3W.ObjectUtils.is(obj) || Object.getOwnPropertyNames(obj).length == 0;
	};
	byAnDr3W.ObjectUtils.mirror = function (obj) {
		if (!byAnDr3W.ObjectUtils.is(obj)) return {};
		let newObj = Object.assign({}, obj);
		for (let key in newObj) if (newObj[newObj[key]] == undefined && (typeof key == "number" || typeof key == "string")) newObj[newObj[key]] = key;
		return newObj;
	};

	byAnDr3W.ArrayUtils = {};
	byAnDr3W.ArrayUtils.is = function (array) {
		return array && Array.isArray(array);
	};
	byAnDr3W.ArrayUtils.sum = function (array) {
		return Array.isArray(array) ? array.reduce((total, num) => total + Math.round(num), 0) : 0;
	};
	byAnDr3W.ArrayUtils.keySort = function (array, key, except) {
		if (!byAnDr3W.ArrayUtils.is(array)) return [];
		if (key == null) return array;
		if (except === undefined) except = null;
		return array.sort((x, y) => {
			let xValue = x[key], yValue = y[key];
			if (xValue !== except) return xValue < yValue ? -1 : xValue > yValue ? 1 : 0;
		});
	};
	byAnDr3W.ArrayUtils.numSort = function (array) {
		return array.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
	};
	byAnDr3W.ArrayUtils.includes = function (array, ...values) {
		if (!byAnDr3W.ArrayUtils.is(array)) return null;
		if (!array.length) return false;
		let all = values.pop();
		if (typeof all != "boolean") {
			values.push(all);
			all = true;
		}
		if (!values.length) return false;
		let contained = undefined;
		for (let v of values) {
			if (contained === undefined) contained = all;
			if (all && !array.includes(v)) contained = false;
			if (!all && array.includes(v)) contained = true;
		}
		return contained;
	};
	byAnDr3W.ArrayUtils.remove = function (array, value, all = false) {
		if (!byAnDr3W.ArrayUtils.is(array)) return [];
		if (!array.includes(value)) return array;
		if (!all) array.splice(array.indexOf(value), 1);
		else while (array.indexOf(value) > -1) array.splice(array.indexOf(value), 1);
		return array;
	};
	byAnDr3W.ArrayUtils.getAllIndexes = function (array, value) {
		if (!byAnDr3W.ArrayUtils.is(array) && typeof array != "string") return [];
		var indexes = [], index = -1;
		while ((index = array.indexOf(value, index + 1)) !== -1) indexes.push(index);
		return indexes;
	};
	byAnDr3W.ArrayUtils.removeCopies = function (array) {
		if (!byAnDr3W.ArrayUtils.is(array)) return [];
		return [...new Set(array)];
	};

	byAnDr3W.BDUtils = {};
	byAnDr3W.BDUtils.getPluginsFolder = function () {
		if (BdApi && BdApi.Plugins && BdApi.Plugins.folder && typeof BdApi.Plugins.folder == "string") return BdApi.Plugins.folder;
		else if (Internal.LibraryRequires.process.env.BETTERDISCORD_DATA_PATH) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.BETTERDISCORD_DATA_PATH, "plugins/");
		else if (Internal.LibraryRequires.process.env.injDir) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.injDir, "plugins/");
		else switch (Internal.LibraryRequires.process.platform) {
			case "win32":
				return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.appdata, "BetterDiscord/plugins/");
			case "darwin":
				return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.HOME, "Library/Preferences/BetterDiscord/plugins/");
			default:
				if (Internal.LibraryRequires.process.env.XDG_CONFIG_HOME) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.XDG_CONFIG_HOME, "BetterDiscord/plugins/");
				else if (Internal.LibraryRequires.process.env.HOME) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.HOME, ".config/BetterDiscord/plugins/");
				else return "";
			}
	};
	byAnDr3W.BDUtils.getThemesFolder = function () {
		if (BdApi && BdApi.Themes && BdApi.Themes.folder && typeof BdApi.Themes.folder == "string") return BdApi.Themes.folder;
		else if (Internal.LibraryRequires.process.env.BETTERDISCORD_DATA_PATH) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.BETTERDISCORD_DATA_PATH, "themes/");
		else if (Internal.LibraryRequires.process.env.injDir) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.injDir, "plugins/");
		else switch (Internal.LibraryRequires.process.platform) {
			case "win32": 
				return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.appdata, "BetterDiscord/themes/");
			case "darwin": 
				return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.HOME, "Library/Preferences/BetterDiscord/themes/");
			default:
				if (Internal.LibraryRequires.process.env.XDG_CONFIG_HOME) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.XDG_CONFIG_HOME, "BetterDiscord/themes/");
				else if (Internal.LibraryRequires.process.env.HOME) return Internal.LibraryRequires.path.resolve(Internal.LibraryRequires.process.env.HOME, ".config/BetterDiscord/themes/");
				else return "";
			}
	};
	byAnDr3W.BDUtils.isPluginEnabled = function (pluginName) {
		if (!BdApi) return null;
		else if (BdApi.Plugins && typeof BdApi.Plugins.isEnabled == "function") return BdApi.Plugins.isEnabled(pluginName);
		else if (typeof BdApi.isPluginEnabled == "function") return BdApi.isPluginEnabled(pluginName);
	};
	byAnDr3W.BDUtils.reloadPlugin = function (pluginName) {
		if (!BdApi) return;
		else if (BdApi.Plugins && typeof BdApi.Plugins.reload == "function") BdApi.Plugins.reload(pluginName);
		else if (window.pluginModule) window.pluginModule.reloadPlugin(pluginName);
	};
	byAnDr3W.BDUtils.enablePlugin = function (pluginName) {
		if (!BdApi) return;
		else if (BdApi.Plugins && typeof BdApi.Plugins.enable == "function") BdApi.Plugins.enable(pluginName);
		else if (window.pluginModule) window.pluginModule.startPlugin(pluginName);
	};
	byAnDr3W.BDUtils.disablePlugin = function (pluginName) {
		if (!BdApi) return;
		else if (BdApi.Plugins && typeof BdApi.Plugins.disable == "function") BdApi.Plugins.disable(pluginName);
		else if (window.pluginModule) window.pluginModule.stopPlugin(pluginName);
	};
	byAnDr3W.BDUtils.getPlugin = function (pluginName, hasToBeEnabled = false, overHead = false) {
		if (BdApi && !hasToBeEnabled || byAnDr3W.BDUtils.isPluginEnabled(pluginName)) {	
			if (BdApi.Plugins && typeof BdApi.Plugins.get == "function") {
				let plugin = BdApi.Plugins.get(pluginName);
				if (!plugin) return null;
				if (overHead) return plugin.filename && plugin.exports && plugin.instance ? plugin : {filename: Internal.LibraryRequires.fs.existsSync(Internal.LibraryRequires.path.join(byAnDr3W.BDUtils.getPluginsFolder(), `${pluginName}.plugin.js`)) ? `${pluginName}.plugin.js` : null, id: pluginName, name: pluginName, plugin: plugin};
				else return plugin.filename && plugin.exports && plugin.instance ? plugin.instance : plugin;
			}
			else if (window.bdplugins) overHead ? window.bdplugins[pluginName] : (window.bdplugins[pluginName] || {}).plugin;
		}
		return null;
	};
	byAnDr3W.BDUtils.isThemeEnabled = function (themeName) {
		if (!BdApi) return null;
		else if (BdApi.Themes && typeof BdApi.Themes.isEnabled == "function") return BdApi.Themes.isEnabled(themeName);
		else if (typeof BdApi.isThemeEnabled == "function") return BdApi.isThemeEnabled(themeName);
	};
	byAnDr3W.BDUtils.enableTheme = function (themeName) {
		if (!BdApi) return;
		else if (BdApi.Themes && typeof BdApi.Themes.enable == "function") BdApi.Themes.enable(themeName);
		else if (window.themeModule) window.themeModule.enableTheme(themeName);
	};
	byAnDr3W.BDUtils.disableTheme = function (themeName) {
		if (!BdApi) return;
		else if (BdApi.Themes && typeof BdApi.Themes.disable == "function") BdApi.Themes.disable(themeName);
		else if (window.themeModule) window.themeModule.disableTheme(themeName);
	};
	byAnDr3W.BDUtils.getTheme = function (themeName, hasToBeEnabled = false) {
		if (BdApi && !hasToBeEnabled || byAnDr3W.BDUtils.isThemeEnabled(themeName)) {
			if (BdApi.Themes && typeof BdApi.Themes.get == "function") return BdApi.Themes.get(themeName);
			else if (window.bdthemes) window.bdthemes[themeName];
		}
		return null;
	};
	byAnDr3W.BDUtils.settingsIds = {
		automaticLoading: "settings.addons.autoReload",
		coloredText: "settings.appearance.coloredText",
		normalizedClasses: "settings.general.classNormalizer",
		showToasts: "settings.general.showToasts"
	};
	byAnDr3W.BDUtils.toggleSettings = function (key, state) {
		if (BdApi && typeof key == "string") {
			let path = key.split(".");
			let currentState = byAnDr3W.BDUtils.getSettings(key);
			if (state === true) {
				if (currentState === false && typeof BdApi.enableSetting == "function") BdApi.enableSetting(...path);
			}
			else if (state === false) {
				if (currentState === true && typeof BdApi.disableSetting == "function") BdApi.disableSetting(...path);
			}
			else if (currentState === true || currentState === false) byAnDr3W.BDUtils.toggleSettings(key, !currentState);
		}
	};
	byAnDr3W.BDUtils.getSettings = function (key) {
		if (!BdApi) return {};
		if (typeof key == "string") return typeof BdApi.isSettingEnabled == "function" && BdApi.isSettingEnabled(...key.split("."));
		else return byAnDr3W.ArrayUtils.is(BdApi.settings) ? BdApi.settings.map(n => n.settings.map(m => m.settings.map(l => ({id: [n.id, m.id, l.id].join("."), value: l.value})))).flat(10).reduce((newObj, setting) => (newObj[setting.id] = setting.value, newObj), {}) : {};
	};
	byAnDr3W.BDUtils.getSettingsProperty = function (property, key) {
		if (!BdApi || !byAnDr3W.ArrayUtils.is(BdApi.settings)) return key ? "" : {};
		else {
			let settingsMap = BdApi.settings.map(n => n.settings.map(m => m.settings.map(l => ({id: [n.id, m.id, l.id].join("."), value: l[property]})))).flat(10).reduce((newObj, setting) => (newObj[setting.id] = setting.value, newObj), {});
			return key ? (settingsMap[key] != null ? settingsMap[key] : "") : "";
		}
	};
	
	
	byAnDr3W.PluginUtils = {};
	byAnDr3W.PluginUtils.buildPlugin = function (config) {
		return [Plugin(config), byAnDr3W];
	};
	byAnDr3W.PluginUtils.load = function (plugin) {
		if (!PluginStores.updateData.timeouts.includes(plugin.name)) {
			PluginStores.updateData.timeouts.push(plugin.name);
			const url = Internal.getPluginURL(plugin);

			PluginStores.updateData.plugins[url] = {name: plugin.name, raw: url, version: plugin.version};
			
			byAnDr3W.PluginUtils.checkUpdate(plugin.name, url);
			
			if (!PluginStores.updateData.interval) PluginStores.updateData.interval = byAnDr3W.TimeUtils.interval(_ => {
				byAnDr3W.PluginUtils.checkAllUpdates();
			}, 1000*60*60*4);
			
			byAnDr3W.TimeUtils.timeout(_ => byAnDr3W.ArrayUtils.remove(PluginStores.updateData.timeouts, plugin.name, true), 30000);
		}
	};
	byAnDr3W.PluginUtils.init = function (plugin) {
		byAnDr3W.PluginUtils.load(plugin);
		
		plugin.settings = byAnDr3W.DataUtils.get(plugin);
		
		byAnDr3W.LogUtils.log(byAnDr3W.LanguageUtils.LibraryStringsFormat("toast_plugin_started", ""), plugin);
		if (Internal.settings.general.showToasts && !byAnDr3W.BDUtils.getSettings(byAnDr3W.BDUtils.settingsIds.showToasts)) byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("toast_plugin_started", `${plugin.name} v${plugin.version}`), {
			disableInteractions: true,
			barColor: byAnDr3W.DiscordConstants.Colors.STATUS_GREEN
		});
		
		if (plugin.css) byAnDr3W.DOMUtils.appendLocalStyle(plugin.name, plugin.css);
		
		Internal.patchPlugin(plugin);
		Internal.addQueuePatches(plugin);
		Internal.addContextChunkObservers(plugin);

		byAnDr3W.PluginUtils.translate(plugin);

		byAnDr3W.PluginUtils.checkChangeLog(plugin);
	};
	byAnDr3W.PluginUtils.clear = function (plugin) {
		byAnDr3W.LogUtils.log(byAnDr3W.LanguageUtils.LibraryStringsFormat("toast_plugin_stopped", ""), plugin);
		if (Internal.settings.general.showToasts && !byAnDr3W.BDUtils.getSettings(byAnDr3W.BDUtils.settingsIds.showToasts)) byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("toast_plugin_stopped", `${plugin.name} v${plugin.version}`), {
			disableInteractions: true,
			barColor: byAnDr3W.DiscordConstants.Colors.STATUS_RED
		});
		
		const url = Internal.getPluginURL(plugin);

		byAnDr3W.PluginUtils.cleanUp(plugin);
		
		for (const type in PluginStores.patchQueues) byAnDr3W.ArrayUtils.remove(PluginStores.patchQueues[type].query, plugin, true);
		for (const type in PluginStores.chunkObserver) byAnDr3W.ArrayUtils.remove(PluginStores.chunkObserver[type].query, plugin, true);
		for (const type in PluginStores.contextChunkObserver) byAnDr3W.ArrayUtils.remove(PluginStores.contextChunkObserver[type].query, plugin, true);
		
		for (const modal of document.querySelectorAll(`.${plugin.name}-modal, .${plugin.name.toLowerCase()}-modal, .${plugin.name}-settingsmodal, .${plugin.name.toLowerCase()}-settingsmodal`)) {
			const closeButton = modal.querySelector(byAnDr3W.dotCN.modalclose);
			if (closeButton) closeButton.click();
		}
		
		delete Cache.data[plugin.name]
		delete PluginStores.updateData.plugins[url];
	};
	byAnDr3W.PluginUtils.translate = function (plugin) {
		if (typeof plugin.setLabelsByLanguage == "function" || typeof plugin.changeLanguageStrings == "function") {
			const translate = _ => {
				if (typeof plugin.setLabelsByLanguage == "function") plugin.labels = plugin.setLabelsByLanguage();
				if (typeof plugin.changeLanguageStrings == "function") plugin.changeLanguageStrings();
			};
			if (Internal.LibraryModules.LanguageStore.chosenLocale || Internal.LibraryModules.LanguageStore._chosenLocale || byAnDr3W.DicordUtils.getSettings("locale")) translate();
			else byAnDr3W.TimeUtils.interval(interval => {
				if (Internal.LibraryModules.LanguageStore.chosenLocale || Internal.LibraryModules.LanguageStore._chosenLocale || byAnDr3W.DicordUtils.getSettings("locale")) {
					byAnDr3W.TimeUtils.clear(interval);
					translate();
				}
			}, 100);
		}
	};
	byAnDr3W.PluginUtils.cleanUp = function (plugin) {
		byAnDr3W.TimeUtils.suppress(_ => {
			if (!byAnDr3W.ObjectUtils.is(plugin)) return;
			if (plugin == window.byAnDr3W_Global) {
				if (Internal.removeChunkObserver) Internal.removeChunkObserver();
				let updateNotice = byAnDr3W.dotCN && document.querySelector(byAnDr3W.dotCN.noticeupdate);
				if (updateNotice) updateNotice.close();
				byAnDr3W.TimeUtils.clear(PluginStores && PluginStores.updateData && PluginStores.updateData.interval);
				delete window.byAnDr3W_Global.loaded;
				if (PluginStores) byAnDr3W.TimeUtils.interval((interval, count) => {
					if (count > 60 || window.byAnDr3W_Global.loaded) byAnDr3W.TimeUtils.clear(interval);
					if (window.byAnDr3W_Global.loaded) for (let pluginName in byAnDr3W.ObjectUtils.sort(PluginStores.loaded)) byAnDr3W.TimeUtils.timeout(_ => {
						if (PluginStores.loaded[pluginName].started) byAnDr3W.BDUtils.reloadPlugin(pluginName);
					});
				}, 1000);
			}
			if (byAnDr3W.DOMUtils && byAnDr3W.DOMUtils.removeLocalStyle) byAnDr3W.DOMUtils.removeLocalStyle(plugin.name);
			if (byAnDr3W.ListenerUtils && byAnDr3W.ListenerUtils.remove) byAnDr3W.ListenerUtils.remove(plugin);
			if (byAnDr3W.ListenerUtils && byAnDr3W.ListenerUtils.removeGlobal) byAnDr3W.ListenerUtils.removeGlobal(plugin);
			if (byAnDr3W.StoreChangeUtils && byAnDr3W.StoreChangeUtils.remove) byAnDr3W.StoreChangeUtils.remove(plugin);
			if (byAnDr3W.ObserverUtils && byAnDr3W.ObserverUtils.disconnect) byAnDr3W.ObserverUtils.disconnect(plugin);
			if (byAnDr3W.PatchUtils && byAnDr3W.PatchUtils.unpatch) byAnDr3W.PatchUtils.unpatch(plugin);
			if (byAnDr3W.WindowUtils && byAnDr3W.WindowUtils.closeAll) byAnDr3W.WindowUtils.closeAll(plugin);
			if (byAnDr3W.WindowUtils && byAnDr3W.WindowUtils.removeListener) byAnDr3W.WindowUtils.removeListener(plugin);
		}, "Failed to clean up Plugin!", plugin)();
	};
	byAnDr3W.PluginUtils.checkUpdate = function (pluginName, url) {
		if (pluginName && url && PluginStores.updateData.plugins[url]) return new Promise(callback => {
			Internal.LibraryRequires.request(url, (error, response, body) => {
				if (error || !PluginStores.updateData.plugins[url]) return callback(null);
				let newName = (body.match(/"name"\s*:\s*"([^"]+)"/) || [])[1] || pluginName;
				let newVersion = (body.match(/@version ([0-9]+\.[0-9]+\.[0-9]+)|['"]([0-9]+\.[0-9]+\.[0-9]+)['"]/i) || []).filter(n => n)[1];
				if (!newVersion) return callback(null);
				if (pluginName == newName && byAnDr3W.NumberUtils.getVersionDifference(newVersion, PluginStores.updateData.plugins[url].version) > 0.2) {
					byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("toast_plugin_force_updated", pluginName), {
						type: "warning",
						disableInteractions: true
					});
					byAnDr3W.PluginUtils.downloadUpdate(pluginName, url);
					return callback(2);
				}
				else if (byAnDr3W.NumberUtils.compareVersions(newVersion, PluginStores.updateData.plugins[url].version)) {
					if (PluginStores.updateData.plugins[url]) PluginStores.updateData.plugins[url].outdated = true;
					byAnDr3W.PluginUtils.showUpdateNotice(pluginName, url);
					return callback(1);
				}
				else {
					byAnDr3W.PluginUtils.removeUpdateNotice(pluginName);
					return callback(0);
				}
			});
		});
		return new Promise(callback => callback(null));
	};
	byAnDr3W.PluginUtils.checkAllUpdates = function () {
		return new Promise(callback => {
			let finished = 0, amount = 0;
			for (let url in PluginStores.updateData.plugins) {
				let plugin = PluginStores.updateData.plugins[url];
				if (plugin) byAnDr3W.PluginUtils.checkUpdate(plugin.name, plugin.raw).then(state => {
					finished++;
					if (state == 1) amount++;
					if (finished >= Object.keys(PluginStores.updateData.plugins).length) callback(amount);
				});
			}
		});
	};
	byAnDr3W.PluginUtils.hasUpdateCheck = function (url) {
		if (!url || typeof url != "string") return false;
		let updateStore = Object.assign({}, window.PluginUpdates && window.PluginUpdates.plugins, PluginStores.updateData.plugins);
		if (updateStore[url]) return true;
		else {
			let temp = url.replace("//raw.githubusercontent.com", "//").split("/");
			let gitName = temp.splice(3, 1);
			temp.splice(4, 1);
			temp.splice(2, 1, gitName + ".github.io");
			let pagesUrl = temp.join("/");
			return !!updateStore[pagesUrl];
		}
	};
	byAnDr3W.PluginUtils.showUpdateNotice = function (pluginName, url) {
		if (!pluginName || !url) return;
		let updateNotice = document.querySelector(byAnDr3W.dotCN.noticeupdate);
		if (!updateNotice) {
			let vanishObserver = new MutationObserver(changes => {
				if (!document.contains(updateNotice)) {
					if (updateNotice.querySelector(byAnDr3W.dotCN.noticeupdateentry)) {
						let layers = document.querySelector(byAnDr3W.dotCN.layers) || document.querySelector(byAnDr3W.dotCN.appmount);
						if (layers) layers.parentElement.insertBefore(updateNotice, layers);
					}
					else vanishObserver.disconnect();
				}
				else if (document.contains(updateNotice) && !updateNotice.querySelector(byAnDr3W.dotCNC.noticeupdateentry + byAnDr3W.dotCN.noticebutton)) vanishObserver.disconnect();
			});
			vanishObserver.observe(document.body, {childList: true, subtree: true});
			updateNotice = byAnDr3W.NotificationUtils.notice(`${byAnDr3W.LanguageUtils.LibraryStrings.update_notice_update}&nbsp;&nbsp;&nbsp;&nbsp;<div class="${byAnDr3W.disCN.noticeupdateentries}"></div>`, {
				type: "info",
				className: byAnDr3W.disCN.noticeupdate,
				html: true,
				forceStyle: true,
				customIcon: `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M 15.46875 0.859375 C 15.772992 1.030675 16.059675 1.2229406 16.326172 1.4316406 C 17.134815 2.0640406 17.768634 2.8677594 18.208984 3.8183594 C 18.665347 4.8050594 18.913286 5.9512625 18.945312 7.2265625 L 18.945312 7.2421875 L 18.945312 7.2597656 L 18.945312 16.753906 L 18.945312 16.769531 L 18.945312 16.785156 C 18.914433 18.060356 18.666491 19.206759 18.208984 20.193359 C 17.768634 21.144059 17.135961 21.947578 16.326172 22.580078 C 16.06768 22.782278 15.790044 22.967366 15.496094 23.134766 L 16.326172 23.134766 C 20.285895 23.158766 24 20.930212 24 15.820312 L 24 8.3535156 C 24.021728 3.1431156 20.305428 0.86132812 16.345703 0.86132812 L 15.46875 0.859375 z M 0 0.8671875 L 0 10.064453 L 4.4492188 15.191406 L 4.4492188 5.4394531 L 8.4394531 5.4394531 C 11.753741 5.4394531 11.753741 9.8828125 8.4394531 9.8828125 L 7.0234375 9.8828125 L 7.0234375 14.126953 L 8.4394531 14.126953 C 11.753741 14.126953 11.753741 18.568359 8.4394531 18.568359 L 0 18.568359 L 0 23.138672 L 8.3457031 23.138672 C 12.647637 23.138672 15.987145 21.3021 16.105469 16.75 C 16.105469 14.6555 15.567688 13.090453 14.621094 12.001953 C 15.567688 10.914853 16.105469 9.3502594 16.105469 7.2558594 C 15.988351 2.7036594 12.648845 0.8671875 8.3457031 0.8671875 L 0 0.8671875 z"/></svg>`,
				buttons: !byAnDr3W.BDUtils.getSettings(byAnDr3W.BDUtils.settingsIds.automaticLoading) && [{
					className: byAnDr3W.disCN.noticeupdatebuttonreload,
					contents: byAnDr3W.LanguageUtils.LanguageStrings.ERRORS_RELOAD,
					onClick: _ => location.reload(),
					onMouseEnter: _ => {
						if (PluginStores.updateData.downloaded) byAnDr3W.TooltipUtils.create(reloadButton, PluginStores.updateData.downloaded.join(", "), {
							type: "bottom",
							style: "max-width: 420px"
						});
					}
				}],
				buttons: [{
					className: byAnDr3W.disCN.noticeupdatebuttonall,
					contents: byAnDr3W.LanguageUtils.LanguageStrings.FORM_LABEL_ALL,
					onClick: _ => {for (let notice of updateNotice.querySelectorAll(byAnDr3W.dotCN.noticeupdateentry)) notice.click();}
				}],
				onClose: _ => vanishObserver.disconnect()
			});
			updateNotice.style.setProperty("position", "relative", "important");
			updateNotice.style.setProperty("visibility", "visible", "important");
			updateNotice.style.setProperty("opacity", "1", "important");
			updateNotice.style.setProperty("z-index", "100000", "important");
			let reloadButton = updateNotice.querySelector(byAnDr3W.dotCN.noticeupdatebuttonreload);
			if (reloadButton) byAnDr3W.DOMUtils.hide(reloadButton);
		}
		if (updateNotice) {
			let updateNoticeList = updateNotice.querySelector(byAnDr3W.dotCN.noticeupdateentries);
			if (updateNoticeList && !updateNoticeList.querySelector(`#${pluginName}-notice`)) {
				if (updateNoticeList.childElementCount) updateNoticeList.appendChild(byAnDr3W.DOMUtils.create(`<div class="${byAnDr3W.disCN.noticeupdateseparator}">, </div>`));
				let updateEntry = byAnDr3W.DOMUtils.create(`<div class="${byAnDr3W.disCN.noticeupdateentry}" id="${pluginName}-notice">${pluginName}</div>`);
				updateEntry.addEventListener("click", _ => {
					if (!updateEntry.wasClicked) {
						updateEntry.wasClicked = true;
						byAnDr3W.PluginUtils.downloadUpdate(pluginName, url);
					}
				});
				updateNoticeList.appendChild(updateEntry);
				if (!updateNoticeList.hasTooltip) {
					updateNoticeList.hasTooltip = true;
					updateNotice.tooltip = byAnDr3W.TooltipUtils.create(updateNoticeList, byAnDr3W.LanguageUtils.LibraryStrings.update_notice_click, {
						type: "bottom",
						zIndex: 100001,
						delay: 500,
						onHide: _ => {updateNoticeList.hasTooltip = false;}
					});
				}
			}
		}
	};
	byAnDr3W.PluginUtils.removeUpdateNotice = function (pluginName, updateNotice = document.querySelector(byAnDr3W.dotCN.noticeupdate)) {
		if (!pluginName || !updateNotice) return;
		let updateNoticeList = updateNotice.querySelector(byAnDr3W.dotCN.noticeupdateentries);
		if (updateNoticeList) {
			let noticeEntry = updateNoticeList.querySelector(`#${pluginName}-notice`);
			if (noticeEntry) {
				let nextSibling = noticeEntry.nextSibling;
				let prevSibling = noticeEntry.prevSibling;
				if (nextSibling && byAnDr3W.DOMUtils.containsClass(nextSibling, byAnDr3W.disCN.noticeupdateseparator)) nextSibling.remove();
				else if (prevSibling && byAnDr3W.DOMUtils.containsClass(prevSibling, byAnDr3W.disCN.noticeupdateseparator)) prevSibling.remove();
				noticeEntry.remove();
			}
			if (!updateNoticeList.childElementCount) {
				let reloadButton = updateNotice.querySelector(byAnDr3W.dotCN.noticeupdatebuttonreload);
				if (reloadButton) {
					updateNotice.querySelector(byAnDr3W.dotCN.noticetext).innerText = byAnDr3W.LanguageUtils.LibraryStrings.update_notice_reload;
					byAnDr3W.DOMUtils.show(reloadButton);
				}
				else updateNotice.querySelector(byAnDr3W.dotCN.noticedismiss).click();
			}
		}
	};
	byAnDr3W.PluginUtils.downloadUpdate = function (pluginName, url) {
		if (pluginName && url) Internal.LibraryRequires.request(url, (error, response, body) => {
			if (error) {
				byAnDr3W.PluginUtils.removeUpdateNotice(pluginName);
				byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("toast_plugin_update_failed", pluginName), {
					type: "danger",
					disableInteractions: true
				});
			}
			else {
				let wasEnabled = byAnDr3W.BDUtils.isPluginEnabled(pluginName);
				let newName = (body.match(/"name"\s*:\s*"([^"]+)"/) || [])[1] || pluginName;
				let newVersion = (body.match(/@version ([0-9]+\.[0-9]+\.[0-9]+)|['"]([0-9]+\.[0-9]+\.[0-9]+)['"]/i) || []).filter(n => n)[1];
				let oldVersion = PluginStores.updateData.plugins[url].version;
				let fileName = pluginName == "byAnDr3W" ? "0byAnDr3W" : pluginName;
				let newFileName = newName == "byAnDr3W" ? "0byAnDr3W" : newName;
				Internal.LibraryRequires.fs.writeFile(Internal.LibraryRequires.path.join(byAnDr3W.BDUtils.getPluginsFolder(), newFileName + ".plugin.js"), body, _ => {
					if (PluginStores.updateData.plugins[url]) PluginStores.updateData.plugins[url].version = newVersion;
					if (fileName != newFileName) {
						Internal.LibraryRequires.fs.unlink(Internal.LibraryRequires.path.join(byAnDr3W.BDUtils.getPluginsFolder(), fileName + ".plugin.js"), _ => {});
						let configPath = Internal.LibraryRequires.path.join(byAnDr3W.BDUtils.getPluginsFolder(), fileName + ".config.json");
						Internal.LibraryRequires.fs.exists(configPath, exists => {
							if (exists) Internal.LibraryRequires.fs.rename(configPath, Internal.LibraryRequires.path.join(byAnDr3W.BDUtils.getPluginsFolder(), newFileName + ".config.json"), _ => {});
						});
						byAnDr3W.TimeUtils.timeout(_ => {if (wasEnabled && !byAnDr3W.BDUtils.isPluginEnabled(newName)) byAnDr3W.BDUtils.enablePlugin(newName);}, 3000);
					}
					byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("toast_plugin_updated", pluginName, "v" + oldVersion, newName, "v" + newVersion), {
						disableInteractions: true
					});
					let updateNotice = document.querySelector(byAnDr3W.dotCN.noticeupdate);
					if (updateNotice) {
						if (updateNotice.querySelector(byAnDr3W.dotCN.noticebutton) && !PluginStores.updateData.downloaded.includes(pluginName)) {
							PluginStores.updateData.downloaded.push(pluginName);
						}
						byAnDr3W.PluginUtils.removeUpdateNotice(pluginName, updateNotice);
					}
				});
			}
		});
	};
	byAnDr3W.PluginUtils.checkChangeLog = function (plugin) {
		if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ObjectUtils.is(plugin.changeLog)) return;
		if (!changeLogs[plugin.name] || byAnDr3W.NumberUtils.compareVersions(plugin.version, changeLogs[plugin.name])) {
			changeLogs[plugin.name] = plugin.version;
			byAnDr3W.DataUtils.save(changeLogs, byAnDr3W, "changeLogs");
			byAnDr3W.PluginUtils.openChangeLog(plugin);
		}
	};
	byAnDr3W.PluginUtils.openChangeLog = function (plugin) {
		if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ObjectUtils.is(plugin.changeLog)) return;
		let changeLogHTML = "", headers = {
			added: "New Features",
			fixed: "Bug Fixes",
			improved: "Improvements",
			progress: "Progress"
		};
		for (let type in plugin.changeLog) {
			type = type.toLowerCase();
			let className = byAnDr3W.disCN["changelog" + type];
			if (className) {
				changeLogHTML += `<h1 class="${className} ${byAnDr3W.disCN.margintop20}"${changeLogHTML.indexOf("<h1") == -1 ? `style="margin-top: 0px !important;"` : ""}>${byAnDr3W.LanguageUtils && byAnDr3W.LanguageUtils.LibraryStrings ? byAnDr3W.LanguageUtils.LibraryStrings["changelog_" + type]  : headers[type]}</h1><ul>`;
				for (let key in plugin.changeLog[type]) changeLogHTML += `<li><strong>${key}</strong>${plugin.changeLog[type][key] ? (": " + plugin.changeLog[type][key] + ".") : ""}</li>`;
				changeLogHTML += `</ul>`
			}
		}
		if (changeLogHTML) byAnDr3W.ModalUtils.open(plugin, {
			header: `${plugin.name} ${byAnDr3W.LanguageUtils.LanguageStrings.CHANGE_LOG}`,
			subHeader: `Version ${plugin.version}`,
			className: byAnDr3W.disCN.modalchangelogmodal,
			contentClassName: byAnDr3W.disCNS.changelogcontainer + byAnDr3W.disCN.modalminicontent,
			footerDirection: Internal.LibraryComponents.Flex.Direction.HORIZONTAL,
			children: byAnDr3W.ReactUtils.elementToReact(byAnDr3W.DOMUtils.create(changeLogHTML)),
			footerChildren: (plugin == byAnDr3W || plugin == libraryInstance || PluginStores.loaded[plugin.name] && PluginStores.loaded[plugin.name] == plugin && plugin.author == "-AnDr3W") && byAnDr3W.ReactUtils.createElement("div", {
				className: byAnDr3W.disCN.changelogfooter,
				children: [{
					href: "https://www.paypal.me/MircoWittrien",
					name: "PayPal",
					icon: "PAYPAL"
				}, {
					href: "https://www.patreon.com/MircoWittrien",
					name: "Patreon",
					icon: "PATREON"
				}, {
					name: byAnDr3W.LanguageUtils.LibraryStringsFormat("send", "Solana"),
					icon: "PHANTOM",
					onClick: _ => {
						byAnDr3W.LibraryRequires.electron.clipboard.write({text: InternalData.mySolana});
						byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("clipboard_success", "Phantom Wallet Key"), {
							type: "success"
						});
					}
				}, {
					name: byAnDr3W.LanguageUtils.LibraryStringsFormat("send", "Ethereum"),
					icon: "METAMASK",
					onClick: _ => {
						byAnDr3W.LibraryRequires.electron.clipboard.write({text: InternalData.myEthereum});
						byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("clipboard_success", "MetaMask Wallet Key"), {
							type: "success"
						});
					}
				}].map(data => byAnDr3W.ReactUtils.createElement(data.href ? Internal.LibraryComponents.Anchor : Internal.LibraryComponents.Clickable, {
					className: byAnDr3W.disCN.changelogsociallink,
					href: data.href || "",
					onClick: !data.onClick ? (_ => {}) : data.onClick,
					children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
						text: data.name,
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
							name: Internal.LibraryComponents.SvgIcon.Names[data.icon],
							width: 16,
							height: 16
						})
					})
				})).concat(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextElement, {
					size: Internal.LibraryComponents.TextElement.Sizes.SIZE_12,
					children: byAnDr3W.LanguageUtils.LibraryStrings.donate_message
				}))
			})
		});
	};
	byAnDr3W.PluginUtils.addLoadingIcon = function (icon) {
		if (!Node.prototype.isPrototypeOf(icon)) return;
		let app = document.querySelector(byAnDr3W.dotCN.app);
		if (!app) return;
		byAnDr3W.DOMUtils.addClass(icon, byAnDr3W.disCN.loadingicon);
		let loadingIconWrapper = document.querySelector(byAnDr3W.dotCN.app + ">" + byAnDr3W.dotCN.loadingiconwrapper);
		if (!loadingIconWrapper) {
			loadingIconWrapper = byAnDr3W.DOMUtils.create(`<div class="${byAnDr3W.disCN.loadingiconwrapper}"></div>`);
			app.appendChild(loadingIconWrapper);
			let killObserver = new MutationObserver(changes => {if (!loadingIconWrapper.firstElementChild) byAnDr3W.DOMUtils.remove(loadingIconWrapper);});
			killObserver.observe(loadingIconWrapper, {childList: true});
		}
		loadingIconWrapper.appendChild(icon);
	};
	byAnDr3W.PluginUtils.createSettingsPanel = function (addon, props) {
		if (!window.byAnDr3W_Global.loaded) return "Could not initiate byAnDr3W Library Plugin! Can not create Settings Panel!";
		addon = addon == byAnDr3W && Internal || addon;
		if (!byAnDr3W.ObjectUtils.is(addon)) return;
		let settingsProps = props;
		if (settingsProps && !byAnDr3W.ObjectUtils.is(settingsProps) && (byAnDr3W.ReactUtils.isValidElement(settingsProps) || byAnDr3W.ArrayUtils.is(settingsProps))) settingsProps = {
			children: settingsProps
		};
		return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsPanel, Object.assign({
			addon: addon,
			collapseStates: settingsProps && settingsProps.collapseStates
		}, settingsProps));
	};
	byAnDr3W.PluginUtils.refreshSettingsPanel = function (plugin, settingsPanel, ...args) {
		if (byAnDr3W.ObjectUtils.is(plugin)) {
			if (settingsPanel && settingsPanel.props && byAnDr3W.ObjectUtils.is(settingsPanel.props._instance)) {
				settingsPanel.props._instance.props = Object.assign({}, settingsPanel.props._instance.props, ...args);
				byAnDr3W.ReactUtils.forceUpdate(settingsPanel.props._instance);
			}
			else if (typeof plugin.getSettingsPanel == "function" && Node.prototype.isPrototypeOf(settingsPanel) && settingsPanel.parentElement) {
				settingsPanel.parentElement.appendChild(plugin.getSettingsPanel(...args));
				settingsPanel.remove();
			}
		}
	};

	window.byAnDr3W_Global = Object.assign({
		started: true,
		loading: true,
		PluginUtils: {
			buildPlugin: byAnDr3W.PluginUtils.buildPlugin,
			cleanUp: byAnDr3W.PluginUtils.cleanUp
		}
	}, config, window.byAnDr3W_Global);

	
	const request = require("request"), fs = require("fs"), path = require("path");
	
	Internal.writeConfig = function (plugin, path, config) {
		let allData = {};
		try {allData = JSON.parse(fs.readFileSync(path));}
		catch (err) {allData = {};}
		try {fs.writeFileSync(path, JSON.stringify(Object.assign({}, allData, {[Internal.shouldSyncConfig(plugin) ? "all" : byAnDr3W.UserUtils.me.id]: config}), null, "	"));}
		catch (err) {}
	};
	Internal.readConfig = function (plugin, path) {
		let sync = Internal.shouldSyncConfig(plugin);
		try {
			let config = JSON.parse(fs.readFileSync(path));
			if (config && Object.keys(config).some(n => !(n == "all" || parseInt(n)))) {
				config = {[Internal.shouldSyncConfig(plugin) ? "all" : byAnDr3W.UserUtils.me.id]: config};
				try {fs.writeFileSync(path, JSON.stringify(config, null, "	"));}
				catch (err) {}
			}
			return config && config[sync ? "all" : byAnDr3W.UserUtils.me.id] || {};
		}
		catch (err) {return {};}
	};
	Internal.shouldSyncConfig = function (plugin) {
		return plugin.neverSyncData !== undefined ? !plugin.neverSyncData : (plugin.forceSyncData || Internal.settings.general.shareData);
	};
	
	byAnDr3W.DataUtils = {};
	byAnDr3W.DataUtils.save = function (data, plugin, key, id) {
		plugin = plugin == byAnDr3W && Internal || plugin;
		let pluginName = typeof plugin === "string" ? plugin : plugin.name;
		let fileName = pluginName == "byAnDr3W" ? "0byAnDr3W" : pluginName;
		let configPath = path.join(byAnDr3W.BDUtils.getPluginsFolder(), fileName + ".config.json");
		
		let config = Cache.data[pluginName] !== undefined ? Cache.data[pluginName] : (Internal.readConfig(plugin, configPath) || {});
		
		if (key === undefined) config = byAnDr3W.ObjectUtils.is(data) ? byAnDr3W.ObjectUtils.sort(data) : data;
		else {
			if (id === undefined) config[key] = byAnDr3W.ObjectUtils.is(data) ? byAnDr3W.ObjectUtils.sort(data) : data;
			else {
				if (!byAnDr3W.ObjectUtils.is(config[key])) config[key] = {};
				config[key][id] = byAnDr3W.ObjectUtils.is(data) ? byAnDr3W.ObjectUtils.sort(data) : data;
			}
		}
		
		let configIsObject = byAnDr3W.ObjectUtils.is(config);
		if (key !== undefined && configIsObject && byAnDr3W.ObjectUtils.is(config[key]) && byAnDr3W.ObjectUtils.isEmpty(config[key])) delete config[key];
		if (byAnDr3W.ObjectUtils.isEmpty(config)) {
			delete Cache.data[pluginName];
			if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
		}
		else {
			if (configIsObject) config = byAnDr3W.ObjectUtils.sort(config);
			Cache.data[pluginName] = configIsObject ? byAnDr3W.ObjectUtils.deepAssign({}, config) : config;
			Internal.writeConfig(plugin, configPath, config);
		}
	};

	byAnDr3W.DataUtils.load = function (plugin, key, id) {
		plugin = plugin == byAnDr3W && Internal || plugin;
		let pluginName = typeof plugin === "string" ? plugin : plugin.name;
		let fileName = pluginName == "byAnDr3W" ? "0byAnDr3W" : pluginName;
		let configPath = path.join(byAnDr3W.BDUtils.getPluginsFolder(), fileName + ".config.json");
		
		let config = Cache.data[pluginName] !== undefined ? Cache.data[pluginName] : (Internal.readConfig(plugin, configPath) || {});
		let configIsObject = byAnDr3W.ObjectUtils.is(config);
		Cache.data[pluginName] = configIsObject ? byAnDr3W.ObjectUtils.deepAssign({}, config) : config;
		
		if (key === undefined) return config;
		else {
			let keyData = configIsObject ? (byAnDr3W.ObjectUtils.is(config[key]) || config[key] === undefined ? byAnDr3W.ObjectUtils.deepAssign({}, config[key]) : config[key]) : null;
			if (id === undefined) return keyData;
			else return !byAnDr3W.ObjectUtils.is(keyData) || keyData[id] === undefined ? null : keyData[id];
		}
	};
	byAnDr3W.DataUtils.remove = function (plugin, key, id) {
		plugin = plugin == byAnDr3W && Internal || plugin;
		let pluginName = typeof plugin === "string" ? plugin : plugin.name;
		let fileName = pluginName == "byAnDr3W" ? "0byAnDr3W" : pluginName;
		let configPath = path.join(byAnDr3W.BDUtils.getPluginsFolder(), fileName + ".config.json");
		
		let config = Cache.data[pluginName] !== undefined ? Cache.data[pluginName] : (Internal.readConfig(plugin, configPath) || {});
		let configIsObject = byAnDr3W.ObjectUtils.is(config);
		
		if (key === undefined || !configIsObject) config = {};
		else {
			if (id === undefined) delete config[key];
			else if (byAnDr3W.ObjectUtils.is(config[key])) delete config[key][id];
		}
		
		if (byAnDr3W.ObjectUtils.is(config[key]) && byAnDr3W.ObjectUtils.isEmpty(config[key])) delete config[key];
		if (byAnDr3W.ObjectUtils.isEmpty(config)) {
			delete Cache.data[pluginName];
			if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
		}
		else {
			if (configIsObject) config = byAnDr3W.ObjectUtils.sort(config);
			Cache.data[pluginName] = configIsObject ? byAnDr3W.ObjectUtils.deepAssign({}, config) : config;
			Internal.writeConfig(plugin, configPath, config);
		}
	};
	byAnDr3W.DataUtils.get = function (plugin, key, id) {
		plugin = plugin == byAnDr3W && Internal || plugin;
		plugin = typeof plugin == "string" ? byAnDr3W.BDUtils.getPlugin(plugin) : plugin;
		const defaults = plugin && plugin.defaults;
		if (!byAnDr3W.ObjectUtils.is(defaults) || key && !byAnDr3W.ObjectUtils.is(defaults[key])) return id === undefined ? {} : null;
		let oldC = byAnDr3W.DataUtils.load(plugin), newC = {}, update = false;
		const checkLayer = (i, j) => {
			let isObj = byAnDr3W.ObjectUtils.is(defaults[i][j].value);
			if (!newC[i]) newC[i] = {};
			if (oldC[i] == null || oldC[i][j] == null || isObj && (!byAnDr3W.ObjectUtils.is(oldC[i][j]) || Object.keys(defaults[i][j].value).some(n => defaults[i][j].value[n] != null && !byAnDr3W.sameProto(defaults[i][j].value[n], oldC[i][j][n])))) {
				newC[i][j] = isObj ? byAnDr3W.ObjectUtils.deepAssign({}, defaults[i][j].value) : defaults[i][j].value;
				update = true;
			}
			else newC[i][j] = oldC[i][j];
		};
		if (key) {for (let j in defaults[key]) checkLayer(key, j);}
		else {for (let i in defaults) if (byAnDr3W.ObjectUtils.is(defaults[i])) for (let j in defaults[i]) checkLayer(i, j);}
		if (update) byAnDr3W.DataUtils.save(Object.assign({}, oldC, newC), plugin);
		
		if (key === undefined) return newC;
		else if (id === undefined) return newC[key] === undefined ? {} : newC[key];
		else return newC[key] === undefined || newC[key][id] === undefined ? null : newC[key][id];
	};
	
	const cssFileName = "0byAnDr3W.raw.css";
	const dataFileName = "0byAnDr3W.data.json";
	const cssFilePath = path.join(byAnDr3W.BDUtils.getPluginsFolder(), cssFileName);
	const dataFilePath = path.join(byAnDr3W.BDUtils.getPluginsFolder(), dataFileName);
	let InternalData, libHashes = {}, oldLibHashes = byAnDr3W.DataUtils.load(byAnDr3W, "hashes"), libraryCSS;
	
	const getBackup = (fileName, path) => {
		return libHashes[fileName] && oldLibHashes[fileName] && libHashes[fileName] == oldLibHashes[fileName] && fs.existsSync(path) && (fs.readFileSync(path) || "").toString();
	};
	const requestLibraryHashes = tryAgain => {
		request("https://api.github.com/repos/mwittrien/BetterDiscordAddons/contents/Library/_res/", {headers: {"user-agent": "node.js"}}, (e, r, b) => {
			if ((e || !b || r.statusCode != 200) && tryAgain) return byAnDr3W.TimeUtils.timeout(_ => requestLibraryHashes(), 10000);
			try {
				b = JSON.parse(b);
				libHashes[cssFileName] = (b.find(n => n && n.name == cssFileName) || {}).sha;
				libHashes[dataFileName] = (b.find(n => n && n.name == dataFileName) || {}).sha;
				byAnDr3W.DataUtils.save(libHashes, byAnDr3W, "hashes")
				requestLibraryData(true);
			}
			catch (err) {requestLibraryData(true);}
		});
	};
	const requestLibraryData = tryAgain => {
		const parseCSS = css => {
			libraryCSS = css;
		
			const backupData = getBackup(dataFileName, dataFilePath);
			if (backupData) parseData(backupData);
			else request.get(`https://mwittrien.github.io/BetterDiscordAddons/Library/_res/${dataFileName}`, (e, r, b) => {
				if ((e || !b || r.statusCode != 200) && tryAgain) return byAnDr3W.TimeUtils.timeout(_ => requestLibraryData(), 10000);
				if (!e && b && r.statusCode == 200) parseData(b, true);
				else parseData(fs.existsSync(dataFilePath) && (fs.readFileSync(dataFilePath) || "").toString());
			});
		};
		const parseData = (dataString, fetched) => {
			try {InternalData = JSON.parse(dataString);}
			catch (err) {
				if (fetched) {
					try {
						dataString = fs.existsSync(dataFilePath) && (fs.readFileSync(dataFilePath) || "").toString();
						InternalData = JSON.parse(dataString);
					}
					catch (err2) {byAnDr3W.LogUtils.error(["Failed to initiate Library!", "Failed Fetch!", dataString ? "Corrupt Backup." : "No Backup.", , err2]);}
				}
				else byAnDr3W.LogUtils.error(["Failed to initiate Library!", dataString ? "Corrupt Backup." : "No Backup.", err]);
			}
			if (fetched && dataString) fs.writeFile(dataFilePath, dataString, _ => {});
			
			Internal.getWebModuleReq = function () {
				if (!Internal.getWebModuleReq.req) {
					const id = "byAnDr3W-WebModules";
					const req = window.webpackJsonp.push([[], {[id]: (module, exports, req) => module.exports = req}, [[id]]]);
					delete req.m[id];
					delete req.c[id];
					Internal.getWebModuleReq.req = req;
				}
				return Internal.getWebModuleReq.req;
			};
			
			if (InternalData) loadLibrary();
			else BdApi.alert("Error", "Could not initiate byAnDr3W Library Plugin. Check your Internet Connection and make sure GitHub isn't blocked by your Network or try disabling your VPN/Proxy.");
		};
		
		const backupCSS = getBackup(cssFileName, cssFilePath);
		if (backupCSS) parseCSS(backupCSS);
		else request.get(`https://mwittrien.github.io/BetterDiscordAddons/Library/_res/${cssFileName}`, (e, r, b) => {
			if ((e || !b || r.statusCode != 200) && tryAgain) return byAnDr3W.TimeUtils.timeout(_ => requestLibraryData(), 10000);
			if (!e && b && r.statusCode == 200) {
				fs.writeFile(cssFilePath, b, _ => {});
				parseCSS(b);
			}
			else parseCSS(fs.existsSync(cssFilePath) && (fs.readFileSync(cssFilePath) || "").toString());
		});
	};
	const loadLibrary = _ => {
		InternalData.UserBackgrounds = {};
		if (InternalData.userBackgroundsUrl && InternalData.userBackgroundsProperties) request(InternalData.userBackgroundsUrl, (e3, r3, b3) => {
			if (!e3 && b3 && r3.statusCode == 200) {
				const log = byAnDr3W.UserUtils.me.id == InternalData.myId || byAnDr3W.UserUtils.me.id == "350635509275557888", notUsedValues = [];
				try {
					InternalData.UserBackgrounds = JSON.parse(b3);
					for (let id in InternalData.UserBackgrounds) {
						let user = {};
						for (let key in InternalData.UserBackgrounds[id]) {
							if (InternalData.userBackgroundsProperties[key]) user[InternalData.userBackgroundsProperties[key]] = key == "background" ? `url(${InternalData.UserBackgrounds[id][key]})` : InternalData.UserBackgrounds[id][key];
							else if (log && !notUsedValues.includes(key)) notUsedValues.push(key);
						}
						InternalData.UserBackgrounds[id] = user;
					}
					if (notUsedValues.length) byAnDr3W.LogUtils.warn(["Found unused variables in usrbgs!", notUsedValues]);
				}
				catch (err) {
					InternalData.UserBackgrounds = {};
					if (log) byAnDr3W.LogUtils.error(["Could not load usrbgs!", err]);
				}
			}
		});
		
		Internal.getPluginURL = function (plugin) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (byAnDr3W.ObjectUtils.is(plugin)) {
				if (plugin.rawUrl) return plugin.rawUrl;
				else {
					let name = InternalData.PluginNameMap && InternalData.PluginNameMap[plugin.name] || plugin.name;
					return `https://mwittrien.github.io/BetterDiscordAddons/Plugins/${name}/${name}.plugin.js`;
				}
			}
			else return "";
		};
		
		Internal.findModule = function (type, cacheString, filter, useExport, noWarnings = false) {
			if (!byAnDr3W.ObjectUtils.is(Cache.modules[type])) Cache.modules[type] = {module: {}, export: {}};
			if (useExport && Cache.modules[type].export[cacheString]) return Cache.modules[type].export[cacheString];
			else if (!useExport && Cache.modules[type].module[cacheString]) return Cache.modules[type].module[cacheString];
			else {
				let m = byAnDr3W.ModuleUtils.find(filter, {useExport: useExport});
				if (m) {
					if (useExport) Cache.modules[type].export[cacheString] = m;
					else Cache.modules[type].module[cacheString] = m;
					return m;
				}
				else if (!noWarnings) byAnDr3W.LogUtils.warn(`${cacheString} [${type}] not found in WebModules`);
			}
		};
		
		Internal.hasModuleStrings = function (module, strings, ignoreCase) {
			const toString = n => ignoreCase ? n.toString().toLowerCase() : n.toString();
			return [strings].flat(10).filter(n => typeof n == "string").map(ignoreCase ? (n => n.toLowerCase()) : (n => n)).every(string => typeof module == "function" && (toString(module).indexOf(string) > -1 || typeof module.__originalMethod == "function" && toString(module.__originalMethod).indexOf(string) > -1 || typeof module.__originalFunction == "function" && toString(module.__originalFunction).indexOf(string) > -1) || byAnDr3W.ObjectUtils.is(module) && typeof module.type == "function" && toString(module.type).indexOf(string) > -1);
		};
		
		Internal.getModuleString = function (module) {
			const id = (byAnDr3W.ModuleUtils.find(m => m == module && m, {useExport: false}) || {}).id;
			if (!id) return "";
			const req = Internal.getWebModuleReq();
			return (req.m[id] || "").toString();
		};
		
		Internal.lazyLoadModuleImports = function (moduleString) {
			return new Promise(callback => {
				if (typeof moduleString !== "string") moduleString = Internal.getModuleString(moduleString);
				if (!moduleString || typeof moduleString !== "string") {
					byAnDr3W.LogUtils.error("Trying to lazy load Imports but Module is not a String");
					return callback(null);
				}
				let run = true, imports = [], menuIndexes = [];
				while (run) {
					const [matchString, promiseMatch, menuRequest] = moduleString.match(/return (Promise\.all\(.+?\))\.then\((.+?)\)\)/) ?? [];
					if (!promiseMatch) run = false;
					else {
						imports = imports.concat(promiseMatch.match(/\d+/g)?.map(e => Number(e)));
						menuIndexes.push(menuRequest.match(/\d+/)?.[0]);
						moduleString = moduleString.replace(matchString, "");
					}
				}
				if (!imports.length || !menuIndexes.length) {
					byAnDr3W.LogUtils.error("Trying to lazy load Imports but could not find Indexes");
					return callback(null);
				}
				const req = Internal.getWebModuleReq();
				Promise.all(byAnDr3W.ArrayUtils.removeCopies(imports).map(i => req.e(i))).then(_ => Promise.all(byAnDr3W.ArrayUtils.removeCopies(menuIndexes).map(i => req(i)))).then(callback);
			});
		};
		
		byAnDr3W.ModuleUtils = {};
		byAnDr3W.ModuleUtils.find = function (filter, config = {}) {
			let useExport = typeof config.useExport != "boolean" ? true : config.useExport;
			let onlySearchUnloaded = typeof config.onlySearchUnloaded != "boolean" ? false : config.onlySearchUnloaded;
			let all = typeof config.all != "boolean" ? false : config.all;
			const req = Internal.getWebModuleReq();
			const found = [];
			if (!onlySearchUnloaded) for (let i in req.c) if (req.c.hasOwnProperty(i)) {
				let m = req.c[i].exports, r = null;
				if (m && (typeof m == "object" || typeof m == "function") && !!(r = filter(m))) {
					if (all) found.push(useExport ? r : req.c[i]);
					else return useExport ? r : req.c[i];
				}
				if (m && m.__esModule && m.default && (typeof m.default == "object" || typeof m.default == "function")) {
					if (!!(r = filter(m.default))) {
						if (all) found.push(useExport ? r : req.c[i]);
						else return useExport ? r : req.c[i];
					}
					else if (m.default.type && (typeof m.default.type == "object" || typeof m.default.type == "function") && !!(r = filter(m.default.type))) {
						if (all) found.push(useExport ? r : req.c[i]);
						else return useExport ? r : req.c[i];
					}
				}
			}
			for (let i in req.m) if (req.m.hasOwnProperty(i)) {
				let m = req.m[i];
				if (m && typeof m == "function") {
					if (req.c[i] && !onlySearchUnloaded && filter(m)) {
						if (all) found.push(useExport ? req.c[i].exports : req.c[i]);
						else return useExport ? req.c[i].exports : req.c[i];
					}
					if (!req.c[i] && onlySearchUnloaded && filter(m)) {
						const resolved = {}, resolved2 = {};
						m(resolved, resolved2, req);
						const trueResolved = resolved2 && byAnDr3W.ObjectUtils.isEmpty(resolved2) ? resolved : resolved2;
						if (all) found.push(useExport ? trueResolved.exports : trueResolved);
						else return useExport ? trueResolved.exports : trueResolved;
					}
				}
			}
			if (all) return found;
		};
		byAnDr3W.ModuleUtils.findByProperties = function (...properties) {
			properties = properties.flat(10);
			let arg2 = properties.pop();
			let arg1 = properties.pop();
			let useExport = true, noWarnings = false;
			if (typeof arg2 != "boolean") properties.push(...[arg1, arg2].filter(n => n));
			else {
				if (typeof arg1 != "boolean") {
					if (arg1) properties.push(arg1);
					useExport = arg2;
				}
				else {
					useExport = arg1;
					noWarnings = arg2;
				}
			}
			return Internal.findModule("prop", JSON.stringify(properties), m => properties.every(prop => {
				const value = m[prop];
				return value !== undefined && !(typeof value == "string" && !value);
			}) && m, useExport, noWarnings);
		};
		byAnDr3W.ModuleUtils.findByName = function (name, useExport, noWarnings = false) {
			return Internal.findModule("name", JSON.stringify(name), m => m.displayName === name && m || m.render && m.render.displayName === name && m || m[name] && m[name].displayName === name && m[name], typeof useExport != "boolean" ? true : useExport, noWarnings);
		};
		byAnDr3W.ModuleUtils.findByString = function (...strings) {
			strings = strings.flat(10);
			let arg2 = strings.pop();
			let arg1 = strings.pop();
			let useExport = true, noWarnings = false;
			if (typeof arg2 != "boolean") strings.push(...[arg1, arg2].filter(n => n));
			else {
				if (typeof arg1 != "boolean") {
					if (arg1) strings.push(arg1);
					useExport = arg2;
				}
				else {
					useExport = arg1;
					noWarnings = arg2;
				}
			}
			return Internal.findModule("string", JSON.stringify(strings), m => Internal.hasModuleStrings(m, strings) && m, useExport, noWarnings);
		};
		byAnDr3W.ModuleUtils.findByPrototypes = function (...protoProps) {
			protoProps = protoProps.flat(10);
			let arg2 = protoProps.pop();
			let arg1 = protoProps.pop();
			let useExport = true, noWarnings = false;
			if (typeof arg2 != "boolean") protoProps.push(...[arg1, arg2].filter(n => n));
			else {
				if (typeof arg1 != "boolean") {
					if (arg1) protoProps.push(arg1);
					useExport = arg2;
				}
				else {
					useExport = arg1;
					noWarnings = arg2;
				}
			}
			return Internal.findModule("proto", JSON.stringify(protoProps), m => m.prototype && protoProps.every(prop => {
				const value = m.prototype[prop];
				return value !== undefined && !(typeof value == "string" && !value);
			}) && m, useExport, noWarnings);
		};
		byAnDr3W.ModuleUtils.findStringObject = function (props, config = {}) {
			return byAnDr3W.ModuleUtils.find(m => {
				let amount = Object.keys(m).length;
				return (!config.length || (config.smaller ? amount < config.length : amount == config.length)) && [props].flat(10).every(prop => typeof m[prop] == "string") && m;
			}) || byAnDr3W.ModuleUtils.find(m => {
				if (typeof m != "function") return false;
				let stringified = m.toString().replace(/\s/g, "");
				if (stringified.indexOf("e=>{e.exports={") != 0) return false;
				let amount = stringified.split(":\"").length - 1;
				return (!config.length || (config.smaller ? amount < config.length : amount == config.length)) && [props].flat(10).every(string => stringified.indexOf(`${string}:`) > -1) && m;
			}, {onlySearchUnloaded: true});
		};
	
		byAnDr3W.ObserverUtils = {};
		byAnDr3W.ObserverUtils.connect = function (plugin, eleOrSelec, observer, config = {childList: true}) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !eleOrSelec || !observer) return;
			if (byAnDr3W.ObjectUtils.isEmpty(plugin.observers)) plugin.observers = {};
			if (!byAnDr3W.ArrayUtils.is(plugin.observers[observer.name])) plugin.observers[observer.name] = [];
			if (!observer.multi) for (let subinstance of plugin.observers[observer.name]) subinstance.disconnect();
			if (observer.instance) plugin.observers[observer.name].push(observer.instance);
			let instance = plugin.observers[observer.name][plugin.observers[observer.name].length - 1];
			if (instance) {
				let node = Node.prototype.isPrototypeOf(eleOrSelec) ? eleOrSelec : typeof eleOrSelec === "string" ? document.querySelector(eleOrSelec) : null;
				if (node) instance.observe(node, config);
			}
		};
		byAnDr3W.ObserverUtils.disconnect = function (plugin, observer) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (byAnDr3W.ObjectUtils.is(plugin) && !byAnDr3W.ObjectUtils.isEmpty(plugin.observers)) {
				let observername = typeof observer == "string" ? observer : (byAnDr3W.ObjectUtils.is(observer) ? observer.name : null);
				if (!observername) {
					for (let observer in plugin.observers) for (let instance of plugin.observers[observer]) instance.disconnect();
					delete plugin.observers;
				}
				else if (!byAnDr3W.ArrayUtils.is(plugin.observers[observername])) {
					for (let instance of plugin.observers[observername]) instance.disconnect();
					delete plugin.observers[observername];
				}
			}
		};

		byAnDr3W.StoreChangeUtils = {};
		byAnDr3W.StoreChangeUtils.add = function (plugin, store, callback) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ObjectUtils.is(store) || typeof store.addChangeListener != "function" ||  typeof callback != "function") return;
			byAnDr3W.StoreChangeUtils.remove(plugin, store, callback);
			if (!byAnDr3W.ArrayUtils.is(plugin.changeListeners)) plugin.changeListeners = [];
			plugin.changeListeners.push({store, callback});
			store.addChangeListener(callback);
		};
		byAnDr3W.StoreChangeUtils.remove = function (plugin, store, callback) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ArrayUtils.is(plugin.changeListeners)) return;
			if (!store) {
				while (plugin.changeListeners.length) {
					let listener = plugin.changeListeners.pop();
					listener.store.removeChangeListener(listener.callback);
				}
			}
			else if (byAnDr3W.ObjectUtils.is(store) && typeof store.addChangeListener == "function") {
				if (!callback) {
					for (let listener of plugin.changeListeners) {
						let removedListeners = [];
						if (listener.store == store) {
							listener.store.removeChangeListener(listener.callback);
							removedListeners.push(listener);
						}
						if (removedListeners.length) plugin.changeListeners = plugin.changeListeners.filter(listener => !removedListeners.includes(listener));
					}
				}
				else if (typeof callback == "function") {
					store.removeChangeListener(callback);
					plugin.changeListeners = plugin.changeListeners.filter(listener => listener.store == store && listener.callback == callback);
				}
			}
		};

		var pressedKeys = [], mousePosition;
		byAnDr3W.ListenerUtils = {};
		byAnDr3W.ListenerUtils.isPressed = function (key) {
			return pressedKeys.includes(key);
		};
		byAnDr3W.ListenerUtils.getPosition = function (key) {
			return mousePosition;
		};
		byAnDr3W.ListenerUtils.add = function (plugin, ele, actions, selectorOrCallback, callbackOrNothing) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || (!Node.prototype.isPrototypeOf(ele) && ele !== window) || !actions) return;
			let callbackIs4th = typeof selectorOrCallback == "function";
			let selector = callbackIs4th ? undefined : selectorOrCallback;
			let callback = callbackIs4th ? selectorOrCallback : callbackOrNothing;
			if (typeof callback != "function") return;
			byAnDr3W.ListenerUtils.remove(plugin, ele, actions, selector);
			for (let action of actions.split(" ")) {
				action = action.split(".");
				let eventName = action.shift().toLowerCase();
				if (!eventName) return;
				let origEventName = eventName;
				eventName = eventName == "mouseenter" || eventName == "mouseleave" ? "mouseover" : eventName;
				let namespace = (action.join(".") || "") + plugin.name;
				if (!byAnDr3W.ArrayUtils.is(plugin.eventListeners)) plugin.eventListeners = [];
				let eventCallback = null;
				if (selector) {
					if (origEventName == "mouseenter" || origEventName == "mouseleave") eventCallback = e => {
						for (let child of e.path) if (typeof child.matches == "function" && child.matches(selector) && !child[namespace + "byAnDr3W" + origEventName]) {
							child[namespace + "byAnDr3W" + origEventName] = true;
							if (origEventName == "mouseenter") callback(byAnDr3W.ListenerUtils.copyEvent(e, child));
							let mouseOut = e2 => {
								if (e2.target.contains(child) || e2.target == child || !child.contains(e2.target)) {
									if (origEventName == "mouseleave") callback(byAnDr3W.ListenerUtils.copyEvent(e, child));
									delete child[namespace + "byAnDr3W" + origEventName];
									document.removeEventListener("mouseout", mouseOut);
								}
							};
							document.addEventListener("mouseout", mouseOut);
							break;
						}
					};
					else eventCallback = e => {
						for (let child of e.path) if (typeof child.matches == "function" && child.matches(selector)) {
							callback(byAnDr3W.ListenerUtils.copyEvent(e, child));
							break;
						}
					};
				}
				else eventCallback = e => callback(byAnDr3W.ListenerUtils.copyEvent(e, ele));
				
				let observer;
				if (Node.prototype.isPrototypeOf(ele)) {
					observer = new MutationObserver(changes => changes.forEach(change => {
						const nodes = Array.from(change.removedNodes);
						if (nodes.indexOf(ele) > -1 || nodes.some(n =>  n.contains(ele))) byAnDr3W.ListenerUtils.remove(plugin, ele, actions, selector);
					}));
					observer.observe(document.body, {subtree: true, childList: true});
				}

				plugin.eventListeners.push({ele, eventName, origEventName, namespace, selector, eventCallback, observer});
				ele.addEventListener(eventName, eventCallback, true);
			}
		};
		byAnDr3W.ListenerUtils.remove = function (plugin, ele, actions = "", selector) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ArrayUtils.is(plugin.eventListeners)) return;
			if (!ele) {
				while (plugin.eventListeners.length) {
					let listener = plugin.eventListeners.pop();
					listener.ele.removeEventListener(listener.eventName, listener.eventCallback, true);
					if (listener.observer) listener.observer.disconnect();
				}
			}
			else if (Node.prototype.isPrototypeOf(ele) || ele === window) {
				for (let action of actions.split(" ")) {
					action = action.split(".");
					let eventName = action.shift().toLowerCase();
					let namespace = (action.join(".") || "") + plugin.name;
					for (let listener of plugin.eventListeners) {
						let removedListeners = [];
						if (listener.ele == ele && (!eventName || listener.origEventName == eventName) && listener.namespace == namespace && (selector === undefined || listener.selector == selector)) {
							listener.ele.removeEventListener(listener.eventName, listener.eventCallback, true);
							if (listener.observer) listener.observer.disconnect();
							removedListeners.push(listener);
						}
						if (removedListeners.length) plugin.eventListeners = plugin.eventListeners.filter(listener => !removedListeners.includes(listener));
					}
				}
			}
		};
		byAnDr3W.ListenerUtils.addGlobal = function (plugin, id, keybind, action) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !id || !byAnDr3W.ArrayUtils.is(keybind) || typeof action != "function") return;
			if (!byAnDr3W.ObjectUtils.is(plugin.globalKeybinds)) plugin.globalKeybinds = {};
			byAnDr3W.ListenerUtils.removeGlobal(plugin, id);
			plugin.globalKeybinds[id] = byAnDr3W.NumberUtils.generateId(Object.entries(plugin.globalKeybinds).map(n => n[1]));
			byAnDr3W.LibraryModules.WindowUtils.inputEventRegister(plugin.globalKeybinds[id], keybind.map(n => [0, n]), action, {blurred: true, focused: true, keydown: false, keyup: true});
			return (_ => byAnDr3W.ListenerUtils.removeGlobal(plugin, id));
		};
		byAnDr3W.ListenerUtils.removeGlobal = function (plugin, id) {
			if (!byAnDr3W.ObjectUtils.is(plugin) || !plugin.globalKeybinds) return;
			if (!id) {
				for (let cachedId in plugin.globalKeybinds) byAnDr3W.LibraryModules.WindowUtils.inputEventUnregister(plugin.globalKeybinds[cachedId]);
				plugin.globalKeybinds = {};
			}
			else {
				byAnDr3W.LibraryModules.WindowUtils.inputEventUnregister(plugin.globalKeybinds[id]);
				delete plugin.globalKeybinds[id];
			}
		};
		byAnDr3W.ListenerUtils.multiAdd = function (node, actions, callback) {
			if (!Node.prototype.isPrototypeOf(node) || !actions || typeof callback != "function") return;
			for (let action of actions.trim().split(" ").filter(n => n)) node.addEventListener(action, callback, true);
		};
		byAnDr3W.ListenerUtils.multiRemove = function (node, actions, callback) {
			if (!Node.prototype.isPrototypeOf(node) || !actions || typeof callback != "function") return;
			for (let action of actions.trim().split(" ").filter(n => n)) node.removeEventListener(action, callback, true);
		};
		byAnDr3W.ListenerUtils.addToChildren = function (node, actions, selector, callback) {
			if (!Node.prototype.isPrototypeOf(node) || !actions || !selector || !selector.trim() || typeof callback != "function") return;
			for (let action of actions.trim().split(" ").filter(n => n)) {
				let eventCallback = callback;
				if (action == "mouseenter" || action == "mouseleave") eventCallback = e => {if (e.target.matches(selector)) callback(e);};
				node.querySelectorAll(selector.trim()).forEach(child => {child.addEventListener(action, eventCallback, true);});
			}
		};
		byAnDr3W.ListenerUtils.copyEvent = function (e, ele) {
			if (!e || !e.constructor || !e.type) return e;
			let eCopy = new e.constructor(e.type, e);
			Object.defineProperty(eCopy, "originalEvent", {value: e});
			Object.defineProperty(eCopy, "which", {value: e.which});
			Object.defineProperty(eCopy, "keyCode", {value: e.keyCode});
			Object.defineProperty(eCopy, "path", {value: e.path});
			Object.defineProperty(eCopy, "relatedTarget", {value: e.relatedTarget});
			Object.defineProperty(eCopy, "srcElement", {value: e.srcElement});
			Object.defineProperty(eCopy, "target", {value: e.target});
			Object.defineProperty(eCopy, "toElement", {value: e.toElement});
			if (ele) Object.defineProperty(eCopy, "currentTarget", {value: ele});
			return eCopy;
		};
		byAnDr3W.ListenerUtils.stopEvent = function (e) {
			if (byAnDr3W.ObjectUtils.is(e)) {
				if (typeof e.preventDefault == "function") e.preventDefault();
				if (typeof e.stopPropagation == "function") e.stopPropagation();
				if (typeof e.stopImmediatePropagation == "function") e.stopImmediatePropagation();
				if (byAnDr3W.ObjectUtils.is(e.originalEvent)) {
					if (typeof e.originalEvent.preventDefault == "function") e.originalEvent.preventDefault();
					if (typeof e.originalEvent.stopPropagation == "function") e.originalEvent.stopPropagation();
					if (typeof e.originalEvent.stopImmediatePropagation == "function") e.originalEvent.stopImmediatePropagation();
				}
			}
		};
		
		var Toasts = [], NotificationBars = [];
		var ToastQueues = {}, DesktopNotificationQueue = {queue: [], running: false};
		for (let key in LibraryConstants.ToastPositions) ToastQueues[LibraryConstants.ToastPositions[key]] = {queue: [], full: false};
		
		byAnDr3W.NotificationUtils = {};
		byAnDr3W.NotificationUtils.toast = function (children, config = {}) {
			if (!children) return;
			let app = document.querySelector(byAnDr3W.dotCN.appmount) || document.body;
			if (!app) return;
			let position = config.position && LibraryConstants.ToastPositions[config.position] || Internal.settings.choices.toastPosition && LibraryConstants.ToastPositions[Internal.settings.choices.toastPosition] || LibraryConstants.ToastPositions.right;
			
			const runQueue = _ => {
				if (ToastQueues[position].full) return;
				let data = ToastQueues[position].queue.shift();
				if (!data) return;
				
				let id = byAnDr3W.NumberUtils.generateId(Toasts);
				let toasts = document.querySelector(byAnDr3W.dotCN.toasts + byAnDr3W.dotCN[position]);
				if (!toasts) {
					toasts = byAnDr3W.DOMUtils.create(`<div class="${byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.toasts, byAnDr3W.disCN[position])}"></div>`);
					app.appendChild(toasts);
				}
				
				if (data.config.id) data.toast.id = data.config.id.split(" ").join("");
				if (data.config.className) byAnDr3W.DOMUtils.addClass(data.toast, data.config.className);
				if (data.config.css) byAnDr3W.DOMUtils.appendLocalStyle("byAnDr3WcustomToast" + id, data.config.css);
				if (data.config.style) data.toast.style = Object.assign({}, data.toast.style, data.config.style);
				
				let backgroundColor, fontColor, barColor;
				
				let type = data.config.type && byAnDr3W.disCN["toast" + data.config.type];
				if (!type) {
					barColor = byAnDr3W.ColorUtils.getType(data.config.barColor) ? byAnDr3W.ColorUtils.convert(data.config.barColor, "HEX") : data.config.barColor;
					let comp = byAnDr3W.ColorUtils.convert(data.config.color, "RGBCOMP");
					if (comp) {
						backgroundColor = byAnDr3W.ColorUtils.convert(comp, "HEX");
						fontColor = comp[0] > 180 && comp[1] > 180 && comp[2] > 180 ? "#000" : "#FFF";
						byAnDr3W.DOMUtils.addClass(data.toast, byAnDr3W.disCN.toastcustom);
					}
					else byAnDr3W.DOMUtils.addClass(data.toast, byAnDr3W.disCN.toastdefault);
				}
				else byAnDr3W.DOMUtils.addClass(data.toast, type);
				
				let loadingInterval;
				let disableInteractions = data.config.disableInteractions && typeof data.config.onClick != "function";
				let timeout = typeof data.config.timeout == "number" && !disableInteractions ? data.config.timeout : 3000;
				timeout = (timeout > 0 ? timeout : 600000) + 300;
				if (data.config.ellipsis && typeof data.children == "string") loadingInterval = byAnDr3W.TimeUtils.interval(_ => data.toast.update(data.children.endsWith(".....") ? data.children.slice(0, -5) : data.children + "."), 500);
				
				let closeTimeout = byAnDr3W.TimeUtils.timeout(_ => data.toast.close(), timeout);
				data.toast.close = _ => {
					byAnDr3W.TimeUtils.clear(closeTimeout);
					if (document.contains(data.toast)) {
						byAnDr3W.DOMUtils.addClass(data.toast, byAnDr3W.disCN.toastclosing);
						data.toast.style.setProperty("pointer-events", "none", "important");
						byAnDr3W.TimeUtils.timeout(_ => {
							if (typeof data.config.onClose == "function") data.config.onClose();
							byAnDr3W.TimeUtils.clear(loadingInterval);
							byAnDr3W.ArrayUtils.remove(Toasts, id);
							byAnDr3W.DOMUtils.removeLocalStyle("byAnDr3WcustomToast" + id);
							data.toast.remove();
							if (!toasts.querySelectorAll(byAnDr3W.dotCN.toast).length) toasts.remove();
						}, 300);
					}
					ToastQueues[position].full = false;
					runQueue();
				};
				
				if (disableInteractions) data.toast.style.setProperty("pointer-events", "none", "important");
				else {
					byAnDr3W.DOMUtils.addClass(data.toast, byAnDr3W.disCN.toastclosable);
					data.toast.addEventListener("click", event => {
						if (typeof data.config.onClick == "function" && !byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.toastcloseicon, event.target)) data.config.onClick();
						data.toast.close();
					});
					if (typeof closeTimeout.pause == "function") {
						let paused = false;
						data.toast.addEventListener("mouseenter", _ => {
							if (paused) return;
							paused = true;
							closeTimeout.pause();
						});
						data.toast.addEventListener("mouseleave", _ => {
							if (!paused) return;
							paused = false;
							closeTimeout.resume();
						});
					}
				}
				
				toasts.appendChild(data.toast);
				byAnDr3W.TimeUtils.timeout(_ => byAnDr3W.DOMUtils.removeClass(data.toast, byAnDr3W.disCN.toastopening));
				
				let icon = data.config.avatar ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.AvatarComponents.default, {
					src: data.config.avatar,
					size: Internal.LibraryComponents.AvatarComponents.Sizes.SIZE_24
				}) : ((data.config.icon || data.config.type && LibraryConstants.ToastIcons[data.config.type]) ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
					name: data.config.type && LibraryConstants.ToastIcons[data.config.type] && Internal.LibraryComponents.SvgIcon.Names[LibraryConstants.ToastIcons[data.config.type]],
					iconSVG: data.config.icon,
					width: 18,
					height: 18,
					nativeClass: true
				}) : null);
				
				byAnDr3W.ReactUtils.render(byAnDr3W.ReactUtils.createElement(class byAnDr3W_Toast extends Internal.LibraryModules.React.Component {
					componentDidMount() {
						data.toast.update = newChildren => {
							if (!newChildren) return;
							data.children = newChildren;
							byAnDr3W.ReactUtils.forceUpdate(this);
						};
					}
					render() {
						return byAnDr3W.ReactUtils.createElement(Internal.LibraryModules.React.Fragment, {
							children: [
								byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.disCN.toastbg,
									style: {backgroundColor: backgroundColor}
								}),
								byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.disCN.toastinner,
									style: {color: fontColor},
									children: [
										icon && byAnDr3W.ReactUtils.createElement("div", {
											className: byAnDr3W.DOMUtils.formatClassName(data.config.avatar && byAnDr3W.disCN.toastavatar, byAnDr3W.disCN.toasticon, data.config.iconClassName),
											children: icon
										}),
										byAnDr3W.ReactUtils.createElement("div", {
											className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.toasttext, data.config.textClassName),
											children: data.children
										}),
										!disableInteractions && byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
											className: byAnDr3W.disCN.toastcloseicon,
											name: Internal.LibraryComponents.SvgIcon.Names.CLOSE,
											width: 16,
											height: 16
										})
									].filter(n => n)
								}),
								byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.toastbar, barColor && byAnDr3W.disCN.toastcustombar),
									style: {
										backgroundColor: barColor,
										animation: `toast-bar ${timeout}ms normal linear`
									}
								})
							]
						});
					}
				}, {}), data.toast);
				
				ToastQueues[position].full = (byAnDr3W.ArrayUtils.sum(Array.from(toasts.childNodes).map(c => {
					let height = byAnDr3W.DOMUtils.getRects(c).height;
					return height > 50 ? height : 50;
				})) - 100) > byAnDr3W.DOMUtils.getRects(app).height;
				
				if (typeof data.config.onShow == "function") data.config.onShow();
			};
			
			let toast = byAnDr3W.DOMUtils.create(`<div class="${byAnDr3W.disCNS.toast + byAnDr3W.disCN.toastopening}"></div>`);
			toast.update = _ => {};
			ToastQueues[position].queue.push({children, config, toast});
			runQueue();
			return toast;
		};
		byAnDr3W.NotificationUtils.desktop = function (content, config = {}) {
			if (!content) return;
			
			const queue = _ => {
				DesktopNotificationQueue.queue.push({content, config});
				runQueue();
			};
			const runQueue = _ => {
				if (DesktopNotificationQueue.running) return;
				let data = DesktopNotificationQueue.queue.shift();
				if (!data) return;
				
				DesktopNotificationQueue.running = true;
				let muted = data.config.silent;
				data.config.silent = data.config.silent || data.config.sound ? true : false;
				let audio = new Audio();
				if (!muted && data.config.sound) {
					audio.src = data.config.sound;
					audio.play();
				}
				let notification = new Notification(data.content, data.config);
				
				let disableInteractions = data.config.disableInteractions && typeof data.config.onClick != "function";
				if (disableInteractions) notification.onclick = _ => {};
				else notification.onclick = _ => {
					if (typeof data.config.onClick == "function") data.config.onClick();
					notification.close();
				};
				
				notification.onclose = _ => {
					audio.pause();
					DesktopNotificationQueue.running = false;
					byAnDr3W.TimeUtils.timeout(runQueue, 1000);
				}
			};
			
			if (!("Notification" in window)) {}
			else if (Notification.permission === "granted") queue();
			else if (Notification.permission !== "denied") Notification.requestPermission(function (response) {if (response === "granted") queue();});
		};
		byAnDr3W.NotificationUtils.notice = function (text, config = {}) {
			if (!text) return;
			let layers = document.querySelector(byAnDr3W.dotCN.layers) || document.querySelector(byAnDr3W.dotCN.appmount);
			if (!layers) return;
			let id = byAnDr3W.NumberUtils.generateId(NotificationBars);
			let notice = byAnDr3W.DOMUtils.create(`<div class="${byAnDr3W.disCNS.notice + byAnDr3W.disCN.noticewrapper}" notice-id="${id}"><div class="${byAnDr3W.disCN.noticedismiss}"${config.forceStyle ? ` style="width: 36px !important; height: 36px !important; position: absolute !important; top: 0 !important; right: 0 !important; left: unset !important;"` : ""}></div><div class="${byAnDr3W.disCN.noticetext}"></div></div>`);
			layers.parentElement.insertBefore(notice, layers);
			let noticeText = notice.querySelector(byAnDr3W.dotCN.noticetext);
			if (config.platform) for (let platform of config.platform.split(" ")) if (DiscordClasses["noticeicon" + platform]) {
				let icon = byAnDr3W.DOMUtils.create(`<i class="${byAnDr3W.disCN["noticeicon" + platform]}"></i>`);
				byAnDr3W.DOMUtils.addClass(icon, byAnDr3W.disCN.noticeplatformicon);
				byAnDr3W.DOMUtils.removeClass(icon, byAnDr3W.disCN.noticeicon);
				notice.insertBefore(icon, noticeText);
			}
			if (config.customIcon) {
				let icon = document.createElement("i"), iconInner = byAnDr3W.DOMUtils.create(config.customIcon);
				if (iconInner.nodeType == Node.TEXT_NODE) icon.style.setProperty("background", `url(${config.customIcon}) center/cover no-repeat`);
				else {
					icon = iconInner;
					if ((icon.tagName || "").toUpperCase() == "SVG") {
						icon.removeAttribute("width");
						icon.setAttribute("height", "100%");
					}
				}
				byAnDr3W.DOMUtils.addClass(icon, byAnDr3W.disCN.noticeplatformicon);
				byAnDr3W.DOMUtils.removeClass(icon, byAnDr3W.disCN.noticeicon);
				notice.insertBefore(icon, noticeText);
			}
			if (byAnDr3W.ArrayUtils.is(config.buttons)) for (let data of config.buttons) {
				let contents = typeof data.contents == "string" && data.contents;
				if (contents) {
					let button = byAnDr3W.DOMUtils.create(`<button class="${byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.noticebutton, data.className)}">${contents}</button>`);
					button.addEventListener("click", event => {
						if (data.close) notice.close();
						if (typeof data.onClick == "function") data.onClick(event, notice);
					});
					if (typeof data.onMouseEnter == "function") button.addEventListener("mouseenter", event => data.onMouseEnter(event, notice));
					if (typeof data.onMouseLeave == "function") button.addEventListener("mouseleave", event => data.onMouseLeave(event, notice));
					notice.appendChild(button);
				}
			}
			if (config.id) notice.id = config.id.split(" ").join("");
			if (config.className) byAnDr3W.DOMUtils.addClass(notice, config.className);
			if (config.textClassName) byAnDr3W.DOMUtils.addClass(noticeText, config.textClassName);
			if (config.css) byAnDr3W.DOMUtils.appendLocalStyle("byAnDr3WcustomNotificationBar" + id, config.css);
			if (config.style) notice.style = config.style;
			if (config.html) noticeText.innerHTML = text;
			else {
				let link = document.createElement("a");
				let newText = [];
				for (let word of text.split(" ")) {
					let encodedWord = byAnDr3W.StringUtils.htmlEscape(word);
					link.href = word;
					newText.push(link.host && link.host !== window.location.host ? `<label class="${byAnDr3W.disCN.noticetextlink}">${encodedWord}</label>` : encodedWord);
				}
				noticeText.innerHTML = newText.join(" ");
			}
			let type = null;
			if (config.type && !document.querySelector(byAnDr3W.dotCNS.chatbase + byAnDr3W.dotCN.noticestreamer)) {
				if (type = byAnDr3W.disCN["notice" + config.type]) byAnDr3W.DOMUtils.addClass(notice, type);
				if (config.type == "premium") {
					let noticeButton = notice.querySelector(byAnDr3W.dotCN.noticebutton);
					if (noticeButton) byAnDr3W.DOMUtils.addClass(noticeButton, byAnDr3W.disCN.noticepremiumaction);
					byAnDr3W.DOMUtils.addClass(noticeText, byAnDr3W.disCN.noticepremiumtext);
					notice.insertBefore(byAnDr3W.DOMUtils.create(`<i class="${byAnDr3W.disCN.noticepremiumlogo}"></i>`), noticeText);
				}
			}
			if (!type) {
				let comp = byAnDr3W.ColorUtils.convert(config.color, "RGBCOMP");
				if (comp) {
					let fontColor = comp[0] > 180 && comp[1] > 180 && comp[2] > 180 ? "#000" : "#FFF";
					let backgroundColor = byAnDr3W.ColorUtils.convert(comp, "HEX");
					let filter = comp[0] > 180 && comp[1] > 180 && comp[2] > 180 ? "brightness(0%)" : "brightness(100%)";
					byAnDr3W.DOMUtils.appendLocalStyle("byAnDr3WcustomNotificationBarColorCorrection" + id, `${byAnDr3W.dotCN.noticewrapper}[notice-id="${id}"]{background-color: ${backgroundColor} !important;}${byAnDr3W.dotCN.noticewrapper}[notice-id="${id}"] ${byAnDr3W.dotCN.noticetext} {color: ${fontColor} !important;}${byAnDr3W.dotCN.noticewrapper}[notice-id="${id}"] ${byAnDr3W.dotCN.noticebutton} {color: ${fontColor} !important;border-color: ${byAnDr3W.ColorUtils.setAlpha(fontColor, 0.25, "RGBA")} !important;}${byAnDr3W.dotCN.noticewrapper}[notice-id="${id}"] ${byAnDr3W.dotCN.noticebutton}:hover {color: ${backgroundColor} !important;background-color: ${fontColor} !important;}${byAnDr3W.dotCN.noticewrapper}[notice-id="${id}"] ${byAnDr3W.dotCN.noticedismiss} {filter: ${filter} !important;}`);
					byAnDr3W.DOMUtils.addClass(notice, byAnDr3W.disCN.noticecustom);
				}
				else byAnDr3W.DOMUtils.addClass(notice, byAnDr3W.disCN.noticedefault);
			}
			if (config.forceStyle) {
				notice.style.setProperty("display", "flex", "important");
				notice.style.setProperty("height", "36px", "important");
				notice.style.setProperty("min-width", "70vw", "important");
				notice.style.setProperty("left", "unset", "important");
				notice.style.setProperty("right", "unset", "important");
				let sideMargin = ((byAnDr3W.DOMUtils.getWidth(document.body.firstElementChild) - byAnDr3W.DOMUtils.getWidth(notice))/2);
				notice.style.setProperty("left", `${sideMargin}px`, "important");
				notice.style.setProperty("right", `${sideMargin}px`, "important");
				notice.style.setProperty("min-width", "unset", "important");
				notice.style.setProperty("width", "unset", "important");
				notice.style.setProperty("max-width", `calc(100vw - ${sideMargin*2}px)`, "important");
			}
			notice.close = _ => {
				byAnDr3W.DOMUtils.addClass(notice, byAnDr3W.disCN.noticeclosing);
				if (config.forceStyle) {
					notice.style.setProperty("overflow", "hidden", "important");
					notice.style.setProperty("height", "0px", "important");
				}
				if (notice.tooltip && typeof notice.tooltip.removeTooltip == "function") notice.tooltip.removeTooltip();
				byAnDr3W.TimeUtils.timeout(_ => {
					if (typeof config.onClose == "function") config.onClose();
					byAnDr3W.ArrayUtils.remove(NotificationBars, id);
					byAnDr3W.DOMUtils.removeLocalStyle("byAnDr3WcustomNotificationBar" + id);
					byAnDr3W.DOMUtils.removeLocalStyle("byAnDr3WcustomNotificationBarColorCorrection" + id);
					byAnDr3W.DOMUtils.remove(notice);
				}, 500);
			};
			notice.querySelector(byAnDr3W.dotCN.noticedismiss).addEventListener("click", notice.close);
			return notice;
		};
		byAnDr3W.NotificationUtils.alert = function (header, body) {
			if (typeof header == "string" && typeof header == "string" && BdApi && typeof BdApi.alert == "function") BdApi.alert(header, body);
		};

		var Tooltips = [];
		byAnDr3W.TooltipUtils = {};
		byAnDr3W.TooltipUtils.create = function (anker, text, config = {}) {
			if (!text && !config.guild) return null;
			const itemLayerContainer = document.querySelector(byAnDr3W.dotCN.app + " ~ " + byAnDr3W.dotCN.itemlayercontainer) || document.querySelector(byAnDr3W.dotCN.itemlayercontainer);
			if (!itemLayerContainer || !Node.prototype.isPrototypeOf(anker) || !document.contains(anker)) return null;
			const id = byAnDr3W.NumberUtils.generateId(Tooltips);
			const itemLayer = byAnDr3W.DOMUtils.create(`<div class="${byAnDr3W.disCNS.itemlayer + byAnDr3W.disCN.itemlayerdisabledpointerevents}"><div class="${byAnDr3W.disCN.tooltip}" tooltip-id="${id}"><div class="${byAnDr3W.disCN.tooltipcontent}"></div><div class="${byAnDr3W.disCN.tooltippointer}"></div></div></div>`);
			itemLayerContainer.appendChild(itemLayer);
			
			const tooltip = itemLayer.firstElementChild;
			const tooltipContent = itemLayer.querySelector(byAnDr3W.dotCN.tooltipcontent);
			const tooltipPointer = itemLayer.querySelector(byAnDr3W.dotCN.tooltippointer);
			
			if (config.id) tooltip.id = config.id.split(" ").join("");
			
			if (typeof config.type != "string" || !byAnDr3W.disCN["tooltip" + config.type.toLowerCase()]) config.type = "top";
			let type = config.type.toLowerCase();
			byAnDr3W.DOMUtils.addClass(tooltip, byAnDr3W.disCN["tooltip" + type], config.className);
			
			let fontColorIsGradient = false, customBackgroundColor = false, style = "";
			if (config.style) style += config.style;
			if (config.fontColor) {
				fontColorIsGradient = byAnDr3W.ObjectUtils.is(config.fontColor);
				if (!fontColorIsGradient) style = (style ? (style + " ") : "") + `color: ${byAnDr3W.ColorUtils.convert(config.fontColor, "RGBA")} !important;`
			}
			if (config.backgroundColor) {
				customBackgroundColor = true;
				let backgroundColorIsGradient = byAnDr3W.ObjectUtils.is(config.backgroundColor);
				let backgroundColor = !backgroundColorIsGradient ? byAnDr3W.ColorUtils.convert(config.backgroundColor, "RGBA") : byAnDr3W.ColorUtils.createGradient(config.backgroundColor);
				style = (style ? (style + " ") : "") + `background: ${backgroundColor} !important; border-color: ${backgroundColorIsGradient ? byAnDr3W.ColorUtils.convert(config.backgroundColor[type == "left" ? 100 : 0], "RGBA") : backgroundColor} !important;`;
			}
			if (style) tooltip.style = style;
			const zIndexed = config.zIndex && typeof config.zIndex == "number";
			if (zIndexed) {
				itemLayer.style.setProperty("z-index", config.zIndex, "important");
				tooltip.style.setProperty("z-index", config.zIndex, "important");
				tooltipContent.style.setProperty("z-index", config.zIndex, "important");
				byAnDr3W.DOMUtils.addClass(itemLayerContainer, byAnDr3W.disCN.itemlayercontainerzindexdisabled);
			}
			if (typeof config.width == "number" && config.width > 196) {
				tooltip.style.setProperty("width", `${config.width}px`, "important");
				tooltip.style.setProperty("max-width", `${config.width}px`, "important");
			}
			if (typeof config.maxWidth == "number" && config.maxWidth > 196) {
				tooltip.style.setProperty("max-width", `${config.maxWidth}px`, "important");
			}
			if (customBackgroundColor) byAnDr3W.DOMUtils.addClass(tooltip, byAnDr3W.disCN.tooltipcustom);
			else if (config.color && byAnDr3W.disCN["tooltip" + config.color.toLowerCase()]) byAnDr3W.DOMUtils.addClass(tooltip, byAnDr3W.disCN["tooltip" + config.color.toLowerCase()]);
			else byAnDr3W.DOMUtils.addClass(tooltip, byAnDr3W.disCN.tooltipprimary);
			
			if (config.list || byAnDr3W.ObjectUtils.is(config.guild)) byAnDr3W.DOMUtils.addClass(tooltip, byAnDr3W.disCN.tooltiplistitem);
			
			const removeTooltip = _ => {
				document.removeEventListener("wheel", wheel);
				document.removeEventListener("mousemove", mouseMove);
				document.removeEventListener("mouseleave", mouseLeave);
				byAnDr3W.DOMUtils.remove(itemLayer);
				byAnDr3W.ArrayUtils.remove(Tooltips, id);
				observer.disconnect();
				if (zIndexed) byAnDr3W.DOMUtils.removeClass(itemLayerContainer, byAnDr3W.disCN.itemlayercontainerzindexdisabled);
				if (typeof config.onHide == "function") config.onHide(itemLayer, anker);
			};
			const setText = newText => {
				if (byAnDr3W.ObjectUtils.is(config.guild)) {
					let isMuted = Internal.LibraryModules.MutedUtils.isMuted(config.guild.id);
					let muteConfig = Internal.LibraryModules.MutedUtils.getMuteConfig(config.guild.id);
					
					let children = [typeof newText == "function" ? newText() : newText].flat(10).filter(n => typeof n == "string" || byAnDr3W.ReactUtils.isValidElement(n));
					
					byAnDr3W.ReactUtils.render(byAnDr3W.ReactUtils.createElement(Internal.LibraryModules.React.Fragment, {
						children: [
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tooltiprow, byAnDr3W.disCN.tooltiprowguildname),
								children: [
									byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildComponents.Badge, {
										guild: config.guild,
										size: Internal.LibraryModules.StringUtils.cssValueToNumber(Internal.DiscordClassModules.TooltipGuild.iconSize),
										className: byAnDr3W.disCN.tooltiprowicon
									}),
									byAnDr3W.ReactUtils.createElement("span", {
										className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tooltipguildnametext),
										children: fontColorIsGradient ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextGradientElement, {
											gradient: byAnDr3W.ColorUtils.createGradient(config.fontColor),
											children: config.guild.toString()
										}) : config.guild.toString()
									}),
								]
							}),
							children.length && byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tooltiprow, byAnDr3W.disCN.tooltiprowextra),
								children: children
							}),
							config.note && byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tooltiprow, byAnDr3W.disCN.tooltiprowextra, byAnDr3W.disCN.tooltipnote),
								children: config.note
							}),
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildVoiceList, {guild: config.guild}),
							isMuted && muteConfig && (muteConfig.end_time == null ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextElement, {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tooltipmutetext),
								size: Internal.LibraryComponents.TextElement.Sizes.SIZE_12,
								color: Internal.LibraryComponents.TextElement.Colors.MUTED,
								children: byAnDr3W.LanguageUtils.LanguageStrings.VOICE_CHANNEL_MUTED
							}) : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildComponents.MutedText, {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tooltipmutetext),
								muteConfig: muteConfig
							}))
						].filter(n => n)
					}), tooltipContent);
				}
				else {
					let children = [typeof newText == "function" ? newText() : newText].flat(10).filter(n => typeof n == "string" || byAnDr3W.ReactUtils.isValidElement(n));
					children.length && byAnDr3W.ReactUtils.render(byAnDr3W.ReactUtils.createElement(Internal.LibraryModules.React.Fragment, {
						children: [
							fontColorIsGradient ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextGradientElement, {
								gradient: byAnDr3W.ColorUtils.createGradient(config.fontColor),
								children: children
							}) : children,
							config.note && byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tooltiprow, byAnDr3W.disCN.tooltiprowextra, byAnDr3W.disCN.tooltipnote),
								children: config.note
							})
						]
					}), tooltipContent);
				}
			};
			const update = newText => {
				if (newText) setText(newText);
				let left, top;
				const tRects = byAnDr3W.DOMUtils.getRects(anker);
				const iRects = byAnDr3W.DOMUtils.getRects(itemLayer);
				const aRects = byAnDr3W.DOMUtils.getRects(document.querySelector(byAnDr3W.dotCN.appmount));
				const positionOffsets = {height: 10, width: 10};
				const offset = typeof config.offset == "number" ? config.offset : 0;
				switch (type) {
					case "top":
						top = tRects.top - iRects.height - positionOffsets.height + 2 - offset;
						left = tRects.left + (tRects.width - iRects.width) / 2;
						break;
					case "bottom":
						top = tRects.top + tRects.height + positionOffsets.height - 2 + offset;
						left = tRects.left + (tRects.width - iRects.width) / 2;
						break;
					case "left":
						top = tRects.top + (tRects.height - iRects.height) / 2;
						left = tRects.left - iRects.width - positionOffsets.width + 2 - offset;
						break;
					case "right":
						top = tRects.top + (tRects.height - iRects.height) / 2;
						left = tRects.left + tRects.width + positionOffsets.width - 2 + offset;
						break;
					}
					
				itemLayer.style.setProperty("top", `${top}px`, "important");
				itemLayer.style.setProperty("left", `${left}px`, "important");
				
				tooltipPointer.style.removeProperty("margin-left");
				tooltipPointer.style.removeProperty("margin-top");
				if (type == "top" || type == "bottom") {
					if (left < 0) {
						itemLayer.style.setProperty("left", "5px", "important");
						tooltipPointer.style.setProperty("margin-left", `${left - 10}px`, "important");
					}
					else {
						const rightMargin = aRects.width - (left + iRects.width);
						if (rightMargin < 0) {
							itemLayer.style.setProperty("left", `${aRects.width - iRects.width - 5}px`, "important");
							tooltipPointer.style.setProperty("margin-left", `${-1*rightMargin}px`, "important");
						}
					}
				}
				else if (type == "left" || type == "right") {
					if (top < 0) {
						const bRects = byAnDr3W.DOMUtils.getRects(document.querySelector(byAnDr3W.dotCN.titlebar));
						const barCorrection = (bRects.width || 0) >= Math.round(75 * window.outerWidth / aRects.width) ? (bRects.height + 5) : 0;
						itemLayer.style.setProperty("top", `${5 + barCorrection}px`, "important");
						tooltipPointer.style.setProperty("margin-top", `${top - 10 - barCorrection}px`, "important");
					}
					else {
						const bottomMargin = aRects.height - (top + iRects.height);
						if (bottomMargin < 0) {
							itemLayer.style.setProperty("top", `${aRects.height - iRects.height - 5}px`, "important");
							tooltipPointer.style.setProperty("margin-top", `${-1*bottomMargin}px`, "important");
						}
					}
				}
			};

			const wheel = e => {
				const tRects1 = byAnDr3W.DOMUtils.getRects(anker);
				byAnDr3W.TimeUtils.clear(wheel.timeout);
				wheel.timeout = byAnDr3W.TimeUtils.timeout(_ => {
					const tRects2 = byAnDr3W.DOMUtils.getRects(anker);
					if (tRects1.x != tRects2.x || tRects1.y != tRects2.y) removeTooltip();
				}, 500);
			};
			const mouseMove = e => {
				const parent = e.target.parentElement.querySelector(":hover");
				if (parent && anker != parent && !anker.contains(parent)) removeTooltip();
			};
			const mouseLeave = e => removeTooltip();
			if (!config.perssist) {
				document.addEventListener("wheel", wheel);
				document.addEventListener("mousemove", mouseMove);
				document.addEventListener("mouseleave", mouseLeave);
			}
			
			const observer = new MutationObserver(changes => changes.forEach(change => {
				const nodes = Array.from(change.removedNodes);
				if (nodes.indexOf(itemLayer) > -1 || nodes.indexOf(anker) > -1 || nodes.some(n =>  n.contains(anker))) removeTooltip();
			}));
			observer.observe(document.body, {subtree: true, childList: true});
			
			tooltip.removeTooltip = itemLayer.removeTooltip = removeTooltip;
			tooltip.setText = itemLayer.setText = setText;
			tooltip.update = itemLayer.update = update;
			setText(text);
			update();
			
			if (config.delay) {
				byAnDr3W.DOMUtils.toggle(itemLayer);
				byAnDr3W.TimeUtils.timeout(_ => {
					byAnDr3W.DOMUtils.toggle(itemLayer);
					if (typeof config.onShow == "function") config.onShow(itemLayer, anker);
				}, config.delay);
			}
			else {
				if (typeof config.onShow == "function") config.onShow(itemLayer, anker);
			}
			return itemLayer;
		};
		
		Internal.forceInitiateProcess = function (pluginDataObjs, instance, type) {
			pluginDataObjs = [pluginDataObjs].flat(10).filter(n => n);
			if (pluginDataObjs.length && instance && type) {
				let forceRender = false;
				for (let pluginData of pluginDataObjs) {
					let plugin = pluginData.plugin == byAnDr3W && Internal || pluginData.plugin, methodNames = [];
					for (let patchType in plugin.patchedModules) {
						if (plugin.patchedModules[patchType][type]) methodNames.push(plugin.patchedModules[patchType][type]);
					}
					methodNames = byAnDr3W.ArrayUtils.removeCopies(methodNames).flat(10).filter(n => n);
					if (methodNames.includes("componentDidMount")) Internal.initiateProcess(plugin, type, {
						arguments: [],
						instance: instance,
						returnvalue: undefined,
						component: undefined,
						methodname: "componentDidMount",
						patchtypes: pluginData.patchTypes[type]
					});
					if (methodNames.includes("render")) forceRender = true;
					else if (!forceRender && methodNames.includes("componentDidUpdate")) Internal.initiateProcess(plugin, type, {
						arguments: [],
						instance: instance,
						returnvalue: undefined,
						component: undefined,
						methodname: "componentDidUpdate",
						patchtypes: pluginData.patchTypes[type]
					});
				}
				if (forceRender) byAnDr3W.ReactUtils.forceUpdate(instance);
			}
		};
		Internal.initiateProcess = function (plugin, type, e) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (byAnDr3W.ObjectUtils.is(plugin) && !plugin.stopping && e.instance) {
				type = Internal.LibraryModules.StringUtils.upperCaseFirstChar(type.split(" _ _ ")[1] || type).replace(/[^A-z0-9]|_/g, "");
				if (typeof plugin[`process${type}`] == "function") {
					if (typeof e.methodname == "string" && (e.methodname.indexOf("componentDid") == 0 || e.methodname.indexOf("componentWill") == 0)) {
						e.node = byAnDr3W.ReactUtils.findDOMNode(e.instance);
						if (e.node) {
							let tempReturn = plugin[`process${type}`](e);
							return tempReturn !== undefined ? tempReturn : e.returnvalue;
						}
						else byAnDr3W.TimeUtils.timeout(_ => {
							e.node = byAnDr3W.ReactUtils.findDOMNode(e.instance);
							if (e.node) plugin[`process${type}`](e);
						});
					}
					else if (e.returnvalue !== undefined || e.patchtypes.includes("before")) {
						let tempReturn = plugin[`process${type}`](e);
						return tempReturn !== undefined ? tempReturn : e.returnvalue;
					}
				}
			}
		};
		Internal.patchObserverData = {observer: null, data: {}};
		Internal.patchPlugin = function (plugin) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ObjectUtils.is(plugin.patchedModules)) return;
			byAnDr3W.PatchUtils.unpatch(plugin);
			let patchedModules = {};
			for (let patchType in plugin.patchedModules) for (let type in plugin.patchedModules[patchType]) {
				if (!patchedModules[type]) patchedModules[type] = {};
				patchedModules[type][patchType] = plugin.patchedModules[patchType][type];
			}
			for (let type in patchedModules) {
				let pluginData = {plugin: plugin, patchTypes: patchedModules[type]};
				let unmappedType = type.split(" _ _ ")[1] || type;
				
				let finderData = InternalData.ModuleUtilsConfig.Finder[unmappedType];
				let config = {
					classNames: [finderData && finderData.class].flat(10).filter(n => DiscordClasses[n]),
					lazyLoaded: finderData && finderData.lazyLoaded,
					stringFind: finderData && finderData.strings,
					propertyFind: finderData && finderData.props,
					prototypeFind: finderData && finderData.protos,
					specialFilter: finderData && finderData.special && Internal.createFilter(finderData.special),
					subComponent: finderData && finderData.subComponent,
					forceObserve: finderData && finderData.forceObserve,
					exported: finderData && finderData.exported || false,
					path: finderData && finderData.path,
					mapped: InternalData.ModuleUtilsConfig.PatchMap[type]
				};
				config.nonRender = config.specialFilter || byAnDr3W.ObjectUtils.toArray(pluginData.patchTypes).flat(10).filter(n => n && !InternalData.ModuleUtilsConfig.InstanceFunctions.includes(n)).length > 0;
				config.nonPrototype = !!(config.subComponent && config.subComponent.strings || config.stringFind || config.subComponent && config.subComponent.props || config.propertyFind || config.subComponent && config.subComponent.protos || config.prototypeFind || config.nonRender);
				
				config.mappedType = config.mapped ? config.mapped + " _ _ " + type : type;
				config.name = config.subComponent && config.subComponent.name || config.mappedType.split(" _ _ ")[0];
				
				let component = InternalData.ModuleUtilsConfig.LoadedInComponents[type] && byAnDr3W.ObjectUtils.get(Internal, InternalData.ModuleUtilsConfig.LoadedInComponents[type]);
				if (component) Internal.patchComponent(pluginData, config.nonRender ? (byAnDr3W.ModuleUtils.find(m => m == component && m, {useExport: config.exported}) || {}).exports : component, config);
				else {
					if (config.mapped) for (let patchType in plugin.patchedModules) if (plugin.patchedModules[patchType][type]) {
						plugin.patchedModules[patchType][config.mappedType] = plugin.patchedModules[patchType][type];
						delete plugin.patchedModules[patchType][type];
					}
					
					let patchSpecial = (func, argument) => {
						let module = byAnDr3W.ModuleUtils[func](argument, config.exported);
						let exports = module && !config.exported && module.exports || module;
						exports = config.path && byAnDr3W.ObjectUtils.get(exports, config.path) || exports;
						exports && Internal.patchComponent(pluginData, Internal.isMemoOrForwardRef(exports) ? exports.default : exports, config);
						return exports ? true : false;
					};
					let found = true;
					if (config.lazyLoaded) Internal.addChunkObserver(pluginData, config);
					else if (config.classNames.length) Internal.searchComponent(pluginData, config);
					else if (config.subComponent && config.subComponent.strings || config.stringFind) found = patchSpecial("findByString", config.subComponent && config.subComponent.strings || config.stringFind);
					else if (config.subComponent && config.subComponent.props || config.propertyFind) found = patchSpecial("findByProperties", config.subComponent && config.subComponent.props || config.propertyFind);
					else if (config.subComponent && config.subComponent.protos || config.prototypeFind) found = patchSpecial("findByPrototypes", config.subComponent && config.subComponent.protos || config.prototypeFind);
					else if (config.nonRender) found = patchSpecial("findByName", config.name);
					else {
						let module = byAnDr3W.ModuleUtils.findByName(config.name);
						if (module) Internal.patchComponent(pluginData, module, config);
						else found = false;
					}
					if (!found) Internal.addChunkObserver(pluginData, config);
				}
			}
		};
		Internal.patchComponent = function (pluginDataObjs, instance, config) {
			pluginDataObjs = [pluginDataObjs].flat(10).filter(n => n);
			if (pluginDataObjs.length && instance) {
				instance = instance[byAnDr3W.ReactUtils.instanceKey] && instance[byAnDr3W.ReactUtils.instanceKey].type ? instance[byAnDr3W.ReactUtils.instanceKey].type : instance;
				if (instance) {
					let toBePatched = config.nonPrototype || !instance.prototype ? instance : instance.prototype;
					toBePatched = toBePatched && toBePatched.type && typeof toBePatched.type.render == "function" ? toBePatched.type : toBePatched;
					if (config.subComponent) {
						for (let pluginData of pluginDataObjs) byAnDr3W.PatchUtils.patch(pluginData.plugin, toBePatched, config.subComponent.type || "default", {after: e => {
							for (let patchType in pluginData.patchTypes) byAnDr3W.PatchUtils.patch(pluginData.plugin, config.subComponent.children && e.returnValue.props && e.returnValue.props.children ? e.returnValue.props.children[0] || e.returnValue.props.children : e.returnValue , "type", {
								[patchType]: e2 => Internal.initiateProcess(pluginData.plugin, config.mappedType, {
									arguments: e2.methodArguments,
									instance: e2.thisObject,
									returnvalue: e2.returnValue,
									component: toBePatched,
									methodname: e.originalMethodName,
									patchtypes: [patchType]
								})
							}, {name, noCache: true});
						}}, {name: config.name});
					}
					else {
						for (let pluginData of pluginDataObjs) for (let patchType in pluginData.patchTypes) {
							byAnDr3W.PatchUtils.patch(pluginData.plugin, toBePatched, pluginData.patchTypes[patchType], {
								[patchType]: e => Internal.initiateProcess(pluginData.plugin, config.mappedType, {
									arguments: e.methodArguments,
									instance: e.thisObject,
									returnvalue: e.returnValue,
									component: toBePatched,
									methodname: e.originalMethodName,
									patchtypes: [patchType]
								})
							}, {name: config.name});
						}
					}
				}
			}
		};
		Internal.createFilter = function (config) {
			return ins => ins && config.every(prop => {
				let value = byAnDr3W.ObjectUtils.get(ins, prop.path);
				return value && (!prop.value || [prop.value].flat(10).filter(n => typeof n == "string").some(n => value.toUpperCase().indexOf(n.toUpperCase()) == 0));
			}) && ins.return.type;
		};
		Internal.isMemoOrForwardRef = function (exports) {
			return exports && exports.default && typeof exports.default.$$typeof == "symbol" && ((exports.default.$$typeof.toString() || "").indexOf("memo") > -1 || (exports.default.$$typeof.toString() || "").indexOf("forward_ref") > -1);
		};
		Internal.checkElementForComponent = function (pluginDataObjs, ele, config) {
			pluginDataObjs = [pluginDataObjs].flat(10).filter(n => n);
			let ins = byAnDr3W.ReactUtils.getInstance(ele);
			if (typeof config.specialFilter == "function") {
				let component = config.specialFilter(ins);
				if (component) {
					if (config.nonRender) {
						let exports = (byAnDr3W.ModuleUtils.find(m => m == component && m, {useExport: false}) || {}).exports;
						Internal.patchComponent(pluginDataObjs, Internal.isMemoOrForwardRef(exports) ? exports.default : exports, config);
					}
					else Internal.patchComponent(pluginDataObjs, component, config);
					byAnDr3W.PatchUtils.forceAllUpdates(pluginDataObjs.map(n => n.plugin), config.mappedType);
					return true;
				}
			}
			else {
				let unmappedType = config.mappedType.split(" _ _ ")[1] || config.mappedType;
				let constructor = byAnDr3W.ReactUtils.findConstructor(ins, unmappedType) || byAnDr3W.ReactUtils.findConstructor(ins, unmappedType, {up: true});
				if (constructor) {
					Internal.patchComponent(pluginDataObjs, constructor, config);
					byAnDr3W.PatchUtils.forceAllUpdates(pluginDataObjs.map(n => n.plugin), config.mappedType);
					return true;
				}
			}
			return false;
		};
		Internal.searchComponent = function (pluginData, config) {
			let instanceFound = false;
			if (!config.forceObserve) {
				const app = document.querySelector(byAnDr3W.dotCN.app);
				if (app) {
					let appIns = byAnDr3W.ReactUtils.findConstructor(app, config.mappedType, {unlimited: true}) || byAnDr3W.ReactUtils.findConstructor(app, config.mappedType, {unlimited: true, up: true});
					if (appIns && (instanceFound = true)) Internal.patchComponent(pluginData, appIns, config);
				}
			}
			if (!instanceFound) {
				let elementFound = false, classes = config.classNames.map(n => byAnDr3W.disCN[n]), selector = config.classNames.map(n => byAnDr3W.dotCN[n]).join(", ");
				for (let ele of document.querySelectorAll(selector)) {
					elementFound = Internal.checkElementForComponent(pluginData, ele, config);
					if (elementFound) break;
				}
				if (!elementFound) {
					if (!Internal.patchObserverData.observer) {
						let appMount = document.querySelector(byAnDr3W.dotCN.appmount);
						if (appMount) {
							Internal.patchObserverData.observer = new MutationObserver(cs => cs.forEach(c => c.addedNodes.forEach(n => {
								if (!n || !n.tagName) return;
								for (let type in Internal.patchObserverData.data) {
									if (!Internal.patchObserverData.data[type] || Internal.patchObserverData.data[type].found) return;
									for (let ele of [byAnDr3W.DOMUtils.containsClass(n, ...Internal.patchObserverData.data[type].classes) && n].concat([...n.querySelectorAll(Internal.patchObserverData.data[type].selector)]).filter(n => n)) {
										if (!Internal.patchObserverData.data[type] || Internal.patchObserverData.data[type].found) return;
										Internal.patchObserverData.data[type].found = Internal.checkElementForComponent(Internal.patchObserverData.data[type].plugins, ele, Internal.patchObserverData.data[type].config);
										if (Internal.patchObserverData.data[type].found) {
											delete Internal.patchObserverData.data[type];
											if (byAnDr3W.ObjectUtils.isEmpty(Internal.patchObserverData.data)) {
												Internal.patchObserverData.observer.disconnect();
												Internal.patchObserverData.observer = null;
											}
										}
									}
								}
							})));
							Internal.patchObserverData.observer.observe(appMount, {childList: true, subtree: true});
						}
					}
					if (!Internal.patchObserverData.data[config.mappedType]) Internal.patchObserverData.data[config.mappedType] = {selector, classes, found: false, config, plugins: []};
					Internal.patchObserverData.data[config.mappedType].plugins.push(pluginData);
				}
			}
		};
		
		byAnDr3W.PatchUtils = {};
		byAnDr3W.PatchUtils.isPatched = function (plugin, module, methodName) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!plugin || (!byAnDr3W.ObjectUtils.is(module) && !byAnDr3W.ArrayUtils.is(module)) || !module.byAnDr3W_patches || !methodName) return false;
			const pluginId = (typeof plugin === "string" ? plugin : plugin.name).toLowerCase();
			return pluginId && module[methodName] && module[methodName].__is_byAnDr3W_patched && module.byAnDr3W_patches[methodName] && byAnDr3W.ObjectUtils.toArray(module.byAnDr3W_patches[methodName]).some(patchObj => byAnDr3W.ObjectUtils.toArray(patchObj).some(priorityObj => Object.keys(priorityObj).includes(pluginId)));
		};
		byAnDr3W.PatchUtils.patch = function (plugin, module, methodNames, patchMethods, config = {}) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!plugin || (!byAnDr3W.ObjectUtils.is(module) && !byAnDr3W.ArrayUtils.is(module)) || !methodNames || !byAnDr3W.ObjectUtils.is(patchMethods)) return null;
			patchMethods = byAnDr3W.ObjectUtils.filter(patchMethods, type => InternalData.ModuleUtilsConfig.PatchTypes.includes(type), true);
			if (byAnDr3W.ObjectUtils.isEmpty(patchMethods)) return null;
			const pluginName = (typeof plugin === "string" ? plugin : plugin.name) || "";
			const pluginVersion = typeof plugin === "string" ? "" : plugin.version;
			const pluginId = pluginName.toLowerCase();
			let patchPriority = !isNaN(config.priority) ? config.priority : (byAnDr3W.ObjectUtils.is(plugin) && !isNaN(plugin.patchPriority) ? plugin.patchPriority : 5);
			patchPriority = patchPriority < 1 ? (plugin == Internal ? 0 : 1) : (patchPriority > 9 ? (plugin == Internal ? 10 : 9) : Math.round(patchPriority));
			if (!byAnDr3W.ObjectUtils.is(module.byAnDr3W_patches)) module.byAnDr3W_patches = {};
			methodNames = [methodNames].flat(10).filter(n => n);
			let cancel = _ => {byAnDr3W.PatchUtils.unpatch(plugin, module, methodNames);};
			for (let methodName of methodNames) if (module[methodName] == null || typeof module[methodName] == "function") {
				if (!module.byAnDr3W_patches[methodName] || config.force && (!module[methodName] || !module[methodName].__is_byAnDr3W_patched)) {
					if (!module.byAnDr3W_patches[methodName]) {
						module.byAnDr3W_patches[methodName] = {};
						for (let type of InternalData.ModuleUtilsConfig.PatchTypes) module.byAnDr3W_patches[methodName][type] = {};
					}
					if (!module[methodName]) module[methodName] = (_ => {});
					const name = config.name || (module.constructor ? (module.constructor.displayName || module.constructor.name) : "module");
					const originalMethod = module[methodName];
					module.byAnDr3W_patches[methodName].originalMethod = originalMethod;
					module[methodName] = function () {
						let callInstead = false, stopCall = false;
						const data = {
							thisObject: this && this !== window ? this : {props: arguments[0]},
							methodArguments: arguments,
							originalMethod: originalMethod,
							originalMethodName: methodName,
							callOriginalMethod: _ => data.returnValue = data.originalMethod.apply(data.thisObject, data.methodArguments),
							callOriginalMethodAfterwards: _ => (callInstead = true, data.returnValue),
							stopOriginalMethodCall: _ => stopCall = true
						};
						if (module.byAnDr3W_patches && module.byAnDr3W_patches[methodName]) {
							for (let priority in module.byAnDr3W_patches[methodName].before) for (let id in byAnDr3W.ObjectUtils.sort(module.byAnDr3W_patches[methodName].before[priority])) {
								byAnDr3W.TimeUtils.suppress(module.byAnDr3W_patches[methodName].before[priority][id], `"before" callback of ${methodName} in ${name}`, {name: module.byAnDr3W_patches[methodName].before[priority][id].pluginName, version: module.byAnDr3W_patches[methodName].before[priority][id].pluginVersion})(data);
							}
							
							if (!module.byAnDr3W_patches || !module.byAnDr3W_patches[methodName]) return (methodName == "render" || methodName == "default") && data.returnValue === undefined ? null : data.returnValue;
							let hasInsteadPatches = byAnDr3W.ObjectUtils.toArray(module.byAnDr3W_patches[methodName].instead).some(priorityObj => !byAnDr3W.ObjectUtils.isEmpty(priorityObj));
							if (hasInsteadPatches) for (let priority in module.byAnDr3W_patches[methodName].instead) for (let id in byAnDr3W.ObjectUtils.sort(module.byAnDr3W_patches[methodName].instead[priority])) if (module.byAnDr3W_patches) {
								let tempReturn = byAnDr3W.TimeUtils.suppress(module.byAnDr3W_patches[methodName].instead[priority][id], `"instead" callback of ${methodName} in ${name}`, {name: module.byAnDr3W_patches[methodName].instead[priority][id].pluginName, version: module.byAnDr3W_patches[methodName].instead[priority][id].pluginVersion})(data);
								if (tempReturn !== undefined) data.returnValue = tempReturn;
							}
							if ((!hasInsteadPatches || callInstead) && !stopCall) byAnDr3W.TimeUtils.suppress(data.callOriginalMethod, `originalMethod of ${methodName} in ${name}`, {name: "Discord"})();
							
							if (!module.byAnDr3W_patches || !module.byAnDr3W_patches[methodName]) return methodName == "render" && data.returnValue === undefined ? null : data.returnValue;
							for (let priority in module.byAnDr3W_patches[methodName].after) for (let id in byAnDr3W.ObjectUtils.sort(module.byAnDr3W_patches[methodName].after[priority])) if (module.byAnDr3W_patches) {
								let tempReturn = byAnDr3W.TimeUtils.suppress(module.byAnDr3W_patches[methodName].after[priority][id], `"after" callback of ${methodName} in ${name}`, {name: module.byAnDr3W_patches[methodName].after[priority][id].pluginName, version: module.byAnDr3W_patches[methodName].after[priority][id].pluginVersion})(data);
								if (tempReturn !== undefined) data.returnValue = tempReturn;
							}
						}
						else byAnDr3W.TimeUtils.suppress(data.callOriginalMethod, `originalMethod of ${methodName} in ${name}`)();
						callInstead = false, stopCall = false;
						return (methodName == "render" || methodName == "default") && data.returnValue === undefined ? null : data.returnValue;
					};
					for (let key of Object.keys(originalMethod)) module[methodName][key] = originalMethod[key];
					if (!module[methodName].__originalFunction) {
						let realOriginalMethod = originalMethod.__originalMethod || originalMethod.__originalFunction || originalMethod;
						if (typeof realOriginalMethod == "function") {
							module[methodName].__originalFunction = realOriginalMethod;
							module[methodName].toString = _ => realOriginalMethod.toString();
						}
					}
					module[methodName].__is_byAnDr3W_patched = true;
				}
				for (let type in patchMethods) if (typeof patchMethods[type] == "function") {
					if (!byAnDr3W.ObjectUtils.is(module.byAnDr3W_patches[methodName][type][patchPriority])) module.byAnDr3W_patches[methodName][type][patchPriority] = {};
					module.byAnDr3W_patches[methodName][type][patchPriority][pluginId] = (...args) => {
						if (config.once || !plugin.started) cancel();
						return patchMethods[type](...args);
					};
					module.byAnDr3W_patches[methodName][type][patchPriority][pluginId].pluginName = pluginName;
					module.byAnDr3W_patches[methodName][type][patchPriority][pluginId].pluginVersion = pluginVersion;
				}
			}
			if (byAnDr3W.ObjectUtils.is(plugin) && !config.once && !config.noCache) {
				if (!byAnDr3W.ArrayUtils.is(plugin.patchCancels)) plugin.patchCancels = [];
				plugin.patchCancels.push(cancel);
			}
			return cancel;
		};
		byAnDr3W.PatchUtils.unpatch = function (plugin, module, methodNames) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!module && !methodNames) {
				if (byAnDr3W.ObjectUtils.is(plugin) && byAnDr3W.ArrayUtils.is(plugin.patchCancels)) while (plugin.patchCancels.length) (plugin.patchCancels.pop())();
			}
			else {
				if ((!byAnDr3W.ObjectUtils.is(module) && !byAnDr3W.ArrayUtils.is(module)) || !module.byAnDr3W_patches) return;
				const pluginId = !plugin ? null : (typeof plugin === "string" ? plugin : plugin.name).toLowerCase();
				if (methodNames) {
					for (let methodName of [methodNames].flat(10).filter(n => n)) if (module[methodName] && module.byAnDr3W_patches[methodName]) unpatch(methodName, pluginId);
				}
				else for (let patchedMethod of module.byAnDr3W_patches) unpatch(patchedMethod, pluginId);
			}
			function unpatch (funcName, pluginId) {
				for (let type of InternalData.ModuleUtilsConfig.PatchTypes) {
					if (pluginId) for (let priority in module.byAnDr3W_patches[funcName][type]) {
						delete module.byAnDr3W_patches[funcName][type][priority][pluginId];
						if (byAnDr3W.ObjectUtils.isEmpty(module.byAnDr3W_patches[funcName][type][priority])) delete module.byAnDr3W_patches[funcName][type][priority];
					}
					else delete module.byAnDr3W_patches[funcName][type];
				}
				if (byAnDr3W.ObjectUtils.isEmpty(byAnDr3W.ObjectUtils.filter(module.byAnDr3W_patches[funcName], key => InternalData.ModuleUtilsConfig.PatchTypes.includes(key) && !byAnDr3W.ObjectUtils.isEmpty(module.byAnDr3W_patches[funcName][key]), true))) {
					module[funcName] = module.byAnDr3W_patches[funcName].originalMethod;
					delete module.byAnDr3W_patches[funcName];
					if (byAnDr3W.ObjectUtils.isEmpty(module.byAnDr3W_patches)) delete module.byAnDr3W_patches;
				}
			}
		};
		byAnDr3W.PatchUtils.forceAllUpdates = function (plugins, selectedTypes) {
			plugins = [plugins].flat(10).map(n => n == byAnDr3W && Internal || n).filter(n => byAnDr3W.ObjectUtils.is(n.patchedModules));
			if (plugins.length) {
				const app = document.querySelector(byAnDr3W.dotCN.app);
				const bdSettings = document.querySelector("#bd-settingspane-container > *");
				if (app) {
					selectedTypes = [selectedTypes].flat(10).filter(n => n).map(type => type && InternalData.ModuleUtilsConfig.PatchMap[type] ? InternalData.ModuleUtilsConfig.PatchMap[type] + " _ _ " + type : type);
					let updateData = {};
					for (let plugin of plugins) {
						updateData[plugin.name] = {
							filteredModules: [],
							specialModules: [],
							specialModuleTypes: [],
							patchTypes: {}
						};
						for (let patchType in plugin.patchedModules) for (let type in plugin.patchedModules[patchType]) {
							let methodNames = [plugin.patchedModules[patchType][type]].flat(10).filter(n => n);
							if (byAnDr3W.ArrayUtils.includes(methodNames, "componentDidMount", "componentDidUpdate", "render", false) && (!selectedTypes.length || selectedTypes.includes(type))) {
								let unmappedType = type.split(" _ _ ")[1] || type;
								let selector = [InternalData.ModuleUtilsConfig.Finder[unmappedType]].flat(10).filter(n => DiscordClasses[n]).map(n => byAnDr3W.dotCN[n]).join(", ");
								let specialFilter = InternalData.ModuleUtilsConfig.Finder[unmappedType] && InternalData.ModuleUtilsConfig.Finder[unmappedType].special && Internal.createFilter(InternalData.ModuleUtilsConfig.Finder[unmappedType].special);
								if (selector && typeof specialFilter == "function") {
									for (let ele of document.querySelectorAll(selector)) {
										let constro = specialFilter(byAnDr3W.ReactUtils.getInstance(ele));
										if (constro) {
											updateData[plugin.name].specialModules.push([type, constro]);
											updateData[plugin.name].specialModuleTypes.push(type);
											break;
										}
									}
								}
								else updateData[plugin.name].filteredModules.push(type);
								let name = type.split(" _ _ ")[0];
								if (!updateData[plugin.name].patchTypes[name]) updateData[plugin.name].patchTypes[name] = [];
								updateData[plugin.name].patchTypes[name].push(patchType);
							}
						}
					}
					let updateDataArray = byAnDr3W.ObjectUtils.toArray(updateData);
					if (byAnDr3W.ArrayUtils.sum(updateDataArray.map(n => n.filteredModules.length + n.specialModules.length))) {
						try {
							let filteredModules = byAnDr3W.ArrayUtils.removeCopies(updateDataArray.map(n => n.filteredModules).flat(10));
							let specialModules = byAnDr3W.ArrayUtils.removeCopies(updateDataArray.map(n => n.specialModules).flat(10));
							const appInsDown = byAnDr3W.ReactUtils.findOwner(app, {name: filteredModules, type: specialModules, all: true, unlimited: true, group: true});
							const appInsUp = byAnDr3W.ReactUtils.findOwner(app, {name: filteredModules, type: specialModules, all: true, unlimited: true, group: true, up: true});
							for (let type in appInsDown) {
								let filteredPlugins = plugins.filter(n => updateData[n.name].filteredModules.includes(type) || updateData[n.name].specialModuleTypes.includes(type)).map(n => ({plugin: n, patchTypes: updateData[n.name].patchTypes}));
								for (let ins of appInsDown[type]) Internal.forceInitiateProcess(filteredPlugins, ins, type);
							}
							for (let type in appInsUp) {
								let filteredPlugins = plugins.filter(n => updateData[n.name].filteredModules.includes(type) || updateData[n.name].specialModuleTypes.includes(type)).map(n => ({plugin: n, patchTypes: updateData[n.name].patchTypes}));
								for (let ins of appInsUp[type]) Internal.forceInitiateProcess(filteredPlugins, ins, type);
							}
							if (bdSettings) {
								const bdSettingsIns = byAnDr3W.ReactUtils.findOwner(bdSettings, {name: filteredModules, type: specialModules, all: true, unlimited: true});
								if (bdSettingsIns.length) {
									const bdSettingsWrap = byAnDr3W.ReactUtils.findOwner(byAnDr3W.ReactUtils.getInstance(document.querySelector("#bd-settingspane-container > *")), {props: "onChange", up: true});
									if (bdSettingsWrap && bdSettingsWrap.props && typeof bdSettingsWrap.props.onChange == "function") bdSettingsWrap.props.onChange(bdSettingsWrap.props.type);
								}
							}
						}
						catch (err) {for (let plugin of plugins) byAnDr3W.LogUtils.error(["Could not force update Components!", err], plugin);}
					}
				}
			}
		};

		byAnDr3W.DiscordConstants = byAnDr3W.ModuleUtils.findByProperties("Permissions", "ActivityTypes");
		
		const DiscordObjects = {};
		Internal.DiscordObjects = new Proxy(DiscordObjects, {
			get: function (_, item) {
				if (DiscordObjects[item]) return DiscordObjects[item];
				if (!InternalData.DiscordObjects[item]) return (function () {});
				if (InternalData.DiscordObjects[item].props) DiscordObjects[item] = byAnDr3W.ModuleUtils.findByPrototypes(InternalData.DiscordObjects[item].props);
				else if (InternalData.DiscordObjects[item].strings) DiscordObjects[item] = byAnDr3W.ModuleUtils.findByString(InternalData.DiscordObjects[item].strings);
				if (InternalData.DiscordObjects[item].value) DiscordObjects[item] = (DiscordObjects[item] || {})[InternalData.DiscordObjects[item].value];
				return DiscordObjects[item] ? DiscordObjects[item] : (function () {});
			}
		});
		byAnDr3W.DiscordObjects = Internal.DiscordObjects;
		
		const LibraryRequires = {};
		Internal.LibraryRequires = new Proxy(LibraryRequires, {
			get: function (_, item) {
				if (LibraryRequires[item]) return LibraryRequires[item];
				if (InternalData.LibraryRequires.indexOf(item) == -1) return (function () {});
				try {LibraryRequires[item] = require(item);}
				catch (err) {}
				return LibraryRequires[item] ? LibraryRequires[item] : (function () {});
			}
		});
		byAnDr3W.LibraryRequires = Internal.LibraryRequires;
		
		const LibraryModules = {};
		LibraryModules.LanguageStore = byAnDr3W.ModuleUtils.find(m => m.Messages && m.Messages.IMAGE && m);
		LibraryModules.React = byAnDr3W.ModuleUtils.findByProperties("createElement", "cloneElement");
		LibraryModules.ReactDOM = byAnDr3W.ModuleUtils.findByProperties("render", "findDOMNode");
		Internal.LibraryModules = new Proxy(LibraryModules, {
			get: function (_, item) {
				if (LibraryModules[item]) return LibraryModules[item];
				if (!InternalData.LibraryModules[item]) return null;
				if (InternalData.LibraryModules[item].props) {
					if (InternalData.LibraryModules[item].nonProps) {
						LibraryModules[item] = byAnDr3W.ModuleUtils.find(m => InternalData.LibraryModules[item].props.every(prop => {
							const value = m[prop];
							return value !== undefined && !(typeof value == "string" && !value);
						}) && InternalData.LibraryModules[item].nonProps.every(prop => m[prop] === undefined) && m);
						if (!LibraryModules[item]) byAnDr3W.LogUtils.warn(`${JSON.stringify([InternalData.LibraryModules[item].props, InternalData.LibraryModules[item].nonProps].flat(10))} [props + nonProps] not found in WebModules`);
					}
					else LibraryModules[item] = byAnDr3W.ModuleUtils.findByProperties(InternalData.LibraryModules[item].props);
				}
				else if (InternalData.LibraryModules[item].strings) LibraryModules[item] = byAnDr3W.ModuleUtils.findByString(InternalData.LibraryModules[item].strings);
				if (InternalData.LibraryModules[item].value) LibraryModules[item] = (LibraryModules[item] || {})[InternalData.LibraryModules[item].value];
				return LibraryModules[item] ? LibraryModules[item] : null;
			}
		});
		
		byAnDr3W.LibraryModules = Internal.LibraryModules;
		
		if (Internal.LibraryModules.KeyCodeUtils) Internal.LibraryModules.KeyCodeUtils.getString = function (keyArray) {
			return Internal.LibraryModules.KeyCodeUtils.toString([keyArray].flat(10).filter(n => n).map(keyCode => [byAnDr3W.DiscordConstants.KeyboardDeviceTypes.KEYBOARD_KEY, Internal.LibraryModules.KeyCodeUtils.keyToCode((Object.entries(Internal.LibraryModules.KeyEvents.codes).find(n => n[1] == keyCode && Internal.LibraryModules.KeyCodeUtils.keyToCode(n[0], null)) || [])[0], null) || keyCode]), true);
		};
		
		byAnDr3W.ReactUtils = Object.assign({}, Internal.LibraryModules.React, Internal.LibraryModules.ReactDOM);
		byAnDr3W.ReactUtils.childrenToArray = function (parent) {
			if (parent && parent.props && parent.props.children && !byAnDr3W.ArrayUtils.is(parent.props.children)) {
				const child = parent.props.children;
				parent.props.children = [];
				parent.props.children.push(child);
			}
			return parent.props.children;
		}
		byAnDr3W.ReactUtils.createElement = function (component, props = {}, errorWrap = false) {
			if (component && component.defaultProps) for (let key in component.defaultProps) if (props[key] == null) props[key] = component.defaultProps[key];
			try {
				let child = Internal.LibraryModules.React.createElement(component || "div", props) || null;
				if (errorWrap) return Internal.LibraryModules.React.createElement(Internal.ErrorBoundary, {key: child && child.key || ""}, child) || null;
				else return child;
			}
			catch (err) {byAnDr3W.LogUtils.error(["Could not create React Element!", err]);}
			return null;
		};
		byAnDr3W.ReactUtils.objectToReact = function (obj) {
			if (!obj) return null;
			else if (typeof obj == "string") return obj;
			else if (byAnDr3W.ObjectUtils.is(obj)) return byAnDr3W.ReactUtils.createElement(obj.type || obj.props && obj.props.href && "a" || "div", !obj.props ?  {} : Object.assign({}, obj.props, {
				children: obj.props.children ? byAnDr3W.ReactUtils.objectToReact(obj.props.children) : null
			}));
			else if (byAnDr3W.ArrayUtils.is(obj)) return obj.map(n => byAnDr3W.ReactUtils.objectToReact(n));
			else return null;
		};
		byAnDr3W.ReactUtils.markdownParse = function (str) {
			if (!byAnDr3W.ReactUtils.markdownParse.parser || !byAnDr3W.ReactUtils.markdownParse.render) {
				byAnDr3W.ReactUtils.markdownParse.parser = Internal.LibraryModules.SimpleMarkdownParser.parserFor(Internal.LibraryModules.SimpleMarkdownParser.defaultRules);
				byAnDr3W.ReactUtils.markdownParse.render = Internal.LibraryModules.SimpleMarkdownParser.reactFor(Internal.LibraryModules.SimpleMarkdownParser.ruleOutput(Internal.LibraryModules.SimpleMarkdownParser.defaultRules, "react"));
			}
			return byAnDr3W.ReactUtils.markdownParse.render(byAnDr3W.ReactUtils.markdownParse.parser(str, {inline: true}));
		};
		byAnDr3W.ReactUtils.elementToReact = function (node, ref) {
			if (byAnDr3W.ReactUtils.isValidElement(node)) return node;
			else if (!Node.prototype.isPrototypeOf(node)) return null;
			else if (node.nodeType == Node.TEXT_NODE) return node.nodeValue;
			let attributes = {}, importantStyles = [];
			if (typeof ref == "function") attributes.ref = ref;
			if (node.attributes) {
				for (let attr of node.attributes) attributes[attr.name] = attr.value;
				if (node.attributes.style) attributes.style = byAnDr3W.ObjectUtils.filter(node.style, n => node.style[n] && isNaN(parseInt(n)), true);
			}
			attributes.children = [];
			if (node.style && node.style.cssText) for (let propStr of node.style.cssText.split(";")) if (propStr.endsWith("!important")) {
				let key = propStr.split(":")[0];
				let camelprop = key.replace(/-([a-z]?)/g, (m, g) => g.toUpperCase());
				if (attributes.style[camelprop] != null) importantStyles.push(key);
			}
			for (let child of node.childNodes) attributes.children.push(byAnDr3W.ReactUtils.elementToReact(child));
			attributes.className = byAnDr3W.DOMUtils.formatClassName(attributes.className, attributes.class);
			delete attributes.class;
			return byAnDr3W.ReactUtils.forceStyle(byAnDr3W.ReactUtils.createElement(node.tagName, attributes), importantStyles);
		};
		byAnDr3W.ReactUtils.forceStyle = function (reactEle, styles) {
			if (!byAnDr3W.ReactUtils.isValidElement(reactEle)) return null;
			if (!byAnDr3W.ObjectUtils.is(reactEle.props.style) || !byAnDr3W.ArrayUtils.is(styles) || !styles.length) return reactEle;
			let ref = reactEle.ref;
			reactEle.ref = instance => {
				if (typeof ref == "function") ref(instance);
				let node = byAnDr3W.ReactUtils.findDOMNode(instance);
				if (Node.prototype.isPrototypeOf(node)) for (let key of styles) {
					let propValue = reactEle.props.style[key.replace(/-([a-z]?)/g, (m, g) => g.toUpperCase())];
					if (propValue != null) node.style.setProperty(key, propValue, "important");
				}
			};
			return reactEle;
		};
		byAnDr3W.ReactUtils.findChild = function (nodeOrInstance, config) {
			if (!nodeOrInstance || !byAnDr3W.ObjectUtils.is(config) || !config.name && !config.key && !config.props && !config.filter) return config.all ? [] : null;
			let instance = Node.prototype.isPrototypeOf(nodeOrInstance) ? byAnDr3W.ReactUtils.getInstance(nodeOrInstance) : nodeOrInstance;
			if (!byAnDr3W.ObjectUtils.is(instance) && !byAnDr3W.ArrayUtils.is(instance)) return null;
			config.name = config.name && [config.name].flat().filter(n => n);
			config.key = config.key && [config.key].flat().filter(n => n);
			config.props = config.props && [config.props].flat().filter(n => n);
			config.filter = typeof config.filter == "function" && config.filter;
			let depth = -1;
			let start = performance.now();
			let maxDepth = config.unlimited ? 999999999 : (config.depth === undefined ? 30 : config.depth);
			let maxTime = config.unlimited ? 999999999 : (config.time === undefined ? 150 : config.time);
			
			let foundChildren = [];
			let singleChild = getChild(instance);
			if (config.all) {
				for (let i in foundChildren) delete foundChildren[i].byAnDr3WreactSearch;
				return foundChildren;
			}
			else return singleChild;
			
			function getChild (children) {
				let result = null;
				if (!children || depth >= maxDepth || performance.now() - start >= maxTime) return result;
				if (!byAnDr3W.ArrayUtils.is(children)) {
					if (check(children)) {
						if (config.all === undefined || !config.all) result = children;
						else if (config.all) {
							if (!children.byAnDr3WreactSearch) {
								children.byAnDr3WreactSearch = true;
								foundChildren.push(children);
							}
						}
					}
					else {
						if (children.props && children.props.children) {
							depth++;
							result = getChild(children.props.children);
							depth--;
						}
						if (!result && children.props && children.props.child) {
							depth++;
							result = getChild(children.props.child);
							depth--;
						}
					}
				}
				else {
					for (let child of children) if (child) {
						if (byAnDr3W.ArrayUtils.is(child)) result = getChild(child);
						else if (check(child)) {
							if (config.all === undefined || !config.all) result = child;
							else if (config.all) {
								if (!child.byAnDr3WreactSearch) {
									child.byAnDr3WreactSearch = true;
									foundChildren.push(child);
								}
							}
						}
						else {
							if (child.props && child.props.children) {
								depth++;
								result = getChild(child.props.children);
								depth--;
							}
							if (!result && child.props && child.props.child) {
								depth++;
								result = getChild(child.props.child);
								depth--;
							}
						}
						if (result) break;
					}
				}
				return result;
			}
			function check (instance) {
				if (!instance) return false;
				let props = instance.stateNode ? instance.stateNode.props : instance.props;
				return instance.type && config.name && config.name.some(name => byAnDr3W.ReactUtils.isCorrectInstance(instance, name)) || config.key && config.key.some(key => instance.key == key) || props && config.props && config.props[config.someProps ? "some" : "every"](prop => byAnDr3W.ArrayUtils.is(prop) ? (byAnDr3W.ArrayUtils.is(prop[1]) ? prop[1].some(checkValue => propCheck(props, prop[0], checkValue)) : propCheck(props, prop[0], prop[1])) : props[prop] !== undefined) || config.filter && config.filter(instance);
			}
			function propCheck (props, key, value) {
				return key != null && props[key] != null && value != null && (key == "className" ? (" " + props[key] + " ").indexOf(" " + value + " ") > -1 : byAnDr3W.equals(props[key], value));
			}
		};
		byAnDr3W.ReactUtils.setChild = function (parent, stringOrChild) {
			if (!byAnDr3W.ReactUtils.isValidElement(parent) || (!byAnDr3W.ReactUtils.isValidElement(stringOrChild) && typeof stringOrChild != "string" && !byAnDr3W.ArrayUtils.is(stringOrChild))) return;
			let set = false;
			checkParent(parent);
			function checkParent(child) {
				if (set) return;
				if (!byAnDr3W.ArrayUtils.is(child)) checkChild(child);
				else for (let subChild of child) checkChild(subChild);
			}
			function checkChild(child) {
				if (!byAnDr3W.ReactUtils.isValidElement(child)) return;
				if (byAnDr3W.ReactUtils.isValidElement(child.props.children)) checkParent(child.props.children);
				else if (byAnDr3W.ArrayUtils.is(child.props.children)) {
					if (child.props.children.every(c => !c || typeof c == "string")) {
						set = true;
						child.props.children = [stringOrChild].flat(10);
					}
					else checkParent(child.props.children);
				}
				else {
					set = true;
					child.props.children = stringOrChild;
				}
			}
		};
		byAnDr3W.ReactUtils.findConstructor = function (nodeOrInstance, types, config = {}) {
			if (!byAnDr3W.ObjectUtils.is(config)) return null;
			if (!nodeOrInstance || !types) return config.all ? (config.group ? {} : []) : null;
			let instance = Node.prototype.isPrototypeOf(nodeOrInstance) ? byAnDr3W.ReactUtils.getInstance(nodeOrInstance) : nodeOrInstance;
			if (!byAnDr3W.ObjectUtils.is(instance)) return config.all ? (config.group ? {} : []) : null;
			types = types && [types].flat(10).filter(n => typeof n == "string");
			if (!types.length) return config.all ? (config.group ? {} : []) : null;;
			let depth = -1;
			let start = performance.now();
			let maxDepth = config.unlimited ? 999999999 : (config.depth === undefined ? 30 : config.depth);
			let maxTime = config.unlimited ? 999999999 : (config.time === undefined ? 150 : config.time);
			let whitelist = config.up ? {
				return: true,
				sibling: true,
				default: true
			} : {
				child: true,
				sibling: true,
				default: true
			};
			whitelist[byAnDr3W.ReactUtils.instanceKey] = true;
			
			let foundConstructors = config.group ? {} : [];
			let singleConstructor = getConstructor(instance);
			if (config.all) {
				for (let i in foundConstructors) {
					if (config.group) for (let j in foundConstructors[i]) delete foundConstructors[i][j].byAnDr3WreactSearch;
					else delete foundConstructors[i].byAnDr3WreactSearch;
				}
				return foundConstructors;
			}
			else return singleConstructor;

			function getConstructor (instance) {
				depth++;
				let result = undefined;
				if (instance && !Node.prototype.isPrototypeOf(instance) && !byAnDr3W.ReactUtils.getInstance(instance) && depth < maxDepth && performance.now() - start < maxTime) {
					if (instance.type && types.some(name => byAnDr3W.ReactUtils.isCorrectInstance(instance, name.split(" _ _ ")[0]))) {
						if (config.all === undefined || !config.all) result = instance.type;
						else if (config.all) {
							if (!instance.type.byAnDr3WreactSearch) {
								instance.type.byAnDr3WreactSearch = true;
								if (config.group) {
									if (instance.type && (instance.type.render && instance.type.render.displayName || instance.type.displayName || instance.type.name)) {
										let group = config.name.find(name => (instance.type.render && instance.type.render.displayName || instance.type.displayName || instance.type.name || instance.type) == name.split(" _ _ ")[0]) || "Default";
										if (!byAnDr3W.ArrayUtils.is(foundConstructors[group])) foundConstructors[group] = [];
										foundConstructors[group].push(instance.stateNode);
									}
								}
								else foundConstructors.push(instance.type);
							}
						}
					}
					if (result === undefined) {
						let keys = Object.getOwnPropertyNames(instance);
						for (let i = 0; result === undefined && i < keys.length; i++) {
							let key = keys[i];
							if (key && whitelist[key] && (typeof instance[key] === "object" || typeof instance[key] == "function")) result = getConstructor(instance[key]);
						}
					}
				}
				depth--;
				return result;
			}
		};
		byAnDr3W.ReactUtils.findDOMNode = function (instance) {
			if (Node.prototype.isPrototypeOf(instance)) return instance;
			if (!instance || !instance.updater || typeof instance.updater.isMounted !== "function" || !instance.updater.isMounted(instance)) return null;
			let node = Internal.LibraryModules.ReactDOM.findDOMNode(instance) || byAnDr3W.ObjectUtils.get(instance, "child.stateNode");
			return Node.prototype.isPrototypeOf(node) ? node : null;
		};
		byAnDr3W.ReactUtils.findOwner = function (nodeOrInstance, config) {
			if (!byAnDr3W.ObjectUtils.is(config)) return null;
			if (!nodeOrInstance || !config.name && !config.type && !config.key && !config.props && !config.filter) return config.all ? (config.group ? {} : []) : null;
			let instance = Node.prototype.isPrototypeOf(nodeOrInstance) ? byAnDr3W.ReactUtils.getInstance(nodeOrInstance) : nodeOrInstance;
			if (!byAnDr3W.ObjectUtils.is(instance)) return config.all ? (config.group ? {} : []) : null;
			config.name = config.name && [config.name].flat().filter(n => n);
			config.type = config.type && [config.type].flat().filter(n => n);
			config.key = config.key && [config.key].flat().filter(n => n);
			config.props = config.props && [config.props].flat().filter(n => n);
			config.filter = typeof config.filter == "function" && config.filter;
			let depth = -1;
			let start = performance.now();
			let maxDepth = config.unlimited ? 999999999 : (config.depth === undefined ? 30 : config.depth);
			let maxTime = config.unlimited ? 999999999 : (config.time === undefined ? 150 : config.time);
			let whitelist = config.up ? {
				return: true,
				sibling: true,
				default: true
			} : {
				child: true,
				sibling: true,
				default: true
			};
			whitelist[byAnDr3W.ReactUtils.instanceKey] = true;
			
			let foundInstances = config.group ? {} : [];
			let singleInstance = getOwner(instance);
			if (config.all) {
				for (let i in foundInstances) {
					if (config.group) for (let j in foundInstances[i]) delete foundInstances[i][j].byAnDr3WreactSearch;
					else delete foundInstances[i].byAnDr3WreactSearch;
				}
				return foundInstances;
			}
			else return singleInstance;

			function getOwner (instance) {
				depth++;
				let result = undefined;
				if (instance && !Node.prototype.isPrototypeOf(instance) && !byAnDr3W.ReactUtils.getInstance(instance) && depth < maxDepth && performance.now() - start < maxTime) {
					let props = instance.stateNode ? instance.stateNode.props : instance.props;
					if (instance.stateNode && !Node.prototype.isPrototypeOf(instance.stateNode) && (instance.type && config.name && config.name.some(name => byAnDr3W.ReactUtils.isCorrectInstance(instance, name.split(" _ _ ")[0])) || instance.type && config.type && config.type.some(type => byAnDr3W.ArrayUtils.is(type) ? instance.type === type[1] : instance.type === type) || instance.key && config.key && config.key.some(key => instance.key == key) || props && config.props && config.props.every(prop => byAnDr3W.ArrayUtils.is(prop) ? (byAnDr3W.ArrayUtils.is(prop[1]) ? prop[1].some(checkValue => byAnDr3W.equals(props[prop[0]], checkValue)) : byAnDr3W.equals(props[prop[0]], prop[1])) : props[prop] !== undefined)) || config.filter && config.filter(instance)) {
						if (config.all === undefined || !config.all) result = instance.stateNode;
						else if (config.all) {
							if (!instance.stateNode.byAnDr3WreactSearch) {
								instance.stateNode.byAnDr3WreactSearch = true;
								if (config.group) {
									if (config.name && instance.type && (instance.type.render && instance.type.render.displayName || instance.type.displayName || instance.type.name || instance.type)) {
										let group = config.name.find(name => (instance.type.render && instance.type.render.displayName || instance.type.displayName || instance.type.name || instance.type) == name.split(" _ _ ")[0]) || "Default";
										if (!byAnDr3W.ArrayUtils.is(foundInstances[group])) foundInstances[group] = [];
										foundInstances[group].push(instance.stateNode);
									}
									else if (config.type && instance.type) {
										let group = [config.type.find(t => byAnDr3W.ArrayUtils.is(t) && instance.type === t[1])].flat(10)[0] || "Default";
										if (!byAnDr3W.ArrayUtils.is(foundInstances[group])) foundInstances[group] = [];
										foundInstances[group].push(instance.stateNode);
									}
								}
								else foundInstances.push(instance.stateNode);
							}
						}
					}
					if (result === undefined) {
						let keys = Object.getOwnPropertyNames(instance);
						for (let i = 0; result === undefined && i < keys.length; i++) {
							let key = keys[i];
							if (key && whitelist[key] && (typeof instance[key] === "object" || typeof instance[key] == "function")) result = getOwner(instance[key]);
						}
					}
				}
				depth--;
				return result;
			}
		};
		byAnDr3W.ReactUtils.findParent = function (nodeOrInstance, config) {
			if (!nodeOrInstance || !byAnDr3W.ObjectUtils.is(config) || !config.name && !config.key && !config.props && !config.filter) return [null, -1];
			let instance = Node.prototype.isPrototypeOf(nodeOrInstance) ? byAnDr3W.ReactUtils.getInstance(nodeOrInstance) : nodeOrInstance;
			if (!byAnDr3W.ObjectUtils.is(instance) && !byAnDr3W.ArrayUtils.is(instance) || instance.props && typeof instance.props.children == "function") return [null, -1];
			config.name = config.name && [config.name].flat().filter(n => n);
			config.key = config.key && [config.key].flat().filter(n => n);
			config.props = config.props && [config.props].flat().filter(n => n);
			config.filter = typeof config.filter == "function" && config.filter;
			let parent, firstArray;
			parent = firstArray = instance;
			while (!byAnDr3W.ArrayUtils.is(firstArray) && firstArray.props && firstArray.props.children) firstArray = firstArray.props.children;
			if (!byAnDr3W.ArrayUtils.is(firstArray)) {
				if (parent && parent.props) {
					parent.props.children = [parent.props.children];
					firstArray = parent.props.children;
				}
				else firstArray = [];
			}
			return getParent(instance);
			function getParent (children) {
				let result = [firstArray, -1];
				if (!children) return result;
				if (!byAnDr3W.ArrayUtils.is(children)) {
					if (check(children)) result = found(children);
					else {
						if (children.props && children.props.children) {
							parent = children;
							result = getParent(children.props.children);
						}
						if (!(result && result[1] > -1) && children.props && children.props.child) {
							parent = children;
							result = getParent(children.props.child);
						}
					}
				}
				else {
					for (let i = 0; result[1] == -1 && i < children.length; i++) if (children[i]) {
						if (byAnDr3W.ArrayUtils.is(children[i])) {
							parent = children;
							result = getParent(children[i]);
						}
						else if (check(children[i])) {
							parent = children;
							result = found(children[i]);
						}
						else {
							if (children[i].props && children[i].props.children) {
								parent = children[i];
								result = getParent(children[i].props.children);
							}
							if (!(result && result[1] > -1) && children[i].props && children[i].props.child) {
								parent = children[i];
								result = getParent(children[i].props.child);
							}
						}
					}
				}
				return result;
			}
			function found (child) {
				if (byAnDr3W.ArrayUtils.is(parent)) return [parent, parent.indexOf(child)];
				else {
					parent.props.children = [];
					parent.props.children.push(child);
					return [parent.props.children, 0];
				}
			}
			function check (instance) {
				if (!instance || instance == parent) return false;
				let props = instance.stateNode ? instance.stateNode.props : instance.props;
				return instance.type && config.name && config.name.some(name => byAnDr3W.ReactUtils.isCorrectInstance(instance, name)) || config.key && config.key.some(key => instance.key == key) || props && config.props && config.props[config.someProps ? "some" : "every"](prop => byAnDr3W.ArrayUtils.is(prop) ? (byAnDr3W.ArrayUtils.is(prop[1]) ? prop[1].some(checkValue => propCheck(props, prop[0], checkValue)) : propCheck(props, prop[0], prop[1])) : props[prop] !== undefined) || config.filter && config.filter(instance);
			}
			function propCheck (props, key, value) {
				return key != null && props[key] != null && value != null && (key == "className" ? (" " + props[key] + " ").indexOf(" " + value + " ") > -1 : byAnDr3W.equals(props[key], value));
			}
		};
		byAnDr3W.ReactUtils.findProps = function (nodeOrInstance, config) {
			if (!byAnDr3W.ObjectUtils.is(config)) return null;
			if (!nodeOrInstance || !config.name && !config.key) return null;
			let instance = Node.prototype.isPrototypeOf(nodeOrInstance) ? byAnDr3W.ReactUtils.getInstance(nodeOrInstance) : nodeOrInstance;
			if (!byAnDr3W.ObjectUtils.is(instance)) return null;
			config.name = config.name && [config.name].flat().filter(n => n);
			config.key = config.key && [config.key].flat().filter(n => n);
			let depth = -1;
			let start = performance.now();
			let maxDepth = config.unlimited ? 999999999 : (config.depth === undefined ? 30 : config.depth);
			let maxTime = config.unlimited ? 999999999 : (config.time === undefined ? 150 : config.time);
			let whitelist = config.up ? {
				return: true,
				sibling: true,
				default: true
			} : {
				child: true,
				sibling: true,
				default: true
			};
			whitelist[byAnDr3W.ReactUtils.instanceKey] = true;
			return findProps(instance);

			function findProps (instance) {
				depth++;
				let result = undefined;
				if (instance && !Node.prototype.isPrototypeOf(instance) && !byAnDr3W.ReactUtils.getInstance(instance) && depth < maxDepth && performance.now() - start < maxTime) {
					if (instance.memoizedProps && (instance.type && config.name && config.name.some(name => byAnDr3W.ReactUtils.isCorrectInstance(instance, name.split(" _ _ ")[0])) || config.key && config.key.some(key => instance.key == key))) result = instance.memoizedProps;
					if (result === undefined) {
						let keys = Object.getOwnPropertyNames(instance);
						for (let i = 0; result === undefined && i < keys.length; i++) {
							let key = keys[i];
							if (key && whitelist[key] && (typeof instance[key] === "object" || typeof instance[key] == "function")) result = findProps(instance[key]);
						}
					}
				}
				depth--;
				return result;
			}
		};
		byAnDr3W.ReactUtils.findValue = function (nodeOrInstance, searchKey, config = {}) {
			if (!byAnDr3W.ObjectUtils.is(config)) return null;
			if (!nodeOrInstance || typeof searchKey != "string") return config.all ? [] : null;
			let instance = Node.prototype.isPrototypeOf(nodeOrInstance) ? byAnDr3W.ReactUtils.getInstance(nodeOrInstance) : nodeOrInstance;
			if (!byAnDr3W.ObjectUtils.is(instance)) return config.all ? [] : null;
			instance = instance[byAnDr3W.ReactUtils.instanceKey] || instance;
			let depth = -1;
			let start = performance.now();
			let maxDepth = config.unlimited ? 999999999 : (config.depth === undefined ? 30 : config.depth);
			let maxTime = config.unlimited ? 999999999 : (config.time === undefined ? 150 : config.time);
			let whitelist = {
				props: true,
				state: true,
				stateNode: true,
				updater: true,
				prototype: true,
				type: true,
				children: config.up ? false : true,
				memoizedProps: true,
				memoizedState: true,
				child: config.up ? false : true,
				return: config.up ? true : false,
				sibling: config.up ? false : true
			};
			let blacklist = {
				contextSection: true
			};
			if (byAnDr3W.ObjectUtils.is(config.whitelist)) Object.assign(whitelist, config.whiteList);
			if (byAnDr3W.ObjectUtils.is(config.blacklist)) Object.assign(blacklist, config.blacklist);
			let foundKeys = [];
			let singleKey = getKey(instance);
			if (config.all) return foundKeys;
			else return singleKey;
			function getKey(instance) {
				depth++;
				let result = undefined;
				if (instance && !Node.prototype.isPrototypeOf(instance) && !byAnDr3W.ReactUtils.getInstance(instance) && depth < maxDepth && performance.now() - start < maxTime) {
					let keys = Object.getOwnPropertyNames(instance);
					for (let i = 0; result === undefined && i < keys.length; i++) {
						let key = keys[i];
						if (key && !blacklist[key]) {
							let value = instance[key];
							if (searchKey === key && (config.value === undefined || byAnDr3W.equals(config.value, value))) {
								if (config.all === undefined || !config.all) result = value;
								else if (config.all) {
									if (config.noCopies === undefined || !config.noCopies) foundKeys.push(value);
									else if (config.noCopies) {
										let copy = false;
										for (let foundKey of foundKeys) if (byAnDr3W.equals(value, foundKey)) {
											copy = true;
											break;
										}
										if (!copy) foundKeys.push(value);
									}
								}
							}
							else if ((typeof value === "object" || typeof value == "function") && (whitelist[key] || key[0] == "." || !isNaN(key[0]))) result = getKey(value);
						}
					}
				}
				depth--;
				return result;
			}
		};
		byAnDr3W.ReactUtils.forceUpdate = function (...instances) {
			for (let ins of instances.flat(10).filter(n => n)) if (ins.updater && typeof ins.updater.isMounted == "function" && ins.updater.isMounted(ins)) ins.forceUpdate();
		};
		byAnDr3W.ReactUtils.getInstance = function (node) {
			if (!byAnDr3W.ObjectUtils.is(node)) return null;
			return node[Object.keys(node).find(key => key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber"))];
		};
		byAnDr3W.ReactUtils.isCorrectInstance = function (instance, name) {
			return instance && ((instance.type && (instance.type.render && instance.type.render.displayName === name || instance.type.displayName === name || instance.type.name === name || instance.type === name)) || instance.render && (instance.render.displayName === name || instance.render.name === name) || instance.displayName == name || instance.name === name);
		};
		byAnDr3W.ReactUtils.render = function (component, node) {
			if (!byAnDr3W.ReactUtils.isValidElement(component) || !Node.prototype.isPrototypeOf(node)) return;
			try {
				Internal.LibraryModules.ReactDOM.render(component, node);
				let observer = new MutationObserver(changes => changes.forEach(change => {
					let nodes = Array.from(change.removedNodes);
					if (nodes.indexOf(node) > -1 || nodes.some(n =>  n.contains(node))) {
						observer.disconnect();
						byAnDr3W.ReactUtils.unmountComponentAtNode(node);
					}
				}));
				observer.observe(document.body, {subtree: true, childList: true});
			}
			catch (err) {byAnDr3W.LogUtils.error(["Could not render React Element!", err]);}
		};
		byAnDr3W.ReactUtils.hookCall = function (callback, args) {
			if (typeof callback != "function") return null;
			let returnValue = null, tempNode = document.createElement("div");
			byAnDr3W.ReactUtils.render(byAnDr3W.ReactUtils.createElement(_ => {
				returnValue = callback(args);
				return null;
			}), tempNode);
			byAnDr3W.ReactUtils.unmountComponentAtNode(tempNode);
			return returnValue;
		};

		byAnDr3W.MessageUtils = {};
		byAnDr3W.MessageUtils.isSystemMessage = function (message) {
			return message && !byAnDr3W.DiscordConstants.USER_MESSAGE_TYPES.has(message.type) && (message.type !== byAnDr3W.DiscordConstants.MessageTypes.APPLICATION_COMMAND || message.interaction == null);
		};
		byAnDr3W.MessageUtils.rerenderAll = function (instant) {
			byAnDr3W.TimeUtils.clear(byAnDr3W.MessageUtils.rerenderAll.timeout);
			byAnDr3W.MessageUtils.rerenderAll.timeout = byAnDr3W.TimeUtils.timeout(_ => {
				let channelId = Internal.LibraryModules.LastChannelStore.getChannelId();
				if (channelId) {
					if (byAnDr3W.DMUtils.isDMChannel(channelId)) byAnDr3W.DMUtils.markAsRead(channelId);
					else byAnDr3W.ChannelUtils.markAsRead(channelId);
				}
				let LayerProviderIns = byAnDr3W.ReactUtils.findOwner(document.querySelector(byAnDr3W.dotCN.messageswrapper), {name: "LayerProvider", unlimited: true, up: true});
				let LayerProviderPrototype = byAnDr3W.ObjectUtils.get(LayerProviderIns, `${byAnDr3W.ReactUtils.instanceKey}.type.prototype`);
				if (LayerProviderIns && LayerProviderPrototype) {
					byAnDr3W.PatchUtils.patch({name: "byAnDr3W MessageUtils"}, LayerProviderPrototype, "render", {after: e => {
						e.returnValue.props.children = typeof e.returnValue.props.children == "function" ? (_ => {return null;}) : [];
						byAnDr3W.ReactUtils.forceUpdate(LayerProviderIns);
					}}, {once: true});
					byAnDr3W.ReactUtils.forceUpdate(LayerProviderIns);
				}
			}, instant ? 0 : 1000);
		};
		byAnDr3W.MessageUtils.openMenu = function (message, e = mousePosition, slim = false) {
			if (!message) return;
			let channel = Internal.LibraryModules.ChannelStore.getChannel(message.channel_id);
			if (!channel) return;
			e = byAnDr3W.ListenerUtils.copyEvent(e.nativeEvent || e, (e.nativeEvent || e).currentTarget);
			let menu = byAnDr3W.ModuleUtils.findByName(slim ? "MessageSearchResultContextMenu" : "MessageContextMenu", false, true);
			if (menu) Internal.LibraryModules.ContextMenuUtils.openContextMenu(e, e2 => byAnDr3W.ReactUtils.createElement(menu.exports.default, Object.assign({}, e2, {message, channel})));
			else Internal.lazyLoadModuleImports(byAnDr3W.ModuleUtils.findByString(slim ? ["SearchResult", "message:", "openContextMenu"] : ["useHoveredMessage", "useContextMenuUser", "openContextMenu"])).then(_ => {
				menu = byAnDr3W.ModuleUtils.findByName(slim ? "MessageSearchResultContextMenu" : "MessageContextMenu", false);
				if (menu) Internal.LibraryModules.ContextMenuUtils.openContextMenu(e, e2 => byAnDr3W.ReactUtils.createElement(menu.exports.default, Object.assign({}, e2, {message, channel})));
			});
		};
			
		byAnDr3W.UserUtils = {};
		byAnDr3W.UserUtils.is = function (user) {
			return user && user instanceof Internal.DiscordObjects.User;
		};
		const myDataUser = Internal.LibraryModules.UserStore && Internal.LibraryModules.UserStore.getCurrentUser && Internal.LibraryModules.UserStore.getCurrentUser();
		if (myDataUser && byAnDr3W.UserUtils._id != myDataUser.id) {
			document.body.setAttribute("data-current-user-id", myDataUser.id);
			byAnDr3W.UserUtils._id = myDataUser.id;
		}
		byAnDr3W.UserUtils.me = new Proxy(myDataUser || {}, {
			get: function (list, item) {
				const user = Internal.LibraryModules.UserStore && Internal.LibraryModules.UserStore.getCurrentUser && Internal.LibraryModules.UserStore.getCurrentUser();
				if (user && byAnDr3W.UserUtils._id != user.id) {
					Cache.data = {};
					document.body.setAttribute("data-current-user-id", user.id);
					byAnDr3W.UserUtils._id = user.id;
				}
				return user ? user[item] : null;
			}
		});
		byAnDr3W.UserUtils.getStatus = function (id = byAnDr3W.UserUtils.me.id) {
			id = typeof id == "number" ? id.toFixed() : id;
			let activity = byAnDr3W.UserUtils.getActivity(id);
			return activity && activity.type == byAnDr3W.DiscordConstants.ActivityTypes.STREAMING ? "streaming" : Internal.LibraryModules.StatusMetaUtils.getStatus(id);
		};
		byAnDr3W.UserUtils.getStatusColor = function (status, useColor) {
			status = typeof status == "string" ? status.toLowerCase() : null;
			switch (status) {
				case "online": return useColor ? byAnDr3W.DiscordConstants.Colors.STATUS_GREEN_600 : "var(--byAnDr3W-green)";
				case "idle": return useColor ? byAnDr3W.DiscordConstants.Colors.STATUS_YELLOW : "var(--byAnDr3W-yellow)";
				case "dnd": return useColor ? byAnDr3W.DiscordConstants.Colors.STATUS_RED : "var(--byAnDr3W-red)";
				case "playing": return useColor ? byAnDr3W.DiscordConstants.Colors.BRAND : "var(--byAnDr3W-blurple)";
				case "listening": return byAnDr3W.DiscordConstants.Colors.SPOTIFY;
				case "streaming": return byAnDr3W.DiscordConstants.Colors.TWITCH;
				default: return byAnDr3W.DiscordConstants.Colors.STATUS_GREY;
			}
		};
		byAnDr3W.UserUtils.getActivity = function (id = byAnDr3W.UserUtils.me.id) {
			for (let activity of Internal.LibraryModules.StatusMetaUtils.getActivities(id)) if (activity.type != byAnDr3W.DiscordConstants.ActivityTypes.CUSTOM_STATUS) return activity;
			return null;
		};
		byAnDr3W.UserUtils.getCustomStatus = function (id = byAnDr3W.UserUtils.me.id) {
			for (let activity of Internal.LibraryModules.StatusMetaUtils.getActivities(id)) if (activity.type == byAnDr3W.DiscordConstants.ActivityTypes.CUSTOM_STATUS) return activity;
			return null;
		};
		byAnDr3W.UserUtils.getAvatar = function (id = byAnDr3W.UserUtils.me.id) {
			let user = Internal.LibraryModules.UserStore.getUser(id);
			if (!user) return window.location.origin + "/assets/1f0bfc0865d324c2587920a7d80c609b.png";
			else return ((user.avatar ? "" : window.location.origin) + Internal.LibraryModules.IconUtils.getUserAvatarURL(user)).split("?")[0];
		};
		byAnDr3W.UserUtils.getBanner = function (id = byAnDr3W.UserUtils.me.id, canAnimate = false) {
			let user = Internal.LibraryModules.UserStore.getUser(id);
			if (!user || !user.banner) return "";
			return Internal.LibraryModules.IconUtils.getUserBannerURL(Object.assign({}, user, {canAnimate})).split("?")[0];
		};
		byAnDr3W.UserUtils.can = function (permission, id = byAnDr3W.UserUtils.me.id, channelId = Internal.LibraryModules.LastChannelStore.getChannelId()) {
			if (!byAnDr3W.DiscordConstants.Permissions[permission]) byAnDr3W.LogUtils.warn([permission, "not found in Permissions"]);
			else {
				let channel = Internal.LibraryModules.ChannelStore.getChannel(channelId);
				if (channel) return Internal.LibraryModules.PermissionRoleUtils.can({permission: byAnDr3W.DiscordConstants.Permissions[permission], user: id, context: channel});
			}
			return false;
		};
		byAnDr3W.UserUtils.openMenu = function (user, guildId, e = mousePosition) {
			if (!user || !guildId) return;
			e = byAnDr3W.ListenerUtils.copyEvent(e.nativeEvent || e, (e.nativeEvent || e).currentTarget);
			let menu = byAnDr3W.ModuleUtils.findByName("GuildChannelUserContextMenu", false, true);
			if (menu) Internal.LibraryModules.ContextMenuUtils.openContextMenu(e, e2 => byAnDr3W.ReactUtils.createElement(menu.exports.default, Object.assign({}, e2, {user, guildId})));
			else Internal.lazyLoadModuleImports(byAnDr3W.ModuleUtils.findByString("openUserContextMenu", "user:", "openContextMenu")).then(_ => {
				menu = byAnDr3W.ModuleUtils.findByName("GuildChannelUserContextMenu", false);
				if (menu) Internal.LibraryModules.ContextMenuUtils.openContextMenu(e, e2 => byAnDr3W.ReactUtils.createElement(menu.exports.default, Object.assign({}, e2, {user, guildId})));
			});
		};

		byAnDr3W.GuildUtils = {};
		byAnDr3W.GuildUtils.is = function (guild) {
			if (!byAnDr3W.ObjectUtils.is(guild)) return false;
			let keys = Object.keys(guild);
			return guild instanceof Internal.DiscordObjects.Guild || Object.keys(new Internal.DiscordObjects.Guild({})).every(key => keys.indexOf(key) > -1);
		};
		byAnDr3W.GuildUtils.getIcon = function (id) {
			let guild = Internal.LibraryModules.GuildStore.getGuild(id);
			if (!guild || !guild.icon) return "";
			return Internal.LibraryModules.IconUtils.getGuildIconURL(guild).split("?")[0];
		};
		byAnDr3W.GuildUtils.getBanner = function (id) {
			let guild = Internal.LibraryModules.GuildStore.getGuild(id);
			if (!guild || !guild.banner) return "";
			return Internal.LibraryModules.IconUtils.getGuildBannerURL(guild).split("?")[0];
		};
		byAnDr3W.GuildUtils.getFolder = function (id) {
			return Internal.LibraryModules.FolderStore.guildFolders.filter(n => n.folderId).find(n => n.guildIds.includes(id));
		};
		byAnDr3W.GuildUtils.openMenu = function (guild, e = mousePosition) {
			if (!guild) return;
			e = byAnDr3W.ListenerUtils.copyEvent(e.nativeEvent || e, (e.nativeEvent || e).currentTarget);
			let menu = byAnDr3W.ModuleUtils.findByName("GuildContextMenu", false, true);
			if (menu) Internal.LibraryModules.ContextMenuUtils.openContextMenu(e, e2 => byAnDr3W.ReactUtils.createElement(menu.exports.default, Object.assign({}, e2, {guild})));
			else Internal.lazyLoadModuleImports(byAnDr3W.ModuleUtils.findByString("renderUnavailableBadge", "guild:", "openContextMenu")).then(_ => {
				menu = byAnDr3W.ModuleUtils.findByName("GuildContextMenu", false);
				if (menu) Internal.LibraryModules.ContextMenuUtils.openContextMenu(e, e2 => byAnDr3W.ReactUtils.createElement(menu.exports.default, Object.assign({}, e2, {guild})));
			});
		};
		byAnDr3W.GuildUtils.markAsRead = function (guildIds) {
			guildIds = [guildIds].flat(10).filter(id => id && typeof id == "string" && Internal.LibraryModules.GuildStore.getGuild(id));
			if (!guildIds) return;
			let channels = guildIds.map(id => [byAnDr3W.ObjectUtils.toArray(Internal.LibraryModules.GuildChannelStore.getChannels(id)), Internal.LibraryModules.GuildEventStore.getGuildScheduledEventsForGuild(id)]).flat(10).map(n => n && (n.channel && n.channel.id || n.id)).flat().filter(n => n);
			if (channels.length) byAnDr3W.ChannelUtils.markAsRead(channels);
			let eventChannels = guildIds.map(id => ({
				channelId: id,
				readStateType: Internal.LibraryModules.UnreadStateTypes.GUILD_EVENT,
				messageId: Internal.LibraryModules.UnreadChannelUtils.lastMessageId(id, Internal.LibraryModules.UnreadStateTypes.GUILD_EVENT)
			})).filter(n => n.messageId);
			if (eventChannels.length) Internal.LibraryModules.AckUtils.bulkAck(eventChannels);
		};
		byAnDr3W.GuildUtils.rerenderAll = function (instant) {
			byAnDr3W.TimeUtils.clear(byAnDr3W.GuildUtils.rerenderAll.timeout);
			byAnDr3W.GuildUtils.rerenderAll.timeout = byAnDr3W.TimeUtils.timeout(_ => {
				let ShakeableIns = byAnDr3W.ReactUtils.findOwner(document.querySelector(byAnDr3W.dotCN.appcontainer), {name: "Shakeable", unlimited: true, up: true});
				let ShakeablePrototype = byAnDr3W.ObjectUtils.get(ShakeableIns, `${byAnDr3W.ReactUtils.instanceKey}.type.prototype`);
				if (ShakeableIns && ShakeablePrototype) {
					byAnDr3W.PatchUtils.patch({name: "byAnDr3W GuildUtils"}, ShakeablePrototype, "render", {after: e => {
						e.returnValue.props.children = typeof e.returnValue.props.children == "function" ? (_ => {return null;}) : [];
						byAnDr3W.ReactUtils.forceUpdate(ShakeableIns);
					}}, {once: true});
					byAnDr3W.ReactUtils.forceUpdate(ShakeableIns);
				}
			}, instant ? 0 : 1000);
		};

		byAnDr3W.FolderUtils = {};
		byAnDr3W.FolderUtils.getId = function (div) {
			if (!Node.prototype.isPrototypeOf(div) || !byAnDr3W.ReactUtils.getInstance(div)) return;
			div = byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.guildfolderwrapper, div);
			if (!div) return;
			return byAnDr3W.ReactUtils.findValue(div, "folderId", {up: true});
		};
		byAnDr3W.FolderUtils.getDefaultName = function (folderId) {
			let folder = Internal.LibraryModules.FolderStore.getGuildFolderById(folderId);
			if (!folder) return "";
			let rest = 2 * byAnDr3W.DiscordConstants.MAX_GUILD_FOLDER_NAME_LENGTH;
			let names = [], allNames = folder.guildIds.map(guildId => (Internal.LibraryModules.GuildStore.getGuild(guildId) || {}).name).filter(n => n);
			for (let name of allNames) if (name.length < rest || names.length === 0) {
				names.push(name);
				rest -= name.length;
			}
			return names.join(", ") + (names.length < allNames.length ? ", ..." : "");
		};

		byAnDr3W.ChannelUtils = {};
		byAnDr3W.ChannelUtils.is = function (channel) {
			if (!byAnDr3W.ObjectUtils.is(channel)) return false;
			let keys = Object.keys(channel);
			return channel instanceof Internal.DiscordObjects.Channel || Object.keys(new Internal.DiscordObjects.Channel({})).every(key => keys.indexOf(key) > -1);
		};
		byAnDr3W.ChannelUtils.isTextChannel = function (channelOrId) {
			let channel = typeof channelOrId == "string" ? Internal.LibraryModules.ChannelStore.getChannel(channelOrId) : channelOrId;
			return byAnDr3W.ObjectUtils.is(channel) && (channel.type == byAnDr3W.DiscordConstants.ChannelTypes.GUILD_TEXT || channel.type == byAnDr3W.DiscordConstants.ChannelTypes.GUILD_STORE || channel.type == byAnDr3W.DiscordConstants.ChannelTypes.GUILD_ANNOUNCEMENT);
		};
		byAnDr3W.ChannelUtils.isThread = function (channelOrId) {
			let channel = typeof channelOrId == "string" ? Internal.LibraryModules.ChannelStore.getChannel(channelOrId) : channelOrId;
			return channel && channel.isThread();
		};
		byAnDr3W.ChannelUtils.isEvent = function (channelOrId) {
			let channel = typeof channelOrId == "string" ? Internal.LibraryModules.GuildEventStore.getGuildScheduledEvent(channelOrId) : channelOrId;
			return channel && Internal.LibraryModules.GuildEventStore.getGuildScheduledEvent(channel.id) && true;
		};
		byAnDr3W.ChannelUtils.markAsRead = function (channelIds) {
			let unreadChannels = [channelIds].flat(10).filter(id => id && typeof id == "string" && ((byAnDr3W.ChannelUtils.isTextChannel(id) || byAnDr3W.ChannelUtils.isThread(id)) && (Internal.LibraryModules.UnreadChannelUtils.hasUnread(id) || Internal.LibraryModules.UnreadChannelUtils.getMentionCount(id) > 0))).map(id => ({
				channelId: id,
				readStateType: Internal.LibraryModules.UnreadStateTypes.CHANNEL,
				messageId: Internal.LibraryModules.UnreadChannelUtils.lastMessageId(id)
			}));
			if (unreadChannels.length) Internal.LibraryModules.AckUtils.bulkAck(unreadChannels);
		};
		byAnDr3W.ChannelUtils.rerenderAll = function (instant) {
			byAnDr3W.TimeUtils.clear(byAnDr3W.ChannelUtils.rerenderAll.timeout);
			byAnDr3W.ChannelUtils.rerenderAll.timeout = byAnDr3W.TimeUtils.timeout(_ => {
				let ChannelsIns = byAnDr3W.ReactUtils.findOwner(document.querySelector(byAnDr3W.dotCN.guildchannels), {name: "Channels", unlimited: true});
				let ChannelsPrototype = byAnDr3W.ObjectUtils.get(ChannelsIns, `${byAnDr3W.ReactUtils.instanceKey}.type.prototype`);
				if (ChannelsIns && ChannelsPrototype) {
					byAnDr3W.PatchUtils.patch({name: "byAnDr3W ChannelUtils"}, ChannelsPrototype, "render", {after: e => {
						e.returnValue.props.children = typeof e.returnValue.props.children == "function" ? (_ => {return null;}) : [];
						byAnDr3W.ReactUtils.forceUpdate(ChannelsIns);
					}}, {once: true});
					byAnDr3W.ReactUtils.forceUpdate(ChannelsIns);
				}
			}, instant ? 0 : 1000);
		};
		
		byAnDr3W.DMUtils = {};
		byAnDr3W.DMUtils.isDMChannel = function (id) {
			let channel = Internal.LibraryModules.ChannelStore.getChannel(id);
			return byAnDr3W.ObjectUtils.is(channel) && (channel.isDM() || channel.isGroupDM());
		};
		byAnDr3W.DMUtils.getIcon = function (id) {
			let channel = Internal.LibraryModules.ChannelStore.getChannel(id);
			if (!channel) return "";
			if (!channel.icon) return channel.isDM() ? byAnDr3W.UserUtils.getAvatar(channel.recipients[0]) : (channel.isGroupDM() ? window.location.origin + Internal.LibraryModules.IconUtils.getChannelIconURL(channel).split("?")[0] : null);
			return Internal.LibraryModules.IconUtils.getChannelIconURL(channel).split("?")[0];
		};
		byAnDr3W.DMUtils.markAsRead = function (dmIds) {
			let unreadDMs = [dmIds].flat(10).filter(id => id && typeof id == "string" && byAnDr3W.DMUtils.isDMChannel(id) && (Internal.LibraryModules.UnreadChannelUtils.hasUnread(id) || Internal.LibraryModules.UnreadChannelUtils.getMentionCount(id) > 0));
			if (unreadDMs.length) for (let i in unreadDMs) byAnDr3W.TimeUtils.timeout(_ => Internal.LibraryModules.AckUtils.ack(unreadDMs[i]), i * 1000);
		};
		
		byAnDr3W.ColorUtils = {};
		byAnDr3W.ColorUtils.convert = function (color, conv, type) {
			if (byAnDr3W.ObjectUtils.is(color)) {
				var newColor = {};
				for (let pos in color) newColor[pos] = byAnDr3W.ColorUtils.convert(color[pos], conv, type);
				return newColor;
			}
			else {
				conv = conv === undefined || !conv ? conv = "RGBCOMP" : conv.toUpperCase();
				type = type === undefined || !type || !["RGB", "RGBA", "RGBCOMP", "HSL", "HSLA", "HSLCOMP", "HEX", "HEXA", "INT"].includes(type.toUpperCase()) ? byAnDr3W.ColorUtils.getType(color) : type.toUpperCase();
				if (conv == "RGBCOMP") {
					switch (type) {
						case "RGBCOMP":
							var rgbComp = [].concat(color);
							if (rgbComp.length == 3) return processRGB(rgbComp);
							else if (rgbComp.length == 4) {
								let a = processA(rgbComp.pop());
								return processRGB(rgbComp).concat(a);
							}
							break;
						case "RGB":
							return processRGB(color.replace(/\s/g, "").slice(4, -1).split(","));
						case "RGBA":
							var rgbComp = color.replace(/\s/g, "").slice(5, -1).split(",");
							var a = processA(rgbComp.pop());
							return processRGB(rgbComp).concat(a);
						case "HSLCOMP":
							var hslComp = [].concat(color);
							if (hslComp.length == 3) return byAnDr3W.ColorUtils.convert(`hsl(${processHSL(hslComp).join(",")})`, "RGBCOMP");
							else if (hslComp.length == 4) {
								let a = processA(hslComp.pop());
								return byAnDr3W.ColorUtils.convert(`hsl(${processHSL(hslComp).join(",")})`, "RGBCOMP").concat(a);
							}
							break;
						case "HSL":
							var hslComp = processHSL(color.replace(/\s/g, "").slice(4, -1).split(","));
							var r, g, b, m, c, x, p, q;
							var h = hslComp[0] / 360, l = parseInt(hslComp[1]) / 100, s = parseInt(hslComp[2]) / 100; m = Math.floor(h * 6); c = h * 6 - m; x = s * (1 - l); p = s * (1 - c * l); q = s * (1 - (1 - c) * l);
							switch (m % 6) {
								case 0: r = s, g = q, b = x; break;
								case 1: r = p, g = s, b = x; break;
								case 2: r = x, g = s, b = q; break;
								case 3: r = x, g = p, b = s; break;
								case 4: r = q, g = x, b = s; break;
								case 5: r = s, g = x, b = p; break;
							}
							return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
						case "HSLA":
							var hslComp = color.replace(/\s/g, "").slice(5, -1).split(",");
							return byAnDr3W.ColorUtils.convert(`hsl(${hslComp.slice(0, 3).join(",")})`, "RGBCOMP").concat(processA(hslComp.pop()));
						case "HEX":
							var hex = /^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$|^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
							return [parseInt(hex[1] + hex[1] || hex[4], 16), parseInt(hex[2] + hex[2] || hex[5], 16), parseInt(hex[3] + hex[3] || hex[6], 16)];
						case "HEXA":
							var hex = /^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$|^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
							return [parseInt(hex[1] + hex[1] || hex[5], 16), parseInt(hex[2] + hex[2] || hex[6], 16), parseInt(hex[3] + hex[3] || hex[7], 16), Math.floor(byAnDr3W.NumberUtils.mapRange([0, 255], [0, 100], parseInt(hex[4] + hex[4] || hex[8], 16)))/100];
						case "INT":
							color = processINT(color);
							return [parseInt(color >> 16 & 255), parseInt(color >> 8 & 255), parseInt(color & 255)];
						default:
							return null;
					}
				}
				else {
					if (conv && type && conv.indexOf("HSL") == 0 && type.indexOf("HSL") == 0) {
						if (type == "HSLCOMP") {
							let hslComp = [].concat(color);
							switch (conv) {
								case "HSLCOMP":
									if (hslComp.length == 3) return processHSL(hslComp);
									else if (hslComp.length == 4) {
										var a = processA(hslComp.pop());
										return processHSL(hslComp).concat(a);
									}
									break;
								case "HSL":
									return `hsl(${processHSL(hslComp.slice(0, 3)).join(",")})`;
								case "HSLA":
									hslComp = hslComp.slice(0, 4);
									var a = hslComp.length == 4 ? processA(hslComp.pop()) : 1;
									return `hsla(${processHSL(hslComp).concat(a).join(",")})`;
							}
						}
						return byAnDr3W.ColorUtils.convert(color.replace(/\s/g, "").slice(color.toUpperCase().indexOf("HSLA") == 0 ? 5 : 4, -1).split(","), conv, "HSLCOMP");
					}
					else {
						let rgbComp = type == "RGBCOMP" ? [].concat(color) : byAnDr3W.ColorUtils.convert(color, "RGBCOMP", type);
						if (rgbComp) switch (conv) {
							case "RGB":
								return `rgb(${processRGB(rgbComp.slice(0, 3)).join(",")})`;
							case "RGBA":
								rgbComp = rgbComp.slice(0, 4);
								var a = rgbComp.length == 4 ? processA(rgbComp.pop()) : 1;
								return `rgba(${processRGB(rgbComp).concat(a).join(",")})`;
							case "HSLCOMP":
								var a = rgbComp.length == 4 ? processA(rgbComp.pop()) : null;
								var hslComp = processHSL(byAnDr3W.ColorUtils.convert(rgbComp, "HSL").replace(/\s/g, "").split(","));
								return a != null ? hslComp.concat(a) : hslComp;
							case "HSL":
								var r = processC(rgbComp[0]), g = processC(rgbComp[1]), b = processC(rgbComp[2]);
								var max = Math.max(r, g, b), min = Math.min(r, g, b), dif = max - min, h, l = max === 0 ? 0 : dif / max, s = max / 255;
								switch (max) {
									case min: h = 0; break;
									case r: h = g - b + dif * (g < b ? 6 : 0); h /= 6 * dif; break;
									case g: h = b - r + dif * 2; h /= 6 * dif; break;
									case b: h = r - g + dif * 4; h /= 6 * dif; break;
								}
								return `hsl(${processHSL([Math.round(h * 360), l * 100, s * 100]).join(",")})`;
							case "HSLA":
								var a = rgbComp.length == 4 ? processA(rgbComp.pop()) : 1;
								return `hsla(${byAnDr3W.ColorUtils.convert(rgbComp, "HSL").slice(4, -1).split(",").concat(a).join(",")})`;
							case "HEX":
								return ("#" + (0x1000000 + (rgbComp[2] | rgbComp[1] << 8 | rgbComp[0] << 16)).toString(16).slice(1)).toUpperCase();
							case "HEXA":
								return ("#" + (0x1000000 + (rgbComp[2] | rgbComp[1] << 8 | rgbComp[0] << 16)).toString(16).slice(1) + (0x100 + Math.round(byAnDr3W.NumberUtils.mapRange([0, 100], [0, 255], processA(rgbComp[3]) * 100))).toString(16).slice(1)).toUpperCase();
							case "INT":
								return processINT(rgbComp[2] | rgbComp[1] << 8 | rgbComp[0] << 16);
							default:
								return null;
						}
					}
				}
			}
			return null;
			function processC(c) {if (c == null) {return 255;} else {c = parseInt(c.toString().replace(/[^0-9\-]/g, ""));return isNaN(c) || c > 255 ? 255 : c < 0 ? 0 : c;}};
			function processRGB(comp) {return [].concat(comp).map(c => {return processC(c);});};
			function processA(a) {if (a == null) {return 1;} else {a = a.toString();a = (a.indexOf("%") > -1 ? 0.01 : 1) * parseFloat(a.replace(/[^0-9\.\-]/g, ""));return isNaN(a) || a > 1 ? 1 : a < 0 ? 0 : a;}};
			function processSL(sl) {if (sl == null) {return "100%";} else {sl = parseFloat(sl.toString().replace(/[^0-9\.\-]/g, ""));return (isNaN(sl) || sl > 100 ? 100 : sl < 0 ? 0 : sl) + "%";}};
			function processHSL(comp) {comp = [].concat(comp);let h = parseFloat(comp.shift().toString().replace(/[^0-9\.\-]/g, ""));h = isNaN(h) || h > 360 ? 360 : h < 0 ? 0 : h;return [h].concat(comp.map(sl => {return processSL(sl);}));};
			function processINT(c) {if (c == null) {return 16777215;} else {c = parseInt(c.toString().replace(/[^0-9]/g, ""));return isNaN(c) || c > 16777215 ? 16777215 : c < 0 ? 0 : c;}};
		};
		byAnDr3W.ColorUtils.setAlpha = function (color, a, conv) {
			if (byAnDr3W.ObjectUtils.is(color)) {
				let newcolor = {};
				for (let pos in color) newcolor[pos] = byAnDr3W.ColorUtils.setAlpha(color[pos], a, conv);
				return newcolor;
			}
			else {
				let rgbComp = byAnDr3W.ColorUtils.convert(color, "RGBCOMP");
				if (rgbComp) {
					a = a.toString();
					a = (a.indexOf("%") > -1 ? 0.01 : 1) * parseFloat(a.replace(/[^0-9\.\-]/g, ""));
					a = isNaN(a) || a > 1 ? 1 : a < 0 ? 0 : a;
					rgbComp[3] = a;
					conv = (conv || byAnDr3W.ColorUtils.getType(color)).toUpperCase();
					conv = conv == "RGB" || conv == "HSL" || conv == "HEX" ? conv + "A" : conv;
					return byAnDr3W.ColorUtils.convert(rgbComp, conv);
				}
			}
			return null;
		};
		byAnDr3W.ColorUtils.getAlpha = function (color) {
			let rgbComp = byAnDr3W.ColorUtils.convert(color, "RGBCOMP");
			if (rgbComp) {
				if (rgbComp.length == 3) return 1;
				else if (rgbComp.length == 4) {
					let a = rgbComp[3].toString();
					a = (a.indexOf("%") > -1 ? 0.01 : 1) * parseFloat(a.replace(/[^0-9\.\-]/g, ""));
					return isNaN(a) || a > 1 ? 1 : a < 0 ? 0 : a;
				}
			}
			return null;
		};
		byAnDr3W.ColorUtils.change = function (color, value, conv) {
			value = parseFloat(value);
			if (color != null && typeof value == "number" && !isNaN(value)) {
				if (byAnDr3W.ObjectUtils.is(color)) {
					let newColor = {};
					for (let pos in color) newColor[pos] = byAnDr3W.ColorUtils.change(color[pos], value, conv);
					return newColor;
				}
				else {
					let rgbComp = byAnDr3W.ColorUtils.convert(color, "RGBCOMP");
					if (rgbComp) {
						let a = byAnDr3W.ColorUtils.getAlpha(rgbComp);
						if (parseInt(value) !== value) {
							value = value.toString();
							value = (value.indexOf("%") > -1 ? 0.01 : 1) * parseFloat(value.replace(/[^0-9\.\-]/g, ""));
							value = isNaN(value) ? 0 : value;
							return byAnDr3W.ColorUtils.convert([].concat(rgbComp).slice(0, 3).map(c => {
								c = Math.round(c * (1 + value));
								return c > 255 ? 255 : c < 0 ? 0 : c;
							}).concat(a), conv || byAnDr3W.ColorUtils.getType(color));
						}
						else return byAnDr3W.ColorUtils.convert([].concat(rgbComp).slice(0, 3).map(c => {
							c = Math.round(c + value);
							return c > 255 ? 255 : c < 0 ? 0 : c;
						}).concat(a), conv || byAnDr3W.ColorUtils.getType(color));
					}
				}
			}
			return null;
		};
		byAnDr3W.ColorUtils.invert = function (color, conv) {
			if (byAnDr3W.ObjectUtils.is(color)) {
				let newColor = {};
				for (let pos in color) newColor[pos] = byAnDr3W.ColorUtils.invert(color[pos], conv);
				return newColor;
			}
			else {
				let comp = byAnDr3W.ColorUtils.convert(color, "RGBCOMP");
				if (comp) return byAnDr3W.ColorUtils.convert([255 - comp[0], 255 - comp[1], 255 - comp[2]], conv || byAnDr3W.ColorUtils.getType(color));
			}
			return null;
		};
		byAnDr3W.ColorUtils.compare = function (color1, color2) {
			if (color1 && color2) {
				color1 = byAnDr3W.ColorUtils.convert(color1, "RGBA");
				color2 = byAnDr3W.ColorUtils.convert(color2, "RGBA");
				if (color1 && color2) return byAnDr3W.equals(color1, color2);
			}
			return null;
		};
		byAnDr3W.ColorUtils.isBright = function (color, compare = 160) {
			if (!byAnDr3W.ColorUtils.getType(color)) return false;
			color = byAnDr3W.ColorUtils.convert(color, "RGBCOMP");
			if (!color) return false;
			return parseInt(compare) < Math.sqrt(0.299 * color[0]**2 + 0.587 * color[1]**2 + 0.144 * color[2]**2);
		};
		byAnDr3W.ColorUtils.getType = function (color) {
			if (color != null) {
				if (typeof color === "object" && (color.length == 3 || color.length == 4)) {
					if (isRGB(color)) return "RGBCOMP";
					else if (isHSL(color)) return "HSLCOMP";
				}
				else if (typeof color === "string") {
					if (/^#[a-f\d]{3}$|^#[a-f\d]{6}$/i.test(color)) return "HEX";
					else if (/^#[a-f\d]{4}$|^#[a-f\d]{8}$/i.test(color)) return "HEXA";
					else {
						color = color.toUpperCase();
						let comp = color.replace(/[^0-9\.\-\,\%]/g, "").split(",");
						if (color.indexOf("RGB(") == 0 && comp.length == 3 && isRGB(comp)) return "RGB";
						else if (color.indexOf("RGBA(") == 0 && comp.length == 4 && isRGB(comp)) return "RGBA";
						else if (color.indexOf("HSL(") == 0 && comp.length == 3 && isHSL(comp)) return "HSL";
						else if (color.indexOf("HSLA(") == 0 && comp.length == 4 && isHSL(comp)) return "HSLA";
					}
				}
				else if (typeof color === "number" && parseInt(color) == color && color > -1 && color < 16777216) return "INT";
			}
			return null;
			function isRGB(comp) {return comp.slice(0, 3).every(rgb => rgb.toString().indexOf("%") == -1 && parseFloat(rgb) == parseInt(rgb));};
			function isHSL(comp) {return comp.slice(1, 3).every(hsl => hsl.toString().indexOf("%") == hsl.length - 1);};
		};
		byAnDr3W.ColorUtils.createGradient = function (colorObj, direction = "to right") {
			let gradientString = "linear-gradient(" + direction;
			for (let pos of Object.keys(colorObj).sort()) {
				let color = byAnDr3W.ColorUtils.convert(colorObj[pos], "RGBA");
				gradientString += color ? `, ${color} ${pos*100}%` : ''
			}
			return gradientString += ")";
		};

		byAnDr3W.DOMUtils = {};
		byAnDr3W.DOMUtils.getSelection = function () {
			let selection = document.getSelection();
			return selection && selection.anchorNode ? selection.getRangeAt(0).toString() : "";
		};
		byAnDr3W.DOMUtils.addClass = function (eles, ...classes) {
			if (!eles || !classes) return;
			for (let ele of [eles].map(n => NodeList.prototype.isPrototypeOf(n) ? Array.from(n) : n).flat(10).filter(n => n)) {
				if (Node.prototype.isPrototypeOf(ele)) add(ele);
				else if (NodeList.prototype.isPrototypeOf(ele)) for (let e of ele) add(e);
				else if (typeof ele == "string") for (let e of ele.split(",")) if (e && (e = e.trim())) for (let n of document.querySelectorAll(e)) add(n);
			}
			function add(node) {
				if (node && node.classList) for (let cla of classes) for (let cl of [cla].flat(10).filter(n => n)) if (typeof cl == "string") for (let c of cl.split(" ")) if (c) node.classList.add(c);
			}
		};
		byAnDr3W.DOMUtils.removeClass = function (eles, ...classes) {
			if (!eles || !classes) return;
			for (let ele of [eles].map(n => NodeList.prototype.isPrototypeOf(n) ? Array.from(n) : n).flat(10).filter(n => n)) {
				if (Node.prototype.isPrototypeOf(ele)) remove(ele);
				else if (NodeList.prototype.isPrototypeOf(ele)) for (let e of ele) remove(e);
				else if (typeof ele == "string") for (let e of ele.split(",")) if (e && (e = e.trim())) for (let n of document.querySelectorAll(e)) remove(n);
			}
			function remove(node) {
				if (node && node.classList) for (let cla of classes) for (let cl of [cla].flat(10).filter(n => n)) if (typeof cl == "string") for (let c of cl.split(" ")) if (c) node.classList.remove(c);
			}
		};
		byAnDr3W.DOMUtils.toggleClass = function (eles, ...classes) {
			if (!eles || !classes) return;
			var force = classes.pop();
			if (typeof force != "boolean") {
				classes.push(force);
				force = undefined;
			}
			if (!classes.length) return;
			for (let ele of [eles].map(n => NodeList.prototype.isPrototypeOf(n) ? Array.from(n) : n).flat(10).filter(n => n)) {
				if (Node.prototype.isPrototypeOf(ele)) toggle(ele);
				else if (NodeList.prototype.isPrototypeOf(ele)) for (let e of ele) toggle(e);
				else if (typeof ele == "string") for (let e of ele.split(",")) if (e && (e = e.trim())) for (let n of document.querySelectorAll(e)) toggle(n);
			}
			function toggle(node) {
				if (node && node.classList) for (let cla of classes) for (let cl of [cla].flat(10).filter(n => n)) if (typeof cl == "string") for (let c of cl.split(" ")) if (c) node.classList.toggle(c, force);
			}
		};
		byAnDr3W.DOMUtils.containsClass = function (eles, ...classes) {
			if (!eles || !classes) return;
			let all = classes.pop();
			if (typeof all != "boolean") {
				classes.push(all);
				all = true;
			}
			if (!classes.length) return;
			let contained = undefined;
			for (let ele of [eles].map(n => NodeList.prototype.isPrototypeOf(n) ? Array.from(n) : n).flat(10).filter(n => n)) {
				if (Node.prototype.isPrototypeOf(ele)) contains(ele);
				else if (NodeList.prototype.isPrototypeOf(ele)) for (let e of ele) contains(e);
				else if (typeof ele == "string") for (let c of ele.split(",")) if (c && (c = c.trim())) for (let n of document.querySelectorAll(c)) contains(n);
			}
			return contained;
			function contains(node) {
				if (node && node.classList) for (let cla of classes) if (typeof cla == "string") for (let c of cla.split(" ")) if (c) {
					if (contained === undefined) contained = all;
					if (all && !node.classList.contains(c)) contained = false;
					if (!all && node.classList.contains(c)) contained = true;
				}
			}
		};
		byAnDr3W.DOMUtils.replaceClass = function (eles, oldclass, newclass) {
			if (!eles || typeof oldclass != "string" || typeof newclass != "string") return;
			for (let ele of [eles].map(n => NodeList.prototype.isPrototypeOf(n) ? Array.from(n) : n).flat(10).filter(n => n)) {
				if (Node.prototype.isPrototypeOf(ele)) replace(ele);
				else if (NodeList.prototype.isPrototypeOf(ele)) for (let e of ele) replace(e);
				else if (typeof ele == "string") for (let e of ele.split(",")) if (e && (e = e.trim())) for (let n of document.querySelectorAll(e)) replace(n);
			}
			function replace(node) {
				if (node && node.tagName && node.className) node.className = node.className.replace(new RegExp(oldclass, "g"), newclass).trim();
			}
		};
		byAnDr3W.DOMUtils.formatClassName = function (...classes) {
			return byAnDr3W.ArrayUtils.removeCopies(classes.flat(10).filter(n => n).join(" ").split(" ")).join(" ").trim();
		};
		byAnDr3W.DOMUtils.removeClassFromDOM = function (...classes) {
			for (let c of classes.flat(10).filter(n => n)) if (typeof c == "string") for (let a of c.split(",")) if (a && (a = a.replace(/\.|\s/g, ""))) byAnDr3W.DOMUtils.removeClass(document.querySelectorAll("." + a), a);
		};
		byAnDr3W.DOMUtils.show = function (...eles) {
			byAnDr3W.DOMUtils.toggle(...eles, true);
		};
		byAnDr3W.DOMUtils.hide = function (...eles) {
			byAnDr3W.DOMUtils.toggle(...eles, false);
		};
		byAnDr3W.DOMUtils.toggle = function (...eles) {
			if (!eles) return;
			let force = eles.pop();
			if (typeof force != "boolean") {
				eles.push(force);
				force = undefined;
			}
			if (!eles.length) return;
			for (let ele of eles.flat(10).filter(n => n)) {
				if (Node.prototype.isPrototypeOf(ele)) toggle(ele);
				else if (NodeList.prototype.isPrototypeOf(ele)) for (let node of ele) toggle(node);
				else if (typeof ele == "string") for (let c of ele.split(",")) if (c && (c = c.trim())) for (let node of document.querySelectorAll(c)) toggle(node);
			}
			function toggle(node) {
				if (!node || !Node.prototype.isPrototypeOf(node)) return;
				let hide = force === undefined ? !byAnDr3W.DOMUtils.isHidden(node) : !force;
				if (hide) {
					let display = node.style.getPropertyValue("display");
					if (display && display != "none") node.byAnDr3WhideDisplayState = {
						display: display,
						important: (` ${node.style.cssText} `.split(` display: ${display}`)[1] || "").trim().indexOf("!important") == 0
					};
					node.style.setProperty("display", "none", "important");
				}
				else {
					if (node.byAnDr3WhideDisplayState) {
						node.style.setProperty("display", node.byAnDr3WhideDisplayState.display, node.byAnDr3WhideDisplayState.important ? "important" : "");
						delete node.byAnDr3WhideDisplayState;
					}
					else node.style.removeProperty("display");
				}
			}
		};
		byAnDr3W.DOMUtils.isHidden = function (node) {
			if (Node.prototype.isPrototypeOf(node) && node.nodeType != Node.TEXT_NODE) return getComputedStyle(node, null).getPropertyValue("display") == "none";
		};
		byAnDr3W.DOMUtils.remove = function (...eles) {
			for (let ele of eles.flat(10).filter(n => n)) {
				if (Node.prototype.isPrototypeOf(ele)) ele.remove();
				else if (NodeList.prototype.isPrototypeOf(ele)) {
					let nodes = Array.from(ele);
					while (nodes.length) nodes.shift().remove();
				}
				else if (typeof ele == "string") for (let c of ele.split(",")) if (c && (c = c.trim())) {
					let nodes = Array.from(document.querySelectorAll(c));
					while (nodes.length) nodes.shift().remove();
				}
			}
		};
		byAnDr3W.DOMUtils.create = function (html) {
			if (typeof html != "string" || !html.trim()) return null;
			let template = document.createElement("template");
			try {template.innerHTML = html.replace(/(?<!pre)>[\t\r\n]+<(?!pre)/g, "><");}
			catch (err) {template.innerHTML = html.replace(/>[\t\r\n]+<(?!pre)/g, "><");}
			if (template.content.childNodes.length == 1) return template.content.firstElementChild || template.content.firstChild;
			else {
				let wrapper = document.createElement("span");
				let nodes = Array.from(template.content.childNodes);
				while (nodes.length) wrapper.appendChild(nodes.shift());
				return wrapper;
			}
		};
		byAnDr3W.DOMUtils.getParent = function (listOrSelector, node) {
			let parent = null;
			if (Node.prototype.isPrototypeOf(node) && listOrSelector) {
				let list = NodeList.prototype.isPrototypeOf(listOrSelector) ? listOrSelector : typeof listOrSelector == "string" ? document.querySelectorAll(listOrSelector) : null;
				if (list) for (let listNode of list) if (listNode.contains(node)) {
					parent = listNode;
					break;
				}
			}
			return parent;
		};
		byAnDr3W.DOMUtils.setText = function (node, stringOrNode) {
			if (!node || !Node.prototype.isPrototypeOf(node)) return;
			let textnode = node.nodeType == Node.TEXT_NODE ? node : null;
			if (!textnode) for (let child of node.childNodes) if (child.nodeType == Node.TEXT_NODE || byAnDr3W.DOMUtils.containsClass(child, "byAnDr3W-textnode")) {
				textnode = child;
				break;
			}
			if (textnode) {
				if (Node.prototype.isPrototypeOf(stringOrNode) && stringOrNode.nodeType != Node.TEXT_NODE) {
					byAnDr3W.DOMUtils.addClass(stringOrNode, "byAnDr3W-textnode");
					node.replaceChild(stringOrNode, textnode);
				}
				else if (Node.prototype.isPrototypeOf(textnode) && textnode.nodeType != Node.TEXT_NODE) node.replaceChild(document.createTextNode(stringOrNode), textnode);
				else textnode.textContent = stringOrNode;
			}
			else node.appendChild(Node.prototype.isPrototypeOf(stringOrNode) ? stringOrNode : document.createTextNode(stringOrNode));
		};
		byAnDr3W.DOMUtils.getText = function (node) {
			if (!node || !Node.prototype.isPrototypeOf(node)) return;
			for (let child of node.childNodes) if (child.nodeType == Node.TEXT_NODE) return child.textContent;
		};
		byAnDr3W.DOMUtils.getRects = function (node) {
			let rects = {};
			if (Node.prototype.isPrototypeOf(node) && node.nodeType != Node.TEXT_NODE) {
				let hideNode = node;
				while (hideNode) {
					let hidden = byAnDr3W.DOMUtils.isHidden(hideNode);
					if (hidden) {
						byAnDr3W.DOMUtils.toggle(hideNode, true);
						hideNode.byAnDr3WgetRectsHidden = true;
					}
					hideNode = hideNode.parentElement;
				}
				rects = node.getBoundingClientRect();
				hideNode = node;
				while (hideNode) {
					if (hideNode.byAnDr3WgetRectsHidden) {
						byAnDr3W.DOMUtils.toggle(hideNode, false);
						delete hideNode.byAnDr3WgetRectsHidden;
					}
					hideNode = hideNode.parentElement;
				}
			}
			return rects;
		};
		byAnDr3W.DOMUtils.getHeight = function (node) {
			if (Node.prototype.isPrototypeOf(node) && node.nodeType != Node.TEXT_NODE) {
				let rects = byAnDr3W.DOMUtils.getRects(node);
				let style = getComputedStyle(node);
				return rects.height + parseInt(style.marginTop) + parseInt(style.marginBottom);
			}
			return 0;
		};
		byAnDr3W.DOMUtils.getInnerHeight = function (node) {
			if (Node.prototype.isPrototypeOf(node) && node.nodeType != Node.TEXT_NODE) {
				let rects = byAnDr3W.DOMUtils.getRects(node);
				let style = getComputedStyle(node);
				return rects.height - parseInt(style.paddingTop) - parseInt(style.paddingBottom);
			}
			return 0;
		};
		byAnDr3W.DOMUtils.getWidth = function (node) {
			if (Node.prototype.isPrototypeOf(node) && node.nodeType != Node.TEXT_NODE) {
				let rects = byAnDr3W.DOMUtils.getRects(node);
				let style = getComputedStyle(node);
				return rects.width + parseInt(style.marginLeft) + parseInt(style.marginRight);
			}
			return 0;
		};
		byAnDr3W.DOMUtils.getInnerWidth = function (node) {
			if (Node.prototype.isPrototypeOf(node) && node.nodeType != Node.TEXT_NODE) {
				let rects = byAnDr3W.DOMUtils.getRects(node);
				let style = getComputedStyle(node);
				return rects.width - parseInt(style.paddingLeft) - parseInt(style.paddingRight);
			}
			return 0;
		};
		byAnDr3W.DOMUtils.appendWebScript = function (url, container) {
			if (typeof url != "string") return;
			if (!container && !document.head.querySelector("bd-head bd-scripts")) document.head.appendChild(byAnDr3W.DOMUtils.create(`<bd-head><bd-scripts></bd-scripts></bd-head>`));
			container = container || document.head.querySelector("bd-head bd-scripts") || document.head;
			container = Node.prototype.isPrototypeOf(container) ? container : document.head;
			byAnDr3W.DOMUtils.removeWebScript(url, container);
			let script = document.createElement("script");
			script.src = url;
			container.appendChild(script);
		};
		byAnDr3W.DOMUtils.removeWebScript = function (url, container) {
			if (typeof url != "string") return;
			container = container || document.head.querySelector("bd-head bd-scripts") || document.head;
			container = Node.prototype.isPrototypeOf(container) ? container : document.head;
			byAnDr3W.DOMUtils.remove(container.querySelectorAll(`script[src="${url}"]`));
		};
		byAnDr3W.DOMUtils.appendWebStyle = function (url, container) {
			if (typeof url != "string") return;
			if (!container && !document.head.querySelector("bd-head bd-styles")) document.head.appendChild(byAnDr3W.DOMUtils.create(`<bd-head><bd-styles></bd-styles></bd-head>`));
			container = container || document.head.querySelector("bd-head bd-styles") || document.head;
			container = Node.prototype.isPrototypeOf(container) ? container : document.head;
			byAnDr3W.DOMUtils.removeWebStyle(url, container);
			container.appendChild(byAnDr3W.DOMUtils.create(`<link type="text/css" rel="stylesheet" href="${url}"></link>`));
		};
		byAnDr3W.DOMUtils.removeWebStyle = function (url, container) {
			if (typeof url != "string") return;
			container = container || document.head.querySelector("bd-head bd-styles") || document.head;
			container = Node.prototype.isPrototypeOf(container) ? container : document.head;
			byAnDr3W.DOMUtils.remove(container.querySelectorAll(`link[href="${url}"]`));
		};
		byAnDr3W.DOMUtils.appendLocalStyle = function (id, css, container) {
			if (typeof id != "string" || typeof css != "string") return;
			if (!container && !document.head.querySelector("bd-head bd-styles")) document.head.appendChild(byAnDr3W.DOMUtils.create(`<bd-head><bd-styles></bd-styles></bd-head>`));
			container = container || document.head.querySelector("bd-head bd-styles") || document.head;
			container = Node.prototype.isPrototypeOf(container) ? container : document.head;
			byAnDr3W.DOMUtils.removeLocalStyle(id, container);
			container.appendChild(byAnDr3W.DOMUtils.create(`<style id="${id}CSS">${css.replace(/\t|\r|\n/g,"")}</style>`));
		};
		byAnDr3W.DOMUtils.removeLocalStyle = function (id, container) {
			if (typeof id != "string") return;
			container = container || document.head.querySelector("bd-head bd-styles") || document.head;
			container = Node.prototype.isPrototypeOf(container) ? container : document.head;
			byAnDr3W.DOMUtils.remove(container.querySelectorAll(`style[id="${id}CSS"]`));
		};
		
		byAnDr3W.ModalUtils = {};
		byAnDr3W.ModalUtils.open = function (plugin, config) {
			if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ObjectUtils.is(config)) return;
			let modalInstance, modalProps, cancels = [], closeModal = _ => {
				if (byAnDr3W.ObjectUtils.is(modalProps) && typeof modalProps.onClose == "function") modalProps.onClose();
			};
			
			let titleChildren = [], headerChildren = [], contentChildren = [], footerChildren = [];
			
			if (typeof config.text == "string") {
				config.contentClassName = byAnDr3W.DOMUtils.formatClassName(config.contentClassName, byAnDr3W.disCN.modaltextcontent);
				contentChildren.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextElement, {
					children: config.text
				}));
			}
			
			if (config.children) {
				let tabBarItems = [], tabIns = {};
				for (let child of [config.children].flat(10).filter(n => n)) if (Internal.LibraryModules.React.isValidElement(child)) {
					if (child.type == Internal.LibraryComponents.ModalComponents.ModalTabContent) {
						if (!tabBarItems.length) child.props.open = true;
						else delete child.props.open;
						let ref = typeof child.ref == "function" ? child.ref : (_ => {});
						child.ref = instance => {
							ref(instance);
							if (instance) tabIns[child.props.tab] = instance;
						};
						tabBarItems.push({value: child.props.tab});
					}
					contentChildren.push(child);
				}
				if (tabBarItems.length) headerChildren.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
					className: byAnDr3W.disCN.tabbarcontainer,
					align: Internal.LibraryComponents.Flex.Align.CENTER,
					children: [
						byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TabBar, {
							className: byAnDr3W.disCN.tabbar,
							itemClassName: byAnDr3W.disCN.tabbaritem,
							type: Internal.LibraryComponents.TabBar.Types.TOP,
							items: tabBarItems,
							onItemSelect: value => {
								for (let key in tabIns) {
									if (key == value) tabIns[key].props.open = true;
									else delete tabIns[key].props.open;
								}
								byAnDr3W.ReactUtils.forceUpdate(byAnDr3W.ObjectUtils.toArray(tabIns));
							}
						}),
						config.tabBarChildren
					].flat(10).filter(n => n)
				}));
			}
			
			if (byAnDr3W.ArrayUtils.is(config.buttons)) for (let button of config.buttons) {
				let contents = typeof button.contents == "string" && button.contents;
				if (contents) {
					let color = typeof button.color == "string" && Internal.LibraryComponents.Button.Colors[button.color.toUpperCase()];
					let look = typeof button.look == "string" && Internal.LibraryComponents.Button.Looks[button.look.toUpperCase()];
					let click = typeof button.click == "function" ? button.click : (typeof button.onClick == "function" ? button.onClick : _ => {});
					
					if (button.cancel) cancels.push(click);
					
					footerChildren.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Button, byAnDr3W.ObjectUtils.exclude(Object.assign({}, button, {
						look: look || (color ? Internal.LibraryComponents.Button.Looks.FILLED : Internal.LibraryComponents.Button.Looks.LINK),
						color: color || Internal.LibraryComponents.Button.Colors.PRIMARY,
						onClick: _ => {
							if (button.close) closeModal();
							if (!(button.close && button.cancel)) click(modalInstance);
						},
						children: contents
					}), "click", "close", "cancel", "contents")));
				}
			}
			
			contentChildren = contentChildren.concat(config.contentChildren).filter(n => n && (typeof n == "string" || byAnDr3W.ReactUtils.isValidElement(n)));
			titleChildren = titleChildren.concat(config.titleChildren).filter(n => n && (typeof n == "string" || byAnDr3W.ReactUtils.isValidElement(n)));
			headerChildren = headerChildren.concat(config.headerChildren).filter(n => n && (typeof n == "string" || byAnDr3W.ReactUtils.isValidElement(n)));
			footerChildren = footerChildren.concat(config.footerChildren).filter(n => n && (typeof n == "string" || byAnDr3W.ReactUtils.isValidElement(n)));
			
			if (contentChildren.length) {
				if (typeof config.onOpen != "function") config.onOpen = _ => {};
				if (typeof config.onClose != "function") config.onClose = _ => {};
				
				let name = plugin.name || (typeof plugin.getName == "function" ? plugin.getName() : null);
				name = typeof name == "string" ? name : null;
				let oldTransitionState = 0;
				Internal.LibraryModules.ModalUtils.openModal(props => {
					modalProps = props;
					return byAnDr3W.ReactUtils.createElement(class byAnDr3W_Modal extends Internal.LibraryModules.React.Component {
						render() {
							return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.ModalComponents.ModalRoot, {
								className: byAnDr3W.DOMUtils.formatClassName(name && `${name}-modal`, byAnDr3W.disCN.modalwrapper, config.className),
								size: typeof config.size == "string" && Internal.LibraryComponents.ModalComponents.ModalSize[config.size.toUpperCase()] || Internal.LibraryComponents.ModalComponents.ModalSize.SMALL,
								transitionState: props.transitionState,
								children: [
									byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.ModalComponents.ModalHeader, {
										className: byAnDr3W.DOMUtils.formatClassName(config.headerClassName, config.shade && byAnDr3W.disCN.modalheadershade, headerChildren.length && byAnDr3W.disCN.modalheaderhassibling),
										separator: config.headerSeparator || false,
										children: [
											byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex.Child, {
												children: [
													byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormTitle, {
														tag: Internal.LibraryComponents.FormComponents.FormTitle.Tags.H4,
														children: config.header
													}),
													byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextElement, {
														size: Internal.LibraryComponents.TextElement.Sizes.SIZE_12,
														children: typeof config.subHeader == "string" || byAnDr3W.ReactUtils.isValidElement(config.subHeader) ? config.subHeader : (name || "")
													})
												]
											}),
											titleChildren,
											byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.ModalComponents.ModalCloseButton, {
												onClick: closeModal
											})
										].flat(10).filter(n => n)
									}),
									headerChildren.length ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
										grow: 0,
										shrink: 0,
										children: headerChildren
									}) : null,
									byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.ModalComponents.ModalContent, {
										className: config.contentClassName,
										scroller: config.scroller,
										direction: config.direction,
										content: config.content,
										children: contentChildren
									}),
									footerChildren.length ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.ModalComponents.ModalFooter, {
										className: config.footerClassName,
										direction: config.footerDirection,
										children: footerChildren
									}) : null
								]
							});
						}
						componentDidMount() {
							modalInstance = this;
							if (props.transitionState == 1 && props.transitionState > oldTransitionState) config.onOpen(modalInstance);
							oldTransitionState = props.transitionState;
						}
						componentWillUnmount() {
							if (props.transitionState == 3) {
								for (let cancel of cancels) cancel(modalInstance);
								config.onClose(modalInstance);
							}
						}
					}, props, true);
				}, {
					onCloseRequest: closeModal
				});
			}
		};
		byAnDr3W.ModalUtils.confirm = function (plugin, text, callback) {
			if (!byAnDr3W.ObjectUtils.is(plugin) || typeof text != "string") return;
			byAnDr3W.ModalUtils.open(plugin, {
				text: text,
				header: byAnDr3W.LanguageUtils.LibraryStrings.confirm,
				className: byAnDr3W.disCN.modalconfirmmodal,
				scroller: false,
				buttons: [
					{contents: byAnDr3W.LanguageUtils.LanguageStrings.OKAY, close: true, color: "RED", onClick: callback},
					{contents: byAnDr3W.LanguageUtils.LanguageStrings.CANCEL, close: true}
				]
			});
		};
	
		const RealMenuItems = byAnDr3W.ModuleUtils.findByProperties("MenuItem", "MenuGroup");
		byAnDr3W.ContextMenuUtils = {};
		byAnDr3W.ContextMenuUtils.open = function (plugin, e, children) {
			Internal.LibraryModules.ContextMenuUtils.openContextMenu(e, _ => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Menu, {
				navId: "byAnDr3W-context",
				onClose: Internal.LibraryModules.ContextMenuUtils.closeContextMenu,
				children: children
			}, true));
		};
		byAnDr3W.ContextMenuUtils.close = function (nodeOrInstance) {
			if (!byAnDr3W.ObjectUtils.is(nodeOrInstance)) return;
			let instance = byAnDr3W.ReactUtils.findOwner(nodeOrInstance, {props: "closeContextMenu", up: true});
			if (byAnDr3W.ObjectUtils.is(instance) && instance.props && typeof instance.props.closeContextMenu == "function") instance.props.closeContextMenu();
			else Internal.LibraryModules.ContextMenuUtils.closeContextMenu();
		};
		byAnDr3W.ContextMenuUtils.createItem = function (component, props = {}) {
			if (!component) return null;
			else {
				if (props.render || props.persisting || byAnDr3W.ObjectUtils.is(props.popoutProps) || (typeof props.color == "string" && !DiscordClasses[`menu${props.color.toLowerCase()}`])) component = Internal.MenuItem;
				if (byAnDr3W.ObjectUtils.toArray(RealMenuItems).some(c => c == component)) return byAnDr3W.ReactUtils.createElement(component, props);
				else return byAnDr3W.ReactUtils.createElement(RealMenuItems.MenuItem, {
					id: props.id,
					disabled: props.disabled,
					customItem: true,
					render: menuItemProps => {
						if (!props.state) props.state = byAnDr3W.ObjectUtils.extract(props, "checked", "value");
						return byAnDr3W.ReactUtils.createElement(Internal.CustomMenuItemWrapper, {
							disabled: props.disabled,
							childProps: Object.assign({}, props, menuItemProps, {color: props.color}),
							children: component
						}, true);
					}
				});
			}
		};
		byAnDr3W.ContextMenuUtils.createItemId = function (...strings) {
			return strings.map(s => typeof s == "number" ? s.toString() : s).filter(s => typeof s == "string").map(s => s.toLowerCase().replace(/\s/, "-")).join("-");
		};
		byAnDr3W.ContextMenuUtils.findItem = function (returnvalue, config) {
			if (!returnvalue || !byAnDr3W.ObjectUtils.is(config) || !config.label && !config.id) return [null, -1];
			config.label = config.label && [config.label].flat().filter(n => n);
			config.id = config.id && [config.id].flat().filter(n => n);
			let contextMenu = byAnDr3W.ReactUtils.findChild(returnvalue, {props: "navId"}) || (byAnDr3W.ArrayUtils.is(returnvalue) ? {props: {children: returnvalue}} : null);
			if (contextMenu) {
				for (let i in contextMenu.props.children) {
					if (contextMenu.props.children[i] && contextMenu.props.children[i].type == RealMenuItems.MenuGroup) {
						if (byAnDr3W.ArrayUtils.is(contextMenu.props.children[i].props.children)) {
							for (let j in contextMenu.props.children[i].props.children) if (check(contextMenu.props.children[i].props.children[j])) {
								if (config.group) return [contextMenu.props.children, parseInt(i)];
								else return [contextMenu.props.children[i].props.children, parseInt(j)];
							}
						}
						else if (contextMenu.props.children[i] && contextMenu.props.children[i].props) {
							if (check(contextMenu.props.children[i].props.children)) {
								if (config.group) return [contextMenu.props.children, parseInt(i)];
								else {
									contextMenu.props.children[i].props.children = [contextMenu.props.children[i].props.children];
									return [contextMenu.props.children[i].props.children, 0];
								}
							}
							else if (contextMenu.props.children[i].props.children && contextMenu.props.children[i].props.children.props && byAnDr3W.ArrayUtils.is(contextMenu.props.children[i].props.children.props.children)) {
								for (let j in contextMenu.props.children[i].props.children.props.children) if (check(contextMenu.props.children[i].props.children.props.children[j])) {
									if (config.group) return [contextMenu.props.children, parseInt(i)];
									else return [contextMenu.props.children[i].props.children.props.children, parseInt(j)];
								}
							}
						}
					}
					else if (check(contextMenu.props.children[i])) return [contextMenu.props.children, parseInt(i)];
				}
				return [contextMenu.props.children, -1];
			}
			return [null, -1];
			function check (child) {
				if (!child) return false;
				let props = child.stateNode ? child.stateNode.props : child.props;
				if (!props) return false;
				return config.id && config.id.some(key => props.id == key) || config.label && config.label.some(key => props.label == key);
			}
		};

		byAnDr3W.StringUtils = {};
		byAnDr3W.StringUtils.htmlEscape = function (string) {
			let ele = document.createElement("div");
			ele.innerText = string;
			return ele.innerHTML;
		};
		byAnDr3W.StringUtils.regEscape = function (string) {
			return typeof string == "string" && string.replace(/([\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}])/g, "\\$1");
		};
		byAnDr3W.StringUtils.insertNRST = function (string) {
			return typeof string == "string" && string.replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\s/g, " ");
		};
		byAnDr3W.StringUtils.highlight = function (string, searchstring, prefix = `<span class="${byAnDr3W.disCN.highlight}">`, suffix = `</span>`) {
			if (typeof string != "string" || !searchstring || searchstring.length < 1) return string;
			let offset = 0, original = string;
			byAnDr3W.ArrayUtils.getAllIndexes(string.toUpperCase(), searchstring.toUpperCase()).forEach(index => {
				let d1 = offset * (prefix.length + suffix.length);
				index = index + d1;
				let d2 = index + searchstring.length;
				let d3 = [-1].concat(byAnDr3W.ArrayUtils.getAllIndexes(string.substring(0, index), "<"));
				let d4 = [-1].concat(byAnDr3W.ArrayUtils.getAllIndexes(string.substring(0, index), ">"));
				if (d3[d3.length - 1] > d4[d4.length - 1]) return;
				string = string.substring(0, index) + prefix + string.substring(index, d2) + suffix + string.substring(d2);
				offset++;
			});
			return string || original;
		};
		byAnDr3W.StringUtils.findMatchCaseless = function (match, string, any) {
			if (typeof match != "string" || typeof string != "string" || !match || !string) return "";
			match = byAnDr3W.StringUtils.regEscape(match);
			let exec = (new RegExp(any ? `([\\n\\r\\s]+${match})|(^${match})` : `([\\n\\r\\s]+${match}[\\n\\r\\s]+)|([\\n\\r\\s]+${match}$)|(^${match}[\\n\\r\\s]+)|(^${match}$)`, "i")).exec(string);
			return exec && typeof exec[0] == "string" && exec[0].replace(/[\n\r\s]/g, "") || "";
		};
		byAnDr3W.StringUtils.equalCase = function (match, string) {
			if (typeof match != "string" || typeof string != "string") return "";
			let first = match.charAt(0);
			return first != first.toUpperCase() ? (string.charAt(0).toLowerCase() + string.slice(1)) : first != first.toLowerCase() ? (string.charAt(0).toUpperCase() + string.slice(1)) : string;
		};
		byAnDr3W.StringUtils.extractSelection = function (original, selection) {
			if (typeof original != "string") return "";
			if (typeof selection != "string") return original;
			let s = [], f = [], wrong = 0, canceled = false, done = false;
			for (let i of byAnDr3W.ArrayUtils.getAllIndexes(original, selection[0])) if (!done) {
				while (i <= original.length && !done) {
					let subSelection = selection.slice(s.filter(n => n != undefined).length);
					if (!subSelection && s.length - 20 <= selection.length) done = true;
					else for (let j in subSelection) if (!done && !canceled) {
						if (original[i] == subSelection[j]) {
							s[i] = subSelection[j];
							f[i] = subSelection[j];
							wrong = 0;
							if (i == original.length) done = true;
						}
						else {
							s[i] = null;
							f[i] = original[i];
							wrong++;
							if (wrong > 4) {
								s = [], f = [], wrong = 0, canceled = true;
								break;
							}
						}
						break;
					}
					canceled = false;
					i++;
				}
			}
			if (s.filter(n => n).length) {
				let reverseS = [].concat(s).reverse(), i = 0, j = 0;
				for (let k in s) {
					if (s[k] == null) i = parseInt(k) + 1;
					else break;
				}
				for (let k in reverseS) {
					if (reverseS[k] == null) j = parseInt(k) + 1;
					else break;
				}
				return f.slice(i, f.length - j).join("");
			}
			else return original;
		};
		
		byAnDr3W.SlateUtils = {};
		byAnDr3W.SlateUtils.isRichValue = function (richValue) {
			return richValue && typeof richValue == "object" && byAnDr3W.SlateUtils.toRichValue("").constructor.prototype.isPrototypeOf(richValue);
		};
		byAnDr3W.SlateUtils.toTextValue = function (richValue) {
			return byAnDr3W.SlateUtils.isRichValue(richValue) ? Internal.LibraryModules.SlateTextUtils.toTextValue(richValue) : "";
		};
		byAnDr3W.SlateUtils.toRichValue = function (string) {
			return typeof string == "string" ? Internal.LibraryModules.SlateRichUtils.toRichValue(string) : null;
		};
		
		byAnDr3W.NumberUtils = {};
		byAnDr3W.NumberUtils.formatBytes = function (bytes, sigDigits) {
			bytes = parseInt(bytes);
			if (isNaN(bytes) || bytes < 0) return "0 Bytes";
			if (bytes == 1) return "1 Byte";
			let size = Math.floor(Math.log(bytes) / Math.log(1024));
			return parseFloat((bytes / Math.pow(1024, size)).toFixed(sigDigits < 1 ? 0 : sigDigits > 20 ? 20 : sigDigits || 2)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][size];
		};
		byAnDr3W.NumberUtils.mapRange = function (from, to, value) {
			if (parseFloat(value) < parseFloat(from[0])) return parseFloat(to[0]);
			else if (parseFloat(value) > parseFloat(from[1])) return parseFloat(to[1]);
			else return parseFloat(to[0]) + (parseFloat(value) - parseFloat(from[0])) * (parseFloat(to[1]) - parseFloat(to[0])) / (parseFloat(from[1]) - parseFloat(from[0]));
		};
		byAnDr3W.NumberUtils.generateId = function (array) {
			array = byAnDr3W.ArrayUtils.is(array) ? array : [];
			let id = Math.floor(Math.random() * 10000000000000000);
			if (array.includes(id)) return byAnDr3W.NumberUtils.generateId(array);
			else {
				array.push(id);
				return id;
			}
		};
		byAnDr3W.NumberUtils.compareVersions = function (newV, oldV) {
			if (!newV || !oldV) return true;
			newV = newV.toString().replace(/["'`]/g, "").split(/,|\./g).map(n => parseInt(n)).filter(n => (n || n == 0) && !isNaN(n));
			oldV = oldV.toString().replace(/["'`]/g, "").split(/,|\./g).map(n => parseInt(n)).filter(n => (n || n == 0) && !isNaN(n));
			let length = Math.max(newV.length, oldV.length);
			if (!length) return true;
			if (newV.length > oldV.length) {
				let tempArray = new Array(newV.length - oldV.length);
				for (let i = 0; i < tempArray.length; i++) tempArray[i] = 0;
				oldV = tempArray.concat(oldV);
			}
			else if (newV.length < oldV.length) {
				let tempArray = new Array(oldV.length - newV.length);
				for (let i = 0; i < tempArray.length; i++) tempArray[i] = 0;
				newV = tempArray.concat(newV);
			}
			for (let i = 0; i < length; i++) for (let iOutdated = false, j = 0; j <= i; j++) {
				if (j == i && newV[j] < oldV[j]) return false;
				if (j < i) iOutdated = newV[j] == oldV[j];
				if ((j == 0 || iOutdated) && j == i && newV[j] > oldV[j]) return true;
			}
			return false;
		};
		byAnDr3W.NumberUtils.getVersionDifference = function (newV, oldV) {
			if (!newV || !oldV) return false;
			newV = newV.toString().replace(/["'`]/g, "").split(/,|\./g).map(n => parseInt(n)).filter(n => (n || n == 0) && !isNaN(n));
			oldV = oldV.toString().replace(/["'`]/g, "").split(/,|\./g).map(n => parseInt(n)).filter(n => (n || n == 0) && !isNaN(n));
			let length = Math.max(newV.length, oldV.length);
			if (!length) return false;
			if (newV.length > oldV.length) {
				let tempArray = new Array(newV.length - oldV.length);
				for (let i = 0; i < tempArray.length; i++) tempArray[i] = 0;
				oldV = tempArray.concat(oldV);
			}
			else if (newV.length < oldV.length) {
				let tempArray = new Array(oldV.length - newV.length);
				for (let i = 0; i < tempArray.length; i++) tempArray[i] = 0;
				newV = tempArray.concat(newV);
			}
			let oldValue = 0, newValue = 0;
			for (let i in oldV.reverse()) oldValue += (oldV[i] * (10 ** i));
			for (let i in newV.reverse()) newValue += (newV[i] * (10 ** i));
			return (newValue - oldValue) / (10 ** (length-1));
		};

		byAnDr3W.DiscordUtils = {};
		byAnDr3W.DiscordUtils.openLink = function (url, config = {}) {
			if ((config.inBuilt || config.inBuilt === undefined && Internal.settings.general.useChromium) && Internal.LibraryRequires.electron && Internal.LibraryRequires.electron.remote) {
				let browserWindow = new Internal.LibraryRequires.electron.remote.BrowserWindow({
					frame: true,
					resizeable: true,
					show: true,
					darkTheme: byAnDr3W.DiscordUtils.getTheme() == byAnDr3W.disCN.themedark,
					webPreferences: {
						nodeIntegration: false,
						nodeIntegrationInWorker: false
					}
				});
				browserWindow.setMenu(null);
				browserWindow.loadURL(url);
				if (config.minimized) browserWindow.minimize(null);
			}
			else window.open(url, "_blank");
		};
		window.DiscordNative && window.DiscordNative.app && window.DiscordNative.app.getPath("appData").then(path => {byAnDr3W.DiscordUtils.getFolder.base = path;});
		byAnDr3W.DiscordUtils.getFolder = function () {
			if (!byAnDr3W.DiscordUtils.getFolder.base) return "";
			else if (byAnDr3W.DiscordUtils.getFolder.folder) return byAnDr3W.DiscordUtils.getFolder.folder;
			else {
				let folder;
				try {
					let build = byAnDr3W.DiscordUtils.getBuild();
					build = "discord" + (build == "stable" ? "" : build);
					folder = Internal.LibraryRequires.path.resolve(byAnDr3W.DiscordUtils.getFolder.base, build, byAnDr3W.DiscordUtils.getVersion());
				} 
				catch (err) {folder = byAnDr3W.DiscordUtils.getFolder.base;}
				return byAnDr3W.DiscordUtils.getFolder.folder = folder;
			}
		};
		byAnDr3W.DiscordUtils.getBuild = function () {
			if (byAnDr3W.DiscordUtils.getBuild.build) return byAnDr3W.DiscordUtils.getBuild.build;
			else {
				let build;
				try {build = window.DiscordNative.app.getReleaseChannel();} 
				catch (err) {
					let version = byAnDr3W.DiscordUtils.getVersion();
					if (version) {
						version = version.split(".");
						if (version.length == 3 && !isNaN(version = parseInt(version[2]))) build = version > 300 ? "stable" : version > 200 ? "canary" : "ptb";
						else build = "stable";
					}
					else build = "stable";
				}
				return byAnDr3W.DiscordUtils.getBuild.build = build;
			}
		};
		byAnDr3W.DiscordUtils.getVersion = function () {
			if (byAnDr3W.DiscordUtils.getVersion.version) return byAnDr3W.DiscordUtils.getVersion.version;
			else {
				let version;
				try {version = window.DiscordNative.app.getVersion();}
				catch (err) {version = "999.999.9999";}
				return byAnDr3W.DiscordUtils.getVersion.version = version;
			}
		};
		byAnDr3W.DiscordUtils.isDevModeEnabled = function () {
			return byAnDr3W.DiscordUtils.getSettings("developerMode");
		};
		byAnDr3W.DiscordUtils.getExperiment = function (id) {
			if (!id) return null;
			const module = byAnDr3W.ModuleUtils.find(m => m.definition && m.definition.defaultConfig && m.definition.defaultConfig[id] != null && typeof m.getCurrentConfig == "function" && m);
			return module && (module.getCurrentConfig({}) || {})[id];
		};
		byAnDr3W.DiscordUtils.getTheme = function () {
			return byAnDr3W.DiscordUtils.getSettings("theme") != "dark" ? byAnDr3W.disCN.themelight : byAnDr3W.disCN.themedark;
		};
		byAnDr3W.DiscordUtils.getMode = function () {
			return byAnDr3W.DiscordUtils.getSettings("messageDisplayCompact") ? "compact" : "cozy";
		};
		byAnDr3W.DiscordUtils.getSettings = function (key) {
			if (!key) return null;
			else if (Internal.LibraryModules.SettingsUtils && (Internal.LibraryModules.SettingsUtils[key] || Internal.LibraryModules.SettingsUtils[key + "DoNotUseYet"])) return (Internal.LibraryModules.SettingsUtils[key] || Internal.LibraryModules.SettingsUtils[key + "DoNotUseYet"]).getSetting();
			else {
				const value = Internal.LibraryModules.SettingsStore.getAllSettings()[key.slice(0, 1).toLowerCase() + key.slice(1)];
				return value != undefined ? value: null;
			}
		};
		byAnDr3W.DiscordUtils.setSettings = function (key, value) {
			if (!key) return;
			else if (Internal.LibraryModules.SettingsUtils && (Internal.LibraryModules.SettingsUtils[key] || Internal.LibraryModules.SettingsUtils[key + "DoNotUseYet"])) (Internal.LibraryModules.SettingsUtils[key] || Internal.LibraryModules.SettingsUtils[key + "DoNotUseYet"]).updateSetting(value);
			else Internal.LibraryModules.SettingsUtilsOld.updateRemoteSettings({[key.slice(0, 1).toLowerCase() + key.slice(1)]: value});
		};
		byAnDr3W.DiscordUtils.getZoomFactor = function () {
			let aRects = byAnDr3W.DOMUtils.getRects(document.querySelector(byAnDr3W.dotCN.appmount));
			let widthZoom = Math.round(100 * window.outerWidth / aRects.width);
			let heightZoom = Math.round(100 * window.outerHeight / aRects.height);
			return widthZoom < heightZoom ? widthZoom : heightZoom;
		};
		byAnDr3W.DiscordUtils.getFontScale = function () {
			return parseInt(document.firstElementChild.style.fontSize.replace("%", ""));
		};
		byAnDr3W.DiscordUtils.shake = function () {
			byAnDr3W.ReactUtils.findOwner(document.querySelector(byAnDr3W.dotCN.appcontainer), {name: "Shakeable", unlimited: true, up: true}).shake();
		};
		byAnDr3W.DiscordUtils.rerenderAll = function (instant) {
			byAnDr3W.TimeUtils.clear(byAnDr3W.DiscordUtils.rerenderAll.timeout);
			byAnDr3W.DiscordUtils.rerenderAll.timeout = byAnDr3W.TimeUtils.timeout(_ => {
				let ShakeableIns = byAnDr3W.ReactUtils.findOwner(document.querySelector(byAnDr3W.dotCN.appcontainer), {name: "Shakeable", unlimited: true, up: true});
				let ShakeablePrototype = byAnDr3W.ObjectUtils.get(ShakeableIns, `${byAnDr3W.ReactUtils.instanceKey}.type.prototype`);
				if (ShakeableIns && ShakeablePrototype) {
					byAnDr3W.PatchUtils.patch({name: "byAnDr3W DiscordUtils"}, ShakeablePrototype, "render", {after: e => {
						e.returnValue.props.children = typeof e.returnValue.props.children == "function" ? (_ => {return null;}) : [];
						byAnDr3W.ReactUtils.forceUpdate(ShakeableIns);
					}}, {once: true});
					byAnDr3W.ReactUtils.forceUpdate(ShakeableIns);
				}
			}, instant ? 0 : 1000);
		};

		byAnDr3W.WindowUtils = {};
		byAnDr3W.WindowUtils.open = function (plugin, url, config = {}) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !url || !Internal.LibraryRequires.electron || !Internal.LibraryRequires.electron.remote) return;
			if (!byAnDr3W.ArrayUtils.is(plugin.browserWindows)) plugin.browserWindows = [];
			config = Object.assign({
				show: false,
				webPreferences: {
					nodeIntegration: true,
					nodeIntegrationInWorker: true
				}
			}, config);
			let browserWindow = new Internal.LibraryRequires.electron.remote.BrowserWindow(byAnDr3W.ObjectUtils.exclude(config, "showOnReady", "onLoad"));
			
			if (!config.show && config.showOnReady) browserWindow.once("ready-to-show", browserWindow.show);
			if (config.devTools) browserWindow.openDevTools();
			if (typeof config.onLoad == "function") browserWindow.webContents.on("did-finish-load", (...args) => {config.onLoad(...args);});
			if (typeof config.onClose == "function") browserWindow.once("closed", (...args) => {config.onClose(...args);});
			
			if (typeof browserWindow.removeMenu == "function") browserWindow.removeMenu();
			else browserWindow.setMenu(null);
			browserWindow.loadURL(url);
			browserWindow.executeJavaScriptSafe = js => {if (!browserWindow.isDestroyed()) browserWindow.webContents.executeJavaScript(`(_ => {${js}})();`);};
			plugin.browserWindows.push(browserWindow);
			return browserWindow;
		};
		byAnDr3W.WindowUtils.close = function (browserWindow) {
			if (byAnDr3W.ObjectUtils.is(browserWindow) && !browserWindow.isDestroyed() && browserWindow.isClosable()) browserWindow.close();
		};
		byAnDr3W.WindowUtils.closeAll = function (plugin) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ArrayUtils.is(plugin.browserWindows)) return;
			while (plugin.browserWindows.length) byAnDr3W.WindowUtils.close(plugin.browserWindows.pop());
		};
		byAnDr3W.WindowUtils.addListener = function (plugin, actions, callback) {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !actions || typeof callback != "function") return;
			byAnDr3W.WindowUtils.removeListener(plugin, actions);
			for (let action of actions.split(" ")) {
				action = action.split(".");
				let eventName = action.shift();
				if (!eventName) return;
				let namespace = (action.join(".") || "") + plugin.name;
				if (!byAnDr3W.ArrayUtils.is(plugin.ipcListeners)) plugin.ipcListeners = [];

				plugin.ipcListeners.push({eventName, namespace, callback});
				Internal.LibraryRequires.electron.ipcRenderer.on(eventName, callback);
			}
		};
		byAnDr3W.WindowUtils.removeListener = function (plugin, actions = "") {
			plugin = plugin == byAnDr3W && Internal || plugin;
			if (!byAnDr3W.ObjectUtils.is(plugin) || !byAnDr3W.ArrayUtils.is(plugin.ipcListeners)) return;
			if (actions) {
				for (let action of actions.split(" ")) {
					action = action.split(".");
					let eventName = action.shift();
					let namespace = (action.join(".") || "") + plugin.name;
					for (let listener of plugin.ipcListeners) {
						let removedListeners = [];
						if (listener.eventName == eventName && listener.namespace == namespace) {
							Internal.LibraryRequires.electron.ipcRenderer.off(listener.eventName, listener.callback);
							removedListeners.push(listener);
						}
						if (removedListeners.length) plugin.ipcListeners = plugin.ipcListeners.filter(listener => {return removedListeners.indexOf(listener) < 0;});
					}
				}
			}
			else {
				for (let listener of plugin.ipcListeners) Internal.LibraryRequires.electron.ipcRenderer.off(listener.eventName, listener.callback);
				plugin.ipcListeners = [];
			}
		};
		
		const DiscordClassModules = Object.assign({}, InternalData.CustomClassModules);
		Internal.DiscordClassModules = new Proxy(DiscordClassModules, {
			get: function (_, item) {
				if (DiscordClassModules[item]) return DiscordClassModules[item];
				if (!InternalData.DiscordClassModules[item]) return;
				DiscordClassModules[item] = byAnDr3W.ModuleUtils.findStringObject(InternalData.DiscordClassModules[item].props, Object.assign({}, InternalData.DiscordClassModules[item]));
				return DiscordClassModules[item] ? DiscordClassModules[item] : undefined;
			}
		});
		byAnDr3W.DiscordClassModules = Internal.DiscordClassModules;
		
		const DiscordClasses = Object.assign({}, InternalData.DiscordClasses);
		byAnDr3W.DiscordClasses = Object.assign({}, DiscordClasses);
		Internal.getDiscordClass = function (item, selector) {
			let className, fallbackClassName;
			className = fallbackClassName = Internal.DiscordClassModules.byAnDr3W.byAnDr3Wundefined + "-" + Internal.generateClassId();
			if (DiscordClasses[item] === undefined) {
				byAnDr3W.LogUtils.warn([item, "not found in DiscordClasses"]);
				return className;
			} 
			else if (!byAnDr3W.ArrayUtils.is(DiscordClasses[item]) || DiscordClasses[item].length != 2) {
				byAnDr3W.LogUtils.warn([item, "is not an Array of Length 2 in DiscordClasses"]);
				return className;
			}
			else if (Internal.DiscordClassModules[DiscordClasses[item][0]] === undefined) {
				byAnDr3W.LogUtils.warn([DiscordClasses[item][0], "not found in DiscordClassModules"]);
				return className;
			}
			else if ([DiscordClasses[item][1]].flat().every(prop => Internal.DiscordClassModules[DiscordClasses[item][0]][prop] === undefined)) {
				byAnDr3W.LogUtils.warn([DiscordClasses[item][1], "not found in", DiscordClasses[item][0], "in DiscordClassModules"]);
				return className;
			}
			else {
				for (let prop of [DiscordClasses[item][1]].flat()) {
					className = Internal.DiscordClassModules[DiscordClasses[item][0]][prop];
					if (className) break;
					else className = fallbackClassName;
				}
				if (selector) {
					className = className.split(" ").filter(n => n.indexOf("da-") != 0).join(selector ? "." : " ");
					className = className || fallbackClassName;
				}
				return byAnDr3W.ArrayUtils.removeCopies(className.split(" ")).join(" ") || fallbackClassName;
			}
		};
		const generationChars = "0123456789ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split("");
		Internal.generateClassId = function () {
			let id = "";
			while (id.length < 6) id += generationChars[Math.floor(Math.random() * generationChars.length)];
			return id;
		};
		byAnDr3W.disCN = new Proxy(DiscordClasses, {
			get: function (list, item) {
				return Internal.getDiscordClass(item, false).replace("#", "");
			}
		});
		byAnDr3W.disCNS = new Proxy(DiscordClasses, {
			get: function (list, item) {
				return Internal.getDiscordClass(item, false).replace("#", "") + " ";
			}
		});
		byAnDr3W.disCNC = new Proxy(DiscordClasses, {
			get: function (list, item) {
				return Internal.getDiscordClass(item, false).replace("#", "") + ",";
			}
		});
		byAnDr3W.dotCN = new Proxy(DiscordClasses, {
			get: function (list, item) {
				let className = Internal.getDiscordClass(item, true);
				return (className.indexOf("#") == 0 ? "" : ".") + className;
			}
		});
		byAnDr3W.dotCNS = new Proxy(DiscordClasses, {
			get: function (list, item) {
				let className = Internal.getDiscordClass(item, true);
				return (className.indexOf("#") == 0 ? "" : ".") + className + " ";
			}
		});
		byAnDr3W.dotCNC = new Proxy(DiscordClasses, {
			get: function (list, item) {
				let className = Internal.getDiscordClass(item, true);
				return (className.indexOf("#") == 0 ? "" : ".") + className + ",";
			}
		});
		byAnDr3W.notCN = new Proxy(DiscordClasses, {
			get: function (list, item) {
				return `:not(.${Internal.getDiscordClass(item, true).split(".")[0]})`;
			}
		});
		byAnDr3W.notCNS = new Proxy(DiscordClasses, {
			get: function (list, item) {
				return `:not(.${Internal.getDiscordClass(item, true).split(".")[0]}) `;
			}
		});
		byAnDr3W.notCNC = new Proxy(DiscordClasses, {
			get: function (list, item) {
				return `:not(.${Internal.getDiscordClass(item, true).split(".")[0]}),`;
			}
		});
	
		const LanguageStrings = Internal.LibraryModules.LanguageStore && Internal.LibraryModules.LanguageStore._proxyContext ? Object.assign({}, Internal.LibraryModules.LanguageStore._proxyContext.defaultMessages) : {};
		const LibraryStrings = Object.assign({}, InternalData.LibraryStrings);
		byAnDr3W.LanguageUtils = {};
		byAnDr3W.LanguageUtils.languages = Object.assign({}, InternalData.Languages);
		byAnDr3W.LanguageUtils.getLanguage = function () {
			let lang = Internal.LibraryModules.LanguageStore.chosenLocale || Internal.LibraryModules.LanguageStore._chosenLocale || byAnDr3W.DiscordUtils.getSettings("locale") || "en";
			if (lang == "en-GB" || lang == "en-US") lang = "en";
			let langIds = lang.split("-");
			let langId = langIds[0];
			let langId2 = langIds[1] || "";
			lang = langId2 && langId.toUpperCase() !== langId2.toUpperCase() ? langId + "-" + langId2 : langId;
			return byAnDr3W.LanguageUtils.languages[lang] || byAnDr3W.LanguageUtils.languages[langId] || byAnDr3W.LanguageUtils.languages.en;
		};
		byAnDr3W.LanguageUtils.getName = function (language) {
			if (!language || typeof language.name != "string") return "";
			if (language.name.startsWith("Discord")) return language.name.slice(0, -1) + (language.ownlang && (byAnDr3W.LanguageUtils.languages[language.id] || {}).name != language.ownlang ? ` / ${language.ownlang}` : "") + ")";
			else return language.name + (language.ownlang && language.name != language.ownlang ? ` / ${language.ownlang}` : "");
		};
		byAnDr3W.LanguageUtils.LanguageStrings = new Proxy(LanguageStrings, {
			get: function (list, item) {
				let stringObj = Internal.LibraryModules.LanguageStore.Messages[item];
				if (!stringObj) byAnDr3W.LogUtils.warn([item, "not found in byAnDr3W.LanguageUtils.LanguageStrings"]);
				else {
					if (stringObj && typeof stringObj == "object" && typeof stringObj.format == "function") return byAnDr3W.LanguageUtils.LanguageStringsFormat(item);
					else return stringObj;
				}
				return "";
			}
		});
		byAnDr3W.LanguageUtils.LanguageStringsCheck = new Proxy(LanguageStrings, {
			get: function (list, item) {
				return !!Internal.LibraryModules.LanguageStore.Messages[item];
			}
		});
		let parseLanguageStringObj = obj => {
			let string = "";
			if (typeof obj == "string") string += obj;
			else if (byAnDr3W.ObjectUtils.is(obj)) {
				if (obj.content) string += parseLanguageStringObj(obj.content);
				else if (obj.children) string += parseLanguageStringObj(obj.children);
				else if (obj.props) string += parseLanguageStringObj(obj.props);
			}
			else if (byAnDr3W.ArrayUtils.is(obj)) for (let ele of obj) string += parseLanguageStringObj(ele);
			return string;
		};
		byAnDr3W.LanguageUtils.LanguageStringsFormat = function (item, ...values) {
			if (item) {
				let stringObj = Internal.LibraryModules.LanguageStore.Messages[item];
				if (stringObj && typeof stringObj == "object" && typeof stringObj.format == "function") {
					let i = 0, returnvalue, formatVars = {};
					while (!returnvalue && i < 10) {
						i++;
						try {returnvalue = stringObj.format(formatVars, false);}
						catch (err) {
							returnvalue = null;
							let value = values.shift();
							formatVars[err.toString().split("for: ")[1]] = value != null ? (value === 0 ? "0" : value) : "undefined";
							if (stringObj.intMessage) {
								try {for (let hook of stringObj.intMessage.format(formatVars).match(/\([^\(\)]+\)/gi)) formatVars[hook.replace(/[\(\)]/g, "")] = n => n;}
								catch (err2) {}
							}
						}
					}
					if (returnvalue) return parseLanguageStringObj(returnvalue);
					else {
						byAnDr3W.LogUtils.warn([item, "failed to format string in byAnDr3W.LanguageUtils.LanguageStrings"]);
						return "";
					}
				}
				else return byAnDr3W.LanguageUtils.LanguageStrings[item];
			}
			else byAnDr3W.LogUtils.warn([item, "enter a valid key to format the string in byAnDr3W.LanguageUtils.LanguageStrings"]);
			return "";
		};
		byAnDr3W.LanguageUtils.LibraryStrings = new Proxy(LibraryStrings.default || {}, {
			get: function (list, item) {
				let languageId = byAnDr3W.LanguageUtils.getLanguage().id;
				if (LibraryStrings[languageId] && LibraryStrings[languageId][item]) return LibraryStrings[languageId][item];
				else if (LibraryStrings.default[item]) return LibraryStrings.default[item];
				else byAnDr3W.LogUtils.warn([item, "not found in byAnDr3W.LanguageUtils.LibraryStrings"]);
				return "";
			}
		});
		byAnDr3W.LanguageUtils.LibraryStringsCheck = new Proxy(LanguageStrings, {
			get: function (list, item) {
				return !!LibraryStrings.default[item];
			}
		});
		byAnDr3W.LanguageUtils.LibraryStringsFormat = function (item, ...values) {
			if (item) {
				let languageId = byAnDr3W.LanguageUtils.getLanguage().id, string = null;
				if (LibraryStrings[languageId] && LibraryStrings[languageId][item]) string = LibraryStrings[languageId][item];
				else if (LibraryStrings.default[item]) string = LibraryStrings.default[item];
				if (string) {
					for (let i = 0; i < values.length; i++) if (typeof values[i] == "string" || typeof values[i] == "number") string = string.replace(new RegExp(`{{var${i}}}`, "g"), values[i]);
					return string;
				}
				else byAnDr3W.LogUtils.warn([item, "not found in byAnDr3W.LanguageUtils.LibraryStrings"]);
			}
			else byAnDr3W.LogUtils.warn([item, "enter a valid key to format the string in byAnDr3W.LanguageUtils.LibraryStrings"]);
			return "";
		};
		byAnDr3W.TimeUtils.interval(interval => {
			if (Internal.LibraryModules.LanguageStore.chosenLocale || Internal.LibraryModules.LanguageStore._chosenLocale || byAnDr3W.DiscordUtils.getSettings("locale")) {
				byAnDr3W.TimeUtils.clear(interval);
				let language = byAnDr3W.LanguageUtils.getLanguage();
				if (language) byAnDr3W.LanguageUtils.languages.$discord = Object.assign({}, language, {name: `Discord (${language.name})`});
			}
		}, 100);
		for (let key in byAnDr3W.LanguageUtils.languages) try {
			if (new Date(0).toLocaleString(key, {second: 'numeric'}) != "0") {
				byAnDr3W.LanguageUtils.languages[key].numberMap = {};
				for (let i = 0; i < 10; i++) byAnDr3W.LanguageUtils.languages[key].numberMap[i] = new Date(i*1000).toLocaleString(key, {second: 'numeric'});
			}
		}
		catch (err) {}
		
		const reactInitialized = Internal.LibraryModules.React && Internal.LibraryModules.React.Component;
		Internal.setDefaultProps = function (component, defaultProps) {
			if (byAnDr3W.ObjectUtils.is(component)) component.defaultProps = Object.assign({}, component.defaultProps, defaultProps);
		};
		let openedItem;
		Internal.MenuItem = reactInitialized && class byAnDr3W_MenuItem extends Internal.LibraryModules.React.Component {
			constructor(props) {
				super(props);
				this.state = {hovered: false};
			}
			componentWillUnmount() {
				if (openedItem == this.props.id) openedItem = null;
			}
			render() {
				let color = (typeof this.props.color == "string" ? this.props.color : Internal.LibraryComponents.MenuItems.Colors.DEFAULT).toLowerCase();
				let isCustomColor = false;
				if (color) {
					if (DiscordClasses[`menu${color}`]) color = color;
					else if (byAnDr3W.ColorUtils.getType(color)) {
						isCustomColor = true;
						color = byAnDr3W.ColorUtils.convert(color, "RGBA");
					}
					else color = (Internal.LibraryComponents.MenuItems.Colors.DEFAULT || "").toLowerCase();
				}
				let renderPopout, onClose, hasPopout = byAnDr3W.ObjectUtils.is(this.props.popoutProps);
				if (hasPopout) {
					renderPopout = instance => {
						openedItem = this.props.id;
						return typeof this.props.popoutProps.renderPopout == "function" && this.props.popoutProps.renderPopout(instance);
					};
					onClose = instance => {
						openedItem = null;
						typeof this.props.popoutProps.onClose == "function" && this.props.popoutProps.onClose(instance);
					};
				}
				let focused = !openedItem ? this.props.isFocused : openedItem == this.props.id;
				let themeDark = byAnDr3W.DiscordUtils.getTheme() == byAnDr3W.disCN.themedark;
				let item = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, Object.assign({
					className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.menuitem, (this.props.label || this.props.subtext) && byAnDr3W.disCN.menulabelcontainer, color && (isCustomColor ? byAnDr3W.disCN.menucolorcustom : byAnDr3W.disCN[`menu${color}`]), this.props.disabled && byAnDr3W.disCN.menudisabled, focused && byAnDr3W.disCN.menufocused),
					style: {
						color: isCustomColor ? ((focused || this.state.hovered) ? (byAnDr3W.ColorUtils.isBright(color) ? "#000000" : "#ffffff") : color) : (this.state.hovered ? "#ffffff" : null),
						background: isCustomColor && (focused || this.state.hovered) && color
					},
					onClick: this.props.disabled ? null : e => {
						if (!this.props.action) return false;
						!this.props.persisting && !hasPopout && this.props.onClose && this.props.onClose();
						this.props.action(e, this);
					},
					onMouseEnter: this.props.disabled ? null : e => {
						if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);
						this.setState({hovered: true});
					},
					onMouseLeave: this.props.disabled ? null : e => {
						if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);
						this.setState({hovered: false});
					},
					"aria-disabled": this.props.disabled,
					children: [
						this.props.icon && this.props.showIconFirst && byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.menuiconcontainerleft,
							children: byAnDr3W.ReactUtils.createElement(this.props.icon, {
								className: byAnDr3W.disCN.menuicon
							})
						}),
						typeof this.props.render == "function" ? this.props.render(this) : this.props.render,
						(this.props.label || this.props.subtext) && byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.menulabel,
							children: [
								typeof this.props.label == "function" ? this.props.label(this) : this.props.label,
								this.props.subtext && byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.disCN.menusubtext,
									children: typeof this.props.subtext == "function" ? this.props.subtext(this) : this.props.subtext
								})
							].filter(n => n)
						}),
						this.props.hint && byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.menuhintcontainer,
							children: typeof this.props.hint == "function" ? this.props.hint(this) : this.props.hint
						}),
						this.props.icon && !this.props.showIconFirst && byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.menuiconcontainer,
							children: byAnDr3W.ReactUtils.createElement(this.props.icon, {
								className: byAnDr3W.disCN.menuicon
							})
						}),
						this.props.input && byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.menuiconcontainer,
							children: this.props.input
						}),
						this.props.imageUrl && byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.menuimagecontainer,
							children: byAnDr3W.ReactUtils.createElement("img", {
								className: byAnDr3W.disCN.menuimage,
								src: typeof this.props.imageUrl == "function" ? this.props.imageUrl(this) : this.props.imageUrl,
								alt: ""
							})
						})
					].filter(n => n)
				}, this.props.menuItemProps, {isFocused: focused}));
				return hasPopout ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutContainer, Object.assign({}, this.props.popoutProps, {
					children: item,
					renderPopout: renderPopout,
					onClose: onClose
				})) : item;
			}
		};
		Internal.CustomMenuItemWrapper = reactInitialized && class byAnDr3W_CustomMenuItemWrapper extends Internal.LibraryModules.React.Component {
			constructor(props) {
				super(props);
				this.state = {hovered: false};
			}
			render() {
				let isItem = this.props.children == Internal.MenuItem;
				let item = byAnDr3W.ReactUtils.createElement(this.props.children, Object.assign({}, this.props.childProps, {
					onMouseEnter: isItem ? e => {
						if (this.props.childProps && typeof this.props.childProps.onMouseEnter == "function") this.props.childProps.onMouseEnter(e, this);
						this.setState({hovered: true});
					} : this.props.childProps && this.props.childProps.onMouseEnter,
					onMouseLeave: isItem ? e => {
						if (this.props.childProps && typeof this.props.childProps.onMouseLeave == "function") this.props.childProps.onMouseLeave(e, this);
						this.setState({hovered: false});
					} : this.props.childProps && this.props.childProps.onMouseLeave,
					isFocused: this.state.hovered && !this.props.disabled
				}));
				return isItem ? item : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
					onMouseEnter: e => this.setState({hovered: true}),
					onMouseLeave: e => this.setState({hovered: false}),
					children: item
				});
			}
		};
		Internal.ErrorBoundary = reactInitialized && class byAnDr3W_ErrorBoundary extends Internal.LibraryModules.React.PureComponent {
			constructor(props) {
				super(props);
				this.state = {hasError: false};
			}
			static getDerivedStateFromError(err) {
				return {hasError: true};
			}
			componentDidCatch(err, info) {
				byAnDr3W.LogUtils.error(["Could not create React Element!", err]);
			}
			render() {
				if (this.state.hasError) return Internal.LibraryModules.React.createElement("span", {
					style: {
						background: byAnDr3W.DiscordConstants && byAnDr3W.DiscordConstants.Colors && byAnDr3W.DiscordConstants.Colors.PRIMARY_DARK,
						borderRadius: 5,
						color: byAnDr3W.DiscordConstants && byAnDr3W.DiscordConstants.Colors && byAnDr3W.DiscordConstants.Colors.STATUS_RED,
						fontSize: 12,
						fontWeight: 600,
						padding: 6,
						textAlign: "center",
						verticalAlign: "center"
					},
					children: "React Component Error"
				});
				return this.props.children;
			}
		};
		
		const loadComponents = _ => {
			const CustomComponents = {};
			
			CustomComponents.AutoFocusCatcher = reactInitialized && class byAnDr3W_AutoFocusCatcher extends Internal.LibraryModules.React.Component {
				render() {
					const style = {padding: 0, margin: 0, border: "none", width: 0, maxWidth: 0, height: 0, maxHeight: 0, visibility: "hidden"};
					return byAnDr3W.ReactUtils.forceStyle(byAnDr3W.ReactUtils.createElement("input", {style}), Object.keys(style));
				}
			};
			
			CustomComponents.BadgeAnimationContainer = reactInitialized && class byAnDr3W_BadgeAnimationContainer extends Internal.LibraryModules.React.Component {
				componentDidMount() {byAnDr3W.ReactUtils.forceUpdate(this);}
				componentWillAppear(e) {if (typeof e == "function") e();}
				componentWillEnter(e) {if (typeof e == "function") e();}
				componentWillLeave(e) {if (typeof e == "function") this.timeoutId = setTimeout(e, 300);}
				componentWillUnmount() {byAnDr3W.TimeUtils.clear(this.timeoutId)}
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.div, {
						className: this.props.className,
						style: this.props.animatedStyle,
						children: this.props.children
					});
				}
			};
			
			CustomComponents.Badges = {};
			CustomComponents.Badges.getBadgePaddingForValue = function (count) {
				switch (count) {
					case 1:
					case 4:
					case 6:
						return 1;
					default:
						return 0;
				}
			};
			CustomComponents.Badges.IconBadge = reactInitialized && class byAnDr3W_IconBadge extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.badgeiconbadge, this.props.shape && Internal.LibraryComponents.Badges.BadgeShapes[this.props.shape] || Internal.LibraryComponents.Badges.BadgeShapes.ROUND),
						style: Object.assign({
							backgroundColor: this.props.disableColor ? null : (this.props.color || byAnDr3W.DiscordConstants.Colors.STATUS_RED)
						}, this.props.style),
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
							className: byAnDr3W.disCN.badgeicon,
							name: this.props.icon
						})
					});
				}
			};
			CustomComponents.Badges.NumberBadge = reactInitialized && class byAnDr3W_NumberBadge extends Internal.LibraryModules.React.Component {
				handleClick(e) {if (typeof this.props.onClick == "function") this.props.onClick(e, this);}
				handleContextMenu(e) {if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);}
				handleMouseEnter(e) {if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);}
				handleMouseLeave(e) {if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);}
				render() {
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.badgenumberbadge, this.props.shape && Internal.LibraryComponents.Badges.BadgeShapes[this.props.shape] || Internal.LibraryComponents.Badges.BadgeShapes.ROUND),
						style: Object.assign({
							backgroundColor: !this.props.disableColor && (this.props.color || byAnDr3W.DiscordConstants.Colors.STATUS_RED),
							width: Internal.LibraryComponents.Badges.getBadgeWidthForValue(this.props.count),
							paddingRight: Internal.LibraryComponents.Badges.getBadgePaddingForValue(this.props.count)
						}, this.props.style),
						onClick: this.handleClick.bind(this),
						onContextMenu: this.handleContextMenu.bind(this),
						onMouseEnter: this.handleMouseEnter.bind(this),
						onMouseLeave: this.handleMouseLeave.bind(this),
						children: Internal.LibraryComponents.Badges.getBadgeCountString(this.props.count)
					});
				}
			};
			
			CustomComponents.BotTag = reactInitialized && class byAnDr3W_BotTag extends Internal.LibraryModules.React.Component {
				handleClick(e) {if (typeof this.props.onClick == "function") this.props.onClick(e, this);}
				handleContextMenu(e) {if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);}
				handleMouseEnter(e) {if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);}
				handleMouseLeave(e) {if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);}
				render() {
					return byAnDr3W.ReactUtils.createElement("span", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, this.props.invertColor ? byAnDr3W.disCN.bottaginvert : byAnDr3W.disCN.bottagregular, this.props.useRemSizes ? byAnDr3W.disCN.bottagrem : byAnDr3W.disCN.bottagpx),
						style: this.props.style,
						onClick: this.handleClick.bind(this),
						onContextMenu: this.handleContextMenu.bind(this),
						onMouseEnter: this.handleMouseEnter.bind(this),
						onMouseLeave: this.handleMouseLeave.bind(this),
						children: byAnDr3W.ReactUtils.createElement("span", {
							className: byAnDr3W.disCN.bottagtext,
							children: this.props.tag || byAnDr3W.LanguageUtils.LanguageStrings.BOT_TAG_BOT
						})
					});
				}
			};
			
			CustomComponents.Button = reactInitialized && class byAnDr3W_Button extends Internal.LibraryModules.React.Component {
				handleClick(e) {if (typeof this.props.onClick == "function") this.props.onClick(e, this);}
				handleContextMenu(e) {if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);}
				handleMouseDown(e) {if (typeof this.props.onMouseDown == "function") this.props.onMouseDown(e, this);}
				handleMouseUp(e) {if (typeof this.props.onMouseUp == "function") this.props.onMouseUp(e, this);}
				handleMouseEnter(e) {if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);}
				handleMouseLeave(e) {if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);}
				render() {
					let processingAndListening = (this.props.disabled || this.props.submitting) && (null != this.props.onMouseEnter || null != this.props.onMouseLeave);
					let props = byAnDr3W.ObjectUtils.exclude(this.props, "look", "color", "hover", "size", "fullWidth", "grow", "disabled", "submitting", "type", "style", "wrapperClassName", "className", "innerClassName", "onClick", "onContextMenu", "onMouseDown", "onMouseUp", "onMouseEnter", "onMouseLeave", "children", "rel");
					let button = byAnDr3W.ReactUtils.createElement("button", Object.assign({}, !this.props.disabled && !this.props.submitting && props, {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.button, this.props.look != null ? this.props.look : Internal.LibraryComponents.Button.Looks.FILLED, this.props.color != null ? this.props.color : Internal.LibraryComponents.Button.Colors.BRAND, this.props.hover, this.props.size != null ? this.props.size : Internal.LibraryComponents.Button.Sizes.MEDIUM, processingAndListening && this.props.wrapperClassName, this.props.fullWidth && byAnDr3W.disCN.buttonfullwidth, (this.props.grow === undefined || this.props.grow) && byAnDr3W.disCN.buttongrow, this.props.hover && this.props.hover !== Internal.LibraryComponents.Button.Hovers.DEFAULT && byAnDr3W.disCN.buttonhashover, this.props.submitting && byAnDr3W.disCN.buttonsubmitting),
						onClick: (this.props.disabled || this.props.submitting) ? e => {return e.preventDefault();} : this.handleClick.bind(this),
						onContextMenu: (this.props.disabled || this.props.submitting) ? e => {return e.preventDefault();} : this.handleContextMenu.bind(this),
						onMouseUp: !this.props.disabled && this.handleMouseDown.bind(this),
						onMouseDown: !this.props.disabled && this.handleMouseUp.bind(this),
						onMouseEnter: this.handleMouseEnter.bind(this),
						onMouseLeave: this.handleMouseLeave.bind(this),
						type: !this.props.type ? "button" : this.props.type,
						disabled: this.props.disabled,
						style: this.props.style,
						rel: this.props.rel,
						children: [
							this.props.submitting && !this.props.disabled ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Spinner, {
								type: Internal.LibraryComponents.Spinner.Type.PULSING_ELLIPSIS,
								className: byAnDr3W.disCN.buttonspinner,
								itemClassName: byAnDr3W.disCN.buttonspinneritem
							}) : null,
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.buttoncontents, this.props.innerClassName),
								children: this.props.children
							})
						]
					}));
					return !processingAndListening ? button : byAnDr3W.ReactUtils.createElement("span", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.buttondisabledwrapper, this.props.wrapperClassName, this.props.size != null ? this.props.size : Internal.LibraryComponents.Button.Sizes.MEDIUM, this.props.fullWidth && byAnDr3W.disCN.buttonfullwidth, (this.props.grow === undefined || this.props.grow) && byAnDr3W.disCN.buttongrow),
						children: [
							button,
							byAnDr3W.ReactUtils.createElement("span", {
								onMouseEnter: this.handleMouseEnter.bind(this),
								onMouseLeave: this.handleMouseLeave.bind(this),
								className: byAnDr3W.disCN.buttondisabledoverlay
							})
						]
					});
				}
			};
			
			CustomComponents.Card = reactInitialized && class byAnDr3W_Card extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement("div", byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.hovercardwrapper, this.props.horizontal && byAnDr3W.disCN.hovercardhorizontal, this.props.backdrop && byAnDr3W.disCN.hovercard, this.props.className),
						onMouseEnter: e => {if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);},
						onMouseLeave: e => {if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);},
						onClick: e => {if (typeof this.props.onClick == "function") this.props.onClick(e, this);},
						onContextMenu: e => {if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);},
						children: [
							!this.props.noRemove ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
								"aria-label": byAnDr3W.LanguageUtils.LanguageStrings.REMOVE,
								className: byAnDr3W.disCNS.hovercardremovebutton + byAnDr3W.disCNS.hovercardremovebuttondefault,
								onClick: e => {
									if (typeof this.props.onRemove == "function") this.props.onRemove(e, this);
									byAnDr3W.ListenerUtils.stopEvent(e);
								}
							}) : null,
							typeof this.props.children == "string" ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextElement, {
								className: byAnDr3W.disCN.hovercardinner,
								children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextScroller, {children: this.props.children})
							}) : this.props.children
						].flat(10).filter(n => n)
					}), "backdrop", "horizontal", "noRemove"));
				}
			};
			Internal.setDefaultProps(CustomComponents.Card, {backdrop: true, noRemove: false});
			
			CustomComponents.ChannelTextAreaButton = reactInitialized && class byAnDr3W_ChannelTextAreaButton extends Internal.LibraryModules.React.Component {
				render() {
					const inner = byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.textareabuttonwrapper,
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
							name: this.props.iconName,
							iconSVG: this.props.iconSVG,
							className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.textareaicon, this.props.iconClassName, this.props.pulse && byAnDr3W.disCN.textareaiconpulse),
							nativeClass: this.props.nativeClass
						})
					});
					const button = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Button, {
						look: Internal.LibraryComponents.Button.Looks.BLANK,
						size: Internal.LibraryComponents.Button.Sizes.NONE,
						"aria-label": this.props.label,
						tabIndex: this.props.tabIndex,
						className: byAnDr3W.DOMUtils.formatClassName(this.props.isActive && byAnDr3W.disCN.textareabuttonactive),
						innerClassName: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.textareabutton, this.props.className, this.props.pulse && byAnDr3W.disCN.textareaattachbuttonplus),
						onClick: this.props.onClick,
						onContextMenu: this.props.onContextMenu,
						onMouseEnter: this.props.onMouseEnter,
						onMouseLeave: this.props.onMouseLeave,
						children: this.props.tooltip && this.props.tooltip.text ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, Object.assign({}, this.props.tooltip, {children: inner})) : inner
					});
					return (this.props.className || "").indexOf(byAnDr3W.disCN.textareapickerbutton) > -1 ? byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.textareapickerbuttoncontainer,
						children: button
					}) : button;
				}
			};
			Internal.setDefaultProps(CustomComponents.ChannelTextAreaButton, {tabIndex: 0});
			
			CustomComponents.CharCounter = reactInitialized && class byAnDr3W_CharCounter extends Internal.LibraryModules.React.Component {
				getCounterString() {
					let input = this.refElement || {}, string = "";
					if (byAnDr3W.DOMUtils.containsClass(this.refElement, byAnDr3W.disCN.textarea)) {
						let instance = byAnDr3W.ReactUtils.findOwner(input, {name: "ChannelEditorContainer", up: true});
						if (instance) string = instance.props.textValue;
						else string = input.value || input.textContent || "";
					}
					else string = input.value || input.textContent || "";
					if (this.props.max && this.props.showPercentage && (string.length/this.props.max) * 100 < this.props.showPercentage) return "";
					let start = input.selectionStart || 0, end = input.selectionEnd || 0, selectlength = end - start, selection = byAnDr3W.DOMUtils.getSelection();
					let select = !selectlength && !selection ? 0 : (selectlength || selection.length);
					select = !select ? 0 : (select > string.length ? (end || start ? string.length - (string.length - end - start) : string.length) : select);
					let children = [
						typeof this.props.renderPrefix == "function" && this.props.renderPrefix(string.length),
						`${string.length}${!this.props.max ? "" : "/" + this.props.max}${!select ? "" : " (" + select + ")"}`,
						typeof this.props.renderSuffix == "function" && this.props.renderSuffix(string.length)
					].filter(n => n);
					if (typeof this.props.onChange == "function") this.props.onChange(this);
					return children.length == 1 ? children[0] : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
						align: Internal.LibraryComponents.Flex.Align.CENTER,
						children: children
					});
				}
				updateCounter() {
					if (!this.refElement) return;
					byAnDr3W.TimeUtils.clear(this.updateTimeout);
					this.updateTimeout = byAnDr3W.TimeUtils.timeout(this.forceUpdateCounter.bind(this), 100);
				}
				forceUpdateCounter() {
					if (!this.refElement) return;
					this.props.children = this.getCounterString();
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				handleSelection() {
					if (!this.refElement) return;
					let mouseMove = _ => {
						byAnDr3W.TimeUtils.timeout(this.forceUpdateCounter.bind(this), 10);
					};
					let mouseUp = _ => {
						document.removeEventListener("mousemove", mouseMove);
						document.removeEventListener("mouseup", mouseUp);
						if (this.refElement.selectionEnd - this.refElement.selectionStart) byAnDr3W.TimeUtils.timeout(_ => {
							document.addEventListener("click", click);
						});
					};
					let click = _ => {
						byAnDr3W.TimeUtils.timeout(this.forceUpdateCounter.bind(this), 100);
						document.removeEventListener("mousemove", mouseMove);
						document.removeEventListener("mouseup", mouseUp);
						document.removeEventListener("click", click);
					};
					document.addEventListener("mousemove", mouseMove);
					document.addEventListener("mouseup", mouseUp);
				}
				componentDidMount() {
					if (this.props.refClass) {
						let node = byAnDr3W.ReactUtils.findDOMNode(this);
						if (node && node.parentElement) {
							this.refElement = node.parentElement.querySelector(this.props.refClass);
							if (this.refElement) {
								if (!this._updateCounter) this._updateCounter = _ => {
									if (!document.contains(node)) byAnDr3W.ListenerUtils.multiRemove(this.refElement, "keydown click change", this._updateCounter);
									else this.updateCounter();
								};
								if (!this._handleSelection) this._handleSelection = _ => {
									if (!document.contains(node)) byAnDr3W.ListenerUtils.multiRemove(this.refElement, "mousedown", this._handleSelection);
									else this.handleSelection();
								};
								byAnDr3W.ListenerUtils.multiRemove(this.refElement, "mousedown", this._handleSelection);
								byAnDr3W.ListenerUtils.multiAdd(this.refElement, "mousedown", this._handleSelection);
								if (this.refElement.tagName == "INPUT" || this.refElement.tagName == "TEXTAREA") {
									byAnDr3W.ListenerUtils.multiRemove(this.refElement, "keydown click change", this._updateCounter);
									byAnDr3W.ListenerUtils.multiAdd(this.refElement, "keydown click change", this._updateCounter);
								}
								else {
									if (!this._mutationObserver) this._mutationObserver = new MutationObserver(changes => {
										if (!document.contains(node)) this._mutationObserver.disconnect();
										else this.updateCounter();
									});
									else this._mutationObserver.disconnect();
									this._mutationObserver.observe(this.refElement, {childList: true, subtree: true});
								}
								this.updateCounter();
							}
							else byAnDr3W.LogUtils.warn(["could not find referenceElement for byAnDr3W_CharCounter"]);
						}
					}
					else byAnDr3W.LogUtils.warn(["refClass can not be undefined for byAnDr3W_CharCounter"]);
				}
				render() {
					let string = this.getCounterString();
					byAnDr3W.TimeUtils.timeout(_ => string != this.getCounterString() && byAnDr3W.ReactUtils.forceUpdate(this));
					return byAnDr3W.ReactUtils.createElement("div", byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.charcounter, this.props.className),
						children: string
					}), "parsing", "max", "refClass", "renderPrefix", "renderSuffix", "showPercentage"));
				}
			};
			
			CustomComponents.Checkbox = reactInitialized && class byAnDr3W_Checkbox extends Internal.LibraryModules.React.Component {
				handleMouseDown(e) {if (typeof this.props.onMouseDown == "function") this.props.onMouseDown(e, this);}
				handleMouseUp(e) {if (typeof this.props.onMouseUp == "function") this.props.onMouseUp(e, this);}
				handleMouseEnter(e) {if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);}
				handleMouseLeave(e) {if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);}
				getInputMode() {
					return this.props.disabled ? "disabled" : this.props.readOnly ? "readonly" : "default";
				}
				getStyle() {
					let style = this.props.style || {};
					if (!this.props.value) return style;
					style = Object.assign({}, style);
					this.props.color = typeof this.props.getColor == "function" ? this.props.getColor(this.props.value) : this.props.color;
					if (Internal.LibraryComponents.Checkbox.Types) switch (this.props.type) {
						case Internal.LibraryComponents.Checkbox.Types.DEFAULT:
							style.borderColor = this.props.color;
							break;
						case Internal.LibraryComponents.Checkbox.Types.GHOST:
							let color = byAnDr3W.ColorUtils.setAlpha(this.props.color, 0.15, "RGB");
							style.backgroundColor = color;
							style.borderColor = color;
							break;
						case Internal.LibraryComponents.Checkbox.Types.INVERTED:
							style.backgroundColor = this.props.color;
							style.borderColor = this.props.color;
					}
					return style;
				}
				getColor() {
					return this.props.value ? (Internal.LibraryComponents.Checkbox.Types && this.props.type === Internal.LibraryComponents.Checkbox.Types.INVERTED ? byAnDr3W.DiscordConstants.Colors.WHITE : this.props.color) : "transparent";
				}
				handleChange(e) {
					this.props.value = typeof this.props.getValue == "function" ? this.props.getValue(this.props.value, e, this) : !this.props.value;
					if (typeof this.props.onChange == "function") this.props.onChange(this.props.value, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					let label = this.props.children ? byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.checkboxlabel, this.props.disabled ? byAnDr3W.disCN.checkboxlabeldisabled : byAnDr3W.disCN.checkboxlabelclickable, this.props.reverse ? byAnDr3W.disCN.checkboxlabelreversed : byAnDr3W.disCN.checkboxlabelforward),
						style: {
							lineHeight: this.props.size + "px"
						},
						children: this.props.children
					}) : null;
					return byAnDr3W.ReactUtils.createElement("label", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.disabled ? byAnDr3W.disCN.checkboxwrapperdisabled : byAnDr3W.disCN.checkboxwrapper, this.props.align, this.props.className),
						children: [
							this.props.reverse && label,
							!this.props.displayOnly && byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FocusRingScope, {
								children: byAnDr3W.ReactUtils.createElement("input", {
									className: byAnDr3W.disCN["checkboxinput" + this.getInputMode()],
									type: "checkbox",
									onClick: this.props.disabled || this.props.readOnly ? (_ => {}) : this.handleChange.bind(this),
									onContextMenu: this.props.disabled || this.props.readOnly ? (_ => {}) : this.handleChange.bind(this),
									onMouseUp: !this.props.disabled && this.handleMouseDown.bind(this),
									onMouseDown: !this.props.disabled && this.handleMouseUp.bind(this),
									onMouseEnter: !this.props.disabled && this.handleMouseEnter.bind(this),
									onMouseLeave: !this.props.disabled && this.handleMouseLeave.bind(this),
									checked: this.props.value,
									style: {
										width: this.props.size,
										height: this.props.size
									}
								})
							}),
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.checkbox, byAnDr3W.disCN["checkbox" + this.props.shape], this.props.value && byAnDr3W.disCN.checkboxchecked),
								style: Object.assign({
									width: this.props.size,
									height: this.props.size,
									borderColor: this.props.checkboxColor
								}, this.getStyle()),
								children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Checkmark, {
									width: 18,
									height: 18,
									color: this.getColor(),
									"aria-hidden": true
								})
							}),
							!this.props.reverse && label
						].filter(n => n)
					});
				}
			};
			CustomComponents.Checkbox.Types = {
				DEFAULT: "DEFAULT",
				GHOST: "GHOST",
				INVERTED: "INVERTED"
			};
			CustomComponents.Checkbox.Shapes = {
				BOX: "box",
				ROUND: "round"
			};
			Internal.setDefaultProps(CustomComponents.Checkbox, {type: CustomComponents.Checkbox.Types.INVERTED, shape: CustomComponents.Checkbox.Shapes.ROUND});
			
			CustomComponents.Clickable = reactInitialized && class byAnDr3W_Clickable extends Internal.LibraryModules.React.Component {
				handleClick(e) {if (typeof this.props.onClick == "function") this.props.onClick(e, this);}
				handleContextMenu(e) {if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);}
				handleMouseDown(e) {if (typeof this.props.onMouseDown == "function") this.props.onMouseDown(e, this);}
				handleMouseUp(e) {if (typeof this.props.onMouseUp == "function") this.props.onMouseUp(e, this);}
				handleMouseEnter(e) {if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);}
				handleMouseLeave(e) {if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);}
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.Clickable, Object.assign({}, this.props, {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, (this.props.className || "").toLowerCase().indexOf("disabled") == -1 && byAnDr3W.disCN.cursorpointer),
						onClick: this.handleClick.bind(this),
						onContextMenu: this.handleContextMenu.bind(this),
						onMouseUp: this.handleMouseDown.bind(this),
						onMouseDown: !this.props.disabled && this.handleMouseUp.bind(this),
						onMouseEnter: this.handleMouseEnter.bind(this),
						onMouseLeave: this.handleMouseLeave.bind(this)
					}));
				}
			};
			
			CustomComponents.CollapseContainer = reactInitialized && class byAnDr3W_CollapseContainer extends Internal.LibraryModules.React.Component {
				render() {
					if (!byAnDr3W.ObjectUtils.is(this.props.collapseStates)) this.props.collapseStates = {};
					this.props.collapsed = this.props.collapsed && (this.props.collapseStates[this.props.title] || this.props.collapseStates[this.props.title] === undefined);
					this.props.collapseStates[this.props.title] = this.props.collapsed;
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.collapsed && byAnDr3W.disCN.collapsecontainercollapsed, this.props.mini ? byAnDr3W.disCN.collapsecontainermini : byAnDr3W.disCN.collapsecontainer, this.props.className),
						id: this.props.id,
						children: [
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
								className: byAnDr3W.disCN.collapsecontainerheader,
								align: Internal.LibraryComponents.Flex.Align.CENTER,
								onClick: e => {
									this.props.collapsed = !this.props.collapsed;
									this.props.collapseStates[this.props.title] = this.props.collapsed;
									if (typeof this.props.onClick == "function") this.props.onClick(this.props.collapsed, this);
									byAnDr3W.ReactUtils.forceUpdate(this);
								},
								children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormTitle, {
									tag: Internal.LibraryComponents.FormComponents.FormTitle.Tags.H5,
									className: byAnDr3W.disCN.collapsecontainertitle,
									children: this.props.title
								})
							}),
							!this.props.collapsed ? byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.collapsecontainerinner,
								children: this.props.children
							}) : null
						]
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.CollapseContainer, {collapsed: true, mini: true});
			
			CustomComponents.ColorPicker = reactInitialized && class byAnDr3W_ColorPicker extends Internal.LibraryModules.React.Component {
				constructor(props) {
					super(props);
					if (!this.state) this.state = {};
					this.state.isGradient = props.gradient && props.color && byAnDr3W.ObjectUtils.is(props.color);
					this.state.gradientBarEnabled = this.state.isGradient;
					this.state.draggingAlphaCursor = false;
					this.state.draggingGradientCursor = false;
					this.state.selectedGradientCursor = 0;
				}
				handleColorChange(color) {
					let changed = false;
					if (color != null) {
						changed = !byAnDr3W.equals(this.state.isGradient ? this.props.color[this.state.selectedGradientCursor] : this.props.color, color);
						if (this.state.isGradient) this.props.color[this.state.selectedGradientCursor] = color;
						else this.props.color = color;
					}
					else changed = true;
					if (changed) {
						if (typeof this.props.onColorChange == "function") this.props.onColorChange(byAnDr3W.ColorUtils.convert(this.props.color, "RGBCOMP"));
						byAnDr3W.ReactUtils.forceUpdate(this);
					}
				}
				render() {
					if (this.state.isGradient) this.props.color = Object.assign({}, this.props.color);
					
					let hslFormat = this.props.alpha ? "HSLA" : "HSL";
					let hexRegex = this.props.alpha ? /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i : /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
					
					let selectedColor = byAnDr3W.ColorUtils.convert(this.state.isGradient ? this.props.color[this.state.selectedGradientCursor] : this.props.color, hslFormat) || byAnDr3W.ColorUtils.convert("#000000FF", hslFormat);
					let currentGradient = (this.state.isGradient ? Object.entries(this.props.color, hslFormat) : [[0, selectedColor], [1, selectedColor]]);
					
					let [h, s, l] = byAnDr3W.ColorUtils.convert(selectedColor, "HSLCOMP");
					let a = byAnDr3W.ColorUtils.getAlpha(selectedColor);
					a = a == null ? 1 : a;
					
					let hexColor = byAnDr3W.ColorUtils.convert(selectedColor, this.props.alpha ? "HEXA" : "HEX");
					let hexLength = hexColor.length;
					
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutFocusLock, {
						className: byAnDr3W.disCNS.colorpickerwrapper + byAnDr3W.disCN.colorpicker,
						children: [
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.colorpickerinner,
								children: [
									byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.disCN.colorpickersaturation,
										children: byAnDr3W.ReactUtils.createElement("div", {
											className: byAnDr3W.disCN.colorpickersaturationcolor,
											style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0, cursor: "crosshair", backgroundColor: byAnDr3W.ColorUtils.convert([h, "100%", "100%"], "RGB")},
											onClick: event => {
												let rects = byAnDr3W.DOMUtils.getRects(byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.colorpickersaturationcolor, event.target));
												this.handleColorChange(byAnDr3W.ColorUtils.convert([h, byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0, 100], event.clientX) + "%", byAnDr3W.NumberUtils.mapRange([rects.top, rects.top + rects.height], [100, 0], event.clientY) + "%", a], hslFormat));
											},
											onMouseDown: event => {
												let rects = byAnDr3W.DOMUtils.getRects(byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.colorpickersaturationcolor, event.target));
												let mouseUp = _ => {
													document.removeEventListener("mouseup", mouseUp);
													document.removeEventListener("mousemove", mouseMove);
												};
												let mouseMove = event2 => {
													this.handleColorChange(byAnDr3W.ColorUtils.convert([h, byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0, 100], event2.clientX) + "%", byAnDr3W.NumberUtils.mapRange([rects.top, rects.top + rects.height], [100, 0], event2.clientY) + "%", a], hslFormat));
												};
												document.addEventListener("mouseup", mouseUp);
												document.addEventListener("mousemove", mouseMove);
											},
											children: [
												byAnDr3W.ReactUtils.createElement("style", {
													children: `${byAnDr3W.dotCN.colorpickersaturationwhite} {background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));background: linear-gradient(to right, #fff, rgba(255,255,255,0));}${byAnDr3W.dotCN.colorpickersaturationblack} {background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));background: linear-gradient(to top, #000, rgba(0,0,0,0));}`
												}),
												byAnDr3W.ReactUtils.createElement("div", {
													className: byAnDr3W.disCN.colorpickersaturationwhite,
													style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0},
													children: [
														byAnDr3W.ReactUtils.createElement("div", {
															className: byAnDr3W.disCN.colorpickersaturationblack,
															style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0}
														}),
														byAnDr3W.ReactUtils.createElement("div", {
															className: byAnDr3W.disCN.colorpickersaturationcursor,
															style: {position: "absolute", cursor: "crosshair", left: s, top: `${byAnDr3W.NumberUtils.mapRange([0, 100], [100, 0], parseFloat(l))}%`},
															children: byAnDr3W.ReactUtils.createElement("div", {
																style: {width: 4, height: 4, boxShadow: "rgb(255, 255, 255) 0px 0px 0px 1.5px, rgba(0, 0, 0, 0.3) 0px 0px 1px 1px inset, rgba(0, 0, 0, 0.4) 0px 0px 1px 2px", borderRadius: "50%", transform: "translate(-2px, -2px)"}
															})
														})
													]
												})
											]
										})
									}),
									byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.disCN.colorpickerhue,
										children: byAnDr3W.ReactUtils.createElement("div", {
											style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0},
											children: byAnDr3W.ReactUtils.createElement("div", {
												className: byAnDr3W.disCN.colorpickerhuehorizontal,
												style: {padding: "0px 2px", position: "relative", height: "100%"},
												onClick: event => {
													let rects = byAnDr3W.DOMUtils.getRects(byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.colorpickerhuehorizontal, event.target));
													this.handleColorChange(byAnDr3W.ColorUtils.convert([byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0, 360], event.clientX), s, l, a], hslFormat));
												},
												onMouseDown: event => {
													let rects = byAnDr3W.DOMUtils.getRects(byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.colorpickerhuehorizontal, event.target));
													let mouseUp = _ => {
														document.removeEventListener("mouseup", mouseUp);
														document.removeEventListener("mousemove", mouseMove);
													};
													let mouseMove = event2 => {
														this.handleColorChange(byAnDr3W.ColorUtils.convert([byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0, 360], event2.clientX), s, l, a], hslFormat));
													};
													document.addEventListener("mouseup", mouseUp);
													document.addEventListener("mousemove", mouseMove);
												},
												children: [
													byAnDr3W.ReactUtils.createElement("style", {
														children: `${byAnDr3W.dotCN.colorpickerhuehorizontal} {background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);background: -webkit-linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);}${byAnDr3W.dotCN.colorpickerhuevertical} {background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);}`
													}),
													byAnDr3W.ReactUtils.createElement("div", {
														className: byAnDr3W.disCN.colorpickerhuecursor,
														style: {position: "absolute", cursor: "ew-resize", left: `${byAnDr3W.NumberUtils.mapRange([0, 360], [0, 100], h)}%`},
														children: byAnDr3W.ReactUtils.createElement("div", {
															style: {marginTop: 1, width: 4, borderRadius: 1, height: 8, boxShadow: "rgba(0, 0, 0, 0.6) 0px 0px 2px", background: "rgb(255, 255, 255)", transform: "translateX(-2px)"}
														})
													})
												]
											})
										})
									}),
									this.props.alpha && byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.disCN.colorpickeralpha,
										children: [
											byAnDr3W.ReactUtils.createElement("div", {
												style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0},
												children: byAnDr3W.ReactUtils.createElement("div", {
													className: byAnDr3W.disCN.colorpickeralphacheckered,
													style: {padding: "0px 2px", position: "relative", height: "100%"}
												})
											}),
											byAnDr3W.ReactUtils.createElement("div", {
												style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0},
												children: byAnDr3W.ReactUtils.createElement("div", {
													className: byAnDr3W.disCN.colorpickeralphahorizontal,
													style: {padding: "0px 2px", position: "relative", height: "100%", background: `linear-gradient(to right, ${byAnDr3W.ColorUtils.setAlpha([h, s, l], 0, "RGBA")}, ${byAnDr3W.ColorUtils.setAlpha([h, s, l], 1, "RGBA")}`},
													onClick: event => {
														let rects = byAnDr3W.DOMUtils.getRects(byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.colorpickeralphahorizontal, event.target));
														this.handleColorChange(byAnDr3W.ColorUtils.setAlpha([h, s, l], byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0, 1], event.clientX), hslFormat));
													},
													onMouseDown: event => {
														let rects = byAnDr3W.DOMUtils.getRects(byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.colorpickeralphahorizontal, event.target));
														let mouseUp = _ => {
															document.removeEventListener("mouseup", mouseUp);
															document.removeEventListener("mousemove", mouseMove);
															this.state.draggingAlphaCursor = false;
															byAnDr3W.ReactUtils.forceUpdate(this);
														};
														let mouseMove = event2 => {
															this.state.draggingAlphaCursor = true;
															this.handleColorChange(byAnDr3W.ColorUtils.setAlpha([h, s, l], byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0, 1], event2.clientX), hslFormat));
														};
														document.addEventListener("mouseup", mouseUp);
														document.addEventListener("mousemove", mouseMove);
													},
													children: byAnDr3W.ReactUtils.createElement("div", {
														className: byAnDr3W.disCN.colorpickeralphacursor,
														style: {position: "absolute", cursor: "ew-resize", left: `${a * 100}%`},
														children: [
															byAnDr3W.ReactUtils.createElement("div", {
																style: {marginTop: 1, width: 4, borderRadius: 1, height: 8, boxShadow: "rgba(0, 0, 0, 0.6) 0px 0px 2px", background: "rgb(255, 255, 255)", transform: "translateX(-2px)"}
															}),
															this.state.draggingAlphaCursor && byAnDr3W.ReactUtils.createElement("span", {
																className: byAnDr3W.disCN.sliderbubble,
																style: {opacity: 1, visibility: "visible", left: 2},
																children: `${Math.floor(a * 100)}%`
															})
														].filter(n => n)
													})
												})
											})
										]
									}),
									this.state.gradientBarEnabled && byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.disCN.colorpickergradient,
										children: [
											byAnDr3W.ReactUtils.createElement("div", {
												style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0},
												children: byAnDr3W.ReactUtils.createElement("div", {
													className: byAnDr3W.disCN.colorpickergradientcheckered,
													style: {padding: "0px 2px", position: "relative", height: "100%"}
												})
											}),
											byAnDr3W.ReactUtils.createElement("div", {
												style: {position: "absolute", top: 0, right: 0, bottom: 0, left: 0},
												children: byAnDr3W.ReactUtils.createElement("div", {
													className: byAnDr3W.disCN.colorpickergradienthorizontal,
													style: {padding: "0px 2px", position: "relative", cursor: "copy", height: "100%", background: byAnDr3W.ColorUtils.createGradient(currentGradient.reduce((colorObj, posAndColor) => (colorObj[posAndColor[0]] = posAndColor[1], colorObj), {}))},
													onClick: event => {
														let rects = byAnDr3W.DOMUtils.getRects(event.target);
														let pos = byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0.01, 0.99], event.clientX);
														if (Object.keys(this.props.color).indexOf(pos) == -1) {
															this.props.color[pos] = byAnDr3W.ColorUtils.convert("#000000FF", hslFormat);
															this.state.selectedGradientCursor = pos;
															this.handleColorChange();
														}
													},
													children: currentGradient.map(posAndColor => byAnDr3W.ReactUtils.createElement("div", {
														className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.colorpickergradientcursor, (posAndColor[0] == 0 || posAndColor[0] == 1) && byAnDr3W.disCN.colorpickergradientcursoredge, this.state.selectedGradientCursor == posAndColor[0] && byAnDr3W.disCN.colorpickergradientcursorselected),
														style: {position: "absolute", cursor: "pointer", left: `${posAndColor[0] * 100}%`},
														onMouseDown: posAndColor[0] == 0 || posAndColor[0] == 1 ? _ => {} : event => {
															event = event.nativeEvent || event;
															let mouseMove = event2 => {
																if (Math.sqrt((event.pageX - event2.pageX)**2) > 10) {
																	document.removeEventListener("mousemove", mouseMove);
																	document.removeEventListener("mouseup", mouseUp);
																	
																	this.state.draggingGradientCursor = true;
																	let cursor = byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN.colorpickergradientcursor, event.target);
																	let rects = byAnDr3W.DOMUtils.getRects(cursor.parentElement);
																	
																	let releasing = _ => {
																		document.removeEventListener("mousemove", dragging);
																		document.removeEventListener("mouseup", releasing);
																		byAnDr3W.TimeUtils.timeout(_ => {this.state.draggingGradientCursor = false;});
																	};
																	let dragging = event3 => {
																		let pos = byAnDr3W.NumberUtils.mapRange([rects.left, rects.left + rects.width], [0.01, 0.99], event3.clientX);
																		if (Object.keys(this.props.color).indexOf(pos) == -1) {
																			delete this.props.color[posAndColor[0]];
																			posAndColor[0] = pos;
																			this.props.color[pos] = posAndColor[1];
																			this.state.selectedGradientCursor = pos;
																			this.handleColorChange();
																		}
																	};
																	document.addEventListener("mousemove", dragging);
																	document.addEventListener("mouseup", releasing);
																}
															};
															let mouseUp = _ => {
																document.removeEventListener("mousemove", mouseMove);
																document.removeEventListener("mouseup", mouseUp);
															};
															document.addEventListener("mousemove", mouseMove);
															document.addEventListener("mouseup", mouseUp);
														},
														onClick: event => {
															byAnDr3W.ListenerUtils.stopEvent(event);
															if (!this.state.draggingGradientCursor) {
																this.state.selectedGradientCursor = posAndColor[0];
																byAnDr3W.ReactUtils.forceUpdate(this);
															}
														},
														onContextMenu: posAndColor[0] == 0 || posAndColor[0] == 1 ? _ => {} : event => {
															byAnDr3W.ListenerUtils.stopEvent(event);
															delete this.props.color[posAndColor[0]];
															this.state.selectedGradientCursor = 0;
															this.handleColorChange();
														},
														children: byAnDr3W.ReactUtils.createElement("div", {
															style: {background: byAnDr3W.ColorUtils.convert(posAndColor[1], "RGBA")}
														})
													}))
												})
											})
										]
									})
								].filter(n => n)
							}),
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextInput, {
								className: byAnDr3W.disCNS.colorpickerhexinput + byAnDr3W.disCN.margintop8,
								maxLength: this.props.alpha ? 9 : 7,
								valuePrefix: "#",
								value: hexColor,
								autoFocus: true,
								onChange: value => {
									const oldLength = hexLength;
									hexLength = (value || "").length;
									if (this.props.alpha && (oldLength > 8 || oldLength < 6) && hexLength == 7) value += "FF";
									if (hexRegex.test(value)) this.handleColorChange(value);
								},
								inputChildren: this.props.gradient && byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
									text: byAnDr3W.LanguageUtils.LibraryStrings.gradient,
									children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
										className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.colorpickergradientbutton, this.state.gradientBarEnabled && byAnDr3W.disCN.colorpickergradientbuttonenabled),
										children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
											nativeClass: true,
											width: 28,
											height: 28,
											name: Internal.LibraryComponents.SvgIcon.Names.GRADIENT
										}),
										onClick: _ => {
											this.state.gradientBarEnabled = !this.state.gradientBarEnabled;
											if (this.state.gradientBarEnabled && !this.state.isGradient) this.props.color = {0: selectedColor, 1: selectedColor};
											else if (!this.state.gradientBarEnabled && this.state.isGradient) this.props.color = selectedColor;
											this.state.isGradient = this.props.color && byAnDr3W.ObjectUtils.is(this.props.color);
											this.handleColorChange();
										}
									})
								})
							}),
							byAnDr3W.ReactUtils.createElement("div", {
								className: "move-corners",
								children: [{top: 0, left: 0}, {top: 0, right: 0}, {bottom: 0, right: 0}, {bottom: 0, left: 0}].map(pos => byAnDr3W.ReactUtils.createElement("div", {
									className: "move-corner",
									onMouseDown: e => {
										if (!this.domElementRef.current) return;
										let rects = byAnDr3W.DOMUtils.getRects(this.domElementRef.current);
										let left = rects.left, top = rects.top;
										let oldX = e.pageX, oldY = e.pageY;
										let mouseUp = _ => {
											document.removeEventListener("mouseup", mouseUp);
											document.removeEventListener("mousemove", mouseMove);
										};
										let mouseMove = e2 => {
											left = left - (oldX - e2.pageX), top = top - (oldY - e2.pageY);
											oldX = e2.pageX, oldY = e2.pageY;
											this.domElementRef.current.style.setProperty("left", `${left}px`, "important");
											this.domElementRef.current.style.setProperty("top", `${top}px`, "important");
										};
										document.addEventListener("mouseup", mouseUp);
										document.addEventListener("mousemove", mouseMove);
									},
									style: Object.assign({}, pos, {width: 10, height: 10, cursor: "move", position: "absolute"})
								}))
							})
						]
					});
				}
			};
			
			CustomComponents.ColorSwatches = reactInitialized && class byAnDr3W_ColorSwatches extends Internal.LibraryModules.React.Component {
				ColorSwatch(props) {
					const swatches = props.swatches;
					let useWhite = !byAnDr3W.ColorUtils.isBright(props.color);
					let swatch = byAnDr3W.ReactUtils.createElement("button", {
						type: "button",
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.colorpickerswatch, props.isSingle && byAnDr3W.disCN.colorpickerswatchsingle, props.isDisabled && byAnDr3W.disCN.colorpickerswatchdisabled, props.isSelected && byAnDr3W.disCN.colorpickerswatchselected, props.isCustom && byAnDr3W.disCN.colorpickerswatchcustom, props.color == null && byAnDr3W.disCN.colorpickerswatchnocolor),
						number: props.number,
						disabled: props.isDisabled,
						onClick: _ => {
							if (!props.isSelected) {
								let color = props.isCustom && props.color == null ? (swatches.props.color || swatches.props.defaultCustomColor || "rgba(0, 0, 0, 1)") : props.color;
								if (typeof swatches.props.onColorChange == "function") swatches.props.onColorChange(byAnDr3W.ColorUtils.convert(color, "RGBCOMP"));
								swatches.props.color = color;
								swatches.props.customColor = props.isCustom ? color : swatches.props.customColor;
								swatches.props.customSelected = props.isCustom;
								byAnDr3W.ReactUtils.forceUpdate(swatches);
							}
						},
						style: Object.assign({}, props.style, {
							background: byAnDr3W.ObjectUtils.is(props.color) ? byAnDr3W.ColorUtils.createGradient(props.color) : byAnDr3W.ColorUtils.convert(props.color, "RGBA")
						}),
						children: [
							props.isCustom || props.isSingle ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
								className: byAnDr3W.disCN.colorpickerswatchdropper,
								foreground: byAnDr3W.disCN.colorpickerswatchdropperfg,
								name: Internal.LibraryComponents.SvgIcon.Names.DROPPER,
								width: props.isCustom ? 14 : 10,
								height: props.isCustom ? 14 : 10,
								color: useWhite ? byAnDr3W.DiscordConstants.Colors.WHITE : byAnDr3W.DiscordConstants.Colors.BLACK
							}) : null,
							props.isSelected && !props.isSingle ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
								name: Internal.LibraryComponents.SvgIcon.Names.CHECKMARK,
								width: props.isCustom ? 32 : 16,
								height: props.isCustom ? 24 : 16,
								color: useWhite ? byAnDr3W.DiscordConstants.Colors.WHITE : byAnDr3W.DiscordConstants.Colors.BLACK
							}) : null
						]
					});
					if (props.isCustom || props.isSingle || props.color == null) swatch = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
						text: props.isCustom || props.isSingle ? byAnDr3W.LanguageUtils.LanguageStrings.CUSTOM_COLOR : byAnDr3W.LanguageUtils.LanguageStrings.DEFAULT,
						tooltipConfig: {type: props.isSingle ? "top" : "bottom"},
						children: swatch
					});
					if (props.isCustom || props.isSingle) swatch = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutContainer, {
						children: swatch,
						wrap: false,
						popoutClassName: byAnDr3W.disCNS.colorpickerwrapper + byAnDr3W.disCN.colorpicker,
						animation: Internal.LibraryComponents.PopoutContainer.Animation.TRANSLATE,
						position: Internal.LibraryComponents.PopoutContainer.Positions.BOTTOM,
						align: Internal.LibraryComponents.PopoutContainer.Align.CENTER,
						open: swatches.props.pickerOpen,
						onClick: _ => swatches.props.pickerOpen = true,
						onOpen: _ => {
							swatches.props.pickerOpen = true;
							if (typeof swatches.props.onPickerOpen == "function") swatches.props.onPickerOpen(this);
						},
						onClose: _ => {
							delete swatches.props.pickerOpen;
							if (typeof swatches.props.onPickerClose == "function") swatches.props.onPickerClose(this);
						},
						renderPopout: _ => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.ColorPicker, Object.assign({}, swatches.props.pickerConfig, {
							color: swatches.props.color,
							onColorChange: color => {
								if (typeof swatches.props.onColorChange == "function") swatches.props.onColorChange(color);
								props.color = color;
								swatches.props.color = color;
								swatches.props.customColor = color;
								swatches.props.customSelected = true;
								byAnDr3W.ReactUtils.forceUpdate(swatches);
							}
						}), true)
					});
					if (props.isCustom) swatch = byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.colorpickerswatchcustomcontainer,
						children: swatch
					});
					return swatch;
				}
				render() {
					this.props.color = byAnDr3W.ObjectUtils.is(this.props.color) ? this.props.color : byAnDr3W.ColorUtils.convert(this.props.color, "RGBA");
					this.props.colors = (byAnDr3W.ArrayUtils.is(this.props.colors) ? this.props.colors : [null, 5433630, 3066993, 1752220, 3447003, 3429595, 8789737, 10181046, 15277667, 15286558, 15158332, 15105570, 15844367, 13094093, 7372936, 6513507, 16777215, 3910932, 2067276, 1146986, 2123412, 2111892, 7148717, 7419530, 11342935, 11345940, 10038562, 11027200, 12745742, 9936031, 6121581, 2894892]).map(c => byAnDr3W.ColorUtils.convert(c, "RGBA"));
					this.props.colorRows = this.props.colors.length ? [this.props.colors.slice(0, parseInt(this.props.colors.length/2)), this.props.colors.slice(parseInt(this.props.colors.length/2))] : [];
					this.props.customColor = !this.props.color || !this.props.customSelected && this.props.colors.indexOf(this.props.color) > -1 ? null : this.props.color;
					this.props.defaultCustomColor = byAnDr3W.ObjectUtils.is(this.props.defaultCustomColor) ? this.props.defaultCustomColor : byAnDr3W.ColorUtils.convert(this.props.defaultCustomColor, "RGBA");
					this.props.customSelected = !!this.props.customColor;
					this.props.pickerConfig = byAnDr3W.ObjectUtils.is(this.props.pickerConfig) ? this.props.pickerConfig : {gradient: true, alpha: true};
					
					const isSingle = !this.props.colors.length;
					return byAnDr3W.ReactUtils.createElement("div", {
						className: isSingle ? byAnDr3W.disCN.colorpickerswatchsinglewrapper : byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.colorpickerswatches, byAnDr3W.disCN.colorpickerswatchescontainer, this.props.disabled && byAnDr3W.disCN.colorpickerswatchesdisabled),
						children: [
							byAnDr3W.ReactUtils.createElement(this.ColorSwatch, {
								swatches: this,
								color: this.props.customColor,
								isSingle: isSingle,
								isCustom: !isSingle,
								isSelected: this.props.customSelected,
								isDisabled: this.props.disabled,
								pickerOpen: this.props.pickerOpen,
								style: {margin: 0}
							}),
							!isSingle && byAnDr3W.ReactUtils.createElement("div", {
								children: this.props.colorRows.map(row => byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.disCN.colorpickerrow,
									children: row.map(color => byAnDr3W.ReactUtils.createElement(this.ColorSwatch, {
										swatches: this,
										color: color,
										isCustom: false,
										isSelected: !this.props.customSelected && color == this.props.color,
										isDisabled: this.props.disabled
									}))
								}))
							}) 
						]
					});
				}
			};

			CustomComponents.DateInput = class byAnDr3W_DateInput extends Internal.LibraryModules.React.Component {
				renderFormatButton(props) {
					const button = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
						className: byAnDr3W.disCN.dateinputbutton,
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
							name: props.svgName,
							width: 20,
							height: 20
						})
					});
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutContainer, {
						width: props.popoutWidth || 350,
						padding: 10,
						animation: Internal.LibraryComponents.PopoutContainer.Animation.SCALE,
						position: Internal.LibraryComponents.PopoutContainer.Positions.TOP,
						align: Internal.LibraryComponents.PopoutContainer.Align.RIGHT,
						onClose: instance => byAnDr3W.DOMUtils.removeClass(instance.domElementRef.current, byAnDr3W.disCN.dateinputbuttonselected),
						renderPopout: instance => {
							byAnDr3W.DOMUtils.addClass(instance.domElementRef.current, byAnDr3W.disCN.dateinputbuttonselected);
							return props.children || byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
								align: Internal.LibraryComponents.Flex.Align.CENTER,
								children: [
									props.name && byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsLabel, {
										label: props.name
									}),
									byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextInput, {
										className: byAnDr3W.disCN.dateinputfield,
										placeholder: props.placeholder,
										value: props.getValue(),
										onChange: typeof props.onChange == "function" ? props.onChange : null
									}),
									props.tooltipText && this.renderInfoButton(props.tooltipText)
								].filter(n => n)
							})
						},
						children: props.name ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
							text: props.name,
							children: button
						}) : button
					});
				}
				renderInfoButton(text, style) {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
						text: [text].flat(10).filter(n => n).map(n => byAnDr3W.ReactUtils.createElement("div", {children: n})),
						tooltipConfig: {
							type: "bottom",
							zIndex: 1009,
							maxWidth: 560
						},
						children: byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.dateinputbutton,
							style: Object.assign({}, style),
							children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
								name: Internal.LibraryComponents.SvgIcon.Names.QUESTIONMARK,
								width: 24,
								height: 24
							})
						})
					});
				}
				handleChange() {
					if (typeof this.props.onChange == "function") this.props.onChange(byAnDr3W.ObjectUtils.extract(this.props, "formatString", "dateString", "timeString", "timeOffset", "language"));
				}
				render() {
					let input = this, formatter, preview;
					const defaultOffset = ((new Date()).getTimezoneOffset() * (-1/60));
					return byAnDr3W.ReactUtils.createElement("div", byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.dateinputwrapper, this.props.className),
						children: [
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsLabel, {
								label: this.props.label
							}),
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.dateinputinner,
								children: [
									byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.disCN.dateinputcontrols,
										children: [
											byAnDr3W.ReactUtils.createElement(class DateInputPreview extends Internal.LibraryModules.React.Component {
												componentDidMount() {formatter = this;}
												render() {
													return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextInput, {
														className: byAnDr3W.disCN.dateinputfield,
														placeholder: Internal.LibraryComponents.DateInput.getDefaultString(input.props.language),
														value: input.props.formatString,
														onChange: value => {
															input.props.formatString = value;
															input.handleChange.apply(input, []);
															byAnDr3W.ReactUtils.forceUpdate(formatter, preview);
														}
													});
												}
											}),
											this.renderInfoButton([
												"$date will be replaced with the Date",
												"$time will be replaced with the Time",
												"$time12 will be replaced with the Time (12h Form)",
												"$month will be replaced with the Month Name",
												"$monthS will be replaced with the Month Name (Short Form)",
												"$day will be replaced with the Weekday Name",
												"$dayS will be replaced with the Weekday Name (Short Form)",
												"$agoAmount will be replaced with ('Today', 'Yesterday', 'x days/weeks/months ago')",
												"$agoDays will be replaced with ('Today', 'Yesterday', 'x days ago')",
												"$agoDate will be replaced with ('Today', 'Yesterday', $date)"
											], {marginRight: 6}),
											this.renderFormatButton({
												name: byAnDr3W.LanguageUtils.LanguageStrings.DATE,
												svgName: Internal.LibraryComponents.SvgIcon.Names.CALENDAR,
												placeholder: this.props.dateString,
												getValue: _ => this.props.dateString,
												tooltipText: [
													"$d will be replaced with the Day",
													"$dd will be replaced with the Day (Forced Zeros)",
													"$m will be replaced with the Month",
													"$mm will be replaced with the Month (Forced Zeros)",
													"$yy will be replaced with the Year (2-Digit)",
													"$yyyy will be replaced with the Year (4-Digit)",
													"$month will be replaced with the Month Name",
													"$monthS will be replaced with the Month Name (Short Form)",
												],
												onChange: value => {
													this.props.dateString = value;
													this.handleChange.apply(this, []);
													byAnDr3W.ReactUtils.forceUpdate(formatter, preview);
												}
											}),
											this.renderFormatButton({
												name: byAnDr3W.LanguageUtils.LibraryStrings.time,
												svgName: Internal.LibraryComponents.SvgIcon.Names.CLOCK,
												placeholder: this.props.timeString,
												getValue: _ => this.props.timeString,
												tooltipText: [
													"$h will be replaced with the Hours",
													"$hh will be replaced with the Hours (Forced Zeros)",
													"$m will be replaced with the Minutes",
													"$mm will be replaced with the Minutes (Forced Zeros)",
													"$s will be replaced with the Seconds",
													"$ss will be replaced with the Seconds (Forced Zeros)",
													"$u will be replaced with the Milliseconds",
													"$uu will be replaced with the Milliseconds (Forced Zeros)"
												],
												onChange: value => {
													this.props.timeString = value;
													this.handleChange.apply(this, []);
													byAnDr3W.ReactUtils.forceUpdate(formatter, preview);
												}
											}),
											this.renderFormatButton({
												name: byAnDr3W.LanguageUtils.LibraryStrings.location,
												svgName: Internal.LibraryComponents.SvgIcon.Names.GLOBE,
												popoutWidth: 550,
												children: [
													byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.AutoFocusCatcher, {}),
													byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
														className: byAnDr3W.disCN.marginbottom4,
														align: Internal.LibraryComponents.Flex.Align.CENTER,
														children: [
															byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsLabel, {
																label: byAnDr3W.LanguageUtils.LanguageStrings.LANGUAGE
															}),
															byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Select, {
																className: byAnDr3W.disCN.dateinputfield,
																value: this.props.language != null ? this.props.language : "$discord",
																options: Object.keys(byAnDr3W.LanguageUtils.languages).map(id => ({
																	value: id,
																	label: byAnDr3W.LanguageUtils.getName(byAnDr3W.LanguageUtils.languages[id])
																})),
																searchable: true,
																optionRenderer: lang => lang.label,
																onChange: value => {
																	this.props.language = value == "$discord" ? undefined : value;
																	this.handleChange.apply(this, []);
																	byAnDr3W.ReactUtils.forceUpdate(formatter, preview);
																}
															})
														]
													}),
													byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
														align: Internal.LibraryComponents.Flex.Align.CENTER,
														children: [
															byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsLabel, {
																label: byAnDr3W.LanguageUtils.LibraryStrings.timezone
															}),
															byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Select, {
																className: byAnDr3W.disCN.dateinputfield,
																value: this.props.timeOffset != null ? this.props.timeOffset : defaultOffset,
																options: [-12.0, -11.0, -10.0, -9.5, -9.0, -8.0, -7.0, -6.0, -5.0, -4.0, -3.5, -3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 5.75, 6.0, 6.5, 7.0, 8.0, 8.75, 9.0, 9.5, 10.0, 10.5, 11.0, 12.0, 12.75, 13.0, 14.0].map(offset => ({label: offset< 0 ? offset : `+${offset}`, value: offset})),
																searchable: true,
																onChange: value => {
																	this.props.timeOffset = value == defaultOffset ? undefined : value;
																	this.handleChange.apply(this, []);
																	byAnDr3W.ReactUtils.forceUpdate(formatter, preview);
																}
															})
														]
													})
												]
											})
										]
									}),
									byAnDr3W.ReactUtils.createElement(class DateInputPreview extends Internal.LibraryModules.React.Component {
										componentDidMount() {preview = this;}
										render() {
											return !input.props.noPreview && byAnDr3W.ReactUtils.createElement("div", {
												className: byAnDr3W.disCN.dateinputpreview,
												children: [
													input.props.prefix && byAnDr3W.ReactUtils.createElement("div", {
														className: byAnDr3W.disCN.dateinputpreviewprefix,
														children: typeof input.props.prefix == "function" ? input.props.prefix(input) : input.props.prefix,
													}),
													byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextScroller, {
														children: Internal.LibraryComponents.DateInput.format(input.props, new Date((new Date()) - (1000*60*60*24*2)))
													}),
													input.props.suffix && byAnDr3W.ReactUtils.createElement("div", {
														className: byAnDr3W.disCN.dateinputpreviewsuffix,
														children: typeof input.props.suffix == "function" ? input.props.suffix(input) : input.props.suffix,
													})
												].filter(n => n)
											});
										}
									})
								]
							})
						]
					}), "onChange", "label", "formatString", "dateString", "timeString", "timeOffset", "language", "noPreview", "prefix", "suffix"));
				}
			};
			CustomComponents.DateInput.getDefaultString = function (language) {
				language = language || byAnDr3W.LanguageUtils.getLanguage().id;
				const date = new Date();
				return date.toLocaleString(language).replace(date.toLocaleDateString(language), "$date").replace(date.toLocaleTimeString(language, {hourCycle: "h12"}), "$time12").replace(date.toLocaleTimeString(language, {hourCycle: "h11"}), "$time12").replace(date.toLocaleTimeString(language, {hourCycle: "h24"}), "$time").replace(date.toLocaleTimeString(language, {hourCycle: "h23"}), "$time");
			};
			CustomComponents.DateInput.parseDate = function (date, offset) {
				let timeObj = date;
				if (typeof timeObj == "string") {
					const language = byAnDr3W.LanguageUtils.getLanguage().id;
					for (let i = 0; i < 12; i++) {
						const tempDate = new Date();
						tempDate.setMonth(i);
						timeObj = timeObj.replace(tempDate.toLocaleDateString(language, {month:"long"}), tempDate.toLocaleDateString("en", {month:"short"}));
					}
					timeObj = new Date(timeObj);
				}
				else if (typeof timeObj == "number") timeObj = new Date(timeObj);
				
				if (timeObj.toString() == "Invalid Date") timeObj = new Date(parseInt(date));
				if (timeObj.toString() == "Invalid Date" || typeof timeObj.toLocaleDateString != "function") timeObj = new Date();
				offset = offset != null && parseFloat(offset);
				if ((offset || offset === 0) && !isNaN(offset)) timeObj = new Date(timeObj.getTime() + ((offset - timeObj.getTimezoneOffset() * (-1/60)) * 60*60*1000));
				return timeObj;
			};
			CustomComponents.DateInput.format = function (data, time) {
				if (typeof data == "string") data = {formatString: data};
				if (data && typeof data.formatString != "string") data.formatString = "";
				if (!data || typeof data.formatString != "string" || !time) return "";
				
				const language = data.language || byAnDr3W.LanguageUtils.getLanguage().id;
				const timeObj = Internal.LibraryComponents.DateInput.parseDate(time, data.timeOffset);
				const now = new Date();
				const daysAgo = Math.round((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(timeObj.getFullYear(), timeObj.getMonth(), timeObj.getDate()))/(1000*60*60*24));
				const date = data.dateString && typeof data.dateString == "string" ? Internal.LibraryComponents.DateInput.formatDate({dateString: data.dateString, language: language}, timeObj) : timeObj.toLocaleDateString(language);
				
				return (data.formatString || Internal.LibraryComponents.DateInput.getDefaultString(language))
					.replace(/\$date/g, date)
					.replace(/\$time12/g, data.timeString && typeof data.timeString == "string" ? Internal.LibraryComponents.DateInput.formatTime({timeString: data.timeString, language: language}, timeObj, true) : timeObj.toLocaleTimeString(language, {hourCycle: "h12"}))
					.replace(/\$time/g, data.timeString && typeof data.timeString == "string" ? Internal.LibraryComponents.DateInput.formatTime({timeString: data.timeString, language: language}, timeObj) : timeObj.toLocaleTimeString(language, {hourCycle: "h23"}))
					.replace(/\$monthS/g, timeObj.toLocaleDateString(language, {month: "short"}))
					.replace(/\$month/g, timeObj.toLocaleDateString(language, {month: "long"}))
					.replace(/\$dayS/g, timeObj.toLocaleDateString(language, {weekday: "short"}))
					.replace(/\$day/g, timeObj.toLocaleDateString(language, {weekday: "long"}))
					.replace(/\$agoAmount/g, daysAgo < 0 ? "" : daysAgo > 1 ? Internal.DiscordObjects.Timestamp(timeObj.getTime()).fromNow() : byAnDr3W.LanguageUtils.LanguageStrings[`SEARCH_SHORTCUT_${daysAgo == 1 ? "YESTERDAY" : "TODAY"}`])
					.replace(/\$agoDays/g, daysAgo < 0 ? "" : daysAgo > 1 ? byAnDr3W.LanguageUtils.LanguageStringsFormat(`GAME_LIBRARY_LAST_PLAYED_DAYS`, daysAgo) : byAnDr3W.LanguageUtils.LanguageStrings[`SEARCH_SHORTCUT_${daysAgo == 1 ? "YESTERDAY" : "TODAY"}`])
					.replace(/\$agoDate/g, daysAgo < 0 ? "" : daysAgo > 1 ? date : byAnDr3W.LanguageUtils.LanguageStrings[`SEARCH_SHORTCUT_${daysAgo == 1 ? "YESTERDAY" : "TODAY"}`])
					.replace(/\(\)|\[\]/g, "").replace(/,\s*$|^\s*,/g, "").replace(/ +/g, " ").trim();
			};
			CustomComponents.DateInput.formatDate = function (data, time) {
				if (typeof data == "string") data = {dateString: data};
				if (data && typeof data.dateString != "string") return "";
				if (!data || typeof data.dateString != "string" || !data.dateString || !time) return "";
				
				const language = data.language || byAnDr3W.LanguageUtils.getLanguage().id;
				const timeObj = Internal.LibraryComponents.DateInput.parseDate(time, data.timeOffset);
				
				return data.dateString
					.replace(/\$monthS/g, timeObj.toLocaleDateString(language, {month: "short"}))
					.replace(/\$month/g, timeObj.toLocaleDateString(language, {month: "long"}))
					.replace(/\$dd/g, timeObj.toLocaleDateString(language, {day: "2-digit"}))
					.replace(/\$d/g, timeObj.toLocaleDateString(language, {day: "numeric"}))
					.replace(/\$mm/g, timeObj.toLocaleDateString(language, {month: "2-digit"}))
					.replace(/\$m/g, timeObj.toLocaleDateString(language, {month: "numeric"}))
					.replace(/\$yyyy/g, timeObj.toLocaleDateString(language, {year: "numeric"}))
					.replace(/\$yy/g, timeObj.toLocaleDateString(language, {year: "2-digit"}))
					.trim();
			};
			CustomComponents.DateInput.formatTime = function (data, time, hour12) {
				if (typeof data == "string") data = {timeString: data};
				if (data && typeof data.timeString != "string") return "";
				if (!data || typeof data.timeString != "string" || !data.timeString || !time) return "";
				
				const language = data.language || byAnDr3W.LanguageUtils.getLanguage().id;
				const timeObj = Internal.LibraryComponents.DateInput.parseDate(time, data.timeOffset);
				
				let hours = timeObj.getHours();
				if (hour12) {
					hours = hours == 0 ? 12 : hours;
					if (hours > 12) hours -= 12;
				}
				const minutes = timeObj.getMinutes();
				const seconds = timeObj.getSeconds();
				const milli = timeObj.getMilliseconds();
				
				let string = data.timeString
					.replace(/\$hh/g, hours < 10 ? `0${hours}` : hours)
					.replace(/\$h/g, hours)
					.replace(/\$mm/g, minutes < 10 ? `0${minutes}` : minutes)
					.replace(/\$m/g, minutes)
					.replace(/\$ss/g, seconds < 10 ? `0${seconds}` : seconds)
					.replace(/\$s/g, seconds)
					.replace(/\$uu/g, milli < 10 ? `00${seconds}` : milli < 100 ? `0${milli}` : milli)
					.replace(/\$u/g, milli)
					.trim();

				let digits = "\\d";
				if (byAnDr3W.LanguageUtils.languages[language] && byAnDr3W.LanguageUtils.languages[language].numberMap) {
					digits = Object.entries(byAnDr3W.LanguageUtils.languages[language].numberMap).map(n => n[1]).join("");
					for (let number in byAnDr3W.LanguageUtils.languages[language].numberMap) string = string.replace(new RegExp(number, "g"), byAnDr3W.LanguageUtils.languages[language].numberMap[number]);
				}
				return hour12 ? timeObj.toLocaleTimeString(language, {hourCycle: "h12"}).replace(new RegExp(`[${digits}]{1,2}[^${digits}][${digits}]{1,2}[^${digits}][${digits}]{1,2}`, "g"), string) : string;
			};
			
			CustomComponents.EmojiPickerButton = reactInitialized && class byAnDr3W_EmojiPickerButton extends Internal.LibraryModules.React.Component {
				handleEmojiChange(emoji) {
					if (emoji != null) {
						this.props.emoji = emoji.id ? {
							id: emoji.id,
							name: emoji.name,
							animated: emoji.animated
						} : {
							id: null,
							name: emoji.optionallyDiverseSequence,
							animated: false
						};
						if (typeof this.props.onSelect == "function") this.props.onSelect(this.props.emoji, this);
						if (typeof this.close == "function" && !byAnDr3W.ListenerUtils.isPressed(16)) this.close();
						byAnDr3W.ReactUtils.forceUpdate(this);
					}
				}
				render() {
					let button = this;
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutContainer, {
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.EmojiButton, {
							className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.emojiinputbutton),
							renderButtonContents: this.props.emoji ? _ => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Emoji, {
								className: byAnDr3W.disCN.emoji,
								emojiId: this.props.emoji.id,
								emojiName: this.props.emoji.name
							}) : null
						}),
						wrap: false,
						animation: Internal.LibraryComponents.PopoutContainer.Animation.NONE,
						position: Internal.LibraryComponents.PopoutContainer.Positions.TOP,
						align: Internal.LibraryComponents.PopoutContainer.Align.LEFT,
						renderPopout: instance => {
							this.close = instance.close;
							return [
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.EmojiPicker, {
									closePopout: this.close,
									onSelectEmoji: this.handleEmojiChange.bind(this),
									allowManagedEmojis: this.props.allowManagedEmojis,
									allowManagedEmojisUsage: this.props.allowManagedEmojisUsage
								}),
								byAnDr3W.ReactUtils.createElement(class extends Internal.LibraryModules.React.Component {
									componentDidMount() {Internal.LibraryComponents.EmojiPickerButton.current = button;}
									componentWillUnmount() {delete Internal.LibraryComponents.EmojiPickerButton.current;}
									render() {return null;}
								})
							];
						}
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.EmojiPickerButton, {allowManagedEmojis: false, allowManagedEmojisUsage: false});
			
			CustomComponents.FavButton = reactInitialized && class byAnDr3W_FavButton extends Internal.LibraryModules.React.Component {
				handleClick() {
					this.props.isFavorite = !this.props.isFavorite;
					if (typeof this.props.onClick == "function") this.props.onClick(this.props.isFavorite, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.favbuttoncontainer, byAnDr3W.disCN.favbutton, this.props.isFavorite && byAnDr3W.disCN.favbuttonselected, this.props.className),
						onClick: this.handleClick.bind(this),
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
							name: Internal.LibraryComponents.SvgIcon.Names[this.props.isFavorite ? "FAVORITE_FILLED" : "FAVORITE"],
							width: this.props.width || 24,
							height: this.props.height || 24,
							className: byAnDr3W.disCN.favbuttonicon
						})
					});
				}
			};
			
			CustomComponents.FileButton = reactInitialized && class byAnDr3W_FileButton extends Internal.LibraryModules.React.Component {
				componentDidMount() {
					if (this.props.searchFolders) {
						let node = byAnDr3W.ReactUtils.findDOMNode(this);
						if (node && (node = node.querySelector("input[type='file']")) != null) {
							node.setAttribute("directory", "");
							node.setAttribute("webkitdirectory", "");
						}
					}
				}
				render() {
					let filter = this.props.filter && [this.props.filter].flat(10).filter(n => typeof n == "string") || [];
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Button, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						onClick: e => {e.currentTarget.querySelector("input").click();},
						children: [
							byAnDr3W.LanguageUtils.LibraryStrings.file_navigator_text,
							byAnDr3W.ReactUtils.createElement("input", {
								type: "file",
								accept: filter.length && (filter.join("/*,") + "/*"),
								style: {display: "none"},
								onChange: e => {
									let file = e.currentTarget.files[0];
									if (this.refInput && file && (!filter.length || filter.some(n => file.type.indexOf(n) == 0))) {
										this.refInput.props.value = this.props.searchFolders ? file.path.split(file.name).slice(0, -1).join(file.name) : `${this.props.mode == "url" ? "url('" : ""}${(this.props.useFilePath) ? file.path : `data:${file.type};base64,${Internal.LibraryRequires.fs.readFileSync(file.path).toString("base64")}`}${this.props.mode ? "')" : ""}`;
										byAnDr3W.ReactUtils.forceUpdate(this.refInput);
										this.refInput.handleChange(this.refInput.props.value);
									}
								}
							})
						]
					}), "filter", "mode", "useFilePath", "searchFolders"));
				}
			};
			
			CustomComponents.FormComponents = {};
			CustomComponents.FormComponents.FormItem = reactInitialized && class byAnDr3W_FormItem extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement("div", {
						className: this.props.className,
						style: this.props.style,
						children: [
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
								align: Internal.LibraryComponents.Flex.Align.BASELINE,
								children: [
									this.props.title != null || this.props.error != null ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex.Child, {
										wrap: true,
										children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormTitle, {
											tag: this.props.tag || Internal.LibraryComponents.FormComponents.FormTitle.Tags.H5,
											disabled: this.props.disabled,
											required: this.props.required,
											error: this.props.error,
											className: this.props.titleClassName,
											children: this.props.title
										})
									}) : null
								].concat([this.props.titleChildren].flat(10)).filter(n => n)
							}),
						].concat(this.props.children)
					});
				}
			};
			
			CustomComponents.GuildComponents = {};
			CustomComponents.GuildComponents.Guild = reactInitialized && class byAnDr3W_Guild extends Internal.LibraryModules.React.Component {
				constructor(props) {
					super(props);
					this.state = {hovered: false};
				}
				handleMouseEnter(e) {
					if (!this.props.sorting) this.setState({hovered: true});
					if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);
				}
				handleMouseLeave(e) {
					if (!this.props.sorting) this.setState({hovered: false});
					if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);
				}
				handleMouseDown(e) {
					if (!this.props.unavailable && this.props.guild && this.props.selectedChannelId) Internal.LibraryModules.DirectMessageUtils.preload(this.props.guild.id, this.props.selectedChannelId);
					if (e.button == 0 && typeof this.props.onMouseDown == "function") this.props.onMouseDown(e, this);
				}
				handleMouseUp(e) {
					if (e.button == 0 && typeof this.props.onMouseUp == "function") this.props.onMouseUp(e, this);
				}
				handleClick(e) {
					if (typeof this.props.onClick == "function") this.props.onClick(e, this);
				}
				handleContextMenu(e) {
					if (this.props.menu) byAnDr3W.GuildUtils.openMenu(this.props.guild, e);
					if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);
				}
				setRef(e) {
					if (typeof this.props.setRef == "function") this.props.setRef(this.props.guild.id, e)
				}
				componentDidMount() {
					let node = byAnDr3W.ReactUtils.findDOMNode(this);
					if (node && node.nodeType != Node.TEXT_NODE) for (let child of node.querySelectorAll("a")) child.setAttribute("draggable", false);
				}
				render() {
					if (!this.props.guild) return null;
					
					this.props.guildId = this.props.guild.id;
					this.props.selectedChannelId = Internal.LibraryModules.LastChannelStore.getChannelId(this.props.guild.id);
					
					let currentVoiceChannel = Internal.LibraryModules.ChannelStore.getChannel(Internal.LibraryModules.CurrentVoiceUtils.getChannelId());
					let hasVideo = currentVoiceChannel && Internal.LibraryModules.VoiceUtils.hasVideo(currentVoiceChannel);
					
					this.props.selected = this.props.state ? Internal.LibraryModules.LastGuildStore.getGuildId() == this.props.guild.id : false;
					this.props.unread = this.props.state ? Internal.LibraryModules.UnreadGuildUtils.hasUnread(this.props.guild.id) : false;
					this.props.badge = this.props.state ? Internal.LibraryModules.UnreadGuildUtils.getMentionCount(this.props.guild.id) : 0;
					
					this.props.mediaState = Object.assign({}, this.props.mediaState, {
						audio: this.props.state ? currentVoiceChannel && currentVoiceChannel.guild_id == this.props.guild.id && !hasVideo : false,
						video: this.props.state ? currentVoiceChannel && currentVoiceChannel.guild_id == this.props.guild.id && hasVideo : false,
						screenshare: this.props.state ? !!Internal.LibraryModules.StreamUtils.getAllApplicationStreams().filter(stream => stream.guildId == this.props.guild.id)[0] : false,
						liveStage: this.props.state ? Object.keys(Internal.LibraryModules.StageChannelStore.getStageInstancesByGuild(this.props.guild.id)).length > 0 : false,
						hasLiveVoiceChannel: this.props.state && false ? !Internal.LibraryModules.MutedUtils.isMuted(this.props.guild.id) && byAnDr3W.ObjectUtils.toArray(Internal.LibraryModules.VoiceUtils.getVoiceStates(this.props.guild.id)).length > 0 : false,
						participating: this.props.state ? Internal.LibraryModules.CurrentVoiceUtils.getGuildId() == this.props.guild.id : false,
						participatingInStage: this.props.state ? currentVoiceChannel && currentVoiceChannel.guild_id == this.props.guild.id && currentVoiceChannel.isGuildStageVoice() : false
					});
					
					this.props.animatable = this.props.state ? this.props.guild.icon && Internal.LibraryModules.IconUtils.isAnimatedIconHash(this.props.guild.icon) : false;
					this.props.unavailable = this.props.state ? Internal.LibraryModules.GuildUnavailableStore.unavailableGuilds.includes(this.props.guild.id) : false;
				
					let isDraggedGuild = this.props.draggingGuildId === this.props.guild.id;
					let guild = isDraggedGuild ? byAnDr3W.ReactUtils.createElement("div", {
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildComponents.DragPlaceholder, {})
					}) : byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.guildcontainer,
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildComponents.BlobMask, {
							selected: this.state.isDropHovering || this.props.selected || this.state.hovered,
							upperBadge: this.props.unavailable ? Internal.LibraryModules.GuildBadgeUtils.renderUnavailableBadge() : Internal.LibraryModules.GuildBadgeUtils.renderMediaBadge(this.props.mediaState),
							lowerBadge: this.props.badge > 0 ? Internal.LibraryModules.GuildBadgeUtils.renderMentionBadge(this.props.badge) : null,
							lowerBadgeWidth: Internal.LibraryComponents.Badges.getBadgeWidthForValue(this.props.badge),
							children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.NavItem, {
								to: {
									pathname: byAnDr3W.DiscordConstants.Routes.CHANNEL(this.props.guild.id, this.props.selectedChannelId),
									state: {
										analyticsSource: {
											page: byAnDr3W.DiscordConstants.AnalyticsPages.GUILD_CHANNEL,
											section: byAnDr3W.DiscordConstants.AnalyticsSections.CHANNEL_LIST,
											object: byAnDr3W.DiscordConstants.AnalyticsObjects.CHANNEL
										}
									}
								},
								name: this.props.guild.name,
								onMouseEnter: this.handleMouseEnter.bind(this),
								onMouseLeave: this.handleMouseLeave.bind(this),
								onMouseDown: this.handleMouseDown.bind(this),
								onMouseUp: this.handleMouseUp.bind(this),
								onClick: this.handleClick.bind(this),
								onContextMenu: this.handleContextMenu.bind(this),
								icon: this.props.guild.getIconURL(this.props.iconSize || 96, this.state.hovered && this.props.animatable),
								selected: this.props.selected || this.state.hovered
							})
						})
					});
					
					let children = [
						this.props.list || this.props.pill ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildComponents.Pill, {
							hovered: !isDraggedGuild && this.state.hovered,
							selected: !isDraggedGuild && this.props.selected,
							unread: !isDraggedGuild && this.props.unread,
							className: byAnDr3W.disCN.guildpill
						}) : null,
						!this.props.tooltip ? guild : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
							tooltipConfig: Object.assign({type: "right"}, this.props.tooltipConfig, {guild: this.props.list && this.props.guild}),
							children: guild
						})
					].filter(n => n);
					return this.props.list ? byAnDr3W.ReactUtils.createElement("div", {
						ref: null != this.props.setRef ? this.props.setRef : null,
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.guildouter, byAnDr3W.disCN._bdguild, this.props.unread && byAnDr3W.disCN._bdguildunread, this.props.selected && byAnDr3W.disCN._bdguildselected, this.props.unread && byAnDr3W.disCN._bdguildunread, this.props.audio && byAnDr3W.disCN._bdguildaudio, this.props.video && byAnDr3W.disCN._bdguildvideo),
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryModules.React.Fragment, {
							children: children
						})
					}) : byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.guild, this.props.className),
						children: children
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.GuildComponents.Guild, {menu: true, tooltip: true, list: false, state: false, draggable: false, sorting: false});
			
			CustomComponents.GuildSummaryItem = reactInitialized && class byAnDr3W_GuildSummaryItem extends Internal.LibraryModules.React.Component {
				defaultRenderGuild(guild, isLast) {
					if (!guild) return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.guildsummaryemptyguild
					});
					let icon = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildComponents.Icon, {
						className: byAnDr3W.disCN.guildsummaryicon,
						guild: guild,
						showTooltip: this.props.showTooltip,
						tooltipPosition: "top",
						size: Internal.LibraryComponents.GuildComponents.Icon.Sizes.SMALLER
					});
					return this.props.switchOnClick ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
						className: byAnDr3W.disCN.guildsummaryclickableicon,
						onClick: _ => Internal.LibraryModules.HistoryUtils.transitionTo(byAnDr3W.DiscordConstants.Routes.CHANNEL(guild.id, Internal.LibraryModules.LastChannelStore.getChannelId(guild.id))),
						key: guild.id,
						tabIndex: -1,
						children: icon
					}) : icon;
				}
				renderGuilds() {
					let elements = [];
					let renderGuild = typeof this.props.renderGuild != "function" ? this.defaultRenderGuild : this.props.renderGuild;
					let loaded = 0, max = this.props.guilds.length === this.props.max ? this.props.guilds.length : this.props.max - 1;
					while (loaded < max && loaded < this.props.guilds.length) {
						let isLast = loaded === this.props.guilds.length - 1;
						let guild = renderGuild.apply(this, [this.props.guilds[loaded], isLast]);
						elements.push(byAnDr3W.ReactUtils.createElement("div", {
							className: isLast ? byAnDr3W.disCN.guildsummaryiconcontainer : byAnDr3W.disCN.guildsummaryiconcontainermasked,
							children: guild
						}));
						loaded++;
					}
					if (loaded < this.props.guilds.length) {
						let rest = Math.min(this.props.guilds.length - loaded, 99);
						elements.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryModules.React.Fragment, {
							key: "more-guilds",
							children: this.props.renderMoreGuilds("+" + rest, rest, this.props.guilds.slice(loaded), this.props)
						}));
					}
					return elements;
				}
				renderIcon() {
					return this.props.renderIcon ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
						name: Internal.LibraryComponents.SvgIcon.Names.WHATISTHIS,
						className: byAnDr3W.disCN.guildsummarysvgicon
					}) : null;
				}
				render() {
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.guildsummarycontainer),
						ref: this.props._ref,
						children: [
							this.renderIcon.apply(this),
							this.renderGuilds.apply(this)
						].flat(10).filter(n => n)
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.GuildSummaryItem, {max: 10, renderMoreGuilds: (count, amount, restGuilds, props) => {
				let icon = byAnDr3W.ReactUtils.createElement("div", {className: byAnDr3W.disCN.guildsummarymoreguilds, children: count});
				return props.showTooltip ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
					text: restGuilds.map(guild => guild.name).join(", "),
					children: icon
				}) : icon;
			}, renderIcon: false});
			
			CustomComponents.GuildVoiceList = reactInitialized && class byAnDr3W_GuildVoiceList extends Internal.LibraryModules.React.Component {
				render() {
					let channels = Internal.LibraryModules.GuildChannelStore.getChannels(this.props.guild.id);
					let voiceChannels = (channels[Internal.LibraryModules.GuildChannelKeys.GUILD_VOCAL_CHANNELS_KEY] || []).filter(c => c.channel.type == byAnDr3W.DiscordConstants.ChannelTypes.GUILD_VOICE).map(c => c.channel.id);
					let stageChannels = (channels[Internal.LibraryModules.GuildChannelKeys.GUILD_VOCAL_CHANNELS_KEY] || []).filter(c => c.channel.type == byAnDr3W.DiscordConstants.ChannelTypes.GUILD_STAGE_VOICE && Internal.LibraryModules.StageChannelStore.getStageInstanceByChannel(c.channel.id)).map(c => c.channel.id);
					let streamOwnerIds = Internal.LibraryModules.StreamUtils.getAllApplicationStreams().filter(app => app.guildId === this.props.guild.id).map(app => app.ownerId) || [];
					let streamOwners = streamOwnerIds.map(ownerId => Internal.LibraryModules.UserStore.getUser(ownerId)).filter(n => n);
					let connectedVoiceUsers = byAnDr3W.ObjectUtils.toArray(Internal.LibraryModules.VoiceUtils.getVoiceStates(this.props.guild.id)).map(state => voiceChannels.includes(state.channelId) && state.channelId != this.props.guild.afkChannelId && !streamOwnerIds.includes(state.userId) && Internal.LibraryModules.UserStore.getUser(state.userId)).filter(n => n);
					let connectedStageUsers = byAnDr3W.ObjectUtils.toArray(Internal.LibraryModules.VoiceUtils.getVoiceStates(this.props.guild.id)).map(state => stageChannels.includes(state.channelId) && state.channelId != this.props.guild.afkChannelId && !streamOwnerIds.includes(state.userId) && Internal.LibraryModules.UserStore.getUser(state.userId)).filter(n => n);
					let children = [
						!connectedStageUsers.length ? null : byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.tooltiprow,
							children: [
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
									name: Internal.LibraryComponents.SvgIcon.Names.PODIUM,
									className: byAnDr3W.disCN.tooltipactivityicon
								}),
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.UserSummaryItem, {
									users: connectedStageUsers,
									max: 6
								})
							]
						}),
						!connectedVoiceUsers.length ? null : byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.tooltiprow,
							children: [
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
									name: Internal.LibraryComponents.SvgIcon.Names.SPEAKER,
									className: byAnDr3W.disCN.tooltipactivityicon
								}),
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.UserSummaryItem, {
									users: connectedVoiceUsers,
									max: 6
								})
							]
						}),
						!streamOwners.length ? null : byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.disCN.tooltiprow,
							children: [
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
									name: Internal.LibraryComponents.SvgIcon.Names.STREAM,
									className: byAnDr3W.disCN.tooltipactivityicon
								}),
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.UserSummaryItem, {
									users: streamOwners,
									max: 6
								})
							]
						})
					].filter(n => n);
					return !children.length ? null : byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.guildvoicelist,
						children: children
					});
				}
			};
			
			CustomComponents.KeybindRecorder = reactInitialized && class byAnDr3W_KeybindRecorder extends Internal.LibraryModules.React.Component {
				handleChange(arrays) {
					this.props.value = arrays.map(platformKey => Internal.LibraryModules.KeyEvents.codes[Internal.LibraryModules.KeyCodeUtils.codeToKey(platformKey)] || platformKey[1]);
					if (typeof this.props.onChange == "function") this.props.onChange(this.props.value, this);
				}
				handleReset() {
					this.props.value = [];
					if (this.recorder) this.recorder.setState({codes: []});
					if (typeof this.props.onChange == "function") this.props.onChange([], this);
					if (typeof this.props.onReset == "function") this.props.onReset(this);
				}
				componentDidMount() {
					if (!this.recorder) this.recorder = byAnDr3W.ReactUtils.findOwner(this, {name: "KeybindRecorder"});
				}
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
						className: byAnDr3W.disCN.hotkeywrapper,
						direction: Internal.LibraryComponents.Flex.Direction.HORIZONTAL,
						align: Internal.LibraryComponents.Flex.Align.CENTER,
						children: [
							byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.KeybindRecorder, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
								defaultValue: [this.props.defaultValue || this.props.value].flat(10).filter(n => n).map(keyCode => [byAnDr3W.DiscordConstants.KeyboardDeviceTypes.KEYBOARD_KEY, Internal.LibraryModules.KeyCodeUtils.keyToCode((Object.entries(Internal.LibraryModules.KeyEvents.codes).find(n => n[1] == keyCode && Internal.LibraryModules.KeyCodeUtils.keyToCode(n[0], null)) || [])[0], null) || keyCode]),
								onChange: this.handleChange.bind(this)
							}), "reset", "onReset")),
							this.props.reset || this.props.onReset ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
								text: byAnDr3W.LanguageUtils.LanguageStrings.REMOVE_KEYBIND,
								tooltipConfig: {type: "top"},
								children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
									className: byAnDr3W.disCN.hotkeyresetbutton,
									onClick: this.handleReset.bind(this),
									children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
										iconSVG: `<svg height="20" width="20" viewBox="0 0 20 20"><path fill="currentColor" d="M 14.348 14.849 c -0.469 0.469 -1.229 0.469 -1.697 0 l -2.651 -3.030 -2.651 3.029 c -0.469 0.469 -1.229 0.469 -1.697 0 -0.469 -0.469 -0.469 -1.229 0 -1.697l2.758 -3.15 -2.759 -3.152 c -0.469 -0.469 -0.469 -1.228 0 -1.697 s 1.228 -0.469 1.697 0 l 2.652 3.031 2.651 -3.031 c 0.469 -0.469 1.228 -0.469 1.697 0 s 0.469 1.229 0 1.697l -2.758 3.152 2.758 3.15 c 0.469 0.469 0.469 1.229 0 1.698 z"></path></svg>`,
									})
								})
							}) : null
						].filter(n => n)
					});
				}
			};
			
			CustomComponents.ListRow = reactInitialized && class byAnDr3W_ListRow extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement("div", byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.listrowwrapper, this.props.className, byAnDr3W.disCN.listrow),
						children: [
							this.props.prefix,
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.listrowcontent,
								style: {flex: "1 1 auto"},
								children: [
									byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.listname, this.props.labelClassName),
										style: {flex: "1 1 auto"},
										children: this.props.label
									}),
									typeof this.props.note == "string" ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormText, {
										type: Internal.LibraryComponents.FormComponents.FormText.Types.DESCRIPTION,
										children: this.props.note
									}) : null
								].filter(n => n)
							}),
							this.props.suffix
						].filter(n => n)
					}), "label", "note", "suffix", "prefix", "labelClassName"));
				}
			};
			
			CustomComponents.MemberRole = reactInitialized && class byAnDr3W_MemberRole extends Internal.LibraryModules.React.Component {
				handleClick(e) {if (typeof this.props.onClick == "function") this.props.onClick(e, this);}
				handleContextMenu(e) {if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);}
				render() {
					let color = byAnDr3W.ColorUtils.convert(this.props.role.colorString, "RGB") || byAnDr3W.DiscordConstants.Colors.PRIMARY_DARK_300;
					return byAnDr3W.ReactUtils.createElement("li", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.userpopoutrole, this.props.className),
						style: {borderColor: byAnDr3W.ColorUtils.setAlpha(color, 0.6)},
						onClick: this.handleClick.bind(this),
						onContextMenu: this.handleContextMenu.bind(this),
						children: [
							!this.props.noCircle ? byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.userpopoutrolecircle,
								style: {backgroundColor: color}
							}) : null,
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.userpopoutrolename,
								children: this.props.role.name
							})
						].filter(n => n)
					});
				}
			};
			
			CustomComponents.MenuItems = {};
			CustomComponents.MenuItems.MenuCheckboxItem = reactInitialized && class byAnDr3W_MenuCheckboxItem extends Internal.LibraryModules.React.Component {
				handleClick() {
					if (this.props.state) {
						this.props.state.checked = !this.props.state.checked;
						if (typeof this.props.action == "function") this.props.action(this.props.state.checked, this);
					}
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.MenuItem, Object.assign({}, this.props, {
						input: this.props.state && this.props.state.checked ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
							className: byAnDr3W.disCN.menuicon,
							background: byAnDr3W.disCN.menucheckbox,
							foreground: byAnDr3W.disCN.menucheck,
							name: Internal.LibraryComponents.SvgIcon.Names.CHECKBOX
						}) : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
							className: byAnDr3W.disCN.menuicon,
							name: Internal.LibraryComponents.SvgIcon.Names.CHECKBOX_EMPTY
						}),
						action: this.handleClick.bind(this)
					}));
				}
			};
			
			CustomComponents.MenuItems.MenuHint = reactInitialized && class byAnDr3W_MenuHint extends Internal.LibraryModules.React.Component {
				render() {
					return !this.props.hint ? null : byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.menuhint,
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextScroller, {
							children: this.props.hint
						})
					});
				}
			};
			
			CustomComponents.MenuItems.MenuIcon = reactInitialized && class byAnDr3W_MenuIcon extends Internal.LibraryModules.React.Component {
				render() {
					let isString = typeof this.props.icon == "string";
					return !this.props.icon ? null : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
						className: byAnDr3W.disCN.menuicon,
						nativeClass: true,
						iconSVG: isString ? this.props.icon : null,
						name: !isString ? this.props.icon : null
					});
				}
			};
			
			CustomComponents.MenuItems.MenuSliderItem = reactInitialized && class byAnDr3W_MenuSliderItem extends Internal.LibraryModules.React.Component {
				handleValueChange(value) {
					if (this.props.state) {
						this.props.state.value = Math.round(byAnDr3W.NumberUtils.mapRange([0, 100], [this.props.minValue, this.props.maxValue], value) * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits);
						if (typeof this.props.onValueChange == "function") this.props.onValueChange(this.props.state.value, this);
					}
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				handleValueRender(value) {
					let newValue = Math.round(byAnDr3W.NumberUtils.mapRange([0, 100], [this.props.minValue, this.props.maxValue], value) * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits);
					if (typeof this.props.onValueRender == "function") {
						let tempReturn = this.props.onValueRender(newValue, this);
						if (tempReturn != undefined) newValue = tempReturn;
					}
					return newValue;
				}
				render() {
					let value = this.props.state && this.props.state.value || 0;
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.MenuControlItem, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						label: typeof this.props.renderLabel == "function" ? this.props.renderLabel(Math.round(value * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits), this) : this.props.label,
						control: (menuItemProps, ref) => {
							return byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.menuslidercontainer,
								children: byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.Slider, Object.assign({}, menuItemProps, {
									ref: ref,
									className: byAnDr3W.disCN.menuslider,
									mini: true,
									initialValue: Math.round(byAnDr3W.NumberUtils.mapRange([this.props.minValue, this.props.maxValue], [0, 100], value) * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits),
									onValueChange: this.handleValueChange.bind(this),
									onValueRender: this.handleValueRender.bind(this)
								}))
							});
						}
					}), "digits", "renderLabel"));
				}
			};
			Internal.setDefaultProps(CustomComponents.MenuItems.MenuSliderItem, {minValue: 0, maxValue: 100, digits: 0});
			
			CustomComponents.ModalComponents = {};
			CustomComponents.ModalComponents.ModalContent = reactInitialized && class byAnDr3W_ModalContent extends Internal.LibraryModules.React.Component {
				render() {
					return this.props.scroller ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Scrollers.Thin, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.modalcontent, this.props.className),
						ref: this.props.scrollerRef,
						children: this.props.children
					}) : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.content && byAnDr3W.disCN.modalcontent, byAnDr3W.disCN.modalnoscroller, this.props.className),
						direction: this.props.direction || Internal.LibraryComponents.Flex.Direction.VERTICAL,
						align: Internal.LibraryComponents.Flex.Align.STRETCH,
						children: this.props.children
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.ModalComponents.ModalContent, {scroller: true, content: true});
			
			CustomComponents.ModalComponents.ModalTabContent = reactInitialized && class byAnDr3W_ModalTabContent extends Internal.LibraryModules.React.Component {
				render() {
					return !this.props.open ? null : byAnDr3W.ReactUtils.createElement(this.props.scroller ? Internal.LibraryComponents.Scrollers.Thin : "div", Object.assign(byAnDr3W.ObjectUtils.exclude(this.props, "scroller", "open"), {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.modaltabcontent, this.props.open && byAnDr3W.disCN.modaltabcontentopen, this.props.className),
						children: this.props.children
					}));
				}
			};
			Internal.setDefaultProps(CustomComponents.ModalComponents.ModalTabContent, {tab: "unnamed"});
			
			CustomComponents.ModalComponents.ModalFooter = reactInitialized && class byAnDr3W_ModalFooter extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.modalfooter, this.props.className),
						direction: this.props.direction || Internal.LibraryComponents.Flex.Direction.HORIZONTAL_REVERSE,
						align: Internal.LibraryComponents.Flex.Align.STRETCH,
						grow: 0,
						shrink: 0,
						children: this.props.children
					});
				}
			};
			
			CustomComponents.MultiInput = reactInitialized && class byAnDr3W_MultiInput extends Internal.LibraryModules.React.Component {
				constructor(props) {
					super(props);
					this.state = {focused: false};
				}
				render() {
					if (this.props.children && this.props.children.props) this.props.children.props.className = byAnDr3W.DOMUtils.formatClassName(this.props.children.props.className, byAnDr3W.disCN.inputmultifield);
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.inputwrapper, byAnDr3W.disCN.inputmultiwrapper),
						children: byAnDr3W.ReactUtils.createElement("div", {
							className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.input, byAnDr3W.disCN.inputmulti, this.state.focused && byAnDr3W.disCN.inputfocused),
							children: [
								byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.DOMUtils.formatClassName(this.props.innerClassName, byAnDr3W.disCN.inputwrapper, byAnDr3W.disCN.inputmultifirst),
									children: this.props.children
								}),
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextInput, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
									className: byAnDr3W.disCN.inputmultilast,
									inputClassName: byAnDr3W.disCN.inputmultifield,
									onFocus: e => this.setState({focused: true}),
									onBlur: e => this.setState({focused: false})
								}), "children", "innerClassName"))
							]
						})
					});
				}
			};
			
			CustomComponents.ListInput = reactInitialized && class byAnDr3W_ListInput extends Internal.LibraryModules.React.Component {
				handleChange() {
					if (typeof this.props.onChange) this.props.onChange(this.props.items, this);
				}
				render() {
					if (!byAnDr3W.ArrayUtils.is(this.props.items)) this.props.items = [];
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.MultiInput, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						className: byAnDr3W.disCN.inputlist,
						innerClassName: byAnDr3W.disCN.inputlistitems,
						onKeyDown: e => {
							if (e.which == 13 && e.target.value && e.target.value.trim()) {
								let value = e.target.value.trim();
								this.props.value = "";
								if (!this.props.items.includes(value)) {
									this.props.items.push(value);
									byAnDr3W.ReactUtils.forceUpdate(this);
									this.handleChange.apply(this, []);
								}
							}
						},
						children: this.props.items.map(item => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Badges.TextBadge, {
							className: byAnDr3W.disCN.inputlistitem,
							color: "var(--byAnDr3W-blurple)",
							style: {borderRadius: "3px"},
							text: [
								item,
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
									className: byAnDr3W.disCN.inputlistdelete,
									name: Internal.LibraryComponents.SvgIcon.Names.CLOSE,
									onClick: _ => {
										byAnDr3W.ArrayUtils.remove(this.props.items, item);
										byAnDr3W.ReactUtils.forceUpdate(this);
										this.handleChange.apply(this, []);
									}
								})
							]
						}))
					}), "items"));
				}
			};
			
			CustomComponents.PaginatedList = reactInitialized && class byAnDr3W_PaginatedList extends Internal.LibraryModules.React.Component {
				constructor(props) {
					super(props);
					this.state = {
						offset: props.offset
					};
				}
				handleJump(offset) {
					if (offset > -1 && offset < Math.ceil(this.props.items.length/this.props.amount) && this.state.offset != offset) {
						this.state.offset = offset;
						if (typeof this.props.onJump == "function") this.props.onJump(offset, this);
						byAnDr3W.ReactUtils.forceUpdate(this);
					}
				}
				renderPagination(bottom) {
					let maxOffset = Math.ceil(this.props.items.length/this.props.amount) - 1;
					return this.props.items.length > this.props.amount && byAnDr3W.ReactUtils.createElement("nav", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.pagination, bottom ? byAnDr3W.disCN.paginationbottom : byAnDr3W.disCN.paginationtop, this.props.mini && byAnDr3W.disCN.paginationmini),
						children: [
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Paginator, {
								totalCount: this.props.items.length,
								currentPage: this.state.offset + 1,
								pageSize: this.props.amount,
								maxVisiblePages: this.props.maxVisiblePages,
								onPageChange: page => {this.handleJump(isNaN(parseInt(page)) ? -1 : page - 1);}
							}),
							this.props.jump && byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextInput, {
								type: "number",
								size: Internal.LibraryComponents.TextInput.Sizes.MINI,
								value: this.state.offset + 1,
								min: 1,
								max: maxOffset + 1,
								onKeyDown: (event, instance) => {if (event.which == 13) this.handleJump(isNaN(parseInt(instance.props.value)) ? -1 : instance.props.value - 1);}
							}),
						].filter(n => n)
					});
				}
				render() {
					let items = [], alphabet = {};
					if (byAnDr3W.ArrayUtils.is(this.props.items) && this.props.items.length) {
						if (!this.props.alphabetKey) items = this.props.items;
						else {
							let unsortedItems = [].concat(this.props.items);
							for (let key of ["0-9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]) {
								let numbers = key == "0-9", alphaItems = [];
								for (let item of unsortedItems) if (item && item[this.props.alphabetKey] && (numbers && !isNaN(parseInt(item[this.props.alphabetKey][0])) || item[this.props.alphabetKey].toUpperCase().indexOf(key) == 0)) alphaItems.push(item);
								for (let sortedItem of alphaItems) byAnDr3W.ArrayUtils.remove(unsortedItems, sortedItem);
								alphabet[key] = {items: byAnDr3W.ArrayUtils.keySort(alphaItems, this.props.alphabetKey), disabled: !alphaItems.length};
							}
							alphabet["?!"] = {items: byAnDr3W.ArrayUtils.keySort(unsortedItems, this.props.alphabetKey), disabled: !unsortedItems.length};
							for (let key in alphabet) items.push(alphabet[key].items);
							items = items.flat(10);
						}
					}
					return typeof this.props.renderItem != "function" || !items.length ? null : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Scrollers.Thin, {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.paginationlist, this.props.mini && byAnDr3W.disCN.paginationlistmini),
						fade: this.props.fade,
						children: [
							this.renderPagination(),
							items.length > this.props.amount && this.props.alphabetKey && byAnDr3W.ReactUtils.createElement("nav", {
								className: byAnDr3W.disCN.paginationlistalphabet,
								children: Object.keys(alphabet).map(key => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
									className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.paginationlistalphabetchar, alphabet[key].disabled &&byAnDr3W.disCN.paginationlistalphabetchardisabled),
									onClick: _ => {if (!alphabet[key].disabled) this.handleJump(Math.floor(items.indexOf(alphabet[key].items[0])/this.props.amount));},
									children: key
								}))
							}),
							this.props.header,
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.paginationlistcontent,
								children: items.slice(this.state.offset * this.props.amount, (this.state.offset + 1) * this.props.amount).map((data, i) => {return this.props.renderItem(data, i);}).flat(10).filter(n => n)
							}),
							this.props.copyToBottom && this.renderPagination(true)
						].flat(10).filter(n => n)
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.PaginatedList, {amount: 50, offset: 0, mini: true, jump: true, maxVisiblePages: 7, copyToBottom: false, fade: true});
			
			CustomComponents.Popout = reactInitialized && class byAnDr3W_Popout extends Internal.LibraryModules.React.Component {
				componentDidMount() {
					this.props.containerInstance.popout = this;
					if (typeof this.props.onOpen == "function") this.props.onOpen(this.props.containerInstance, this);
				}
				componentWillUnmount() {
					delete this.props.containerInstance.popout;
					if (typeof this.props.onClose == "function") this.props.onClose(this.props.containerInstance, this);
				}
				render() {
					if (!this.props.wrap) return this.props.children;
					let pos = typeof this.props.position == "string" ? this.props.position.toLowerCase() : null;
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutFocusLock, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.popoutwrapper, this.props.className, this.props.themed && byAnDr3W.disCN.popoutthemedpopout, this.props.arrow  && byAnDr3W.disCN.popoutarrow, this.props.arrow && (pos == "top" ? byAnDr3W.disCN.popoutarrowtop : byAnDr3W.disCN.popoutarrowbottom)),
						id: this.props.id,
						onClick: e => e.stopPropagation(),
						style: byAnDr3W.ObjectUtils.extract(this.props, "padding", "height", "maxHeight", "minHeight", "width", "maxWidth", "minWidth"),
						children: this.props.children
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.Popout, {themed: true, wrap: true});
			
			CustomComponents.PopoutContainer = reactInitialized && class byAnDr3W_PopoutContainer extends Internal.LibraryModules.React.Component {
				componentDidMount() {
					this.toggle = this.toggle.bind(this);
					this.onDocumentClicked = this.onDocumentClicked.bind(this);
					this.domElementRef = byAnDr3W.ReactUtils.createRef();
					this.domElementRef.current = byAnDr3W.ReactUtils.findDOMNode(this);
				}
				onDocumentClicked() {
					const node = byAnDr3W.ReactUtils.findDOMNode(this.popout);
					if (!node || !document.contains(node) || node != event.target && document.contains(event.target) && !node.contains(event.target)) this.toggle();
				}
				toggle() {
					this.props.open = !this.props.open;
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					const child = (byAnDr3W.ArrayUtils.is(this.props.children) ? this.props.children[0] : this.props.children) || byAnDr3W.ReactUtils.createElement("div", {style: {height: "100%", width: "100%"}});
					child.props.className = byAnDr3W.DOMUtils.formatClassName(child.props.className, this.props.className);
					const childProps = Object.assign({}, child.props);
					child.props.onClick = (e, childThis) => {
						if ((this.props.openOnClick || this.props.openOnClick === undefined)) this.toggle();
						if (typeof this.props.onClick == "function") this.props.onClick(e, this);
						if (typeof childProps.onClick == "function") childProps.onClick(e, childThis);
						if (this.props.killEvent || childProps.killEvent) byAnDr3W.ListenerUtils.stopEvent(e);
					};
					child.props.onContextMenu = (e, childThis) => {
						if (this.props.openOnContextMenu) this.toggle();
						if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);
						if (typeof childProps.onContextMenu == "function") childProps.onContextMenu(e, childThis);
						if (this.props.killEvent || childProps.killEvent) byAnDr3W.ListenerUtils.stopEvent(e);
					};
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryModules.React.Fragment, {
						onClick: this.toggle,
						children: [
							child,
							this.props.open && byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.AppReferencePositionLayer, {
								onMount: _ => byAnDr3W.TimeUtils.timeout(_ => document.addEventListener("click", this.onDocumentClicked)),
								onUnmount: _ => document.removeEventListener("click", this.onDocumentClicked),
								position: this.props.position,
								align: this.props.align,
								reference: this.domElementRef,
								children: _ => {
									const popout = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Popout, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
										className: this.props.popoutClassName,
										containerInstance: this,
										position: this.props.position,
										style: this.props.popoutStyle,
										onOpen: typeof this.props.onOpen == "function" ? this.props.onOpen.bind(this) : _ => {},
										onClose: typeof this.props.onClose == "function" ? this.props.onClose.bind(this) : _ => {},
										children: typeof this.props.renderPopout == "function" ? this.props.renderPopout(this) : null
									}), "popoutStyle", "popoutClassName", "shouldShow", "changing", "renderPopout", "openOnClick", "onClick", "openOnContextMenu", "onContextMenu"));
									const animation = Object.entries(Internal.LibraryComponents.PopoutContainer.Animation).find(n => n[1] == this.props.animation);
									return !animation || this.props.animation == Internal.LibraryComponents.PopoutContainer.Animation.NONE ? popout : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutCSSAnimator, {
										position: this.props.position,
										type: Internal.LibraryComponents.PopoutCSSAnimator.Types[animation[0]],
										children: popout
									});
								}
							})
						]
					});
				}
			};
			Internal.setDefaultProps(CustomComponents.PopoutContainer, {wrap: true});
			
			CustomComponents.QuickSelect = reactInitialized && class byAnDr3W_QuickSelect extends Internal.LibraryModules.React.Component {
				handleChange(option) {
					this.props.value = option;
					if (typeof this.props.onChange == "function") this.props.onChange(option.value || option.key, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					let options = (byAnDr3W.ArrayUtils.is(this.props.options) ? this.props.options : [{}]).filter(n => n);
					let selectedOption = byAnDr3W.ObjectUtils.is(this.props.value) ? this.props.value : (options[0] || {});
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.quickselectwrapper),
						children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
							className: byAnDr3W.disCN.quickselect,
							align: Internal.LibraryComponents.Flex.Align.CENTER,
							children: [
								byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.disCN.quickselectlabel,
									children: this.props.label
								}),
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
									align: Internal.LibraryComponents.Flex.Align.CENTER,
									className: byAnDr3W.disCN.quickselectclick,
									onClick: event => {
										Internal.LibraryModules.ContextMenuUtils.openContextMenu(event, _ => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Menu, {
											navId: "byAnDr3W-quickselect",
											onClose: Internal.LibraryModules.ContextMenuUtils.closeContextMenu,
											className: this.props.popoutClassName,
											children: byAnDr3W.ContextMenuUtils.createItem(Internal.LibraryComponents.MenuItems.MenuGroup, {
												children: options.map((option, i) => {
													let selected = option.value && option.value === selectedOption.value || option.key && option.key === selectedOption.key;
													return byAnDr3W.ContextMenuUtils.createItem(Internal.LibraryComponents.MenuItems.MenuItem, {
														label: option.label,
														id: byAnDr3W.ContextMenuUtils.createItemId("option", option.key || option.value || i),
														action: selected ? null : event2 => this.handleChange.bind(this)(option)
													});
												})
											})
										}));
									},
									children: [
										byAnDr3W.ReactUtils.createElement("div", {
											className: byAnDr3W.disCN.quickselectvalue,
											children: typeof this.props.renderValue == "function" ? this.props.renderValue(this.props.value) : this.props.value.label
										}),
										byAnDr3W.ReactUtils.createElement("div", {
											className: byAnDr3W.disCN.quickselectarrow
										})
									]
								})
							]
						})
					});
				}
			};
			
			CustomComponents.RadioGroup = reactInitialized && class byAnDr3W_RadioGroup extends Internal.LibraryModules.React.Component {
				handleChange(value) {
					this.props.value = value.value;
					if (typeof this.props.onChange == "function") this.props.onChange(value, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.RadioGroup, Object.assign({}, this.props, {
						onChange: this.handleChange.bind(this)
					}));
				}
			};
			
			CustomComponents.SearchBar = reactInitialized && class byAnDr3W_SearchBar extends Internal.LibraryModules.React.Component {
				handleChange(query) {
					this.props.query = query;
					if (typeof this.props.onChange == "function") this.props.onChange(query, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				handleClear() {
					this.props.query = "";
					if (this.props.changeOnClear && typeof this.props.onChange == "function") this.props.onChange("", this);
					if (typeof this.props.onClear == "function") this.props.onClear(this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					let props = Object.assign({}, this.props, {
						onChange: this.handleChange.bind(this),
						onClear: this.handleClear.bind(this)
					});
					if (typeof props.query != "string") props.query = "";
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.SearchBar, props);
				}
			};
			
			CustomComponents.Select = reactInitialized && class byAnDr3W_Select extends Internal.LibraryModules.React.Component {
				handleChange(value) {
					this.props.value = value.value || value;
					if (typeof this.props.onChange == "function") this.props.onChange(value, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.selectwrapper),
						children: byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.SearchableSelect, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
							className: this.props.inputClassName,
							autoFocus: this.props.autoFocus ? this.props.autoFocus : false,
							maxVisibleItems: this.props.maxVisibleItems || 7,
							renderOptionLabel: this.props.optionRenderer,
							onChange: this.handleChange.bind(this)
						}), "inputClassName", "optionRenderer"))
					});
				}
			};
			
			CustomComponents.SettingsGuildList = reactInitialized && class byAnDr3W_SettingsGuildList extends Internal.LibraryModules.React.Component {
				render() {
					this.props.disabled = byAnDr3W.ArrayUtils.is(this.props.disabled) ? this.props.disabled : [];
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
						className: this.props.className,
						wrap: Internal.LibraryComponents.Flex.Wrap.WRAP,
						children: [this.props.includeDMs && {name: byAnDr3W.LanguageUtils.LanguageStrings.DIRECT_MESSAGES, acronym: "DMs", id: byAnDr3W.DiscordConstants.ME, getIconURL: _ => {}}].concat(Internal.LibraryModules.FolderStore.getFlattenedGuilds()).filter(n => n).map(guild => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
							text: guild.name,
							children: byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.DOMUtils.formatClassName(this.props.guildClassName, byAnDr3W.disCN.settingsguild, this.props.disabled.includes(guild.id) && byAnDr3W.disCN.settingsguilddisabled),
								children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.GuildComponents.Icon, {
									guild: guild,
									size: this.props.size || Internal.LibraryComponents.GuildComponents.Icon.Sizes.MEDIUM
								}),
								onClick: e => {
									let isDisabled = this.props.disabled.includes(guild.id);
									if (isDisabled) byAnDr3W.ArrayUtils.remove(this.props.disabled, guild.id, true);
									else this.props.disabled.push(guild.id);
									if (typeof this.props.onClick == "function") this.props.onClick(this.props.disabled, this);
									byAnDr3W.ReactUtils.forceUpdate(this);
								}
							})
						}))
					});
				}
			};
			
			CustomComponents.SettingsPanel = reactInitialized && class byAnDr3W_SettingsPanel extends Internal.LibraryModules.React.Component {
				componentDidMount() {
					this.props._instance = this;
					let node = byAnDr3W.ReactUtils.findDOMNode(this);
					if (node) this.props._node = node;
				}
				componentWillUnmount() {
					if (byAnDr3W.ObjectUtils.is(this.props.addon) && typeof this.props.addon.onSettingsClosed == "function") this.props.addon.onSettingsClosed();
				}
				render() {						
					let panelItems = [
						byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.AutoFocusCatcher, {}),
						typeof this.props.children == "function" ? (_ => {
							return this.props.children(this.props.collapseStates);
						})() : this.props.children
					].flat(10).filter(n => n);
					
					return byAnDr3W.ReactUtils.createElement("div", {
						key: this.props.addon && this.props.addon.name && `${this.props.addon.name}-settingsPanel`,
						id: this.props.addon && this.props.addon.name && `${this.props.addon.name}-settings`,
						className: byAnDr3W.disCN.settingspanel,
						children: panelItems
					});
				}
			};
			
			CustomComponents.SettingsPanelList = reactInitialized && class byAnDr3W_SettingsPanelInner extends Internal.LibraryModules.React.Component {
				render() {
					return this.props.children ? byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.settingspanellistwrapper, this.props.mini && byAnDr3W.disCN.settingspanellistwrappermini),
						children: [
							this.props.dividerTop ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormDivider, {
								className: this.props.mini ? byAnDr3W.disCN.marginbottom4 : byAnDr3W.disCN.marginbottom8
							}) : null,
							typeof this.props.title == "string" ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormTitle, {
								className: byAnDr3W.disCN.marginbottom4,
								tag: Internal.LibraryComponents.FormComponents.FormTitle.Tags.H3,
								children: this.props.title
							}) : null,
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.settingspanellist,
								children: this.props.children
							}),
							this.props.dividerBottom ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormDivider, {
								className: this.props.mini ? byAnDr3W.disCN.margintop4 : byAnDr3W.disCN.margintop8
							}) : null
						]
					}) : null;
				}
			};
			
			CustomComponents.SettingsItem = reactInitialized && class byAnDr3W_SettingsItem extends Internal.LibraryModules.React.Component {
				handleChange(value) {
					if (typeof this.props.onChange == "function") this.props.onChange(value, this);
				}
				render() {
					if (typeof this.props.type != "string" || !["BUTTON", "SELECT", "SLIDER", "SWITCH", "TEXTINPUT"].includes(this.props.type.toUpperCase())) return null;
					let childComponent = Internal.LibraryComponents[this.props.type];
					if (!childComponent) return null;
					if (this.props.mini && childComponent.Sizes) this.props.size = childComponent.Sizes.MINI || childComponent.Sizes.MIN;
					let label = this.props.label ? (this.props.tag ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormTitle, {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.labelClassName, byAnDr3W.disCN.marginreset),
						tag: this.props.tag,
						children: this.props.label
					}) : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsLabel, {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.labelClassName),
						mini: this.props.mini,
						label: this.props.label
					})) : null;
					let margin = this.props.margin != null ? this.props.margin : (this.props.mini ? 0 : 8);
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.settingsrow, byAnDr3W.disCN.settingsrowcontainer, this.props.disabled && byAnDr3W.disCN.settingsrowdisabled, margin != null && (DiscordClasses[`marginbottom${margin}`] && byAnDr3W.disCN[`marginbottom${margin}`] || margin == 0 && byAnDr3W.disCN.marginreset)),
						id: this.props.id,
						children: [
							this.props.dividerTop ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormDivider, {
								className: this.props.mini ? byAnDr3W.disCN.marginbottom4 : byAnDr3W.disCN.marginbottom8
							}) : null,
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.settingsrowlabel,
								children: [
									label && !this.props.basis ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex.Child, {
										grow: 1,
										shrink: 1,
										wrap: true,
										children: label
									}) : label,
									this.props.labelChildren,
									byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex.Child, {
										className: byAnDr3W.disCNS.settingsrowcontrol + byAnDr3W.disCN.flexchild,
										grow: 0,
										shrink: this.props.basis ? 0 : 1,
										basis: this.props.basis,
										wrap: true,
										children: byAnDr3W.ReactUtils.createElement(childComponent, byAnDr3W.ObjectUtils.exclude(Object.assign(byAnDr3W.ObjectUtils.exclude(this.props, "className", "id", "type"), this.props.childProps, {
											onChange: this.handleChange.bind(this),
											onValueChange: this.handleChange.bind(this)
										}), "basis", "margin", "dividerBottom", "dividerTop", "label", "labelClassName", "labelChildren", "tag", "mini", "note", "childProps"))
									})
								].flat(10).filter(n => n)
							}),
							typeof this.props.note == "string" ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex.Child, {
								className: byAnDr3W.disCN.settingsrownote,
								children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormText, {
									disabled: this.props.disabled,
									type: Internal.LibraryComponents.FormComponents.FormText.Types.DESCRIPTION,
									children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextScroller, {speed: 2, children: this.props.note})
								})
							}) : null,
							this.props.dividerBottom ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FormComponents.FormDivider, {
								className: this.props.mini ? byAnDr3W.disCN.margintop4 : byAnDr3W.disCN.margintop8
							}) : null
						]
					});
				}
			};
			
			CustomComponents.SettingsLabel = reactInitialized && class byAnDr3W_SettingsLabel extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextScroller, {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.settingsrowtitle, this.props.mini ? byAnDr3W.disCN.settingsrowtitlemini : byAnDr3W.disCN.settingsrowtitledefault, byAnDr3W.disCN.cursordefault),
						speed: 2,
						children: this.props.label
					});
				}	
			};
			
			CustomComponents.SettingsList = reactInitialized && class byAnDr3W_SettingsList extends Internal.LibraryModules.React.Component {
				componentDidMount() {
					this.checkList();
				}
				componentDidUpdate() {
					this.checkList();
				}
				checkList() {
					let list = byAnDr3W.ReactUtils.findDOMNode(this);
					if (list && !this.props.configWidth) {
						let headers = Array.from(list.querySelectorAll(byAnDr3W.dotCN.settingstableheader));
						headers.shift();
						if (byAnDr3W.DOMUtils.getRects(headers[0]).width == 0) byAnDr3W.TimeUtils.timeout(_ => {this.resizeList(headers);});
						else this.resizeList(headers);
					}
				}
				resizeList(headers) {
					let configWidth = 0, biggestWidth = 0;
					if (!configWidth) {
						for (let header of headers) {
							header.style = "";
							let width = byAnDr3W.DOMUtils.getRects(header).width;
							configWidth = width > configWidth ? width : configWidth;
						}
						configWidth += 4;
						biggestWidth = configWidth;
					}
					if (headers.length * configWidth > 300) {
						this.props.vertical = true;
						configWidth = parseInt(290 / headers.length);
					}
					else if (configWidth < 36) {
						configWidth = 36;
						biggestWidth = configWidth;
					}
					this.props.configWidth = configWidth;
					this.props.biggestWidth = biggestWidth;
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				renderHeaderOption(props) {
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(props.className, byAnDr3W.disCN.colorbase, byAnDr3W.disCN.size10, props.clickable && byAnDr3W.disCN.cursorpointer),
						onClick: _ => {if (typeof this.props.onHeaderClick == "function") this.props.onHeaderClick(props.label, this);},
						onContextMenu: _ => {if (typeof this.props.onHeaderContextMenu == "function") this.props.onHeaderContextMenu(props.label, this);},
						children: byAnDr3W.ReactUtils.createElement("span", {
							children: props.label
						})
					});
				}
				renderItem(props) {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Card, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						className: byAnDr3W.DOMUtils.formatClassName([this.props.cardClassName, props.className].filter(n => n).join(" ").indexOf(byAnDr3W.disCN.card) == -1 && byAnDr3W.disCN.cardprimaryoutline, byAnDr3W.disCN.settingstablecard, this.props.cardClassName, props.className),
						cardId: props.key,
						backdrop: false,
						horizontal: true,
						style: Object.assign({}, this.props.cardStyle, props.style),
						children: [
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.settingstablecardlabel,
								children: this.props.renderLabel(props, this)
							}),
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.settingstablecardconfigs,
								style: {
									width: props.wrapperWidth || null,
									minWidth: props.wrapperWidth || null,
									maxWidth: props.wrapperWidth || null
								},
								children: this.props.settings.map(setting => byAnDr3W.ReactUtils.createElement("div", {
									className: byAnDr3W.disCN.checkboxcontainer,
									children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
										text: setting,
										children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Checkbox, {
											disabled: props.disabled,
											cardId: props.key,
											settingId: setting,
											shape: Internal.LibraryComponents.Checkbox.Shapes && Internal.LibraryComponents.Checkbox.Shapes.ROUND,
											type: Internal.LibraryComponents.Checkbox.Types && Internal.LibraryComponents.Checkbox.Types.INVERTED,
											color: this.props.checkboxColor,
											getColor: this.props.getCheckboxColor,
											value: props[setting],
											getValue: this.props.getCheckboxValue,
											onChange: this.props.onCheckboxChange
										})
									})
								})).flat(10).filter(n => n)
							})
						]
					}), "title", "data", "settings", "renderLabel", "cardClassName", "cardStyle", "checkboxColor", "getCheckboxColor",  "getCheckboxValue", "onCheckboxChange", "configWidth", "biggestWidth", "pagination"));
				}
				render() {
					this.props.settings = byAnDr3W.ArrayUtils.is(this.props.settings) ? this.props.settings : [];
					this.props.renderLabel = typeof this.props.renderLabel == "function" ? this.props.renderLabel : data => data.label;
					this.props.data = (byAnDr3W.ArrayUtils.is(this.props.data) ? this.props.data : [{}]).filter(n => n);
					
					let wrapperWidth = this.props.configWidth && this.props.configWidth * this.props.settings.length;
					let isHeaderClickable = typeof this.props.onHeaderClick == "function" || typeof this.props.onHeaderContextMenu == "function";
					let usePagination = byAnDr3W.ObjectUtils.is(this.props.pagination);
					
					let header = byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.disCN.settingstableheaders,
						style: this.props.vertical && this.props.biggestWidth ? {
							marginTop: this.props.biggestWidth - 15 || 0
						} : {},
						children: [
							this.renderHeaderOption({
								className: byAnDr3W.disCN.settingstableheadername,
								clickable: this.props.title && isHeaderClickable,
								label: this.props.title || ""
							}),
							byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.settingstableheaderoptions,
								style: {
									width: wrapperWidth || null,
									minWidth: wrapperWidth || null,
									maxWidth: wrapperWidth || null
								},
								children: this.props.settings.map(setting => this.renderHeaderOption({
									className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.settingstableheaderoption, this.props.vertical && byAnDr3W.disCN.settingstableheadervertical),
									clickable: isHeaderClickable,
									label: setting
								}))
							})
						]
					});
					return !this.props.data.length ? null : byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.settingstablelist, this.props.className),
						children: [
							!usePagination && header,
							!usePagination ? this.props.data.map(data => this.renderItem(Object.assign({}, data, {wrapperWidth}))) : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PaginatedList, Object.assign({}, this.props.pagination, {
								header: header,
								items: this.props.data,
								renderItem: data => this.renderItem(Object.assign({}, data, {wrapperWidth})),
								onJump: (offset, instance) => {
									this.props.pagination.offset = offset;
									if (typeof this.props.pagination.onJump == "function") this.props.pagination.onJump(offset, this, instance);
								}
							}))
						].filter(n => n)
					});
				}
			};
			
			CustomComponents.SettingsSaveItem = reactInitialized && class byAnDr3W_SettingsSaveItem extends Internal.LibraryModules.React.Component {
				saveSettings(value) {
					if (!byAnDr3W.ArrayUtils.is(this.props.keys) || !byAnDr3W.ObjectUtils.is(this.props.plugin)) return;
					let keys = this.props.keys.filter(n => n);
					let option = keys.shift();
					if (byAnDr3W.ObjectUtils.is(this.props.plugin) && option) {
						let data = byAnDr3W.DataUtils.load(this.props.plugin, option);
						let newC = "";
						for (let key of keys) newC += `{"${key}":`;
						value = value != null && value.value != null ? value.value : value;
						let isString = typeof value == "string";
						let marker = isString ? `"` : ``;
						newC += (marker + (isString ? value.replace(/\\/g, "\\\\") : value) + marker) + "}".repeat(keys.length);
						newC = JSON.parse(newC);
						newC = byAnDr3W.ObjectUtils.is(newC) ? byAnDr3W.ObjectUtils.deepAssign({}, data, newC) : newC;
						byAnDr3W.DataUtils.save(newC, this.props.plugin, option);
						if (!this.props.plugin.settings) this.props.plugin.settings = {};
						this.props.plugin.settings[option] = newC;
						this.props.plugin.SettingsUpdated = true;
					}
					if (typeof this.props.onChange == "function") this.props.onChange(value, this);
				}
				render() {
					if (typeof this.props.type != "string" || !["SELECT", "SLIDER", "SWITCH", "TEXTINPUT"].includes(this.props.type.toUpperCase())) return null;
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsItem, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						onChange: this.saveSettings.bind(this)
					}), "keys", "key", "plugin"));
				}
			};
			
			CustomComponents.SidebarList = reactInitialized && class byAnDr3W_SidebarList extends Internal.LibraryModules.React.Component {
				handleItemSelect(item) {
					this.props.selectedItem = item;
					if (typeof this.props.onItemSelect == "function") this.props.onItemSelect(item, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					let items = (byAnDr3W.ArrayUtils.is(this.props.items) ? this.props.items : [{}]).filter(n => n);
					let selectedItem = this.props.selectedItem || (items[0] || {}).value;
					let selectedElements = (items.find(n => n.value == selectedItem) || {}).elements;
					let renderElement = typeof this.props.renderElement == "function" ? this.props.renderElement : (_ => {});
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(this.props.className, byAnDr3W.disCN.sidebarlist),
						children: [
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Scrollers.Thin, {
								className: byAnDr3W.DOMUtils.formatClassName(this.props.sidebarClassName, byAnDr3W.disCN.sidebar),
								fade: true,
								children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TabBar, {
									itemClassName: this.props.itemClassName,
									type: Internal.LibraryComponents.TabBar.Types.SIDE,
									items: items,
									selectedItem: selectedItem,
									renderItem: this.props.renderItem,
									onItemSelect: this.handleItemSelect.bind(this)
								})
							}),
							byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Scrollers.Thin, {
								className: byAnDr3W.DOMUtils.formatClassName(this.props.contentClassName, byAnDr3W.disCN.sidebarcontent),
								fade: true,
								children: [selectedElements].flat(10).filter(n => n).map(data => renderElement(data))
							})
						]
					});
				}
			};
			
			CustomComponents.Slider = reactInitialized && class byAnDr3W_Slider extends Internal.LibraryModules.React.Component {
				handleMarkerRender(marker) {
					let newMarker = byAnDr3W.NumberUtils.mapRange([0, 100], this.props.edges, marker);
					if (typeof this.props.digits == "number") newMarker = Math.round(newMarker * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits);
					return newMarker;
				}
				handleValueChange(value) {
					let newValue = byAnDr3W.NumberUtils.mapRange([0, 100], this.props.edges, value);
					if (typeof this.props.digits == "number") newValue = Math.round(newValue * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits);
					this.props.defaultValue = this.props.value = newValue;
					if (typeof this.props.onValueChange == "function") this.props.onValueChange(newValue, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				handleValueRender(value) {
					let newValue = byAnDr3W.NumberUtils.mapRange([0, 100], this.props.edges, value);
					if (typeof this.props.digits == "number") newValue = Math.round(newValue * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits);
					if (typeof this.props.onValueRender == "function") {
						let tempReturn = this.props.onValueRender(newValue, this);
						if (tempReturn != undefined) newValue = tempReturn;
					}
					return newValue;
				}
				render() {
					let value = this.props.value || this.props.defaultValue || 0;
					if (!byAnDr3W.ArrayUtils.is(this.props.edges) || this.props.edges.length != 2) this.props.edges = [this.props.min || this.props.minValue || 0, this.props.max || this.props.maxValue || 100];
					this.props.minValue = 0;
					this.props.maxValue = 100;
					let defaultValue = byAnDr3W.NumberUtils.mapRange(this.props.edges, [0, 100], value);
					if (typeof this.props.digits == "number") defaultValue = Math.round(defaultValue * Math.pow(10, this.props.digits)) / Math.pow(10, this.props.digits);
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.Slider, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						initialValue: defaultValue,
						markers: typeof this.props.markerAmount == "number" ? Array.from(Array(this.props.markerAmount).keys()).map((_, i) => i * (this.props.maxValue - this.props.minValue)/10) : undefined,
						onMarkerRender: this.handleMarkerRender.bind(this),
						onValueChange: this.handleValueChange.bind(this),
						onValueRender: this.handleValueRender.bind(this)
					}), "digits", "edges", "max", "min", "markerAmount"));
				}
			};
			Internal.setDefaultProps(CustomComponents.Slider, {hideBubble: false, digits: 3});
			
			CustomComponents.SvgIcon = reactInitialized && class byAnDr3W_Icon extends Internal.LibraryModules.React.Component {
				render() {
					if (byAnDr3W.ObjectUtils.is(this.props.name)) {
						let calcClassName = [];
						if (byAnDr3W.ObjectUtils.is(this.props.name.getClassName)) for (let path in this.props.name.getClassName) {
							if (!path || byAnDr3W.ObjectUtils.get(this, path)) calcClassName.push(byAnDr3W.disCN[this.props.name.getClassName[path]]);
						}
						if (calcClassName.length || this.props.className) this.props.nativeClass = true;
						this.props.iconSVG = this.props.name.icon;
						let props = Object.assign({
							width: 24,
							height: 24,
							color: "currentColor"
						}, this.props.name.defaultProps, this.props, {
							className: byAnDr3W.DOMUtils.formatClassName(calcClassName, this.props.className)
						});
						for (let key in props) this.props.iconSVG = this.props.iconSVG.replace(new RegExp(`%%${key}`, "g"), props[key]);
					}
					if (this.props.iconSVG) {
						let icon = byAnDr3W.ReactUtils.elementToReact(byAnDr3W.DOMUtils.create(this.props.iconSVG));
						if (byAnDr3W.ReactUtils.isValidElement(icon)) {
							icon.props.className = byAnDr3W.DOMUtils.formatClassName(!this.props.nativeClass && byAnDr3W.disCN.svgicon, icon.props.className, this.props.className);
							icon.props.style = Object.assign({}, icon.props.style, this.props.style);
							icon.props = Object.assign({}, byAnDr3W.ObjectUtils.extract(this.props, "onClick", "onContextMenu", "onMouseDown", "onMouseUp", "onMouseEnter", "onMouseLeave"), icon.props);
							return icon;
						}
					}
					return null;
				}
			};
			CustomComponents.SvgIcon.Names = InternalData.SvgIcons || {};
			
			const SwitchIconPaths = {
				a: {
					TOP: "M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z",
					BOTTOM: "M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"
				},
				b: {
					TOP: "M6.56666 11.0013L6.56666 8.96683L13.5667 8.96683L13.5667 11.0013L6.56666 11.0013Z",
					BOTTOM: "M13.5582 8.96683L13.5582 11.0013L6.56192 11.0013L6.56192 8.96683L13.5582 8.96683Z"
				},
				c: {
					TOP: "M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z",
					BOTTOM: "M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"
				}
			};
			const SwitchInner = function (props) {
				let reducedMotion = byAnDr3W.ReactUtils.useContext(Internal.LibraryModules.PreferencesContext.AccessibilityPreferencesContext).reducedMotion;
				let ref = byAnDr3W.ReactUtils.useRef(null);
				let state = byAnDr3W.ReactUtils.useState(false);
				let animation = Internal.LibraryComponents.Animations.useSpring({
					config: {
						mass: 1,
						tension: 250
					},
					opacity: props.disabled ? .3 : 1,
					state: state[0] ? (props.value ? .7 : .3) : (props.value ? 1 : 0)
				});
				let fill = animation.state.to({
					output: [props.uncheckedColor, props.checkedColor]
				});
				let mini = props.size == Internal.LibraryComponents.Switch.Sizes.MINI;
				
				return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.div, {
					className: byAnDr3W.DOMUtils.formatClassName(props.className, byAnDr3W.disCN.switch, mini && byAnDr3W.disCN.switchmini),
					onMouseDown: _ => {
						return !props.disabled && state[1](true);
					},
					onMouseUp: _ => {
						return state[1](false);
					},
					onMouseLeave: _ => {
						return state[1](false);
					},
					style: {
						opacity: animation.opacity,
						backgroundColor: animation.state.to({
							output: [props.uncheckedColor, props.checkedColor]
						})
					},
					tabIndex: -1,
					children: [
						byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.svg, {
							className: byAnDr3W.disCN.switchslider,
							viewBox: "0 0 28 20",
							preserveAspectRatio: "xMinYMid meet",
							style: {
								left: animation.state.to({
									range: [0, .3, .7, 1],
									output: mini ? [-1, 2, 6, 9] : [-3, 1, 8, 12]
								})
							},
							children: [
								byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.rect, {
									fill: "white",
									x: animation.state.to({
										range: [0, .3, .7, 1],
										output: [4, 0, 0, 4]
									}),
									y: animation.state.to({
										range: [0, .3, .7, 1],
										output: [0, 1, 1, 0]
									}),
									height: animation.state.to({
										range: [0, .3, .7, 1],
										output: [20, 18, 18, 20]
									}),
									width: animation.state.to({
										range: [0, .3, .7, 1],
										output: [20, 28, 28, 20]
									}),
									rx: "10"
								}),
								byAnDr3W.ReactUtils.createElement("svg", {
									viewBox: "0 0 20 20",
									fill: "none",
									children: [
										byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.path, {
											fill: fill,
											d: animation.state.to({
												range: [0, .3, .7, 1],
												output: reducedMotion.enabled ? [SwitchIconPaths.a.TOP, SwitchIconPaths.a.TOP, SwitchIconPaths.c.TOP, SwitchIconPaths.c.TOP] : [SwitchIconPaths.a.TOP, SwitchIconPaths.b.TOP, SwitchIconPaths.b.TOP, SwitchIconPaths.c.TOP]
											})
										}),
										byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.path, {
											fill: fill,
											d: animation.state.to({
												range: [0, .3, .7, 1],
												output: reducedMotion.enabled ? [SwitchIconPaths.a.BOTTOM, SwitchIconPaths.a.BOTTOM, SwitchIconPaths.c.BOTTOM, SwitchIconPaths.c.BOTTOM] : [SwitchIconPaths.a.BOTTOM, SwitchIconPaths.b.BOTTOM, SwitchIconPaths.b.BOTTOM, SwitchIconPaths.c.BOTTOM]
											})
										})
									]
								})
							]
						}),
						byAnDr3W.ReactUtils.createElement("input", byAnDr3W.ObjectUtils.exclude(Object.assign({}, props, {
							id: props.id,
							type: "checkbox",
							ref: ref,
							className: byAnDr3W.DOMUtils.formatClassName(props.inputClassName, byAnDr3W.disCN.switchinner),
							tabIndex: props.disabled ? -1 : 0,
							onKeyDown: e => {
								if (!props.disabled && !e.repeat && (e.key == " " || e.key == "Enter")) state[1](true);
							},
							onKeyUp: e => {
								if (!props.disabled && !e.repeat) {
									state[1](false);
									if (e.key == "Enter" && ref.current) ref.current.click();
								}
							},
							onChange: e => {
								state[1](false);
								if (typeof props.onChange == "function") props.onChange(e.currentTarget.checked, e);
							},
							checked: props.value,
							disabled: props.disabled
						}), "uncheckedColor", "checkedColor", "size", "value"))
					]
				});
			};
			CustomComponents.Switch = reactInitialized && class byAnDr3W_Switch extends Internal.LibraryModules.React.Component {
				handleChange() {
					this.props.value = !this.props.value;
					if (typeof this.props.onChange == "function") this.props.onChange(this.props.value, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					return byAnDr3W.ReactUtils.createElement(SwitchInner, Object.assign({}, this.props, {
						onChange: this.handleChange.bind(this)
					}));
				}
			};
			CustomComponents.Switch.Sizes = {
				DEFAULT: "default",
				MINI: "mini",
			};
			Internal.setDefaultProps(CustomComponents.Switch, {
				size: CustomComponents.Switch.Sizes.DEFAULT,
				uncheckedColor: byAnDr3W.DiscordConstants.Colors.PRIMARY_DARK_400,
				checkedColor: byAnDr3W.DiscordConstants.Colors.BRAND
			});
			
			CustomComponents.TabBar = reactInitialized && class byAnDr3W_TabBar extends Internal.LibraryModules.React.Component {
				handleItemSelect(item) {
					this.props.selectedItem = item;
					if (typeof this.props.onItemSelect == "function") this.props.onItemSelect(item, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				render() {
					let items = (byAnDr3W.ArrayUtils.is(this.props.items) ? this.props.items : [{}]).filter(n => n);
					let selectedItem = this.props.selectedItem || (items[0] || {}).value;
					let renderItem = typeof this.props.renderItem == "function" ? this.props.renderItem : (data => data.label || data.value);
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.TabBar, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						selectedItem: selectedItem,
						onItemSelect: this.handleItemSelect.bind(this),
						children: items.map(data => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TabBar.Item, {
							className: byAnDr3W.DOMUtils.formatClassName(this.props.itemClassName, selectedItem == data.value && this.props.itemSelectedClassName),
							itemType: this.props.type,
							id: data.value,
							children: renderItem(data),
							"aria-label": data.label || data.value
						}))
					}), "itemClassName", "items", "renderItem"));
				}
			};
			
			CustomComponents.Table = reactInitialized && class byAnDr3W_Table extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.Table, Object.assign({}, this.props, {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.table, this.props.className),
						headerCellClassName: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tableheadercell, this.props.headerCellClassName),
						sortedHeaderCellClassName: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tableheadercellsorted, this.props.sortedHeaderCellClassName),
						bodyCellClassName: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.tablebodycell, this.props.bodyCellClassName),
						onSort: (sortKey, sortDirection) => {
							this.props.sortDirection = this.props.sortKey != sortKey && sortDirection == Internal.LibraryComponents.Table.SortDirection.ASCENDING && this.props.columns.filter(n => n.key == sortKey)[0].reverse ? Internal.LibraryComponents.Table.SortDirection.DESCENDING : sortDirection;
							this.props.sortKey = sortKey;
							this.props.data = byAnDr3W.ArrayUtils.keySort(this.props.data, this.props.sortKey);
							if (this.props.sortDirection == Internal.LibraryComponents.Table.SortDirection.DESCENDING) this.props.data.reverse();
							if (typeof this.props.onSort == "function") this.props.onSort(this.props.sortKey, this.props.sortDirection);
							byAnDr3W.ReactUtils.forceUpdate(this);
						}
					}));
				}
			};
			
			CustomComponents.TextArea = reactInitialized && class byAnDr3W_TextArea extends Internal.LibraryModules.React.Component {
				handleChange(e) {
					this.props.value = e;
					if (typeof this.props.onChange == "function") this.props.onChange(e, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				handleBlur(e) {if (typeof this.props.onBlur == "function") this.props.onBlur(e, this);}
				handleFocus(e) {if (typeof this.props.onFocus == "function") this.props.onFocus(e, this);}
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.NativeSubComponents.TextArea, Object.assign({}, this.props, {
						onChange: this.handleChange.bind(this),
						onBlur: this.handleBlur.bind(this),
						onFocus: this.handleFocus.bind(this)
					}));
				}
			};
			
			CustomComponents.TextGradientElement = reactInitialized && class byAnDr3W_TextGradientElement extends Internal.LibraryModules.React.Component {
				render() {
					if (this.props.gradient && this.props.children) return byAnDr3W.ReactUtils.createElement("span", {
						children: this.props.children,
						ref: instance => {
							let ele = byAnDr3W.ReactUtils.findDOMNode(instance);
							if (ele) {
								ele.style.setProperty("background-image", this.props.gradient, "important");
								ele.style.setProperty("color", "transparent", "important");
								ele.style.setProperty("-webkit-background-clip", "text", "important");
							}
						}
					});
					return this.props.children || null;
				}
			};
			
			CustomComponents.TextInput = reactInitialized && class byAnDr3W_TextInput extends Internal.LibraryModules.React.Component {
				handleChange(e) {
					let value = e = byAnDr3W.ObjectUtils.is(e) ? e.currentTarget.value : e;
					this.props.value = this.props.valuePrefix && !value.startsWith(this.props.valuePrefix) ? (this.props.valuePrefix + value) : value;
					if (typeof this.props.onChange == "function") this.props.onChange(this.props.value, this);
					byAnDr3W.ReactUtils.forceUpdate(this);
				}
				handleInput(e) {if (typeof this.props.onInput == "function") this.props.onInput(byAnDr3W.ObjectUtils.is(e) ? e.currentTarget.value : e, this);}
				handleKeyDown(e) {if (typeof this.props.onKeyDown == "function") this.props.onKeyDown(e, this);}
				handleBlur(e) {if (typeof this.props.onBlur == "function") this.props.onBlur(e, this);}
				handleFocus(e) {if (typeof this.props.onFocus == "function") this.props.onFocus(e, this);}
				handleMouseEnter(e) {if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);}
				handleMouseLeave(e) {if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);}
				handleNumberButton(ins, value) {
					byAnDr3W.TimeUtils.clear(this.pressedTimeout);
					this.pressedTimeout = byAnDr3W.TimeUtils.timeout(_ => {
						delete this.props.focused;
						byAnDr3W.ReactUtils.forceUpdate(this);
					}, 1000);
					this.props.focused = true;
					this.handleChange.apply(this, [value]);
					this.handleInput.apply(this, [value]);
				}
				componentDidMount() {
					if (this.props.type == "file") {
						let navigatorInstance = byAnDr3W.ReactUtils.findOwner(this, {name: "byAnDr3W_FileButton"});
						if (navigatorInstance) navigatorInstance.refInput = this;
					}
					let input = byAnDr3W.ReactUtils.findDOMNode(this);
					if (!input) return;
					input = input.querySelector("input") || input;
					if (input && !input.patched) {
						input.addEventListener("keydown", e => {
							this.handleKeyDown.apply(this, [e]);
							e.stopImmediatePropagation();
						});
						input.patched = true;
					}
				}
				render() {
					let inputChildren = [
						byAnDr3W.ReactUtils.createElement("input", byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
							className: byAnDr3W.DOMUtils.formatClassName(this.props.size && Internal.LibraryComponents.TextInput.Sizes[this.props.size.toUpperCase()] && byAnDr3W.disCN["input" + this.props.size.toLowerCase()] || byAnDr3W.disCN.inputdefault, this.props.inputClassName, this.props.focused && byAnDr3W.disCN.inputfocused, this.props.error || this.props.errorMessage ? byAnDr3W.disCN.inputerror : (this.props.success && byAnDr3W.disCN.inputsuccess), this.props.disabled && byAnDr3W.disCN.inputdisabled, this.props.editable && byAnDr3W.disCN.inputeditable),
							type: this.props.type == "color" || this.props.type == "file" ? "text" : this.props.type,
							onChange: this.handleChange.bind(this),
							onInput: this.handleInput.bind(this),
							onKeyDown: this.handleKeyDown.bind(this),
							onBlur: this.handleBlur.bind(this),
							onFocus: this.handleFocus.bind(this),
							onMouseEnter: this.handleMouseEnter.bind(this),
							onMouseLeave: this.handleMouseLeave.bind(this),
							maxLength: this.props.type == "file" ? false : this.props.maxLength,
							style: this.props.width ? {width: `${this.props.width}px`} : {},
							ref: this.props.inputRef
						}), "errorMessage", "focused", "error", "success", "inputClassName", "inputChildren", "valuePrefix", "inputPrefix", "size", "editable", "inputRef", "style", "mode", "colorPickerOpen", "noAlpha", "filter", "useFilePath", "searchFolders")),
						this.props.inputChildren,
						this.props.type == "color" ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex.Child, {
							wrap: true,
							children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.ColorSwatches, {
								colors: [],
								color: this.props.value && this.props.mode == "comp" ? byAnDr3W.ColorUtils.convert(this.props.value.split(","), "RGB") : this.props.value,
								onColorChange: color => this.handleChange.apply(this, [!color ? "" : (this.props.mode == "comp" ? byAnDr3W.ColorUtils.convert(color, "RGBCOMP").slice(0, 3).join(",") : byAnDr3W.ColorUtils.convert(color, this.props.noAlpha ? "RGB" : "RGBA"))]),
								pickerOpen: this.props.colorPickerOpen,
								onPickerOpen: _ => this.props.colorPickerOpen = true,
								onPickerClose: _ => delete this.props.colorPickerOpen,
								ref: this.props.controlsRef,
								pickerConfig: {gradient: false, alpha: this.props.mode != "comp" && !this.props.noAlpha}
							})
						}) : null,
						this.props.type == "file" ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.FileButton, {
							filter: this.props.filter,
							mode: this.props.mode,
							useFilePath: this.props.useFilePath,
							searchFolders: this.props.searchFolders,
							ref: this.props.controlsRef
						}) : null
					].flat(10).filter(n => n);
					
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.inputwrapper, this.props.type == "number" && (this.props.size && Internal.LibraryComponents.TextInput.Sizes[this.props.size.toUpperCase()] && byAnDr3W.disCN["inputnumberwrapper" + this.props.size.toLowerCase()] || byAnDr3W.disCN.inputnumberwrapperdefault), this.props.className),
						style: this.props.style,
						children: [
							this.props.inputPrefix ? byAnDr3W.ReactUtils.createElement("span", {
								className: byAnDr3W.disCN.inputprefix
							}) : null,
							this.props.type == "number" ? byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.inputnumberbuttons,
								children: [
									byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.disCN.inputnumberbuttonup,
										onClick: e => {
											let min = parseInt(this.props.min);
											let max = parseInt(this.props.max);
											let newV = parseInt(this.props.value) + 1 || min || 0;
											if (isNaN(max) || !isNaN(max) && newV <= max) this.handleNumberButton.bind(this)(e._targetInst, isNaN(min) || !isNaN(min) && newV >= min ? newV : min);
										}
									}),
									byAnDr3W.ReactUtils.createElement("div", {
										className: byAnDr3W.disCN.inputnumberbuttondown,
										onClick: e => {
											let min = parseInt(this.props.min);
											let max = parseInt(this.props.max);
											let newV = parseInt(this.props.value) - 1 || min || 0;
											if (isNaN(min) || !isNaN(min) && newV >= min) this.handleNumberButton.bind(this)(e._targetInst, isNaN(max) || !isNaN(max) && newV <= max ? newV : max);
										}
									})
								]
							}) : null,
							inputChildren.length == 1 ? inputChildren[0] : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex, {
								align: Internal.LibraryComponents.Flex.Align.CENTER,
								children: inputChildren.map((child, i) => i != 0 ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Flex.Child, {
									shrink: 0,
									children: child
								}) : child)
							}),
							this.props.errorMessage ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TextElement, {
								className: byAnDr3W.disCN.margintop8,
								size: Internal.LibraryComponents.TextElement.Sizes.SIZE_12,
								color: Internal.LibraryComponents.TextElement.Colors.STATUS_RED,
								children: this.props.errorMessage
							}) : null
						].filter(n => n)
					});
				}
			};
			
			CustomComponents.TextScroller = reactInitialized && class byAnDr3W_TextScroller extends Internal.LibraryModules.React.Component {
				render() {
					let scrolling, scroll = _ => {};
					return byAnDr3W.ReactUtils.createElement("div", {
						className: byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN.textscroller, this.props.className),
						style: Object.assign({}, this.props.style, {
							position: "relative",
							display: "block",
							overflow: "hidden"
						}),
						ref: instance => {
							const ele = byAnDr3W.ReactUtils.findDOMNode(instance);
							if (ele && ele.parentElement) {
								const maxWidth = byAnDr3W.DOMUtils.getInnerWidth(ele.parentElement);
								if (maxWidth > 50) ele.style.setProperty("max-width", `${maxWidth}px`);
								if (!this.props.initiated) byAnDr3W.TimeUtils.timeout(_ => {
									this.props.initiated = true;
									if (document.contains(ele.parentElement)) byAnDr3W.ReactUtils.forceUpdate(this);
								}, 3000);
								const Animation = new Internal.LibraryModules.AnimationUtils.Value(0);
								Animation.interpolate({inputRange: [0, 1], outputRange: [0, (byAnDr3W.DOMUtils.getRects(ele.firstElementChild).width - byAnDr3W.DOMUtils.getRects(ele).width) * -1]}).addListener(v => {
									ele.firstElementChild.style.setProperty("display", v.value == 0 ? "inline" : "block", "important");
									ele.firstElementChild.style.setProperty("left", `${v.value}px`, "important");
								});
								scroll = p => {
									const display = ele.firstElementChild.style.getPropertyValue("display");
									ele.firstElementChild.style.setProperty("display", "inline", "important");
									const innerWidth = byAnDr3W.DOMUtils.getRects(ele.firstElementChild).width;
									const outerWidth = byAnDr3W.DOMUtils.getRects(ele).width;
									ele.firstElementChild.style.setProperty("display", display, "important");
									
									let w = p + parseFloat(ele.firstElementChild.style.getPropertyValue("left")) / (innerWidth - outerWidth);
									w = isNaN(w) || !isFinite(w) ? p : w;
									w *= innerWidth / (outerWidth * 2);
									Internal.LibraryModules.AnimationUtils.parallel([Internal.LibraryModules.AnimationUtils.timing(Animation, {toValue: p, duration: Math.sqrt(w**2) * 4000 / (parseInt(this.props.speed) || 1)})]).start();
								};
							}
						},
						onClick: e => {
							if (typeof this.props.onClick == "function") this.props.onClick(e, this);
						},
						onMouseEnter: e => {
							if (byAnDr3W.DOMUtils.getRects(e.currentTarget).width < byAnDr3W.DOMUtils.getRects(e.currentTarget.firstElementChild).width || e.currentTarget.firstElementChild.style.getPropertyValue("display") != "inline") {
								scrolling = true;
								scroll(1);
							}
						},
						onMouseLeave: e => {
							if (scrolling) {
								scrolling = false;
								scroll(0);
							}
						},
						children: byAnDr3W.ReactUtils.createElement("div", {
							style: {
								left: "0",
								position: "relative",
								display: "inline",
								whiteSpace: "nowrap"
							},
							children: this.props.children
						})
					});
				}
			};
			CustomComponents.TooltipContainer = reactInitialized && class byAnDr3W_TooltipContainer extends Internal.LibraryModules.React.Component {
				updateTooltip(text) {
					if (this.tooltip) this.tooltip.update(text);
				}
				render() {
					let child = (typeof this.props.children == "function" ? this.props.children() : (byAnDr3W.ArrayUtils.is(this.props.children) ? this.props.children[0] : this.props.children)) || byAnDr3W.ReactUtils.createElement("div", {});
					child.props.className = byAnDr3W.DOMUtils.formatClassName(child.props.className, this.props.className);
					let childProps = Object.assign({}, child.props);
					let shown = false;
					child.props.onMouseEnter = (e, childThis) => {
						if (!shown && !e.currentTarget.__byAnDr3WtooltipShown && !(this.props.onlyShowOnShift && !e.shiftKey) && !(this.props.onlyShowOnCtrl && !e.ctrlKey)) {
							e.currentTarget.__byAnDr3WtooltipShown = shown = true;
							this.tooltip = byAnDr3W.TooltipUtils.create(e.currentTarget, typeof this.props.text == "function" ? this.props.text(this, e) : this.props.text, Object.assign({
								note: this.props.note,
								delay: this.props.delay
							}, this.props.tooltipConfig, {
								onHide: (tooltip, anker) => {
									delete anker.__byAnDr3WtooltipShown;
									shown = false;
									if (this.props.tooltipConfig && typeof this.props.tooltipConfig.onHide == "function") this.props.tooltipConfig.onHide(tooltip, anker);
								}
							}));
							if (typeof this.props.onMouseEnter == "function") this.props.onMouseEnter(e, this);
							if (typeof childProps.onMouseEnter == "function") childProps.onMouseEnter(e, childThis);
						}
					};
					child.props.onMouseLeave = (e, childThis) => {
						if (typeof this.props.onMouseLeave == "function") this.props.onMouseLeave(e, this);
						if (typeof childProps.onMouseLeave == "function") childProps.onMouseLeave(e, childThis);
					};
					child.props.onClick = (e, childThis) => {
						if (typeof this.props.onClick == "function") this.props.onClick(e, this);
						if (typeof childProps.onClick == "function") childProps.onClick(e, childThis);
						if (typeof this.props.text == "function") this.updateTooltip(this.props.text(this, e));
					};
					child.props.onContextMenu = (e, childThis) => {
						if (typeof this.props.onContextMenu == "function") this.props.onContextMenu(e, this);
						if (typeof childProps.onContextMenu == "function") childProps.onContextMenu(e, childThis);
						if (typeof this.props.text == "function") this.updateTooltip(this.props.text(this, e));
					};
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryModules.React.Fragment, {
						children: child
					});
				}
			};
			
			CustomComponents.UserPopoutContainer = reactInitialized && class byAnDr3W_UserPopoutContainer extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.PopoutContainer, byAnDr3W.ObjectUtils.exclude(Object.assign({}, this.props, {
						wrap: false,
						renderPopout: instance => byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.UserPopout, {
							user: Internal.LibraryModules.UserStore.getUser(this.props.userId),
							userId: this.props.userId,
							channelId: this.props.channelId,
							guildId: this.props.guildId
						}),
					}), "userId", "channelId", "guildId"));
				}
			};
			
			const VideoInner = function (props) {
				let ref = byAnDr3W.ReactUtils.useRef(null);
				byAnDr3W.ReactUtils.useEffect(_ => {
					if (ref.current) props.play ? ref.current.play() : ref.current.pause();
				}, [props.play]);
				return props.naturalWidth <= byAnDr3W.DiscordConstants.MAX_VIDEO_WIDTH && props.naturalHeight <= byAnDr3W.DiscordConstants.MAX_VIDEO_HEIGHT || props.naturalWidth <= byAnDr3W.DiscordConstants.MAX_VIDEO_HEIGHT && props.naturalHeight <= byAnDr3W.DiscordConstants.MAX_VIDEO_WIDTH ? byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.VideoForwardRef, {
					ref: ref,
					className: props.className,
					poster: props.poster,
					src: props.src,
					width: props.width,
					height: props.height,
					muted: true,
					loop: true,
					autoPlay: props.play,
					preload: "none"
				}) : byAnDr3W.ReactUtils.createElement("img", {
					alt: "",
					src: props.poster,
					width: props.width,
					height: props.height
				});
			};
			CustomComponents.Video = reactInitialized && class byAnDr3W_Video extends Internal.LibraryModules.React.Component {
				render() {
					return byAnDr3W.ReactUtils.createElement(VideoInner, this.props);
				}
			};
			
			const NativeSubComponents = {};
			Internal.NativeSubComponents = new Proxy(NativeSubComponents, {
				get: function (_, item) {
					if (NativeSubComponents[item]) return NativeSubComponents[item];
					if (!InternalData.NativeSubComponents[item]) return "div";
					if (InternalData.NativeSubComponents[item].name) {
						if (InternalData.NativeSubComponents[item].protos) {
							NativeSubComponents[item] = byAnDr3W.ModuleUtils.find(m => m && m.displayName == InternalData.NativeSubComponents[item].name && m.prototype && InternalData.NativeSubComponents[item].protos.every(proto => m.prototype[proto]) && m);
							if (!NativeSubComponents[item]) byAnDr3W.LogUtils.warn(`${JSON.stringify([InternalData.NativeSubComponents[item].name, InternalData.NativeSubComponents[item].protos].flat(10))} [name + protos] not found in WebModules`);
						}
						else NativeSubComponents[item] = byAnDr3W.ModuleUtils.findByName(InternalData.NativeSubComponents[item].name);
					}
					else if (InternalData.NativeSubComponents[item].props) NativeSubComponents[item] = byAnDr3W.ModuleUtils.findByProperties(InternalData.NativeSubComponents[item].props);
					return NativeSubComponents[item] ? NativeSubComponents[item] : "div";
				}
			});
			
			const LibraryComponents = {};
			Internal.LibraryComponents = new Proxy(LibraryComponents, {
				get: function (_, item) {
					if (LibraryComponents[item]) return LibraryComponents[item];
					if (!InternalData.LibraryComponents[item] && !CustomComponents[item]) return "div";
					if (InternalData.LibraryComponents[item]) {
						if (InternalData.LibraryComponents[item].name) LibraryComponents[item] = byAnDr3W.ModuleUtils.findByName(InternalData.LibraryComponents[item].name);
						else if (InternalData.LibraryComponents[item].strings) LibraryComponents[item] = byAnDr3W.ModuleUtils.findByString(InternalData.LibraryComponents[item].strings);
						else if (InternalData.LibraryComponents[item].props) LibraryComponents[item] = byAnDr3W.ModuleUtils.findByProperties(InternalData.LibraryComponents[item].props);
						if (InternalData.LibraryComponents[item].value) LibraryComponents[item] = (LibraryComponents[item] || {})[InternalData.LibraryComponents[item].value];
						if (InternalData.LibraryComponents[item].assign) LibraryComponents[item] = Object.assign({}, LibraryComponents[item]);
					}
					if (CustomComponents[item]) LibraryComponents[item] = LibraryComponents[item] ? Object.assign({}, LibraryComponents[item], CustomComponents[item]) : CustomComponents[item];
					
					const NativeComponent = LibraryComponents[item] && Internal.NativeSubComponents[item];
					if (NativeComponent && typeof NativeComponent != "string") {
						for (let key in NativeComponent) if (key != "displayName" && key != "name" && (typeof NativeComponent[key] != "function" || key.charAt(0) == key.charAt(0).toUpperCase())) {
							if (key == "defaultProps") LibraryComponents[item][key] = Object.assign({}, LibraryComponents[item][key], NativeComponent[key]);
							else if (!LibraryComponents[item][key]) LibraryComponents[item][key] = NativeComponent[key];
						}
					}
					if (InternalData.LibraryComponents[item] && InternalData.LibraryComponents[item].children) {
						const SubComponents = LibraryComponents[item] && typeof LibraryComponents[item] == "object" ? LibraryComponents[item] : {};
						const InternalParentData = InternalData.LibraryComponents[item].children;
						LibraryComponents[item] = new Proxy(byAnDr3W.ObjectUtils.is(SubComponents) ? SubComponents : {}, {
							get: function (_, item2) {
								if (CustomComponents[item] && CustomComponents[item][item2]) return CustomComponents[item][item2];
								if (SubComponents[item2]) return SubComponents[item2];
								if (!InternalParentData[item2]) return "div";
								if (InternalParentData[item2].name) SubComponents[item2] = byAnDr3W.ModuleUtils.findByName(InternalParentData[item2].name);
								else if (InternalParentData[item2].strings) SubComponents[item2] = byAnDr3W.ModuleUtils.findByString(InternalParentData[item2].strings);
								else if (InternalParentData[item2].props) SubComponents[item2] = byAnDr3W.ModuleUtils.findByProperties(InternalParentData[item2].props); 
								
								if (InternalParentData[item2].value) SubComponents[item2] = (SubComponents[item2] || {})[InternalParentData[item2].value];
								if (InternalParentData[item2].assign) SubComponents[item] = Object.assign({}, SubComponents[item2]);
								if (CustomComponents[item2]) SubComponents[item2] = SubComponents[item2] ? Object.assign({}, SubComponents[item2], CustomComponents[item2]) : CustomComponents[item2];
								
								const NativeComponent = Internal.NativeSubComponents[item2];
								if (NativeComponent && typeof NativeComponent != "string") {
									for (let key in NativeComponent) if (key != "displayName" && key != "name" && (typeof NativeComponent[key] != "function" || key.charAt(0) == key.charAt(0).toUpperCase())) {
										if (key == "defaultProps") SubComponents[item2][key] = Object.assign({}, SubComponents[item2][key], NativeComponent[key]);
										else if (!SubComponents[item2][key]) SubComponents[item2][key] = NativeComponent[key];
									}
								}
								return SubComponents[item2] ? SubComponents[item2] : "div";
							}
						});
					}
					return LibraryComponents[item] ? LibraryComponents[item] : "div";
				}
			});
			
			byAnDr3W.LibraryComponents = Internal.LibraryComponents;
			
			Internal.createCustomControl = function (data) {
				let controlButton = byAnDr3W.DOMUtils.create(`<button class="${byAnDr3W.DOMUtils.formatClassName(byAnDr3W.disCN._repobutton, byAnDr3W.disCN._repocontrolsbutton, byAnDr3W.disCN._repocontrolscustom)}"></button>`);
				byAnDr3W.ReactUtils.render(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
					nativeClass: true,
					name: data.svgName,
					width: 20,
					height: 20
				}), controlButton);
				controlButton.addEventListener("click", _ => {if (typeof data.onClick == "function") data.onClick();});
				if (data.tooltipText) controlButton.addEventListener("mouseenter", _ => {byAnDr3W.TooltipUtils.create(controlButton, data.tooltipText);});
				return controlButton;
			};
			Internal.appendCustomControls = function (card) {
				if (!card || card.querySelector(byAnDr3W.dotCN._repocontrolscustom)) return;
				let checkbox = card.querySelector(byAnDr3W.dotCN._reposwitch);
				if (!checkbox) return;
				let props = byAnDr3W.ObjectUtils.get(byAnDr3W.ReactUtils.getInstance(card), "return.stateNode.props");
				let plugin = props && props.addon && (props.addon.plugin || props.addon.instance);
				if (plugin && (plugin == libraryInstance || plugin.name && plugin.name && PluginStores.loaded[plugin.name] && PluginStores.loaded[plugin.name] == plugin)) {
					let url = Internal.getPluginURL(plugin);
					let controls = [];
					let footerControls = card.querySelector(byAnDr3W.dotCNS._repofooter + byAnDr3W.dotCN._repocontrols);
					if (plugin.changeLog) controls.push(Internal.createCustomControl({
						tooltipText: byAnDr3W.LanguageUtils.LanguageStrings.CHANGE_LOG,
						svgName: Internal.LibraryComponents.SvgIcon.Names.CHANGELOG,
						onClick: _ => {byAnDr3W.PluginUtils.openChangeLog(plugin);}
					}));
					if (PluginStores.updateData.plugins[url] && PluginStores.updateData.plugins[url].outdated) controls.push(Internal.createCustomControl({
						tooltipText: byAnDr3W.LanguageUtils.LanguageStrings.UPDATE_MANUALLY,
						svgName: Internal.LibraryComponents.SvgIcon.Names.DOWNLOAD,
						onClick: _ => {byAnDr3W.PluginUtils.downloadUpdate(plugin.name, url);}
					}));
					if (footerControls) for (let control of controls) footerControls.insertBefore(control, footerControls.firstElementChild);
					else for (let control of controls) checkbox.parentElement.insertBefore(control, checkbox.parentElement.firstElementChild);
				}
			};
			Internal.addListObserver = function (layer) {
				if (!layer) return;
				byAnDr3W.ObserverUtils.connect(byAnDr3W, layer, {name: "cardObserver", instance: new MutationObserver(changes => {changes.forEach(change => {if (change.addedNodes) {change.addedNodes.forEach(n => {
					if (byAnDr3W.DOMUtils.containsClass(n, byAnDr3W.disCN._repocard)) Internal.appendCustomControls(n);
					if (n.nodeType != Node.TEXT_NODE) for (let c of n.querySelectorAll(byAnDr3W.dotCN._repocard)) Internal.appendCustomControls(c);
					Internal.appendCustomControls(byAnDr3W.DOMUtils.getParent(byAnDr3W.dotCN._repocard, n));
				});}});})}, {childList: true, subtree: true});
				for (let c of layer.querySelectorAll(byAnDr3W.dotCN._repocard)) Internal.appendCustomControls(c);
			}

			const keyDownTimeouts = {};
			byAnDr3W.ListenerUtils.add(byAnDr3W, document, "keydown.byAnDr3WPressedKeys", e => {
				if (!pressedKeys.includes(e.which)) {
					byAnDr3W.TimeUtils.clear(keyDownTimeouts[e.which]);
					pressedKeys.push(e.which);
					keyDownTimeouts[e.which] = byAnDr3W.TimeUtils.timeout(_ => {
						byAnDr3W.ArrayUtils.remove(pressedKeys, e.which, true);
					}, 60000);
				}
			});
			byAnDr3W.ListenerUtils.add(byAnDr3W, document, "keyup.byAnDr3WPressedKeys", e => {
				byAnDr3W.TimeUtils.clear(keyDownTimeouts[e.which]);
				byAnDr3W.ArrayUtils.remove(pressedKeys, e.which, true);
			});
			byAnDr3W.ListenerUtils.add(byAnDr3W, document, "mousedown.byAnDr3WMousePosition", e => {
				mousePosition = e;
			});
			byAnDr3W.ListenerUtils.add(byAnDr3W, window, "focus.byAnDr3WPressedKeysReset", e => {
				pressedKeys = [];
			});
			
			Internal.patchedModules = {
				before: {
					SearchBar: "render",
					EmojiPicker: "type",
					EmojiPickerListRow: "default"
				},
				after: {
					useCopyIdItem: "default",
					Menu: "default",
					SettingsView: "componentDidMount",
					Shakeable: "render",
					Account: ["componentDidMount", "componentDidUpdate"],
					Message: "default",
					MessageToolbar: "type",
					MessageHeader: "default",
					MemberListItem: ["componentDidMount", "componentDidUpdate"],
					PrivateChannel: ["componentDidMount", "componentDidUpdate"],
					AnalyticsContext: ["componentDidMount", "componentDidUpdate"],
					UserPopoutAvatar: "UserPopoutAvatar",
					PeopleListItem: ["componentDidMount", "componentDidUpdate"],
					DiscordTag: "default"
				}
			};
			
			Internal.processUseCopyIdItem = function (e) {
				if (!e.returnvalue) e.returnvalue = false;
			};
			
			const menuExtraPatches = {};
			Internal.processMenu = function (e) {
				if (e.instance.props.navId) switch (e.instance.props.navId) {
					case "guild-header-popout":
						if (menuExtraPatches["guild-header-popout"]) return;
						menuExtraPatches["guild-header-popout"] = true;
						byAnDr3W.TimeUtils.interval((interval, count) => {
							if (count > 20) return byAnDr3W.TimeUtils.clear(interval);
							else {
								let module = byAnDr3W.ModuleUtils.findByString("guild-header-popout");
								if (module) byAnDr3W.PatchUtils.patch(byAnDr3W, module.default.prototype, "render", {after: e2 => {
									byAnDr3W.PatchUtils.patch(byAnDr3W, e2.returnValue.type, "type", {after: e3 => {
										Internal.triggerQueuePatch("GuildHeaderContextMenu", {
											arguments: e3.methodArguments,
											instance: {props: e3.methodArguments[0]},
											returnvalue: e3.returnValue,
											component: e2.returnValue,
											methodname: "type",
											type: "GuildHeaderContextMenu"
										});
									}}, {noCache: true});
								}});
							}
						}, 500);
						return;
				}
				if (!e.instance.props.children || byAnDr3W.ArrayUtils.is(e.instance.props.children) && !e.instance.props.children.length) Internal.LibraryModules.ContextMenuUtils.closeContextMenu();
			};
			
			Internal.processSearchBar = function (e) {
				if (typeof e.instance.props.query != "string") e.instance.props.query = "";
			};
			
			Internal.processSettingsView = function (e) {
				if (e.node && e.node.parentElement && e.node.parentElement.getAttribute("aria-label") == byAnDr3W.DiscordConstants.Layers.USER_SETTINGS) Internal.addListObserver(e.node.parentElement);
			};
		
			let AppViewExport = InternalData.ModuleUtilsConfig.Finder.AppView && byAnDr3W.ModuleUtils.findByString(InternalData.ModuleUtilsConfig.Finder.AppView.strings, false);
			if (AppViewExport) Internal.processShakeable = function (e) {
				let [children, index] = byAnDr3W.ReactUtils.findParent(e.returnvalue, {filter: n => {
					if (!n || typeof n.type != "function") return;
					let typeString = n.type.toString();
					return [InternalData.ModuleUtilsConfig.Finder.AppView.strings].flat(10).filter(n => typeof n == "string").every(string => typeString.indexOf(string) > -1);
				}});
				if (index > -1) children[index] = byAnDr3W.ReactUtils.createElement(AppViewExport.exports.default, children[index].props);
			};
			
			Internal.processMessage = function (e) {
				if (e.returnvalue && e.returnvalue.props && e.returnvalue.props.children && e.returnvalue.props.children.props) {
					let message;
					for (let key in e.instance.props) {
						if (!message) message = byAnDr3W.ObjectUtils.get(e.instance.props[key], "props.message");
						else break;
					}
					if (message) {
						e.returnvalue.props.children.props[InternalData.authorIdAttribute] = message.author.id;
						if (Internal.LibraryModules.RelationshipStore.isFriend(message.author.id)) e.returnvalue.props.children.props[InternalData.authorFriendAttribute] = true;
						if (message.author.id == byAnDr3W.UserUtils.me.id) e.returnvalue.props.children.props[InternalData.authorSelfAttribute] = true;
					}
				}
			};
			
			Internal.processMessageToolbar = function (e) {
				if (document.querySelector(byAnDr3W.dotCN.emojipicker) || !byAnDr3W.ObjectUtils.toArray(PluginStores.loaded).filter(p => p.started).some(p => p.onSystemMessageOptionContextMenu || p.onSystemMessageOptionToolbar || p.onMessageOptionContextMenu || p.onMessageOptionToolbar)) return;
				let toolbar = byAnDr3W.ReactUtils.findChild(e.returnvalue, {filter: c => c && c.props && c.props.showMoreUtilities != undefined && c.props.showEmojiPicker != undefined && c.props.setPopout != undefined});
				if (toolbar) byAnDr3W.PatchUtils.patch(byAnDr3W, toolbar, "type", {after: e2 => {
					let menu = byAnDr3W.ReactUtils.findChild(e2.returnValue, {filter: c => c && c.props && typeof c.props.onRequestClose == "function" && c.props.onRequestClose.toString().indexOf("moreUtilities") > -1});
					let isSystem = byAnDr3W.MessageUtils.isSystemMessage(e2.methodArguments[0] && e2.methodArguments[0].message);
					Internal.triggerQueuePatch(isSystem ? "SystemMessageOptionToolbar" : "MessageOptionToolbar", {
						arguments: e2.methodArguments,
						instance: {props: e2.methodArguments[0]},
						returnvalue: e2.returnValue,
						methodname: "default",
						type: isSystem ? "SystemMessageOptionToolbar" : "MessageOptionToolbar"
					});
					if (menu && typeof menu.props.renderPopout == "function") {
						let renderPopout = menu.props.renderPopout;
						menu.props.renderPopout = byAnDr3W.TimeUtils.suppress((...args) => {
							let renderedPopout = renderPopout(...args);
							renderedPopout.props.updatePosition = _ => {};
							byAnDr3W.PatchUtils.patch(byAnDr3W, renderedPopout, "type", {after: e3 => {
								let isSystem = byAnDr3W.MessageUtils.isSystemMessage(e3.methodArguments[0] && e3.methodArguments[0].message);
								Internal.triggerQueuePatch(isSystem ? "SystemMessageOptionContextMenu" : "MessageOptionContextMenu", {
									arguments: e3.methodArguments,
									instance: {props: e3.methodArguments[0]},
									returnvalue: e3.returnValue,
									methodname: "default",
									type: isSystem ? "SystemMessageOptionContextMenu" : "MessageOptionContextMenu"
								});
							}}, {noCache: true});
							return renderedPopout;
						}, "Error in Popout Render of MessageOptionToolbar!");
					}
				}}, {once: true});
			};

			const byAnDr3W_Patrons = Object.assign({}, InternalData.byAnDr3W_Patrons), byAnDr3W_Patron_Tiers = Object.assign({}, InternalData.byAnDr3W_Patron_Tiers);
			Internal._processAvatarRender = function (user, avatar, wrapper, className) {
				if (byAnDr3W.ReactUtils.isValidElement(avatar) && byAnDr3W.ObjectUtils.is(user) && (avatar.props.className || "").indexOf(byAnDr3W.disCN.byAnDr3Wbadgeavatar) == -1) {
					if (wrapper) wrapper.props[InternalData.userIdAttribute] = user.id;
					avatar.props[InternalData.userIdAttribute] = user.id;
					let role = "", note = "", color, link, addBadge = Internal.settings.general.showSupportBadges;
					if (byAnDr3W_Patrons[user.id] && byAnDr3W_Patrons[user.id].active) {
						link = "https://www.patreon.com/MircoWittrien";
						role = byAnDr3W_Patrons[user.id].text || (byAnDr3W_Patron_Tiers[byAnDr3W_Patrons[user.id].tier] || {}).text;
						note = byAnDr3W_Patrons[user.id].text && (byAnDr3W_Patron_Tiers[byAnDr3W_Patrons[user.id].tier] || {}).text;
						color = byAnDr3W_Patrons[user.id].color;
						className = byAnDr3W.DOMUtils.formatClassName(avatar.props.className, className, addBadge && byAnDr3W.disCN.byAnDr3Whasbadge, byAnDr3W.disCN.byAnDr3Wbadgeavatar, byAnDr3W.disCN.byAnDr3Wsupporter, byAnDr3W.disCN[`byAnDr3Wsupporter${byAnDr3W_Patrons[user.id].tier}`]);
					}
					else if (user.id == InternalData.myId) {
						addBadge = true;
						role = `Theme ${byAnDr3W.LanguageUtils.LibraryStrings.developer}`;
						className = byAnDr3W.DOMUtils.formatClassName(avatar.props.className, className, byAnDr3W.disCN.byAnDr3Whasbadge, byAnDr3W.disCN.byAnDr3Wbadgeavatar, byAnDr3W.disCN.byAnDr3Wdev);
					}
					if (role) {
						delete avatar.props[InternalData.userIdAttribute];
						if (avatar.type == "img") avatar = byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.AvatarComponents.default, Object.assign({}, avatar.props, {
							size: Internal.LibraryComponents.AvatarComponents.Sizes.SIZE_40
						}));
						delete avatar.props.className;
						let newProps = {
							className: className,
							children: [avatar]
						};
						newProps[InternalData.userIdAttribute] = user.id;
						avatar = byAnDr3W.ReactUtils.createElement("div", newProps);
						if (addBadge) avatar.props.children.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.TooltipContainer, {
							text: role,
							note: note,
							tooltipConfig: {backgroundColor: color || ""},
							onClick: link ? (_ => byAnDr3W.DiscordUtils.openLink(link)) : (_ => {}),
							children: byAnDr3W.ReactUtils.createElement("div", {
								className: byAnDr3W.disCN.byAnDr3Wbadge
							})
						}));
						return avatar;
					}
				}
			};
			Internal._processAvatarMount = function (user, avatar, wrapper) {
				if (!user) return;
				if (wrapper) wrapper.setAttribute(InternalData.userIdAttribute, user.id);
				if (Node.prototype.isPrototypeOf(avatar) && (avatar.className || "").indexOf(byAnDr3W.disCN.byAnDr3Wbadgeavatar) == -1) {
					avatar.setAttribute(InternalData.userIdAttribute, user.id);
					let role = "", note = "", color, link, addBadge = Internal.settings.general.showSupportBadges;
					if (byAnDr3W_Patrons[user.id] && byAnDr3W_Patrons[user.id].active) {
						link = "https://www.patreon.com/MircoWittrien";
						role = byAnDr3W_Patrons[user.id].text || (byAnDr3W_Patron_Tiers[byAnDr3W_Patrons[user.id].tier] || {}).text;
						note = byAnDr3W_Patrons[user.id].text && (byAnDr3W_Patron_Tiers[byAnDr3W_Patrons[user.id].tier] || {}).text;
						color = byAnDr3W_Patrons[user.id].color;
						avatar.className = byAnDr3W.DOMUtils.formatClassName(avatar.className, addBadge && byAnDr3W.disCN.byAnDr3Whasbadge, byAnDr3W.disCN.byAnDr3Wbadgeavatar, byAnDr3W.disCN.byAnDr3Wsupporter, byAnDr3W.disCN[`byAnDr3Wsupporter${byAnDr3W_Patrons[user.id].tier}`]);
					}
					else if (user.id == InternalData.myId) {
						addBadge = true;
						role = `Theme ${byAnDr3W.LanguageUtils.LibraryStrings.developer}`;
						avatar.className = byAnDr3W.DOMUtils.formatClassName(avatar.className, addBadge && byAnDr3W.disCN.byAnDr3Whasbadge, byAnDr3W.disCN.byAnDr3Wbadgeavatar, byAnDr3W.disCN.byAnDr3Wdev);
					}
					if (addBadge && role && !avatar.querySelector(byAnDr3W.dotCN.byAnDr3Wbadge)) {
						let badge = document.createElement("div");
						badge.className = byAnDr3W.disCN.byAnDr3Wbadge;
						if (link) badge.addEventListener("click", _ => byAnDr3W.DiscordUtils.openLink(link));
						badge.addEventListener("mouseenter", _ => byAnDr3W.TooltipUtils.create(badge, role, {position: "top", note: note, backgroundColor: color || ""}));
						avatar.appendChild(badge);
					}
				}
			};
			Internal.processAccount = function (e) {
				Internal._processAvatarMount(e.instance.props.currentUser, e.node.querySelector(byAnDr3W.dotCN.avatarwrapper), e.node);
			};
			Internal.processMessageHeader = function (e) {
				if (e.instance.props.message && e.instance.props.message.author) {
					let avatarWrapper = e.returnvalue.props.avatar || byAnDr3W.ObjectUtils.get(e, "returnvalue.props.children.0");
					if (avatarWrapper && avatarWrapper.props && typeof avatarWrapper.props.children == "function") {
						let renderChildren = avatarWrapper.props.children;
						avatarWrapper.props.children = byAnDr3W.TimeUtils.suppress((...args) => {
							let renderedChildren = renderChildren(...args);
							return Internal._processAvatarRender(e.instance.props.message.author, renderedChildren, null, byAnDr3W.disCN.messageavatar) || renderedChildren;
						}, "Error in Avatar Render of MessageHeader!");
					}
					else if (avatarWrapper && avatarWrapper.type == "img") e.returnvalue.props.children[0] = Internal._processAvatarRender(e.instance.props.message.author, avatarWrapper) || avatarWrapper;
				}
			};
			Internal.processMemberListItem = function (e) {
				Internal._processAvatarMount(e.instance.props.user, e.node.querySelector(byAnDr3W.dotCN.avatarwrapper), e.node);
			};
			Internal.processPrivateChannel = function (e) {
				Internal._processAvatarMount(e.instance.props.user, e.node.querySelector(byAnDr3W.dotCN.avatarwrapper), e.node);
			};
			Internal.processAnalyticsContext = function (e) {
				if (e.instance.props.section != byAnDr3W.DiscordConstants.AnalyticsSections.PROFILE_MODAL && e.instance.props.section != byAnDr3W.DiscordConstants.AnalyticsSections.PROFILE_POPOUT) return;
				const user = byAnDr3W.ReactUtils.findValue(e.instance, "user");
				if (!user) return;
				const avatar = e.instance.props.section != byAnDr3W.DiscordConstants.AnalyticsSections.PROFILE_POPOUT && e.node.querySelector(byAnDr3W.dotCN.avatarwrapper);
				const wrapper = e.node.querySelector(byAnDr3W.dotCNC.userpopout + byAnDr3W.dotCN.userprofile) || e.node;
				if (avatar) Internal._processAvatarMount(user, avatar, wrapper);
				if (wrapper) {
					wrapper.setAttribute(InternalData.userIdAttribute, user.id);
					if (InternalData.UserBackgrounds[user.id]) for (let property in InternalData.UserBackgrounds[user.id]) wrapper.style.setProperty(property, InternalData.UserBackgrounds[user.id][property], "important");
				}
			};
			Internal.processUserPopoutAvatar = function (e) {
				if (!e.instance.props.user) return;
				let [children, index] = byAnDr3W.ReactUtils.findParent(e.returnvalue, {props: [["className", byAnDr3W.disCN.userpopoutavatarwrapper]]});
				if (index > -1) children[index] = Internal._processAvatarRender(e.instance.props.user, children[index], null, e.instance) || children[index];
			};
			Internal.processPeopleListItem = function (e) {
				if (e.instance.props.user) e.node.setAttribute(InternalData.userIdAttribute, e.instance.props.user.id);
			};
			Internal.processDiscordTag = function (e) {
				if (e.instance && e.instance.props && e.returnvalue && e.instance.props.user) e.returnvalue.props.user = e.instance.props.user;
			};
			Internal.processEmojiPicker = function (e) {
				if (byAnDr3W.ObjectUtils.toArray(PluginStores.loaded).filter(p => p.started).some(p => p.onSystemMessageOptionContextMenu || p.onSystemMessageOptionToolbar || p.onMessageOptionContextMenu || p.onMessageOptionToolbar)) e.instance.props.persistSearch = true;
			};
			Internal.processEmojiPickerListRow = function (e) {
				if (e.instance.props.emojiDescriptors && Internal.LibraryComponents.EmojiPickerButton.current && Internal.LibraryComponents.EmojiPickerButton.current.props && Internal.LibraryComponents.EmojiPickerButton.current.props.allowManagedEmojisUsage) for (let i in e.instance.props.emojiDescriptors) e.instance.props.emojiDescriptors[i] = Object.assign({}, e.instance.props.emojiDescriptors[i], {isDisabled: false});
			};
			
			Internal.addChunkObserver = function (pluginData, config) {
				let module;
				if (config.stringFind) module = byAnDr3W.ModuleUtils.findByString(config.stringFind, config.exported, true);
				else if (config.propertyFind) module = byAnDr3W.ModuleUtils.findByProperties(config.propertyFind, config.exported, true);
				else if (config.prototypeFind) module = byAnDr3W.ModuleUtils.findByPrototypes(config.prototypeFind, config.exported, true);
				else module = byAnDr3W.ModuleUtils.findByName(config.name, config.exported, true);
				if (module) {
					let exports = !config.exported && module.exports || module;
					exports = config.path && byAnDr3W.ObjectUtils.get(exports, config.path) || exports;
					exports && Internal.patchComponent(pluginData, Internal.isMemoOrForwardRef(exports) ? exports.default : exports, config);
				}
				else {
					if (!PluginStores.chunkObserver[config.mappedType]) {
						PluginStores.chunkObserver[config.mappedType] = {query: [], config};
						let filter;
						if (config.stringFind) filter = m => m && Internal.hasModuleStrings(m, config.stringFind) && m;
						else if (config.propertyFind) filter = m => [config.propertyFind].flat(10).filter(n => n).every(prop => {
							const value = m[prop];
							return value !== undefined && !(typeof value == "string" && !value);
						}) && m;
						else if (config.prototypeFind) filter = m =>  m.prototype && [config.prototypeFind].flat(10).filter(n => n).every(prop => {
							const value = m.prototype[prop];
							return value !== undefined && !(typeof value == "string" && !value);
						}) && m;
						else filter = m => m.displayName === config.name && m || m.render && m.render.displayName === config.name && m || m[config.name] && m[config.name].displayName === name && m[config.name];
						PluginStores.chunkObserver[config.mappedType].filter = filter;
					}
					PluginStores.chunkObserver[config.mappedType].query.push(pluginData);
				}
			};
			Internal.addQueuePatches = function (plugin) {
				if (!InternalData.ModuleUtilsConfig.QueuedComponents) return;
				plugin = plugin == byAnDr3W && Internal || plugin;
				for (let type of InternalData.ModuleUtilsConfig.QueuedComponents) if (typeof plugin[`on${type}`] == "function") {
					if (PluginStores.patchQueues[type].query.indexOf(plugin) == -1) {
						PluginStores.patchQueues[type].query.push(plugin);
						PluginStores.patchQueues[type].query.sort((x, y) => x.name < y.name ? -1 : x.name > y.name ? 1 : 0);
					}
				}
			};
			Internal.triggerQueuePatch = function (type, e) {
				if (e.returnvalue && byAnDr3W.ObjectUtils.is(PluginStores.patchQueues[type]) && byAnDr3W.ArrayUtils.is(PluginStores.patchQueues[type].query)) {
					for (let plugin of PluginStores.patchQueues[type].query) if(typeof plugin[`on${type}`] == "function") plugin[`on${type}`](e);
				}
			};
			Internal.addContextChunkObservers = function (plugin) {
				if (!InternalData.ModuleUtilsConfig.ContextMenuTypes) return;
				plugin = plugin == byAnDr3W && Internal || plugin;
				for (let type of InternalData.ModuleUtilsConfig.ContextMenuTypes) {
					type = `${type}ContextMenu`;
					if (typeof plugin[`on${InternalData.ModuleUtilsConfig.ContextMenuTypesMap[type] || type}`] == "function") {
						for (let module of PluginStores.contextChunkObserver[type].modules) Internal.patchContextMenu(plugin, type, module);
						if (PluginStores.contextChunkObserver[type].query.indexOf(plugin) == -1) {
							PluginStores.contextChunkObserver[type].query.push(plugin);
							PluginStores.contextChunkObserver[type].query.sort((x, y) => x.name < y.name ? -1 : x.name > y.name ? 1 : 0);
						}
					}
				}
			};
			Internal.patchContextMenu = function (plugin, type, module) {
				if (!module || !module.default) return;
				plugin = plugin == byAnDr3W && Internal || plugin;
				const mappedType = InternalData.ModuleUtilsConfig.ContextMenuTypesMap[type] || type;
				if (!InternalData.ModuleUtilsConfig.ContextMenuSubItemsMap[mappedType]) {
					const call = (args, props, returnValue, name) => {
						if (!returnValue || !returnValue.props || !returnValue.props.children || returnValue.props.children.__byAnDr3WPatchesCalled && returnValue.props.children.__byAnDr3WPatchesCalled[plugin.name]) return;
						returnValue.props.children.__byAnDr3WPatchesCalled = Object.assign({}, returnValue.props.children.__byAnDr3WPatchesCalled, {[plugin.name]: true});
						return plugin[`on${mappedType}`]({
							arguments: args,
							instance: {props: props},
							returnvalue: returnValue,
							component: module,
							methodname: "default",
							type: name
						});
					};
					byAnDr3W.PatchUtils.patch(plugin, module, "default", {after: e => {
						if (typeof plugin[`on${mappedType}`] != "function") return;
						else if (e.returnValue && e.returnValue.props.children !== undefined) {
							if (e.returnValue.props.navId) {
								e.returnValue.props.children = [e.returnValue.props.children].flat(10);
								call(e.methodArguments, e.methodArguments[0], e.returnValue, module.default.displayName);
							}
							if (e.returnValue.props.children && e.returnValue.props.children.type && e.returnValue.props.children.type.displayName) {
								const name = e.returnValue.props.children.type.displayName;
								const originalReturn = e.returnValue.props.children.type(e.returnValue.props.children.props);
								if (!originalReturn || !originalReturn.type) return;
								let newType = (...args) => {
									const returnValue = byAnDr3W.ReactUtils.createElement(originalReturn.type, originalReturn.props);
									if (returnValue.props.children) call(args, args[0], returnValue, name);
									else byAnDr3W.PatchUtils.patch(plugin, returnValue, "type", {after: e2 => {
										if (e2.returnValue && typeof plugin[`on${type}`] == "function") call(e2.methodArguments, e2.methodArguments[0], e2.returnValue, name);
									}}, {noCache: true});
									return returnValue;
								};
								newType.displayName = name;
								e.returnValue.props.children = byAnDr3W.ReactUtils.createElement(newType, e.returnValue.props.children.props);
							}
						}
						else byAnDr3W.PatchUtils.patch(plugin, e.returnValue, "type", {after: e2 => {
							if (e2.returnValue && typeof plugin[`on${mappedType}`] == "function") call(e2.methodArguments, e2.methodArguments[0], e2.returnValue, module.default.displayName);
						}}, {noCache: true});
					}}, {name: type});
				}
				else {
					const getProps = (props, keys) => {
						let newProps = Object.assign({}, byAnDr3W.ObjectUtils.is(props) ? props : typeof props == "string" ? {id: props} : {});
						for (const key of [keys].flat(10).filter(n => n)) {
							const store = `${Internal.LibraryModules.StringUtils.upperCaseFirstChar(key)}Store`;
							const getter = `get${Internal.LibraryModules.StringUtils.upperCaseFirstChar(key)}`;
							const value = props && props[key] || Internal.LibraryModules[store] && typeof Internal.LibraryModules[store][getter] == "function" && Internal.LibraryModules[store][getter](props && props.id || props);
							if (value) {
								newProps = Object.assign(newProps, {[key]: value});
								break;
							}
						}
						return newProps;
					};
					byAnDr3W.PatchUtils.patch(plugin, module, "default", {after: e => {
						if (typeof plugin[`on${mappedType}`] != "function") return;
						e.returnValue = [e.returnValue].flat(10).filter(n => n);
						return plugin[`on${mappedType}`]({
							arguments: e.methodArguments,
							instance: {props: InternalData.ModuleUtilsConfig.ContextMenuSubItemsMap[mappedType].keys && getProps(e.methodArguments[0], InternalData.ModuleUtilsConfig.ContextMenuSubItemsMap[mappedType].keys) || e.methodArguments[0]},
							returnvalue: e.returnValue,
							component: module,
							methodname: "default",
							type: type,
							subType: module.__byAnDr3W_ContextMenu_Patch_Name
						});
					}}, {name: type});
				}
			};
			
			byAnDr3W.ReactUtils.instanceKey = Object.keys(document.querySelector(byAnDr3W.dotCN.app) || {}).some(n => n.startsWith("__reactInternalInstance")) ? "_reactInternalFiber" : "_reactInternals";

			byAnDr3W.PluginUtils.load(byAnDr3W);
			Internal.settings = byAnDr3W.DataUtils.get(Internal);
			changeLogs = byAnDr3W.DataUtils.load(byAnDr3W, "changeLogs");
			byAnDr3W.PluginUtils.checkChangeLog(byAnDr3W);
			
			(_ => {
				const chunkName = "webpackChunkdiscord_app";
				const originalPush = window[chunkName].push;
				const patches = {};
				const handlePush = chunk => {
					for (const id in chunk[1]) {
						const origModule = chunk[1][id];
						chunk[1][id] = (module, exports, require) => {
							Reflect.apply(origModule, null, [module, exports, require]);
							const removedTypes = [];
							for (const type in PluginStores.chunkObserver) {
								const foundModule = PluginStores.chunkObserver[type].filter(exports) || exports.default && PluginStores.chunkObserver[type].filter(exports.default);
								if (foundModule) {
									Internal.patchComponent(PluginStores.chunkObserver[type].query, PluginStores.chunkObserver[type].config.exported ? foundModule : exports, PluginStores.chunkObserver[type].config);
									removedTypes.push(type);
									break;
								}
							}
							while (removedTypes.length) delete PluginStores.chunkObserver[removedTypes.pop()];
							
							let found = false, funcString = exports && exports.default && typeof exports.default == "function" && exports.default.toString();
							if (funcString && funcString.indexOf(".page") > -1 && funcString.indexOf(".section") > -1 && funcString.indexOf(".objectType") > -1) {
								const returnValue = exports.default({});
								if (returnValue && returnValue.props && returnValue.props.object == byAnDr3W.DiscordConstants.AnalyticsObjects.CONTEXT_MENU) {
									for (const type in PluginStores.contextChunkObserver) {
										if (PluginStores.contextChunkObserver[type].filter(returnValue.props.children)) {
											exports.__byAnDr3W_ContextMenuWrapper_Patch_Name = exports.__byAnDr3W_ContextMenu_Patch_Name;
											found = true;
											if (PluginStores.contextChunkObserver[type].modules.indexOf(exports) == -1) PluginStores.contextChunkObserver[type].modules.push(exports);
											for (const plugin of PluginStores.contextChunkObserver[type].query) Internal.patchContextMenu(plugin, type, exports);
											break;
										}
									}
								}
							}
							if (!found) for (const type in PluginStores.contextChunkObserver) {
								if (PluginStores.contextChunkObserver[type].filter(exports)) {
									if (PluginStores.contextChunkObserver[type].modules.indexOf(exports) == -1) PluginStores.contextChunkObserver[type].modules.push(exports);
									for (const plugin of PluginStores.contextChunkObserver[type].query) Internal.patchContextMenu(plugin, type, exports);
									break;
								}
							}
						};
						Object.assign(chunk[1][id], origModule, {toString: _ => origModule.toString()});
						patches[id] = [chunk, origModule];
					}
					return Reflect.apply(originalPush, window[chunkName], [chunk]);
				};
				
				Object.defineProperty(window[chunkName], "push", {
					configurable: true,
					get: _ => handlePush,
					set: newPush => {
						originalPush = newPush;
						Object.defineProperty(window[chunkName], "push", {
							value: handlePush,
							configurable: true,
							writable: true
						});
					}
				});
				Internal.removeChunkObserver = _ => {
					for (let id in patches) {
						patches[id][0] = patches[id][1];
						patches[id] = null;
					}
					Object.defineProperty(window[chunkName], "push", {
						configurable: true,
						get: _ => (chunk => Reflect.apply(originalPush, window[chunkName], [chunk]))
					});
				};
			})();
			
			if (InternalData.ModuleUtilsConfig.ContextMenuTypes) for (let type of InternalData.ModuleUtilsConfig.ContextMenuTypes) {
				type = `${type}ContextMenu`;
				if (!PluginStores.contextChunkObserver[type]) {
					const mappedType = InternalData.ModuleUtilsConfig.ContextMenuTypesMap[type] || type;
					PluginStores.contextChunkObserver[type] = {query: [], modules: []};
					if (!InternalData.ModuleUtilsConfig.ContextMenuSubItemsMap[mappedType]) PluginStores.contextChunkObserver[type].filter = m => {
						if (!m || !(m.default || m.type)) return;
						const d = m.default || m.type;
						if (d.displayName && d.displayName.endsWith("ContextMenu") && `${InternalData.ModuleUtilsConfig.ContextMenuTypes.find(t => d.displayName.indexOf(t) > -1)}ContextMenu` == type) {
							m.__byAnDr3W_ContextMenu_Patch_Name = type;
							return true;
						}
						else if (m.__byAnDr3W_ContextMenuWrapper_Patch_Name && m.__byAnDr3W_ContextMenuWrapper_Patch_Name.endsWith("ContextMenu") && `${InternalData.ModuleUtilsConfig.ContextMenuTypes.find(t => m.__byAnDr3W_ContextMenuWrapper_Patch_Name.indexOf(t) > -1)}ContextMenu` == type) {
							m.__byAnDr3W_ContextMenu_Patch_Name = type;
							return true;
						}
					};
					else PluginStores.contextChunkObserver[type].filter = m => {
						if (!m || !(m.default || m.type)) return;
						const d = m.default || m.type;
						if (d.displayName && InternalData.ModuleUtilsConfig.ContextMenuSubItemsMap[mappedType].items.indexOf(d.displayName) > -1) {
							m.__byAnDr3W_ContextMenu_Patch_Name = d.displayName;
							return true;
						}
						else {
							const subType = InternalData.ModuleUtilsConfig.ContextMenuSubItemsMap[mappedType].items.find(item => InternalData.ModuleUtilsConfig.Finder[item] && InternalData.ModuleUtilsConfig.Finder[item].strings && Internal.hasModuleStrings(d, InternalData.ModuleUtilsConfig.Finder[item].strings));
							if (subType) {
								m.__byAnDr3W_ContextMenu_Patch_Name = subType;
								return true;
							}
						}
					};
					PluginStores.contextChunkObserver[type].modules = byAnDr3W.ModuleUtils.find(PluginStores.contextChunkObserver[type].filter, {useExport: false, all: true}).map(m => m.exports).filter(n => n);
				}
			}
			
			Internal.patchPlugin(byAnDr3W);
			Internal.addQueuePatches(byAnDr3W);
			Internal.addContextChunkObservers(byAnDr3W);
			
			if (InternalData.ModuleUtilsConfig.QueuedComponents) for (let type of InternalData.ModuleUtilsConfig.QueuedComponents) if (!PluginStores.patchQueues[type]) PluginStores.patchQueues[type] = {query: [], modules: []};
			
			let languageChangeTimeout;
			if (Internal.LibraryModules.SettingsUtilsOld) byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryModules.SettingsUtilsOld, ["updateRemoteSettings", "updateLocalSettings"], {after: e => {
				if (e.methodArguments[0] && e.methodArguments[0].locale) {
					byAnDr3W.TimeUtils.clear(languageChangeTimeout);
					languageChangeTimeout = byAnDr3W.TimeUtils.timeout(_ => {
						for (let pluginName in PluginStores.loaded) if (PluginStores.loaded[pluginName].started) byAnDr3W.PluginUtils.translate(PluginStores.loaded[pluginName]);
					}, 10000);
				}
			}});
			
			Internal.onSettingsClosed = function () {
				if (Internal.SettingsUpdated) {
					delete Internal.SettingsUpdated;
					Internal.forceUpdateAll();
				}
			};
			
			Internal.forceUpdateAll = function () {					
				byAnDr3W.MessageUtils.rerenderAll();
				byAnDr3W.PatchUtils.forceAllUpdates(byAnDr3W);
			};
			
			if (Internal.LibraryComponents.GuildComponents.BlobMask) {
				let newBadges = ["lowerLeftBadge", "upperLeftBadge"];
				byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryComponents.GuildComponents.BlobMask.prototype, "render", {
					before: e => {
						e.thisObject.props = Object.assign({}, Internal.LibraryComponents.GuildComponents.BlobMask.defaultProps, e.thisObject.props);
						for (let type of newBadges) if (!e.thisObject.state[`${type}Mask`]) e.thisObject.state[`${type}Mask`] = new Internal.LibraryComponents.Animations.Controller({spring: 0});
					},
					after: e => {
						let [children, index] = byAnDr3W.ReactUtils.findParent(e.returnValue, {name: "TransitionGroup"});
						if (index > -1) {
							children[index].props.children.push(!e.thisObject.props.lowerLeftBadge ? null : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.BadgeAnimationContainer, {
								className: byAnDr3W.disCN.guildlowerleftbadge,
								key: "lower-left-badge",
								animatedStyle: e.thisObject.getLowerLeftBadgeStyles(),
								children: e.thisObject.props.lowerLeftBadge
							}));
							children[index].props.children.push(!e.thisObject.props.upperLeftBadge ? null : byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.BadgeAnimationContainer, {
								className: byAnDr3W.disCN.guildupperleftbadge,
								key: "upper-left-badge",
								animatedStyle: e.thisObject.getUpperLeftBadgeStyles(),
								children: e.thisObject.props.upperLeftBadge
							}));
						}
						[children, index] = byAnDr3W.ReactUtils.findParent(e.returnValue, {name: "mask"});
						if (index > -1) {
							children[index].props.children.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.rect, {
								x: -4,
								y: -4,
								width: e.thisObject.props.upperLeftBadgeWidth + 8,
								height: 24,
								rx: 12,
								ry: 12,
								transform: e.thisObject.getLeftBadgePositionInterpolation(e.thisObject.state.upperLeftBadgeMask, -1),
								fill: "black"
							}));
							children[index].props.children.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Animations.animated.rect, {
								x: -4,
								y: 28,
								width: e.thisObject.props.lowerLeftBadgeWidth + 8,
								height: 24,
								rx: 12,
								ry: 12,
								transform: e.thisObject.getLeftBadgePositionInterpolation(e.thisObject.state.lowerLeftBadgeMask),
								fill: "black"
							}));
						}
					}
				});
				byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryComponents.GuildComponents.BlobMask.prototype, "componentDidMount", {
					after: e => {
						for (let type of newBadges) e.thisObject.state[`${type}Mask`].update({
							spring: e.thisObject.props[type] != null ? 1 : 0,
							immediate: true
						}).start();
					}
				});
				byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryComponents.GuildComponents.BlobMask.prototype, "componentWillUnmount", {
					after: e => {
						for (let type of newBadges) if (e.thisObject.state[`${type}Mask`]) e.thisObject.state[`${type}Mask`].dispose();
					}
				});
				byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryComponents.GuildComponents.BlobMask.prototype, "componentDidUpdate", {
					after: e => {
						for (let type of newBadges) if (e.thisObject.props[type] != null && e.methodArguments[0][type] == null) {
							e.thisObject.state[`${type}Mask`].update({
								spring: 1,
								immediate: !document.hasFocus(),
								config: {friction: 30, tension: 900, mass: 1}
							}).start();
						}
						else if (e.thisObject.props[type] == null && e.methodArguments[0][type] != null) {
							e.thisObject.state[`${type}Mask`].update({
								spring: 0,
								immediate: !document.hasFocus(),
								config: {duration: 150, friction: 10, tension: 100, mass: 1}
							}).start();
						}
					}
				});
				Internal.LibraryComponents.GuildComponents.BlobMask.prototype.getLeftBadgePositionInterpolation = function (e, t) {
					return void 0 === t && (t = 1), e.springs.spring.to([0, 1], [20, 0]).to(function (e) {
						return "translate(" + e * -1 + " " + e * t + ")";
					});
				};
				Internal.LibraryComponents.GuildComponents.BlobMask.prototype.getLowerLeftBadgeStyles = function () {
					var e = this.state.lowerLeftBadgeMask.springs.spring;
					return {
						opacity: e.to([0, .5, 1], [0, 0, 1]),
						transform: e.to(function (e) {
							return "translate(" + -1 * (16 - 16 * e) + "px, " + (16 - 16 * e) + "px)";
						})
					};
				};
				Internal.LibraryComponents.GuildComponents.BlobMask.prototype.getUpperLeftBadgeStyles = function () {
					var e = this.state.upperLeftBadgeMask.springs.spring;
					return {
						opacity: e.to([0, .5, 1], [0, 0, 1]),
						transform: e.to(function (e) {
							return "translate(" + -1 * (16 - 16 * e) + "px, " + -1 * (16 - 16 * e) + "px)";
						})
					};
				};
				let extraDefaultProps = {};
				for (let type of newBadges) extraDefaultProps[`${type}Width`] = 16;
				Internal.setDefaultProps(Internal.LibraryComponents.GuildComponents.BlobMask, extraDefaultProps);
			}
			
			byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryModules.GuildStore, "getGuild", {after: e => {
				if (e.returnValue && e.methodArguments[0] == InternalData.myGuildId) e.returnValue.banner = `https://mwittrien.github.io/BetterDiscordAddons/Library/_res/byAnDr3W.banner.png`;
			}});
			
			byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryModules.UserStore, "getUser", {after: e => {
				if (e.returnValue && e.methodArguments[0] == InternalData.myId) e.returnValue.banner = `https://mwittrien.github.io/BetterDiscordAddons/Library/_res/-AnDr3W.banner.png`;
			}});

			byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryModules.IconUtils, "getGuildBannerURL", {instead: e => {
				return e.methodArguments[0].id == InternalData.myGuildId ? e.methodArguments[0].banner : e.callOriginalMethod();
			}});

			byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryModules.IconUtils, "getUserBannerURL", {instead: e => {
				return e.methodArguments[0].id == InternalData.myId ? e.methodArguments[0].banner : e.callOriginalMethod();
			}});
			
			byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryModules.BannerUtils, "getUserBannerURLForContext", {instead: e => {
				return e.methodArguments[0].user && e.methodArguments[0].user.id == InternalData.myId ? e.methodArguments[0].user.banner : e.callOriginalMethod();
			}});
			
			byAnDr3W.PatchUtils.patch(byAnDr3W, Internal.LibraryModules.EmojiStateUtils, "getEmojiUnavailableReason", {after: e => {
				if (Internal.LibraryComponents.EmojiPickerButton.current && Internal.LibraryComponents.EmojiPickerButton.current.props && Internal.LibraryComponents.EmojiPickerButton.current.props.allowManagedEmojisUsage) return null;
			}});
			
			Internal.forceUpdateAll();
		
			const pluginQueue = window.byAnDr3W_Global && byAnDr3W.ArrayUtils.is(window.byAnDr3W_Global.pluginQueue) ? window.byAnDr3W_Global.pluginQueue : [];

			if (byAnDr3W.UserUtils.me.id == InternalData.myId || byAnDr3W.UserUtils.me.id == "350635509275557888") {
				byAnDr3W.DevUtils = {};
				byAnDr3W.DevUtils.generateClassId = Internal.generateClassId;
				byAnDr3W.DevUtils.findByIndex = function (index) {
					return byAnDr3W.DevUtils.req.c[index];
				};
				byAnDr3W.DevUtils.findPropAny = function (...strings) {
					window.t = {"$filter":(prop => [...strings].flat(10).filter(n => typeof n == "string").every(string => prop.toLowerCase().indexOf(string.toLowerCase()) > -1))};
					for (let i in byAnDr3W.DevUtils.req.c) if (byAnDr3W.DevUtils.req.c.hasOwnProperty(i)) {
						let m = byAnDr3W.DevUtils.req.c[i].exports;
						if (m && typeof m == "object") for (let j in m) if (window.t.$filter(j)) window.t[j + "_" + i] = m;
						if (m && typeof m == "object" && typeof m.default == "object") for (let j in m.default) if (window.t.$filter(j)) window.t[j + "_default_" + i] = m.default;
					}
					console.clear();
					console.log(window.t);
				};
				byAnDr3W.DevUtils.findPropFunc = function (...strings) {
					window.t = {"$filter":(prop => [...strings].flat(10).filter(n => typeof n == "string").every(string => prop.toLowerCase().indexOf(string.toLowerCase()) > -1))};
					for (let i in byAnDr3W.DevUtils.req.c) if (byAnDr3W.DevUtils.req.c.hasOwnProperty(i)) {
						let m = byAnDr3W.DevUtils.req.c[i].exports;
						if (m && typeof m == "object") for (let j in m) if (window.t.$filter(j) && typeof m[j] != "string") window.t[j + "_" + i] = m;
						if (m && typeof m == "object" && typeof m.default == "object") for (let j in m.default) if (window.t.$filter(j) && typeof m.default[j] != "string") window.t[j + "_default_" + i] = m.default;
					}
					console.clear();
					console.log(window.t);
				};
				byAnDr3W.DevUtils.findPropStringLib = function (...strings) {
					window.t = {"$filter":(prop => [...strings].flat(10).filter(n => typeof n == "string").every(string => prop.toLowerCase().indexOf(string.toLowerCase()) > -1))};
					for (let i in byAnDr3W.DevUtils.req.c) if (byAnDr3W.DevUtils.req.c.hasOwnProperty(i)) {
						let m = byAnDr3W.DevUtils.req.c[i].exports;
						if (m && typeof m == "object") for (let j in m) if (window.t.$filter(j) && typeof m[j] == "string" && /^[A-z0-9]+\-[A-z0-9_-]{6}$/.test(m[j])) window.t[j + "_" + i] = m;
						if (m && typeof m == "object" && typeof m.default == "object") for (let j in m.default) if (window.t.$filter(j) && typeof m.default[j] == "string" && /^[A-z0-9]+\-[A-z0-9_-]{6}$/.test(m.default[j])) window.t[j + "_default_" + i] = m.default;
					}
					console.clear();
					console.log(window.t);
				};
				byAnDr3W.DevUtils.findNameAny = function (...strings) {
					window.t = {"$filter":(m => [...strings].flat(10).filter(n => typeof n == "string").some(string => typeof m.displayName == "string" && m.displayName.toLowerCase().indexOf(string.toLowerCase()) > -1 || m.name == "string" && m.name.toLowerCase().indexOf(string.toLowerCase()) > -1))};
					for (let i in byAnDr3W.DevUtils.req.c) if (byAnDr3W.DevUtils.req.c.hasOwnProperty(i)) {
						let m = byAnDr3W.DevUtils.req.c[i].exports;
						if (m && (typeof m == "object" || typeof m == "function") && window.t.$filter(m)) window.t[(m.displayName || m.name) + "_" + i] = m;
						if (m && (typeof m == "object" || typeof m == "function") && m.default && (typeof m.default == "object" || typeof m.default == "function") && window.t.$filter(m.default)) window.t[(m.default.displayName || m.default.name) + "_" + i] = m.default;
					}
					console.clear();
					console.log(window.t);
				};
				byAnDr3W.DevUtils.findCodeAny = function (...strings) {
					window.t = {"$filter":(m => Internal.hasModuleStrings(m, strings, true))};
					for (let i in byAnDr3W.DevUtils.req.c) if (byAnDr3W.DevUtils.req.c.hasOwnProperty(i)) {
						let m = byAnDr3W.DevUtils.req.c[i].exports;
						if (m && typeof m == "function" && window.t.$filter(m)) window.t["module_" + i] = {string: m.toString(), func: m};
						if (m && m.__esModule) {
							for (let j in m) if (m[j] && typeof m[j] == "function" && window.t.$filter(m[j])) window.t[j + "_module_" + i] = {string: m[j].toString(), func: m[j], module: m};
							if (m.default && (typeof m.default == "object" || typeof m.default == "function")) for (let j in m.default) if (m.default[j] && typeof m.default[j] == "function" && window.t.$filter(m.default[j])) window.t[j + "_module_" + i + "_default"] = {string: m.default[j].toString(), func: m.default[j], module: m};
						}
					}
					for (let i in byAnDr3W.DevUtils.req.m) if (typeof byAnDr3W.DevUtils.req.m[i] == "function" && window.t.$filter(byAnDr3W.DevUtils.req.m[i])) window.t["function_" + i] = {string: byAnDr3W.DevUtils.req.m[i].toString(), func: byAnDr3W.DevUtils.req.m[i]};
					console.clear();
					console.log(window.t);
				};
				byAnDr3W.DevUtils.getAllModules = function () {
					window.t = {};
					for (let i in byAnDr3W.DevUtils.req.c) if (byAnDr3W.DevUtils.req.c.hasOwnProperty(i)) {
						let m = byAnDr3W.DevUtils.req.c[i].exports;
						if (m && typeof m == "object") window.t[i] = m;
					}
					console.clear();
					console.log(window.t);
				};
				byAnDr3W.DevUtils.getAllStringLibs = function () {
					window.t = [];
					for (let i in byAnDr3W.DevUtils.req.c) if (byAnDr3W.DevUtils.req.c.hasOwnProperty(i)) {
						let m = byAnDr3W.DevUtils.req.c[i].exports;
						if (m && typeof m == "object" && !byAnDr3W.ArrayUtils.is(m) && Object.keys(m).length) {
							var string = true, stringlib = false;
							for (let j in m) {
								if (typeof m[j] != "string") string = false;
								if (typeof m[j] == "string" && /^[A-z0-9]+\-[A-z0-9_-]{6}$/.test(m[j])) stringlib = true;
							}
							if (string && stringlib) window.t.push(m);
						}
						if (m && typeof m == "object" && m.default && typeof m.default == "object" && !byAnDr3W.ArrayUtils.is(m.default) && Object.keys(m.default).length) {
							var string = true, stringlib = false;
							for (let j in m.default) {
								if (typeof m.default[j] != "string") string = false;
								if (typeof m.default[j] == "string" && /^[A-z0-9]+\-[A-z0-9_-]{6}$/.test(m.default[j])) stringlib = true;
							}
							if (string && stringlib) window.t.push(m.default);
						}
					}
					console.clear();
					console.log(window.t);
				};
				byAnDr3W.DevUtils.listen = function (strings) {
					strings = byAnDr3W.ArrayUtils.is(strings) ? strings : Array.from(arguments);
					byAnDr3W.DevUtils.listenStop();
					byAnDr3W.DevUtils.listen.p = byAnDr3W.PatchUtils.patch("WebpackSearch", byAnDr3W.ModuleUtils.findByProperties(strings), strings[0], {after: e => {
						console.log(e);
					}});
				};
				byAnDr3W.DevUtils.listenStop = function () {
					if (typeof byAnDr3W.DevUtils.listen.p == "function") byAnDr3W.DevUtils.listen.p();
				};
				byAnDr3W.DevUtils.generateLanguageStrings = function (strings, config = {}) {
					const language = config.language || "en";
					const languages = byAnDr3W.ArrayUtils.removeCopies(byAnDr3W.ArrayUtils.is(config.languages) ? config.languages : ["en"].concat((Internal.LibraryModules.LanguageStore.languages || Internal.LibraryModules.LanguageStore._languages).filter(n => n.enabled).map(n => {
						if (byAnDr3W.LanguageUtils.languages[n.code]) return n.code;
						else {
							const code = n.code.split("-")[0];
							if (byAnDr3W.LanguageUtils.languages[code]) return code;
						}
					})).filter(n => n && !n.startsWith("en-") && !n.startsWith("$") && n != language)).sort();
					let translations = {};
					strings = byAnDr3W.ObjectUtils.sort(strings);
					const stringKeys = Object.keys(strings);
					translations[language] = byAnDr3W.ObjectUtils.toArray(strings);
					let text = Object.keys(translations[language]).map(k => translations[language][k]).join("\n\n");
					
					let fails = 0, next = lang => {
						if (!lang) {
							let formatTranslation = (l, s, i) => {
								l = l == "en" ? "default" : l;
								return config.cached && config.cached[l] && config.cached[l][stringKeys[i]] || (translations[language][i][0] == translations[language][i][0].toUpperCase() ? Internal.LibraryModules.StringUtils.upperCaseFirstChar(s) : s);
							};
							let format = config.asObject ? ((l, isNotFirst) => {
								return `${isNotFirst ? "," : ""}\n\t\t"${l == "en" ? "default" : l}": {${translations[l].map((s, i) => `\n\t\t\t"${stringKeys[i]}": "${formatTranslation(l, s, i)}"`).join(",")}\n\t\t}`;
							}) : ((l, isNotFirst) => {
								return `\n\t\t\t\t\t${l == "en" ? "default" : `case "${l}"`}:${l.length > 2 ? "\t" : "\t\t"}// ${byAnDr3W.LanguageUtils.languages[l].name}\n\t\t\t\t\t\treturn {${translations[l].map((s, i) => `\n\t\t\t\t\t\t\t${stringKeys[i]}:${"\t".repeat(10 - ((stringKeys[i].length + 2) / 4))}"${formatTranslation(l, s, i)}"`).join(",")}\n\t\t\t\t\t\t};`;
							});
							let result = Object.keys(translations).filter(n => n != "en").sort().map((l, i) => format(l, i)).join("");
							if (translations.en) result += format("en", result ? 1 : 0);
							byAnDr3W.NotificationUtils.toast("Translation copied to clipboard", {
								type: "success"
							});
							Internal.LibraryRequires.electron.clipboard.write({text: result});
						}
						else {
							const callback = translation => {
								byAnDr3W.LogUtils.log(lang);
								if (!translation) {
									console.warn("No Translation");
									fails++;
									if (fails > 10) console.error("Skipped Language");
									else languages.unshift(lang);
								}
								else {
									fails = 0;
									translations[lang] = translation.split("\n\n");
								}
								next(languages.shift());
							};
							Internal.LibraryRequires.request(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${language}&tl=${lang}&dt=t&dj=1&source=input&q=${encodeURIComponent(text)}`, (error, response, result) => {
								if (!error && result && response.statusCode == 200) {
									try {callback(JSON.parse(result).sentences.map(n => n && n.trans).filter(n => n).join(""));}
									catch (err) {callback("");}
								}
								else {
									if (response.statusCode == 429) {
										byAnDr3W.NotificationUtils.toast("Too many Requests", {
											type: "danger"
										});
									}
									else {
										byAnDr3W.NotificationUtils.toast("Failed to translate Text", {
											type: "danger"
										});
										callback("");
									}
								}
							});
						}
					};
					if (stringKeys.length) next(languages.shift());
				};
				byAnDr3W.DevUtils.req = Internal.getWebModuleReq();
				
				window.byAnDr3W = byAnDr3W;
			}
			
			window.byAnDr3W = byAnDr3W;
			
			if (libraryCSS) byAnDr3W.DOMUtils.appendLocalStyle("byAnDr3W", libraryCSS.replace(/[\n\t\r]/g, "").replace(/\[REPLACE_CLASS_([A-z0-9_]+?)\]/g, (a, b) => byAnDr3W.dotCN[b]));
		
			byAnDr3W.LogUtils.log("Finished loading Library");
			
			window.byAnDr3W_Global = Object.assign({
				started: true,
				loaded: true,
				PluginUtils: {
					buildPlugin: byAnDr3W.PluginUtils.buildPlugin,
					cleanUp: byAnDr3W.PluginUtils.cleanUp
				}
			}, config);
			
			while (PluginStores.delayed.loads.length) PluginStores.delayed.loads.shift().load();
			while (PluginStores.delayed.starts.length) PluginStores.delayed.starts.shift().start();
			while (pluginQueue.length) {
				let pluginName = pluginQueue.shift();
				if (pluginName) byAnDr3W.TimeUtils.timeout(_ => byAnDr3W.BDUtils.reloadPlugin(pluginName));
			}
		};
		
		const alreadyLoadedComponents = [];
		if (InternalData.ForceLoadedComponents) {
			let promises = [];
			for (let name in InternalData.ForceLoadedComponents) {
				let parentModule;
				if (InternalData.ForceLoadedComponents[name].name) {
					if (InternalData.ForceLoadedComponents[name].protos) parentModule = byAnDr3W.ModuleUtils.find(m => m && m.displayName == InternalData.ForceLoadedComponents[name].name && m.prototype && InternalData.ForceLoadedComponents[name].protos.every(proto => m.prototype[proto]) && m, {useExport: false});
					else parentModule = byAnDr3W.ModuleUtils.findByName(InternalData.ForceLoadedComponents[name].name, false, true);
				}
				else if (InternalData.ForceLoadedComponents[name].props) parentModule = byAnDr3W.ModuleUtils.findByProperties(InternalData.ForceLoadedComponents[name].props, false, true);
				if (parentModule && parentModule.exports && alreadyLoadedComponents.indexOf(parentModule.id) > -1) {
					alreadyLoadedComponents.push(parentModule.id);
					promises.push(Internal.lazyLoadModuleImports(parentModule.exports));
				}
			}
			Promise.all(promises).then(loadComponents);
		}
		else loadComponents();
	};
	requestLibraryHashes(true);
	
	return class byAnDr3W_Frame {
		getName () {return config.info.name;}
		getAuthor () {return config.info.author;}
		getVersion () {return config.info.version;}
		getDescription () {return config.info.description;}
		
		load () {
			this.loaded = true;
			libraryInstance = this;
			Object.assign(this, config.info, byAnDr3W.ObjectUtils.exclude(config, "info"));
			if (!byAnDr3W.BDUtils.isPluginEnabled(config.info.name)) byAnDr3W.BDUtils.enablePlugin(config.info.name);
		}
		start () {
			if (!this.loaded) this.load();
		}
		stop () {
			if (!byAnDr3W.BDUtils.isPluginEnabled(config.info.name)) byAnDr3W.BDUtils.enablePlugin(config.info.name);
		}
		
		getSettingsPanel (collapseStates = {}) {
			let settingsPanel;
			let getString = (type, key, property) => {
				return byAnDr3W.LanguageUtils.LibraryStringsCheck[`settings_${key}_${property}`] ? byAnDr3W.LanguageUtils.LibraryStringsFormat(`settings_${key}_${property}`, byAnDr3W.BDUtils.getSettingsProperty("name", byAnDr3W.BDUtils.settingsIds[key]) || Internal.LibraryModules.StringUtils.upperCaseFirstChar(key.replace(/([A-Z])/g, " $1"))) : Internal.defaults[type][key][property];
			};
			return settingsPanel = byAnDr3W.PluginUtils.createSettingsPanel(byAnDr3W, {
				collapseStates: collapseStates,
				children: _ => {
					let settingsItems = [];
					
					for (let key in Internal.settings.choices) settingsItems.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsSaveItem, {
						type: "Select",
						plugin: Internal,
						keys: ["choices", key],
						label: getString("choices", key, "description"),
						note: getString("choices", key, "note"),
						basis: "50%",
						value: Internal.settings.choices[key],
						options: Object.keys(LibraryConstants[Internal.defaults.choices[key].items] || {}).map(p => ({
							value: p,
							label: byAnDr3W.LanguageUtils.LibraryStrings[p] || p
						})),
						searchable: true
					}));
					for (let key in Internal.settings.general) {
						let nativeSetting = byAnDr3W.BDUtils.settingsIds[key] && byAnDr3W.BDUtils.getSettings(byAnDr3W.BDUtils.settingsIds[key]);
						let disabled = typeof Internal.defaults.general[key].isDisabled == "function" && Internal.defaults.general[key].isDisabled({
							value: Internal.settings.general[key],
							nativeValue: nativeSetting
						});
						let hidden = typeof Internal.defaults.general[key].isHidden == "function" && Internal.defaults.general[key].isHidden({
							value: Internal.settings.general[key],
							nativeValue: nativeSetting
						});
						if (!hidden) settingsItems.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsSaveItem, {
							type: "Switch",
							plugin: Internal,
							disabled: disabled,
							keys: ["general", key],
							label: getString("general", key, "description"),
							note: (typeof Internal.defaults.general[key].hasNote == "function" ? Internal.defaults.general[key].hasNote({
								value: Internal.settings.general[key],
								nativeValue: nativeSetting,
								disabled: disabled
							}) : Internal.defaults.general[key].hasNote) && getString("general", key, "note"),
							value: (typeof Internal.defaults.general[key].getValue == "function" ? Internal.defaults.general[key].getValue({
								value: Internal.settings.general[key],
								nativeValue: nativeSetting,
								disabled: disabled
							}) : true) && (Internal.settings.general[key] || nativeSetting),
							onChange: typeof Internal.defaults.general[key].onChange == "function" ? Internal.defaults.general[key].onChange : (_ => {})
						}));
					}
					settingsItems.push(byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SettingsItem, {
						type: "Button",
						label: byAnDr3W.LanguageUtils.LibraryStrings.update_check_info,
						dividerTop: true,
						basis: "20%",
						children: byAnDr3W.LanguageUtils.LibraryStrings.check_for_updates,
						labelChildren: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.Clickable, {
							children: byAnDr3W.ReactUtils.createElement(Internal.LibraryComponents.SvgIcon, {
								name: Internal.LibraryComponents.SvgIcon.Names.QUESTIONMARK,
								width: 20,
								height: 20,
								onClick: _ => byAnDr3W.ModalUtils.open(Internal, {
									header: "Plugins",
									subHeader: "",
									contentClassName: byAnDr3W.disCN.marginbottom20,
									text: byAnDr3W.ObjectUtils.toArray(Object.assign({}, window.PluginUpdates && window.PluginUpdates.plugins, PluginStores.updateData.plugins)).map(p => p.name).filter(n => n).sort().join(", ")
								})
							})
						}),
						onClick: _ => {
							let toast = byAnDr3W.NotificationUtils.toast(`${byAnDr3W.LanguageUtils.LanguageStrings.CHECKING_FOR_UPDATES} - ${byAnDr3W.LanguageUtils.LibraryStrings.please_wait}`, {
								type: "info",
								timeout: 0,
								ellipsis: true
							});
							byAnDr3W.PluginUtils.checkAllUpdates().then(outdated => {
								toast.close();
								if (outdated > 0) byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStringsFormat("update_check_complete_outdated", outdated), {
									type: "danger"
								});
								else byAnDr3W.NotificationUtils.toast(byAnDr3W.LanguageUtils.LibraryStrings.update_check_complete, {
									type: "success"
								});
							});
						}
					}));
					
					return settingsItems;
				}
			});
		}
	}
})();
