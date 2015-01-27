var Projection = function()
{
	this._init = [];
	this._rules = [];
	this._otherwise = [];
}

Projection.prototype.init = function(func) {
	this._init.push(func);
	return this;
};

Projection.prototype.any = function(func) {
	this.when(function() { return true;}, func);
	return this;
}

Projection.prototype.when = function(criteria, func) {
	this._rules.push({criteria: criteria, function: func});
	return this;
}

Projection.prototype.property = function(prop, value, func) {
	this._rules.push({criteria: function(x) { return x[prop] === value}, function: func});
	return this;
}

Projection.prototype.otherwise = function(func) {
	this._otherwise.push(func);
	return this;
}

Projection.prototype.project = function(state, data) {
	this._init.forEach(function(f) {
		f(state);
	});
	if(!Array.isArray(data)) {
		data = [data];
	}

	var self = this;
	data.forEach(function(x) {

		state = self._match(state, x);
	});

	return state;
}

Projection.prototype._match = function(state, element) {
	var processed = false;
	this._rules.forEach(function(rule) {
		if(rule.criteria(element)) {
			processed = true;
			rule["function"](state, element);
		}
	});

	if(!processed) {
		this._otherwise.forEach(function(func) {
			func(state, element);
		});
	}

	return state;
};

module.exports = Projection;