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
                _validate(el)
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
var _validate = function (_el) {
    if(_el.hasAttribute('validate')) {
        var str_validate = _el.getAttribute('validate')
        // split to array
        var arr_validate = str_validate.split('|')
        var size = arr_validate.length
        var i = 0
        if (typeof this.valiteObject !== 'object') {
            this.validateObject = {}
        }
        if (typeof this.valid !== 'boolen') {
            this.valid = true
        }
        var setErrorText = function (message) {
            if (_el.hasAttribute('child')) {
                if (typeof this.validateObject[_el.getAttribute('child')] === 'undefined') {
                    this.validateObject[_el.getAttribute('child')] = {}
                }
                this.validateObject[_el.getAttribute('child')][_el.name] = message
            } else {
                this.validateObject[_el.getAttribute('child')][_el.name] = message
            }
        }
        var setNotValid = function () {
            if(this.valid) this.valid = false
        }
        for (i; i < size; i++) {
            var get = arr_validate[i]
            if (get === 'required') {
                if(_el.value === null || _el.value === 'undefined' || _el.value === '' || _el.value.length === 0) {
                    setErrorText('required')
                    setNotValid()
                }
            }
            if (/^min:[0-9]+$/.test(get)) { 
                var min = get.match(/^min:([0-9]+)$/)[1]
                if (_el.value.length < min) {
                    setErrorText('field length less than ' + min)
                    setNotValid()
                }
            }
            if (/^max:[0-9]+$/.test(get)){
                var max = get.match(/^max:([0-9]+)$/)[1]
                if (_el.value.length > max) {
                    setErrorText('field length more than ' + max)
                    setNotValid()
                }
            }
            if (/^eq:[\w]+$/.test(get)){
                var eq = get.match(/^eq:([\w]+)$/)[1]
                var input =this.target.querySelector('[name="' + eq + '"]')
                if (_el.value !== input.value) {
                    setErrorText(_el.name + ' field not match with ' + eq)
                    setNotValid()
                }
            }
            if(get === 'email' && !/^[_\.\w]+\@[_\.\w]+/.test(_el.value)){
                setErrorText('email field incorrect')
                setNotValid()
            }
        }
    }
    return true
}
var _form = function (e) {
    const self = this
    if(typeof e !== 'undefined') {
        if (typeof e === 'function') {
            return function (data) {
                if (typeof data.target !== 'undefined') {
                    self.target = data.target
                    self.refByName().getObject(e)
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
_form.prototype.refByClass = _refByClass
_form.prototype.getObject = _object
_form.prototype.valid = true
var vueform = function () {}

var _install = function (Vue, Option) {
    Vue.prototype.$form = function (e) {
        return new _form(e)
    }
}
vueform.install = _install

module.exports = {
    vueform: vueform,
    gForm: function (e) {
        return new _form(e)
    }
}