var Projector = function(projection, state) {
	this._projection = projection;
	this._state = state;
}

Projector.prototype.project = function(data, callback) {
	return this._projection.project(this._state, data, callback);
};

module.exports = Projector;