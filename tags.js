/**
 * Bootstrap 5 (and 4!) tags
 *
 * Turns your select[multiple] into nice tags lists
 *
 * Required Bootstrap 5 styles:
 * - badge
 * - background-color utility
 * - text-truncate utility
 * - forms
 * - dropdown
 */

// #region config

/**
 * @callback EventCallback
 * @param {Event} event
 * @param {Tags} inst
 * @returns {void}
 */

/**
 * @callback ServerCallback
 * @param {Response} response
 * @param {Tags} inst
 * @returns {Promise}
 */

/**
 * @callback RenderCallback
 * @param {Suggestion} item
 * @param {String} label
 * @param {Tags} inst
 * @returns {String}
 */

/**
 * @callback ItemCallback
 * @param {Suggestion} item
 * @param {Tags} inst
 * @returns {void}
 */

/**
 * @callback ValueCallback
 * @param {String} value
 * @param {Tags} inst
 * @returns {void}
 */

/**
 * @callback AddCallback
 * @param {String} value
 * @param {Object} data
 * @param {Tags} inst
 * @returns {void|Boolean}
 */

/**
 * @callback CreateCallback
 * @param {HTMLOptionElement} option
 * @param {Tags} inst
 * @returns {void}
 */

/**
 * @typedef Config
 * @property {Array<Suggestion|SuggestionGroup>} items Source items
 * @property {Boolean} allowNew Allows creation of new tags
 * @property {Boolean} showAllSuggestions Show all suggestions even if they don't match. Disables validation.
 * @property {String} badgeStyle Color of the badge (color can be configured per option as well)
 * @property {Boolean} allowClear Show a clear icon
 * @property {Boolean} clearEnd Place clear icon at the end
 * @property {Array} selected A list of initially selected values
 * @property {String} regex Regex for new tags
 * @property {Array|String} separator A list (pipe separated) of characters that should act as separator (default is using enter key)
 * @property {Number} max Limit to a maximum of tags (0 = no limit)
 * @property {String} placeholder Provides a placeholder if none are provided as the first empty option
 * @property {String} clearLabel Text as clear tooltip
 * @property {String} searchLabel Default placeholder
 * @property {Boolean} showDropIcon Show dropdown icon
 * @property {Boolean} keepOpen Keep suggestions open after selection, clear on focus out
 * @property {Boolean} allowSame Allow same tags used multiple times
 * @property {String} baseClass Customize the class applied to badges
 * @property {Boolean} addOnBlur Add new tags on blur (only if allowNew is enabled)
 * @property {Boolean} showDisabled Show disabled tags
 * @property {Boolean} hideNativeValidation Hide native validation tooltips
 * @property {Number} suggestionsThreshold Number of chars required to show suggestions
 * @property {Number} maximumItems Maximum number of items to display
 * @property {Boolean} autoselectFirst Always select the first item
 * @property {Boolean} updateOnSelect Update input value on selection (doesn't play nice with autoselectFirst)
 * @property {Boolean} highlightTyped Highlight matched part of the suggestion
 * @property {Boolean} fullWidth Match the width on the input field
 * @property {Boolean} fixed Use fixed positioning (solve overflow issues)
 * @property {Boolean} fuzzy Fuzzy search
 * @property {Boolean} singleBadge Show badge for single elements
 * @property {Array} activeClasses By default: ["bg-primary", "text-white"]
 * @property {String} labelField Key for the label
 * @property {String} valueField Key for the value
 * @property {Array} searchFields Key for the search
 * @property {String} queryParam Name of the param passed to endpoint (query by default)
 * @property {String} server Endpoint for data provider
 * @property {String} serverMethod HTTP request method for data provider, default is GET
 * @property {String|Object} serverParams Parameters to pass along to the server. You can specify a "related" key with the id of a related field.
 * @property {String} serverDataKey By default: data
 * @property {Object} fetchOptions Any other fetch options (https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax)
 * @property {Boolean} liveServer Should the endpoint be called each time on input
 * @property {Boolean} noCache Prevent caching by appending a timestamp
 * @property {Number} debounceTime Debounce time for live server
 * @property {String} notFoundMessage Display a no suggestions found message. Leave empty to disable
 * @property {RenderCallback} onRenderItem Callback function that returns the suggestion
 * @property {ItemCallback} onSelectItem Callback function to call on selection
 * @property {ValueCallback} onClearItem Callback function to call on clear
 * @property {CreateCallback} onCreateItem Callback function when an item is created
 * @property {EventCallback} onBlur Callback function on blur
 * @property {EventCallback} onFocus Callback function on focus
 * @property {AddCallback} onCanAdd Callback function to validate item. Return false to show validation message.
 * @property {ServerCallback} onServerResponse Callback function to process server response. Must return a Promise
 */

/**
 * @typedef Suggestion
 * @property {String} value Can be overriden by config valueField
 * @property {String} label Can be overriden by config labelField
 * @property {Boolean} disabled
 * @property {Object} data
 * @property {Boolean} [selected]
 * @property {Number} [group_id]
 */

/**
 * @typedef SuggestionGroup
 * @property {String} group
 * @property {Array} items
 */

/**
 * @type {Config}
 */
const DEFAULTS = {
  items: [],
  allowNew: false,
  showAllSuggestions: false,
  badgeStyle: "primary",
  allowClear: false,
  clearEnd: false,
  selected: [],
  regex: "",
  separator: [],
  max: 0,
  clearLabel: "Clear",
  searchLabel: "Type a value",
  showDropIcon: true,
  keepOpen: false,
  allowSame: false,
  baseClass: "",
  placeholder: "",
  addOnBlur: false,
  showDisabled: false,
  hideNativeValidation: false,
  suggestionsThreshold: -1,
  maximumItems: 0,
  autoselectFirst: true,
  updateOnSelect: false,
  highlightTyped: false,
  fullWidth: true,
  fixed: false,
  fuzzy: false,
  singleBadge: false,
  activeClasses: ["bg-primary", "text-white"],
  labelField: "label",
  valueField: "value",
  searchFields: ["label"],
  queryParam: "query",
  server: "",
  serverMethod: "GET",
  serverParams: {},
  serverDataKey: "data",
  fetchOptions: {},
  liveServer: false,
  noCache: true,
  debounceTime: 300,
  notFoundMessage: "",
  onRenderItem: (item, label, inst) => {
    return label;
  },
  onSelectItem: (item, inst) => {},
  onClearItem: (value, inst) => {},
  onCreateItem: (option, inst) => {},
  onBlur: (event, inst) => {},
  onFocus: (event, inst) => {},
  onCanAdd: (text, data, inst) => {},
  onServerResponse: (response, inst) => {
    return response.json();
  },
};

// #endregion

// #region constants

const CLASS_PREFIX = "tags-";
const LOADING_CLASS = "is-loading";
const ACTIVE_CLASS = "is-active";
const INVALID_CLASS = "is-invalid";
const MAX_REACHED_CLASS = "is-max-reached";
const SHOW_CLASS = "show";
const VALUE_ATTRIBUTE = "data-value";
const NEXT = "next";
const PREV = "prev";
const FOCUS_CLASS = "form-control-focus"; // should match form-control:focus
const PLACEHOLDER_CLASS = "form-placeholder-shown"; // should match :placeholder-shown
const DISABLED_CLASS = "form-control-disabled"; // should match form-control:disabled
const INSTANCE_MAP = new WeakMap();
let counter = 0;
let tooltip = window.bootstrap && window.bootstrap.Tooltip;

// #endregion

// #region functions

/**
 * @param {Function} func
 * @param {number} timeout
 * @returns {Function}
 */
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //@ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * @param {string} text
 * @param {string} size
 * @returns {Number}
 */
