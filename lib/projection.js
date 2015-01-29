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
	return this.when( function(x) { return x[prop] === value}, func);
}

Projection.prototype.otherwise = function(func) {
	this._otherwise.push(func);
	return this;
}

Projection.prototype.combine = function(projection) {
	this._init = this._init.concat(projection._init);
	this._rules = this._rules.concat(projection._rules);
	this._otherwise = this._otherwise.concat(projection._otherwise);
	return this;
}

Projection.prototype.project = function(state, data, callback) {
	var supportsAsync = typeof(callback) !== 'undefined';
	this._init.forEach(function(f) {
		f(state);
	});

	if(!Array.isArray(data)) {
		data = [data];
	}
	var idx = 0;
	var self = this;

	next(state);

	function next() {
		var element = data[idx++];
		//is done?
		if(!element) {
			if(callback) {
				callback(null, state);
				return state;
			} else {
				return state;
			}
		} else {
			self._match(state, element, next, supportsAsync);
		}
	}
	return state;
}

Projection.prototype._match = function(state, element, next, supportsAsync) {
	var processed = false;
	var self = this;
	this._rules.forEach(function(rule) {
		if(rule.criteria(element)) {
			processed = true;
			var func = rule["function"];
			self._exec(func,state, element, next, supportsAsync);
			
		}
	});

	if(!processed) {
		this._otherwise.forEach(function(func) {
			self._exec(func,state, element, next, supportsAsync);
		});
	}

};

Projection.prototype._exec = function(func, state, element, next, supportsAsync) {
	//3 arguments, means that function is expecting a next() function
	if(func.length === 3) {
		if(!supportsAsync) {
			throw new Error("cannot have async projection without calling project with callback");
		} else {
			func(state, element, next);
			return true;
		}
	} else {
		func(state, element);
		next(state);
	}

}

module.exports = Projection;