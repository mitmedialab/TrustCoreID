Object.defineProperty(Array.prototype, 'group', {
    enumerable: false,
    value: function (key) {
        let map = {};
        this.forEach(function (e) {
            var k = key(e);
            map[k] = map[k] || [];
            map[k].push(e);
        });
        return Object.keys(map).map(function (k) {
            return {key: k, data: map[k]};
        });
    }
});

console.log('overrides')