function calcTextWidth(text, size = null) {
  const span = ce("span");
  document.body.appendChild(span);
  span.style.fontSize = size || "inherit";
  span.style.height = "auto";
  span.style.width = "auto";
  span.style.position = "absolute";
  span.style.whiteSpace = "no-wrap";
  span.innerHTML = text;
  const width = Math.ceil(span.clientWidth);
  document.body.removeChild(span);
  return width;
}

/**
 * @param {String} str
 * @returns {String}
 */
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * @param {String|Number} str
 * @returns {String}
 */
function normalize(str) {
  if (!str) {
    return "";
  }
  return removeDiacritics(str.toString()).toLowerCase();
}

/**
 * A simple fuzzy match algorithm that checks if chars are matched
 * in order in the target string
 *
 * @param {String} str
 * @param {String} lookup
 * @returns {Boolean}
 */
function fuzzyMatch(str, lookup) {
  if (str.indexOf(lookup) >= 0) {
    return true;
  }
  let pos = 0;
  for (let i = 0; i < lookup.length; i++) {
    const c = lookup[i];
    if (c == " ") continue;
    pos = str.indexOf(c, pos) + 1;
    if (pos <= 0) {
      return false;
    }
  }
  return true;
}

/**
 * @param {HTMLElement} item
 */
function hideItem(item) {
  item.style.display = "none";
  attrs(item, {
    "aria-hidden": "true",
  });
}

/**
 * @param {HTMLElement} item
 */
function showItem(item) {
  item.style.display = "list-item";
  attrs(item, {
    "aria-hidden": "false",
  });
}

/**
 * @param {HTMLElement} el
 * @param {Object} attrs
 */
function attrs(el, attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
}

/**
 * @param {HTMLElement} el
 * @param {string} attr
 */
function rmAttr(el, attr) {
  if (el.hasAttribute(attr)) {
    el.removeAttribute(attr);
  }
}

/**
 * Allow 1/0, true/false as strings
 * @param {any} value
 * @returns {Boolean}
 */
function parseBool(value) {
  return ["true", "false", "1", "0", true, false].includes(value) && !!JSON.parse(value);
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K|String} tagName Name of the element
 * @returns {*}
 */
function ce(tagName) {
  return document.createElement(tagName);
}

/**
 * @param {HTMLElement} el
 * @param {HTMLElement} newEl
 * @returns {HTMLElement}
 */
// function insertAfter(el, newEl) {
//   return el.parentNode.insertBefore(newEl, el.nextSibling);
// }

// #endregion

class Tags {
  /**
   * @param {HTMLSelectElement} el
   * @param {Object|Config} config
   */
  constructor(el, config = {}) {
    if (!(el instanceof HTMLElement)) {
      console.error("Invalid element", el);
      return;
    }
    INSTANCE_MAP.set(el, this);
    counter++;
    this._selectElement = el;

    this._configure(config);

    // private vars
    this._keyboardNavigation = false;
    this._searchFunc = debounce(() => {
      this._loadFromServer(true);
    }, this._config.debounceTime);
    this._fireEvents = true;

    this._configureParent();

    // Create elements
    this._holderElement = ce("div"); // this is the one holding the fake input and the dropmenu
    this._containerElement = ce("div"); // this is the one for the fake input (labels + input)
    this._dropElement = ce("ul"); // this dropdown list
    this._searchInput = ce("input"); // the input element
    this._holderElement.appendChild(this._containerElement);

    // insert before select, this helps having native validation tooltips positioned properly
    this._selectElement.parentElement.insertBefore(this._holderElement, this._selectElement);
    // insertAfter(this._selectElement, this._holderElement);

    // Configure them
    this._configureHolderElement();
    this._configureContainerElement();
    this._configureSelectElement();
    this._configureSearchInput();
    this._configureDropElement();
    this.resetState();

    this.handleEvent = (ev) => {
      this._handleEvent(ev);
    };

    if (this._config.fixed) {
      document.addEventListener("scroll", this, true); // capture input for all scrollables elements
      window.addEventListener("resize", this);
    }

    // Add listeners (remove then on dispose()). See handleEvent.
    this._searchInput.addEventListener("focus", this); // focusin bubbles, focus does not.
    this._searchInput.addEventListener("blur", this); // focusout bubbles, blur does not.
    this._searchInput.addEventListener("input", this);
    this._searchInput.addEventListener("keydown", this);
    this._dropElement.addEventListener("mousemove", this);

    this.loadData(true);
  }

  // #region Core

  /**
   * Attach to all elements matched by the selector
   * @param {string} selector
   * @param {Object} opts
   */
  static init(selector = "select[multiple]", opts = {}) {
    /**
     * @type {NodeListOf<HTMLSelectElement>}
     */
    let list = document.querySelectorAll(selector);
    for (let i = 0; i < list.length; i++) {
      if (Tags.getInstance(list[i])) {
        continue;
      }
      new Tags(list[i], opts);
    }
  }

  /**
   * @param {HTMLSelectElement} el
   */
  static getInstance(el) {
    if (INSTANCE_MAP.has(el)) {
      return INSTANCE_MAP.get(el);
    }
  }

  dispose() {
    this._searchInput.removeEventListener("focus", this);
    this._searchInput.removeEventListener("blur", this);
    this._searchInput.removeEventListener("input", this);
    this._searchInput.removeEventListener("keydown", this);
    this._dropElement.removeEventListener("mousemove", this);

    if (this._config.fixed) {
      document.removeEventListener("scroll", this, true);
      window.removeEventListener("resize", this);
    }

    // restore select, remove our custom stuff and unbind parent
    this._selectElement.style.display = "block";
    this._holderElement.parentElement.removeChild(this._holderElement);
    if (this.parentForm) {
      this.parentForm.removeEventListener("reset", this);
    }

    INSTANCE_MAP.delete(this._selectElement);
  }

  /**
   * @link https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4#handling-events
   * @param {Event} event
   */
  _handleEvent(event) {
    // debounce scroll and resize
    const debounced = ["scroll", "resize"];
    if (debounced.includes(event.type)) {
      if (this._timer) window.cancelAnimationFrame(this._timer);
      this._timer = window.requestAnimationFrame(() => {
        this[`on${event.type}`](event);
      });
    } else {
      this[`on${event.type}`](event);
    }
  }

  /**
   * @param {Config|Object} config
   */
  _configure(config = {}) {
    this._config = Object.assign({}, DEFAULTS, {
      // Hide icon by default if no value
      showDropIcon: this._findOption() ? true : false,
    });

    const json = this._selectElement.dataset.config ? JSON.parse(this._selectElement.dataset.config) : {};
    // Handle options, using arguments first, then json config and then data attr as override
    const o = { ...config, ...json, ...this._selectElement.dataset };

    // Typecast provided options based on defaults types
    for (const [key, defaultValue] of Object.entries(DEFAULTS)) {
      // Check for undefined keys
      if (key == "config" || o[key] === void 0) {
        continue;
      }
      const value = o[key];
      switch (typeof defaultValue) {
        case "number":
          this._config[key] = parseInt(value);
          break;
        case "boolean":
          this._config[key] = parseBool(value);
          break;
        case "string":
          this._config[key] = value.toString();
          break;
        case "object":
          this._config[key] = value;
          if (typeof value === "string") {
            if (["{", "["].includes(value[0])) {
              // JSON like string
              this._config[key] = JSON.parse(value);
            } else {
              // CSV or pipe separated string
              this._config[key] = value.split(value.includes("|") ? "|" : ",");
            }
          }
          break;
        case "function":
          // Find a global function with this name
          this._config[key] = typeof value === "string" ? value.split(".").reduce((r, p) => r[p], window) : value;
          if (!this._config[key]) {
            console.error("Invalid function", value);
          }
          break;
        default:
          this._config[key] = value;
          break;
      }
    }

    // Dynamic default values
    if (!this._config.placeholder) {
      this._config.placeholder = this._getPlaceholder();
    }
    if (this._config.suggestionsThreshold == -1) {
      // if we don't have ajax auto completion, behave like a select by default
      this._config.suggestionsThreshold = this._config.liveServer ? 1 : 0;
    }
  }

