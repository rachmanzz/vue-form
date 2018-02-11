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

var _object = function (callback) {
    var q = this.query
    var size = q.length
    var i = 0
    var m = {} // mapping
    for (i; i < size; i++) {
        var el = q[i]
        if (el.type !== 'submit' && el.type !== 'reset') {
            if(el.type === 'checkbox') {
                m[el.name] = el.checked
            } else if (el.type === 'radio') {
                if (typeof m[el.name] === 'undefined' ) {
                    m[el.name] = ''
                }
                if (el.checked) {
                    m[el.name] = el.value
                }
            } else {
                m[el.name] = el.value
            }
        }
    }

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

var _form = function (e) {
    if (typeof e.target !== 'undefined') {
        this.target = e.target
    }
}

_form.prototype.refByName = _refByName

var vueform = function () {}

var _install = function (Vue, Option) {
}