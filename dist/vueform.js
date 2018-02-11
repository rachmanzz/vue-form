/**
  * return boolen
    - check typeof object
**/
var isDefine = function (v) { return typeof v !== 'undefined' },
isString = function (v) { return typeof v === 'string' },
isNumber = function (v) { return typeof v === 'number' },
isFunc   = function (v) { return typeof v === 'function' },
isArray  = function (v) { return Array.isArray(v) },
isObject = function (v) { return !isArray(v) && typeof v === 'object' }

var builderObject = function (m, el, val, callback) {
    if (el.hasAttribute('child')) {
        var child = el.getAttribute('child')
        if (typeof m[child] === 'undefined') {
            m[child] = {}
        } 
        m[child][el.name] = val
        callback(child, m[child])
        return
    }
}

var _object = function (callback) {
    var q = this.query
    var size = q.length
    var i = 0
    var m = {} // mapping
    m.__buildObject__ = function (el, val) {
        if (el.hasAttribute('child')) {
            var child = el.getAttribute('child')
            if (typeof this[child] === 'undefined') {
                this[child] = {}
            }
            this[child][el.name] = val
            return
        } 
        this[el.name] = val
    }
    for (i; i < size; i++) {
        var el = q[i]
        if (el.type !== 'submit' && el.type !== 'reset') {
            if(el.type === 'checkbox') {
                m.__buildObject__(el, el.checked) 
            } else if (el.type === 'radio') {
                if (typeof m[el.name] === 'undefined' ) {
                    m[el.name] = ''
                }
                if (el.checked) {
                    m.__buildObject__(el, el.value)
                }
            } else {
                m.__buildObject__(el, el.value)
            }
        }
    }
    delete m.__buildObject__ // delete key of object when object already to use
    if (typeof callback !== 'undefined' && typeof callback === 'function') {
        callback(m)
    } else {
        return m
    }
}

var _refByName = function () {
    this.query = this.target.querySelectorAll('[name]')
    return this
}
var _refByClass = function (arg) {
    this.query = this.target.querySelectorAll('.' + arg)
    return this
}

var _ref = function (arg) {
    this.query = this.target.querySelectorAll(arg)
    return this
}

var _form = function (e) {
    const self = this
    if(typeof e !== 'undefined') {
        if (typeof e === 'function') {
            return function (data) {
                if (typeof data.target !== 'undefined') {
                    self.target = data.target
                    e(self.refByName().getObject())
                } else {
                    e(data)
                }
            }
        } 
        if (typeof e.target !== 'undefined') {
            this.target = e.target
        }
    }
}

_form.prototype.refByName = _refByName
_form.prototype.ref = _ref
_form.prototype.refByClass = _r
_form.prototype.getObject = _object
var vueform = function () {}

var _install = function (Vue, Option) {
    Vue.prototype.$form = function (e) {
        return new _form(e)
    }
}
vueform.install = _install

module.exports = vueform