  /**
   * @param {String} k
   * @returns {*}
   */
  config(k = null) {
    return k ? this._config[k] : this._config;
  }

  /**
   * @param {String} k
   * @param {*} v
   */
  setConfig(k, v) {
    this._config[k] = v;
  }

  // #endregion

  // #region Html

  /**
   * Find overflow parent for positioning
   * and bind reset event of the parent form
   */
  _configureParent() {
    this.overflowParent = null;
    this.parentForm = this._selectElement.parentElement;
    while (this.parentForm) {
      if (this.parentForm.style.overflow === "hidden") {
        this.overflowParent = this.parentForm;
      }
      this.parentForm = this.parentForm.parentElement;
      if (this.parentForm && this.parentForm.nodeName == "FORM") {
        break;
      }
    }
    if (this.parentForm) {
      this.parentForm.addEventListener("reset", this);
    }
  }

  /**
   * @returns {string}
   */
  _getPlaceholder() {
    // Use placeholder and data-placeholder in priority
    if (this._selectElement.hasAttribute("placeholder")) {
      return this._selectElement.getAttribute("placeholder");
    }
    if (this._selectElement.dataset.placeholder) {
      return this._selectElement.dataset.placeholder;
    }
    // Fallback to first option if no value
    let firstOption = this._selectElement.querySelector("option");
    if (!firstOption || !this._config.autoselectFirst) {
      return "";
    }
    rmAttr(firstOption, "selected");
    firstOption.selected = false;
    return !firstOption.value ? firstOption.textContent : "";
  }

  _configureSelectElement() {
    const selectEl = this._selectElement;

    // Hiding the select should keep it focusable, otherwise we get this
    // An invalid form control with name='...' is not focusable.
    // If it's not focusable, we need to remove the native validation attributes

    // If we use display none, we don't get the focus event
    // selectEl.style.display = "none";

    // If we position it like this, the html5 validation message will not display properly
    if (this._config.hideNativeValidation) {
      // This position dont break render within input-group and is focusable
      selectEl.style.position = "absolute";
      selectEl.style.left = "-9999px";
    } else {
      // Hide but keep it focusable. If 0 height, no native validation message will show
      // It is placed below so that native tooltip is displayed properly
      // Flex basis is required for input-group otherwise it breaks the layout
      selectEl.style.cssText = `height:1px;width:1px;opacity:0;padding:0;margin:0;border:0;float:left;flex-basis:100%;`;
    }

    // Make sure it's not usable using tab
    selectEl.tabIndex = -1;

    // No need for custom label click event if select is focusable
    // const label = document.querySelector('label[for="' + selectEl.getAttribute("id") + '"]');
    // if (label) {
    //   label.addEventListener("click", this);
    // }

    // It can be focused by clicking on the label
    selectEl.addEventListener("focus", (event) => {
      this.onclick(event);
    });

    // When using regular html5 validation, make sure our fake element get the proper class
    selectEl.addEventListener("invalid", (event) => {
      this._holderElement.classList.add(INVALID_CLASS);
    });
  }

  /**
   * Configure drop element
   * Needs to be called after searchInput is created
   */
  _configureDropElement() {
    const dropEl = this._dropElement;
    dropEl.classList.add(...["dropdown-menu", CLASS_PREFIX + "menu"]);
    dropEl.id = CLASS_PREFIX + "menu-" + counter;
    dropEl.setAttribute("role", "menu");

    const dropStyles = dropEl.style;
    dropStyles.padding = "0"; // avoid ugly space before option
    dropStyles.maxHeight = "280px";
    if (!this._config.fullWidth) {
      dropStyles.maxWidth = "360px";
    }
    if (this._config.fixed) {
      dropStyles.position = "fixed";
    }
    dropStyles.overflowY = "auto";
    // Prevent scrolling the menu from scrolling the page
    // @link https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
    dropStyles.overscrollBehavior = "contain";
    dropStyles.textAlign = "unset"; // otherwise RTL is not good

    // If the mouse was outside, entering remove keyboard nav mode
    dropEl.addEventListener("mouseenter", (event) => {
      this._keyboardNavigation = false;
    });
    this._holderElement.appendChild(dropEl);

    // include aria-controls with the value of the id of the suggested list of values.
    this._searchInput.setAttribute("aria-controls", dropEl.id);
  }

  _configureHolderElement() {
    const holder = this._holderElement;
    holder.classList.add(...["form-control", "dropdown"]);
    // Reflect size (we must use form-select-xx because we may use form-select)
    ["form-select-lg", "form-select-sm"].forEach((className) => {
      if (this._selectElement.classList.contains(className)) {
        holder.classList.add(className);
      }
    });

    // It is really more like a dropdown
    if (this._config.suggestionsThreshold == 0 && this._config.showDropIcon) {
      holder.classList.add("form-select");
    }

    // If we have an overflow parent, we can simply inherit styles
    if (this.overflowParent) {
      holder.style.position = "inherit";
    }
    // Prevent fixed height due to form-control in bs4
    holder.style.height = "auto";

    // Without this, clicking on a floating label won't always focus properly
    holder.addEventListener("click", this);
  }

  _configureContainerElement() {
    this._containerElement.addEventListener("click", (event) => {
      if (this.isDisabled()) {
        return;
      }
      if (this._searchInput.style.visibility != "hidden") {
        this._searchInput.focus();
      }
    });

    // Add some extra css to help positioning
    const containerStyles = this._containerElement.style;
    containerStyles.display = "flex";
    containerStyles.alignItems = "center";
    containerStyles.flexWrap = "wrap";
  }

  _configureSearchInput() {
    const searchInput = this._searchInput;

    searchInput.type = "text";
    searchInput.autocomplete = "field-" + Date.now(); // off is ignored
    searchInput.spellcheck = false;
    // note: firefox doesn't support the properties so we use attributes
    // @link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-autocomplete
    // @link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded
    // use the aria-expanded state on the element with role combobox to communicate that the list is displayed.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaLabel
    attrs(searchInput, {
      "aria-auto-complete": "list",
      "aria-has-popup": "menu",
      "aria-expanded": "false",
      "aria-label": this._config.searchLabel,
      role: "combobox",
    });
    searchInput.style.cssText = `background-color:transparent;color:currentColor;border:0;padding:0;outline:0;max-width:100%`;
    this.resetSearchInput(true);

    this._containerElement.appendChild(searchInput);
    this._rtl = window.getComputedStyle(searchInput).direction === "rtl";
  }

  // #endregion

  // #region Events

  onfocus(event) {
    this._holderElement.classList.add(FOCUS_CLASS);
    this.showOrSearch();
    this._config.onFocus(event, this);
  }

  onblur(event) {
    // Cancel any pending request
    if (this._abortController) {
      this._abortController.abort();
    }
    let clearValidation = true;
    if (this._config.addOnBlur && this._searchInput.value) {
      clearValidation = this._enterValue();
    }
    this._holderElement.classList.remove(FOCUS_CLASS);
    this.hideSuggestions(clearValidation);
    if (this._fireEvents) {
      const sel = this.getSelection();
      const data = {
        selection: sel ? sel.dataset.value : null,
        input: this._searchInput.value,
      };
      this._config.onBlur(event, this);
      this._selectElement.dispatchEvent(new CustomEvent("tags.blur", { bubbles: true, detail: data }));
    }
  }

