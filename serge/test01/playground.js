var $px = $px || {};

console.log("PLAYGROUND...");

(function (_px) {

    var hasOwnProp = {}.hasOwnProperty;

    function createName (name) {
        return '$' + name;
    }

    _px.Emitter = function() {
        this.subjects = {};
        this.debug = false;
    }

    _px.Emitter.prototype.emit = function (name, data) {
        var fnName = createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        this.subjects[fnName].onNext(data);
    };

    _px.Emitter.prototype.listen = function (name, handler) {
        var fnName = createName(name);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        return this.subjects[fnName].subscribe(handler);
    };

    _px.Emitter.prototype.dispose = function () {
        var subjects = this.subjects;
        for (var prop in subjects) {
            if (hasOwnProp.call(subjects, prop)) {
                subjects[prop].dispose();
            }
        }

        this.subjects = {};
    };

})($px);

(function(_px) {

    var emitter = new _px.Emitter();

    var subscriptions = (function() {
        var fn1 = function (data) {
            console.log('fn1: ' + data);
        };
        var fn2a = function (data) {
            console.log('fn2.a: ' + data);
        };
        var fn2b = function (data) {
            console.log('fn2.b: ' + data);
        };

        var subscriptions = {
            s1: emitter.listen('fn1', fn1),
            s2a: emitter.listen('fn2', fn2a),
            s2b: emitter.listen('fn2', fn2b)
        };

        return subscriptions;
    })();

    emitter.emit('fn1', 'foo');
    emitter.emit('fn2', 'bar');

    subscriptions.s2b.dispose();
    emitter.emit('fn2', 'barabar');

    subscriptions.s1.dispose();
    subscriptions.s2a.dispose();

    emitter.dispose();
    emitter.emit('fn1', 'to infinity');

})($px);

(function(_px) {

    _px.globalEmitter1 = new _px.Emitter();
    _px.globalEmitter1.listen("test", function testListener(data) {
        console.log('globalEmitter1 "test" event: ' + data);
    });

})($px);