  oninput(ev) {
    const data = this._searchInput.value;

    // Add item if a separator is used
    // On mobile or copy paste, it can pass multiple chars (eg: when pressing space and it formats the string)
    if (data) {
      const lastChar = data.slice(-1);
      if (this._config.separator.length && this._config.separator.includes(lastChar)) {
        // Remove separator even if adding is prevented
        this._searchInput.value = this._searchInput.value.slice(0, -1);
        let value = this._searchInput.value;
        let label = value;
        let addData = {};
        // There is no good reason to use the separator feature without allowNew, but who knows!
        if (!this._config.allowNew) {
          const sel = this.getSelection();
          if (!sel) {
            return;
          }
          value = sel.getAttribute(VALUE_ATTRIBUTE);
          label = sel.dataset.label;
        } else {
          addData.new = 1;
        }
        this._add(label, value, addData);
        return;
      }
    }

    // Adjust input width to current content
    setTimeout(() => {
      this._adjustWidth();
    });

    // Check if we should display suggestions
    this.showOrSearch();
  }

  /**
   * keypress doesn't send arrow keys, so we use keydown
   * @param {KeyboardEvent} event
   */
  onkeydown(event) {
    // Keycode reference : https://css-tricks.com/snippets/javascript/javascript-keycodes/
    let key = event.keyCode || event.key;
    /**
     * @type {HTMLInputElement}
     */
    // @ts-ignore
    const target = event.target;

    // Android virtual keyboard might always return 229
    if (event.keyCode == 229) {
      key = target.value.charAt(target.selectionStart - 1).charCodeAt(0);
    }

    // Keyboard keys
    switch (key) {
      case 13:
      case "Enter":
        event.preventDefault();
        this._enterValue();
        break;
      case 38:
      case "ArrowUp":
        event.preventDefault();
        this._keyboardNavigation = true;
        this._moveSelection(PREV);
        break;
      case 40:
      case "ArrowDown":
        event.preventDefault();
        this._keyboardNavigation = true;
        if (this.isDropdownVisible()) {
          this._moveSelection(NEXT);
        } else {
          // show menu regardless of input length
          this.showOrSearch(false);
        }
        break;
      case 8:
      case "Backspace":
        // If the current item is empty, remove the last one
        if (this._searchInput.value.length == 0) {
          this.removeLastItem();
          this._adjustWidth();
          this.showOrSearch();
        }
        break;
      case 27:
      case "Escape":
        this._searchInput.focus();
        this.hideSuggestions();
        break;
    }
  }

  onmousemove(e) {
    // Moving the mouse means no longer using keyboard
    this._keyboardNavigation = false;
  }

  onscroll(e) {
    this._positionMenu();
  }

  onresize(e) {
    this._positionMenu();
  }

  onclick(e = null) {
    if (e) {
      e.preventDefault();
    }
    if (!this.isSingle() && this.isMaxReached()) {
      return;
    }
    // Focus on input when clicking on element or focusing select
    this._searchInput.focus();
  }

  onreset(e) {
    this.reset();
  }

  // #endregion

  /**
   * @param {Boolean} init called during init
   */
  loadData(init = false) {
    if (Object.keys(this._config.items).length > 0) {
      this.setData(this._config.items, true);
    } else {
      this.resetSuggestions(true);
    }

    if (this._config.server) {
      if (this._config.liveServer) {
        // No need to load anything since it will happen when typing
        // Initial values are loaded from config items or from provided options
      } else {
        this._loadFromServer(!init);
      }
    }
  }

  /**
   * Make sure we have valid selected attributes
   */
  _setSelectedAttributes() {
    // we use selectedOptions because single select can have a selected option without a selected attribute if it's the first value
    const selectedOptions = this._selectElement.selectedOptions || [];
    for (let j = 0; j < selectedOptions.length; j++) {
      // Enforce selected attr for consistency
      if (selectedOptions[j].value && !selectedOptions[j].hasAttribute("selected")) {
        selectedOptions[j].setAttribute("selected", "selected");
      }
    }
  }

  resetState() {
    if (this.isDisabled()) {
      this._holderElement.setAttribute("readonly", "");
      this._searchInput.setAttribute("disabled", "");
      this._holderElement.classList.add(DISABLED_CLASS);
    } else {
      rmAttr(this._holderElement, "readonly");
      rmAttr(this._searchInput, "disabled");
      this._holderElement.classList.remove(DISABLED_CLASS);
    }
  }

  /**
   * Reset suggestions from select element
   * Iterates over option children then calls setData
   * @param {Boolean} init called during init
   */
  resetSuggestions(init = false) {
    this._setSelectedAttributes();
    let suggestions = Array.from(this._selectElement.children)
      .filter(
        /**
         * @param {HTMLOptionElement|HTMLOptGroupElement} option
         */
        (option) => {
          return option instanceof HTMLOptGroupElement || !option.disabled || this._config.showDisabled;
        }
      )
      .map(
        /**
         * @param {HTMLOptionElement|HTMLOptGroupElement} option
         */
        (option) => {
          if (option instanceof HTMLOptGroupElement) {
            return {
              group: option.getAttribute("label"),
              items: option.children,
            };
          }
          return {
            value: option.getAttribute("value"),
            label: option.textContent,
            disabled: option.disabled,
            selected: option.selected,
            data: Object.assign(
              {
                disabled: option.disabled, // pass as data as well
              },
              option.dataset
            ),
          };
        }
      );

    this.setData(suggestions, init);
  }

  /**
   * Try to add the current value
   * @returns {Boolean}
   */
  _enterValue() {
    let selection = this.getSelection();
    if (selection) {
      selection.click();
      return true;
    } else {
      // We use what is typed if not selected and not empty
      if (this._config.allowNew && this._searchInput.value) {
        let text = this._searchInput.value;
        const el = this._add(text, text, { new: 1 });
        return el ? true : false;
      }
    }
    return false;
  }

  /**
   * @param {Boolean} show Show menu after load. False during init
   */
  _loadFromServer(show = false) {
    if (this._abortController) {
      this._abortController.abort();
    }
    this._abortController = new AbortController();

    const params = Object.assign({}, this._config.serverParams);
    // Pass current value
    params[this._config.queryParam] = this._searchInput.value;
    // Prevent caching
    if (this._config.noCache) {
      params.t = Date.now();
    }
    // We have a related field
    if (params.related) {
      /**
       * @type {HTMLInputElement}
       */
      //@ts-ignore
      const input = document.getElementById(params.related);
      if (input) {
        params.related = input.value;
        const inputName = input.getAttribute("name");
        if (inputName) {
          params[inputName] = input.value;
        }
      }
    }

    const urlParams = new URLSearchParams(params);
    let url = this._config.server;
    let fetchOptions = Object.assign(this._config.fetchOptions, {
      method: this._config.serverMethod || "GET",
      signal: this._abortController.signal,
    });

    if (fetchOptions.method === "POST") {
      fetchOptions.body = urlParams;
    } else {
      url += "?" + urlParams.toString();
    }

    this._holderElement.classList.add(LOADING_CLASS);
    fetch(url, fetchOptions)
      .then((r) => this._config.onServerResponse(r, this))
      .then((suggestions) => {
        const data = suggestions[this._config.serverDataKey] || suggestions;
        this.setData(data, !show);
        this._abortController = null;
        if (show) {
          this._showSuggestions();
        }
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          return;
        }
        console.error(e);
      })
      .finally((e) => {
        this._holderElement.classList.remove(LOADING_CLASS);
      });
  }

  /**
   * Wrapper for the public addItem method that check if the item
   * can be added
   *
   * @param {string} text
   * @param {string} value
   * @param {object} data
   * @returns {HTMLOptionElement|null}
   */
  _add(text, value = null, data = {}) {
    if (!this.canAdd(text, data)) {
      return null;
    }
    const el = this.addItem(text, value, data);
    this._resetHtmlState();
    if (this._config.keepOpen) {
      this._showSuggestions();
    } else {
      this.resetSearchInput();
    }
    return el;
  }

  /**
   * @param {HTMLElement} li
   * @returns {Boolean}
   */
  _isItemEnabled(li) {
    if (li.style.display === "none") {
      return false;
    }
    const fc = li.firstElementChild;
    return fc.tagName === "A" && !fc.classList.contains("disabled");
  }

  /**
   * @param {String} dir
   * @param {*|HTMLElement} sel
   * @returns {HTMLElement}
   */
  _moveSelection(dir = NEXT, sel = null) {
    const active = this.getSelection();

    // select first li if visible
    if (!active) {
      // no active selection, cannot go back
      if (dir === PREV) {
        return sel;
      }
      // find first enabled item
      if (!sel) {
        sel = this._dropElement.firstChild;
        while (sel && !this._isItemEnabled(sel)) {
          sel = sel["nextSibling"];
        }
      }
    } else {
      const sibling = dir === NEXT ? "nextSibling" : "previousSibling";

      // Iterate over visible li
      sel = active.parentNode;
      do {
        sel = sel[sibling];
      } while (sel && !this._isItemEnabled(sel));

      // We have a new selection
      if (sel) {
        // Remove classes from current active
        active.classList.remove(...this._activeClasses());
      } else if (active) {
        // Use active element as selection
        sel = active.parentElement;
      }
    }

    if (sel) {
      // Scroll if necessary
      const selHeight = sel.offsetHeight;
      const selTop = sel.offsetTop;
      const parent = sel.parentNode;
      const parentHeight = parent.offsetHeight;
      const parentScrollHeight = parent.scrollHeight;
      const parentTop = parent.offsetTop;

      // Reset scroll, this can happen if menu was scrolled then hidden
      if (selHeight === 0) {
        setTimeout(() => {
          parent.scrollTop = 0;
        });
      }

      if (dir === PREV) {
        // Don't use scrollIntoView as it scrolls the whole window
        // Avoid minor top scroll due to headers
        const scrollTop = selTop - parentTop > 10 ? selTop - parentTop : 0;
        parent.scrollTop = scrollTop;
      } else {
        // This is the equivalent of scrollIntoView(false) but only for parent node
        // Only scroll if the element is not visible
        const scrollNeeded = selTop + selHeight - (parentHeight + parent.scrollTop);
        if (scrollNeeded > 0 && selHeight > 0) {
          parent.scrollTop = selTop + selHeight - parentHeight + 1;
          // On last element, make sure we scroll the the bottom
          if (parent.scrollTop + parentHeight >= parentScrollHeight - 10) {
            parent.scrollTop = selTop - parentTop;
          }
        }
      }

      // Adjust link
      const a = sel.querySelector("a");
      a.classList.add(...this._activeClasses());
      this._searchInput.setAttribute("aria-activedescendant", a.id);
      if (this._config.updateOnSelect) {
        this._searchInput.value = a.dataset.label;
        this._adjustWidth();
      }
    } else {
      this._searchInput.setAttribute("aria-activedescendant", "");
    }
    return sel;
  }

  /**
   * Adjust the field to fit its content and show/hide placeholder if needed
   */
  _adjustWidth() {
    this._holderElement.classList.remove(PLACEHOLDER_CLASS);
    if (this._searchInput.value) {
      this._searchInput.size = this._searchInput.value.length;
    } else {
      // Show the placeholder only if empty
      if (this.getSelectedValues().length) {
        this._searchInput.placeholder = "";
        this._searchInput.size = 1;
      } else {
        this._searchInput.size = this._config.placeholder.length > 0 ? this._config.placeholder.length : 1;
        this._searchInput.placeholder = this._config.placeholder;
        this._holderElement.classList.add(PLACEHOLDER_CLASS);
      }
    }

    // If the string contains ascii chars or strange font, input size may be wrong
    // We cannot only rely on the size attribute
    const v = this._searchInput.value || this._searchInput.placeholder;
    const computedFontSize = window.getComputedStyle(this._holderElement).fontSize;
    const w = calcTextWidth(v, computedFontSize) + 16;
    this._searchInput.style.width = w + "px"; // Don't use minWidth as it would prevent using maxWidth
  }

  /**
   * Add suggestions to the drop element
   * @param {Array<Suggestion|SuggestionGroup>} suggestions
   */
  _buildSuggestions(suggestions) {
    while (this._dropElement.lastChild) {
      this._dropElement.removeChild(this._dropElement.lastChild);
    }
    let idx = 0;
    let groupId = 1; // start at one, because data-id = "" + 0 doesn't do anything
    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];

      if (!suggestion) {
        continue;
      }

      // Handle optgroups
      if (suggestion["group"] && suggestion["items"]) {
        const newChild = ce("li");
        newChild.setAttribute("role", "presentation");
        newChild.dataset.id = "" + groupId;
        const newChildSpan = ce("span");
        newChild.append(newChildSpan);
        newChildSpan.classList.add(...["dropdown-header", "text-truncate"]);
        newChildSpan.innerHTML = suggestion["group"];
        this._dropElement.appendChild(newChild);

        if (suggestion["items"]) {
          for (let j = 0; j < suggestion["items"].length; j++) {
            const groupSuggestion = suggestion["items"][j];
            groupSuggestion.group_id = groupId;
            this._buildSuggestionsItem(suggestion["items"][j], idx);
            idx++;
          }
        }

        groupId++;
      }

      //@ts-ignore
      this._buildSuggestionsItem(suggestion, idx);
      idx++;
    }

    // Create the not found message
    if (this._config.notFoundMessage) {
      const notFound = ce("li");
      notFound.setAttribute("role", "presentation");
      notFound.classList.add(CLASS_PREFIX + "not-found");
      // Actual message is refreshed on typing, but we need item for consistency
      notFound.innerHTML = `<span class="dropdown-item"></span>`;
      this._dropElement.appendChild(notFound);
    }
  }

  /**
   * @param {Suggestion} suggestion
   * @param {Number} i The global counter
   */
  _buildSuggestionsItem(suggestion, i) {
    if (!suggestion[this._config.valueField]) {
      return;
    }

    const value = suggestion[this._config.valueField];
    const label = suggestion[this._config.labelField];

    let textContent = this._config.onRenderItem(suggestion, label, this);

    const newChild = ce("li");
    newChild.setAttribute("role", "presentation");
    if (suggestion.group_id) {
      newChild.setAttribute("data-group-id", "" + suggestion.group_id);
    }
    const newChildLink = ce("a");
    newChild.append(newChildLink);
    newChildLink.id = this._dropElement.id + "-" + i;
    newChildLink.classList.add(...["dropdown-item", "text-truncate"]);
    if (suggestion.disabled) {
      newChildLink.classList.add(...["disabled"]);
    }
    newChildLink.setAttribute(VALUE_ATTRIBUTE, value);
    newChildLink.dataset.label = label;
    this._config.searchFields.forEach((sf) => {
      newChild.dataset[sf] = suggestion[sf];
    });
    newChildLink.setAttribute("href", "#");
    newChildLink.innerHTML = textContent;
    this._dropElement.appendChild(newChild);

    // Hover sets active item
    newChildLink.addEventListener("mouseenter", (event) => {
      // Don't trigger enter if using arrows
      if (this._keyboardNavigation) {
        return;
      }
      this.removeSelection();
      newChild.querySelector("a").classList.add(...this._activeClasses());
    });
    newChildLink.addEventListener("mousedown", (event) => {
      // Otherwise searchInput would lose focus and close the menu
      event.preventDefault();
    });
    newChildLink.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._add(label, value, suggestion.data);
      this._config.onSelectItem(suggestion, this);
    });
  }

  /**
   * @returns {NodeListOf<HTMLOptionElement>}
   */
  initialOptions() {
    return this._selectElement.querySelectorAll("option[data-init]");
  }

  /**
   * Call this before looping in a list that calls addItem
   * This will make sure addItem will not add incorrectly options to the select
   */
  _removeSelectedAttrs() {
    this._selectElement.querySelectorAll("option").forEach((opt) => {
      rmAttr(opt, "selected");
    });
  }

  reset() {
    this.removeAll();

    // Reset doesn't fire change event
    this._fireEvents = false;
    const opts = this.initialOptions();
    this._removeSelectedAttrs();
    for (let j = 0; j < opts.length; j++) {
      const iv = opts[j];
      this.addItem(iv.textContent, iv.value, iv.dataset);
    }
    this._resetHtmlState();
    this._fireEvents = true;
  }

  /**
   * @param {Boolean} init Pass true during init
   */
  resetSearchInput(init = false) {
    this._searchInput.value = "";
    this._adjustWidth();

    if (!init) {
      this.hideSuggestions();
      // Trigger input even to show suggestions if needed when focused
      if (this._searchInput === document.activeElement) {
        this._searchInput.dispatchEvent(new Event("input"));
      }
    }

    // We use visibility instead of display to keep layout intact
    if (this.isMaxReached()) {
      this._holderElement.classList.add(MAX_REACHED_CLASS);
      this._searchInput.style.visibility = "hidden";
    } else {
      if (this._searchInput.style.visibility == "hidden") {
        this._searchInput.style.visibility = "visible";
      }
    }

    if (this.isSingle() && !init) {
      //@ts-ignore
      document.activeElement.blur();
    }
  }

  /**
   * @returns {Array}
   */
  getSelectedValues() {
    // option[selected] is used rather that selectedOptions as it works more consistently
    /**
     * @type {NodeListOf<HTMLOptionElement>}
     */
    const selected = this._selectElement.querySelectorAll("option[selected]");
    return Array.from(selected).map((el) => el.value);
  }

  /**
   * @returns {Array}
   */
  getAvailableValues() {
    /**
     * @type {NodeListOf<HTMLOptionElement>}
     */
    const selected = this._selectElement.querySelectorAll("option");
    return Array.from(selected).map((el) => el.value);
  }

  /**
   * Show suggestions or search them depending on live server
   * @param {Boolean} check
   */
  showOrSearch(check = true) {
    if (check && !this._shouldShow()) {
      // focusing should not clear validation
      this.hideSuggestions(false);
      return;
    }
    if (this._config.liveServer) {
      this._searchFunc();
    } else {
      this._showSuggestions();
    }
  }

  /**
   * The element create with buildSuggestions
   * @param {Boolean} clearValidation
   */
  hideSuggestions(clearValidation = true) {
    this._dropElement.classList.remove(SHOW_CLASS);
    attrs(this._searchInput, {
      "aria-expanded": "false",
    });
    this.removeSelection();
    if (clearValidation) {
      this._holderElement.classList.remove(INVALID_CLASS);
    }
  }

  /**
   * Show or hide suggestions
   * @param {Boolean} check
   * @param {Boolean} clearValidation
   */
  toggleSuggestions(check = true, clearValidation = true) {
    if (this._dropElement.classList.contains(SHOW_CLASS)) {
      this.hideSuggestions(clearValidation);
    } else {
      this.showOrSearch(check);
    }
  }

  /**
   * Do we have enough input to show suggestions ?
   * @returns {Boolean}
   */
  _shouldShow() {
    if (this.isDisabled() || this.isMaxReached()) {
      return false;
    }
    return this._searchInput.value.length >= this._config.suggestionsThreshold;
  }

  /**
   * The element create with buildSuggestions
   */
  _showSuggestions() {
    // It's not focused anymore
    if (document.activeElement != this._searchInput) {
      return;
    }
    // Never show suggestions if you cannot add new values
    if (this._searchInput.style.visibility == "hidden") {
      return;
    }

    const lookup = normalize(this._searchInput.value);

    const valueCounter = {};

    // Filter the list according to search string
    const list = this._dropElement.querySelectorAll("li");
    let count = 0;
    let firstItem = null;
    let hasPossibleValues = false;
    let visibleGroups = {};
    for (let i = 0; i < list.length; i++) {
      /**
       * @type {HTMLLIElement}
       */
      let item = list[i];
      /**
       * @type {HTMLAnchorElement|HTMLSpanElement}
       */
      //@ts-ignore
      let link = item.firstElementChild;

      // This is the empty result message or a header
      if (link instanceof HTMLSpanElement) {
        // We will show it later
        if (item.dataset.id) {
          visibleGroups[item.dataset.id] = false;
        }
        hideItem(item);
        continue;
      }

      // Remove previous selection
      link.classList.remove(...this._activeClasses());

      // Hide selected values
      if (!this._config.allowSame) {
        const v = link.getAttribute(VALUE_ATTRIBUTE);
        // Find if the matching option is already selected by index to deal with same values
        valueCounter[v] = valueCounter[v] || 0;
        const opt = this._findOption(link.getAttribute(VALUE_ATTRIBUTE), "[selected]", valueCounter[v]++);
        if (opt) {
          hideItem(item);
          continue;
        }
      }

      // Check search length since we can trigger dropdown with arrow
      const showAllSuggestions = this._config.showAllSuggestions || lookup.length === 0;
      // Do we find a matching string or do we display immediately ?
      let isMatched = lookup.length == 0 && this._config.suggestionsThreshold === 0;
      if (!showAllSuggestions && lookup.length > 0) {
        // match on any field
        this._config.searchFields.forEach((sf) => {
          const text = normalize(link.dataset[sf]);
          const found = this._config.fuzzy ? fuzzyMatch(text, lookup) : text.indexOf(lookup) >= 0;
          if (found) {
            isMatched = true;
          }
        });
      }

      const selectFirst = isMatched || lookup.length === 0;
      if (showAllSuggestions || isMatched) {
        count++;
        showItem(item);
        if (item.dataset.groupId) {
          visibleGroups[item.dataset.groupId] = true;
        }
        // Only select as first item if its matching or no lookup
        if (!firstItem && this._isItemEnabled(item) && selectFirst) {
          firstItem = item;
        }
        if (this._config.maximumItems > 0 && count > this._config.maximumItems) {
          hideItem(item);
        }
      } else {
        hideItem(item);
      }

      if (this._config.highlightTyped) {
        // using .textContent removes any html that can be present (eg: mark added through highlightTyped)
        const textContent = link.textContent;
        const idx = normalize(textContent).indexOf(lookup);
        const highlighted =
          textContent.substring(0, idx) +
          `<mark>${textContent.substring(idx, idx + lookup.length)}</mark>` +
          textContent.substring(idx + lookup.length, textContent.length);
        link.innerHTML = highlighted;
      }

      if (this._isItemEnabled(item)) {
        hasPossibleValues = true;
      }
    }

    // No item and we don't allow new items => error
    if (!this._config.allowNew && !(lookup.length === 0 && !hasPossibleValues)) {
      this._holderElement.classList.add(INVALID_CLASS);
    }

    // If we allow new elements, regex validation should happen on canAdd instead
    if (this._config.allowNew && this._config.regex && this.isInvalid()) {
      this._holderElement.classList.remove(INVALID_CLASS);
    }

    // Show all groups with visible values
    Array.from(list)
      .filter((li) => {
        return li.dataset.id;
      })
      .forEach((li) => {
        if (visibleGroups[li.dataset.id] === true) {
          showItem(li);
        }
      });

    if (hasPossibleValues) {
      // Remove validation message if we show selectable values
      this._holderElement.classList.remove(INVALID_CLASS);

      // Autoselect first
      if (firstItem && this._config.autoselectFirst) {
        this.removeSelection();
        this._moveSelection(NEXT, firstItem);
      }
    }

    // Remove dropdown if list is empty
    if (count === 0) {
      if (this._config.notFoundMessage) {
        /**
         * @type {HTMLElement}
         */
        const notFound = this._dropElement.querySelector("." + CLASS_PREFIX + "not-found");
        notFound.style.display = "block";
        const notFoundMessage = this._config.notFoundMessage.replace("{{tag}}", this._searchInput.value);
        notFound.innerHTML = `<span class="dropdown-item">${notFoundMessage}</span>`;
        this._showDropdown();
      } else {
        // Remove dropdown if not found (do not clear validation)
        this.hideSuggestions(false);
      }
    } else {
      // Or show it if necessary
      this._showDropdown();
    }
  }

  _showDropdown() {
    this._dropElement.classList.add(SHOW_CLASS);
    attrs(this._searchInput, {
      "aria-expanded": "true",
    });
    this._positionMenu();
  }

  _positionMenu() {
    const isRTL = this._rtl;
    const fixed = this._config.fixed;
    const fullWidth = this._config.fullWidth;
    const bounds = this._searchInput.getBoundingClientRect();
    const holderBounds = this._holderElement.getBoundingClientRect();

    let left = 0;
    let top = 0;

    if (fixed) {
      // In full width, use holder as left reference, otherwise use input
      if (fullWidth) {
        left = holderBounds.x;
        top = holderBounds.y + holderBounds.height + 2; // 2px offset
      } else {
        left = bounds.x;
        top = bounds.y + bounds.height;
      }
    } else {
      // When positioning is not fixed, we leave it up to the browser
      // it may not work in complex situations with scrollable overflows, etc
      if (fullWidth) {
        // Stick it at the start
        left = 0;
        // Move it below
        top = holderBounds.height + 2; // 2px offset
      } else {
        // Position next to input (offsetLeft != bounds.x)
        left = this._searchInput.offsetLeft;
        top = this._searchInput.offsetHeight + 6;
      }
    }

    // Align end
    if (isRTL && !fullWidth) {
      left -= this._dropElement.offsetWidth - bounds.width;
    }

    // Horizontal overflow
    if (!fullWidth) {
      const w = Math.min(window.innerWidth, document.body.offsetWidth);
      const hdiff = isRTL
        ? bounds.x + bounds.width - this._dropElement.offsetWidth - 1
        : w - 1 - (bounds.x + this._dropElement.offsetWidth);
      if (hdiff < 0) {
        left = isRTL ? left - hdiff : left + hdiff;
      }
    }

    // Use full holder width
    if (fullWidth) {
      this._dropElement.style.width = this._holderElement.offsetWidth + "px";
    }

    Object.assign(this._dropElement.style, {
      // Reset any height overflow adjustement
      transform: "unset",
      // Position element
      left: left + "px",
      top: top + "px",
    });

    // Overflow height
    const dropBounds = this._dropElement.getBoundingClientRect();
    const h = window.innerHeight;

    // We display above input if it overflows
    if (dropBounds.y + dropBounds.height > h) {
      // We need to add the offset twice
      const topOffset = fullWidth ? holderBounds.height + 4 : bounds.height;
      // In chrome, we need 100.1% to avoid blurry text
      // @link https://stackoverflow.com/questions/32034574/font-looks-blurry-after-translate-in-chrome
      this._dropElement.style.transform = "translateY(calc(-100.1% - " + topOffset + "px))";
    }
  }

  /**
   * @returns {Number}
   */
  _getBootstrapVersion() {
    let ver = 5;
    // If we have jQuery and the tooltip plugin for BS4
    //@ts-ignore
    if (window.jQuery && $.fn.tooltip != undefined && $.fn.tooltip.Constructor != undefined) {
      //@ts-ignore
      ver = parseInt($.fn.tooltip.Constructor.VERSION.charAt(0));
    }
    return ver;
  }

  /**
   * Find if label is already selected (based on attribute)
   * @param {string} text
   * @returns {Boolean}
   */
  _isSelected(text) {
    const opt = Array.from(this._selectElement.querySelectorAll("option")).find(
      (el) => el.textContent == text && el.getAttribute("selected")
    );
    return opt ? true : false;
  }

  /**
   * Find if label is selectable (based on attribute)
   * @param {string} text
   * @returns {Boolean}
   */
  _isSelectable(text) {
    const opt = Array.from(this._selectElement.querySelectorAll("option")).find(
      (el) => el.textContent == text && !el.getAttribute("selected")
    );
    return opt ? true : false;
  }

  /**
   * Checks if value matches a configured regex
   * @param {string} value
   * @returns {Boolean}
   */
  _validateRegex(value) {
    const regex = new RegExp(this._config.regex.trim());
    return regex.test(value);
  }

  /**
   * @returns {HTMLElement}
   */
  getSelection() {
    return this._dropElement.querySelector("a." + ACTIVE_CLASS);
  }

  removeSelection() {
    const selection = this.getSelection();
    if (selection) {
      selection.classList.remove(...this._activeClasses());
    }
  }

  /**
   * @returns {Array}
   */
  _activeClasses() {
    return [...this._config.activeClasses, ...[ACTIVE_CLASS]];
  }

  /**
   * @deprecated since 1.5
   * @returns {HTMLElement}
   */
  getActiveSelection() {
    return this.getSelection();
  }

  /**
   * @deprecated since 1.5
   */
  removeActiveSelection() {
    return this.removeSelection();
  }

  /**
   * Remove all items
   */
  removeAll() {
    let items = this.getSelectedValues();
    items.forEach((item) => {
      this.removeItem(item, true);
    });
    this._adjustWidth();
  }

  /**
   * @param {Boolean} noEvents
   */
  removeLastItem(noEvents = false) {
    let items = this._containerElement.querySelectorAll("span." + CLASS_PREFIX + "badge");
    if (!items.length) {
      return;
    }
    let lastItem = items[items.length - 1];
    this.removeItem(lastItem.getAttribute(VALUE_ATTRIBUTE), noEvents);
  }

  enable() {
    this._selectElement.setAttribute("disabled", "");
    this.resetState();
  }

  disable() {
    rmAttr(this._selectElement, "disabled");
    this.resetState();
  }

  /**
   * @returns {Boolean}
   */
  isDisabled() {
    return this._selectElement.hasAttribute("disabled") || this._selectElement.disabled || this._selectElement.hasAttribute("readonly");
  }

  /**
   * @returns {Boolean}
   */
  isDropdownVisible() {
    return this._dropElement.classList.contains(SHOW_CLASS);
  }

  /**
   * @returns {Boolean}
   */
  isInvalid() {
    return this._holderElement.classList.contains(INVALID_CLASS);
  }

  /**
   * @returns {Boolean}
   */
  isSingle() {
    return !this._selectElement.hasAttribute("multiple");
  }

  /**
   * @returns {Boolean}
   */
  isMaxReached() {
    return this._config.max && this.getSelectedValues().length >= this._config.max;
  }

  /**
   * @param {string} text
   * @param {Object} data
   * @returns {Boolean}
   */
  canAdd(text, data = {}) {
    // Check invalid input
    if (!text) {
      return false;
    }
    // Doesn't allow new
    if (data.new && !this._config.allowNew) {
      return false;
    }
    // Check disabled
    if (this.isDisabled()) {
      return false;
    }
    // Check already selected input (single will replace, so never return false if selected)
    if (!this.isSingle() && !this._config.allowSame) {
      // For new tags or server powered lists...
      if (data.new || this._config.server) {
        // ... check if selected
        if (this._isSelected(text)) {
          return false;
        }
      } else {
        // ...check if selectable
        if (!this._isSelectable(text)) {
          return false;
        }
      }
    }
    // Check for max
    if (this.isMaxReached()) {
      return false;
    }
    // Check for regex on new input
    if (this._config.regex && data.new && !this._validateRegex(text)) {
      this._holderElement.classList.add(INVALID_CLASS);
      return false;
    }
    // Check for custom validation
    if (this._config.onCanAdd && this._config.onCanAdd(text, data, this) === false) {
      this._holderElement.classList.add(INVALID_CLASS);
      return false;
    }
    return true;
  }

  /**
   * Set data
   * @param {Array<Suggestion|SuggestionGroup>|Object} src An array of items or a value:label object
   * @param {Boolean} init called during init
   */
  setData(src, init = false) {
    // Convert value:label to array
    if (!Array.isArray(src)) {
      src = Object.entries(src).map(([value, label]) => ({ value, label }));
    }

    // Track initial selection in case of reset
    if (init) {
      // addItem will add attribute back
      this._removeSelectedAttrs();
      src.forEach((suggestion) => {
        const value = suggestion[this._config.valueField];
        const label = suggestion[this._config.labelField];

        if (!value) {
          return;
        }

        if (suggestion.selected || this._config.selected.includes(value)) {
          const added = this.addItem(label, value, suggestion.data);
          // Add attribute to actual option to allow for same options being selected
          if (added) {
            added.setAttribute("data-init", "true");
          }
        }
      });
    }

    this._buildSuggestions(src);
    this._resetHtmlState();
  }

  /**
   * Keep in mind that we can have the same value for multiple options
   * @param {*} value
   * @param {string} mode
   * @param {number} counter
   * @returns {HTMLOptionElement|null}
   */
  _findOption(value = null, mode = "", counter = 0) {
    // escape invalid characters for HTML attributes: \' " = < > ` &.'
    const val = value === null ? "" : '[value="' + CSS.escape(value) + '"]';
    const sel = "option" + val + mode;
    const opts = this._selectElement.querySelectorAll(sel);
    //@ts-ignore
    return opts[counter] || null;
  }

  /**
   * You might want to use canAdd before to ensure the item is valid
   * @param {string} text
   * @param {string} value
   * @param {object} data
   * @return {HTMLOptionElement} The created or selected option
   */
  addItem(text, value = null, data = {}) {
    if (!value) {
      value = text;
    }

    // Single items remove first
    if (this.isSingle() && this.getSelectedValues().length) {
      this.removeLastItem(true);
    }

    let opt = this._findOption(value, ":not([selected])");

    // we need to create a new option
    if (!opt) {
      opt = ce("option");
      opt.value = value;
      opt.textContent = text; // innerText is not well supported by jsdom
      // Pass along data provided
      for (const [key, value] of Object.entries(data)) {
        opt.dataset[key] = value;
      }
      this._selectElement.appendChild(opt);
      this._config.onCreateItem(opt, this);
    }

    if (opt) {
      data = Object.assign(
        {
          title: opt.getAttribute("title"),
        },
        data,
        opt.dataset
      );
    }
    // update select, we need to set attribute for option[selected]
    opt.setAttribute("selected", "selected");
    opt.selected = true;

    this._createBadge(text, value, data);

    // Fire change event
    if (this._fireEvents) {
      this._selectElement.dispatchEvent(new Event("change", { bubbles: true }));
    }

    return opt;
  }

  /**
   * mobile safari is doing it's own crazy thing...
   * without this, it wil not pick up the proper state of the select element and validation will fail
   */
  _resetHtmlState() {
    const html = this._selectElement.innerHTML;
    this._selectElement.innerHTML = "";
    this._selectElement.innerHTML = html;

    this._adjustWidth();
  }

  /**
   * @param {string} text
   * @param {string} value
   * @param {object} data
   */
  _createBadge(text, value = null, data = {}) {
    const v5 = this._getBootstrapVersion() === 5;
    const allowClear = this._config.allowClear && !data.disabled;

    // create span
    let html = text;

    /**
     * @type {HTMLSpanElement}
     */
    let span = ce("span");
    let classes = [CLASS_PREFIX + "badge"];

    const isSingle = this.isSingle() && !this._config.singleBadge;

    if (!isSingle) {
      classes.push("badge");
      let badgeStyle = this._config.badgeStyle;
      if (data.badgeStyle) {
        badgeStyle = data.badgeStyle;
      }
      if (data.badgeClass) {
        classes.push(...data.badgeClass.split(" "));
      }
      if (this._config.baseClass) {
        // custom style
        classes.push(...this._config.baseClass.split(" "));
      } else if (v5) {
        // https://getbootstrap.com/docs/5.3/components/badge/
        classes = [...classes, ...["bg-" + badgeStyle], "text-truncate"];
      } else {
        // https://getbootstrap.com/docs/4.6/components/badge/
        classes = [...classes, ...["badge-" + badgeStyle]];
      }

      // add extra styles to avoid any layout issues due to very large labels
      span.style.maxWidth = "100%";
    }

    if (data.disabled && parseBool(data.disabled)) {
      classes.push(...["disabled", "opacity-50"]);
    }

    const vertMargin = isSingle ? 0 : 2;

    // We cannot really rely on classes to get a proper sizing
    span.style.margin = vertMargin + "px 6px " + vertMargin + "px 0px";
    // Use logical styles for RTL support
    span.style.marginBlock = vertMargin + "px";
    span.style.marginInline = "0px 6px";
    span.classList.add(...classes);
    span.setAttribute(VALUE_ATTRIBUTE, value);
    // Tooltips
    if (data.title) {
      span.setAttribute("title", data.title);
    }

    if (allowClear) {
      span.style.display = "inline-flex";
      span.style.alignItems = "center";

      // TODO: btn-close white is deprecated
      // @link https://getbootstrap.com/docs/5.3/components/close-button/
      const closeClass = classes.includes("text-dark") || isSingle ? "btn-close" : "btn-close btn-close-white";
      let btnMargin = "margin-inline: 0px 6px;";
      let btnOrder = "";
      if (this._config.clearEnd) {
        btnMargin = "margin-inline: 6px 0px;";
        btnOrder = "order:2;"; // use flex order to move to the end
      }
      const btn = v5
        ? '<button type="button" style="font-size:0.65em;' +
          btnOrder +
          btnMargin +
          '" class="' +
          " " +
          closeClass +
          '" aria-label="' +
          this._config.clearLabel +
          '"></button>'
        : '<button type="button" style="font-size:1em;' +
          btnOrder +
          btnMargin +
          'text-shadow:none;color:currentColor;transform:scale(1.2)" class="' +
          ' close" aria-label="' +
          this._config.clearLabel +
          '"><span aria-hidden="true">&times;</span></button>';
      html = btn + html;
    }

    span.innerHTML = html;
    this._containerElement.insertBefore(span, this._searchInput);

    // tooltips
    if (data.title && tooltip && v5) {
      tooltip.getOrCreateInstance(span);
    }

    if (allowClear) {
      span.querySelector("button").addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!this.isDisabled()) {
          this.removeItem(value);
          //@ts-ignore
          document.activeElement.blur();
          this._adjustWidth();
        }
      });
    }
  }

  /**
   * @param {string} value
   * @param {Boolean} value
   */
  removeItem(value, noEvents = false) {
    // Remove badge if any
    // escape invalid characters for HTML attributes: \' " = < > ` &.'
    const escapedValue = CSS.escape(value);
    let items = this._containerElement.querySelectorAll("span[" + VALUE_ATTRIBUTE + '="' + escapedValue + '"]');
    if (!items.length) {
      return;
    }
    // Remove the last entry for this value
    const idx = items.length - 1;
    const item = items[idx];
    if (item) {
      if (item.dataset.bsOriginalTitle) {
        tooltip.getOrCreateInstance(item).dispose();
      }
      item.remove();
    }

    // update select
    let opt = this._findOption(value, "[selected]", idx);
    if (opt) {
      rmAttr(opt, "selected");
      opt.selected = false;

      // Fire change event
      if (this._fireEvents && !noEvents) {
        this._selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    // Make input visible
    if (this._searchInput.style.visibility == "hidden" && !this.isMaxReached()) {
      this._searchInput.style.visibility = "visible";
      this._holderElement.classList.remove(MAX_REACHED_CLASS);
    }

    if (!noEvents) {
      this._config.onClearItem(value, this);
    }
  }
}

export default Tags;
