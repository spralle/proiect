var proiect = require('..');
var should = require('should');

describe('Projection', function() {
	it('#init', function() {
		var projection = new proiect.Projection();
		projection
			.init(function(s) {
				s.count = 0;
			});
		var projector = new proiect.Projector(projection);
		var result = projector.project({});
		result.count.should.equal(0);
	});
	it('#any with one element', function() {
		var projection = new proiect.Projection();
		projection
			.init(function(s) {
				s.count = 0;
			}).any(function(s, i) {
				s.count++;
			});
		var projector = new proiect.Projector(projection);
		var result = projector.project({});
		result.count.should.equal(1);
	});
	it('#any with two elements', function() {
		var projection = new proiect.Projection();
		projection
			.init(function(s) {
				s.count = 0;
			}).any(function(s, i) {
				s.count++;
			});
		var projector = new proiect.Projector(projection);
		var result = projector.project([{}, {}]);
		result.count.should.equal(2);
	});
	it('#when', function() {
		var projection = new proiect.Projection();
		projection
			.init(function(s) {
				s.count = 0;
			}).when(function(i) {
				return typeof(i.key) != 'undefined';
			}, function(s, i) {
				s.count++;
			});
		var projector = new proiect.Projector(projection);
		var result = projector.project([{ key:'test'}, {}, {}]);
		result.count.should.equal(1);
	});	
	it('#when multiple criterias', function() {
		var projection = new proiect.Projection();
		projection
			.init(function(s) {
				s.count = 0;
				s.other = 0;
			}).when(function(i) {
				return typeof(i.key) != 'undefined';
			}, function(s, i) {
				s.count++;
			}).when(function(i) {
				return typeof(i.key2) != 'undefined';
			}, function(s, i) {
				s.count++;
			}).otherwise(function(s,i) {
				s.other++;
			});
		var projector = new proiect.Projector(projection);
		var result = projector.project([{ key:'test'}, {key2:'test'}, {}]);
		result.count.should.equal(2);
		result.other.should.equal(1);
	});		
	it('#property', function() {
		var projection = new proiect.Projection();
		projection
			.init(function(s) {
				s.count = 0;
			}).property('key', 'test', function(s, i) {
				s.count++;
			});
		var projector = new proiect.Projector(projection);
		var result = projector.project([{ key:'test'}, {}, {}]);
		result.count.should.equal(1);
	});	
	it('#otherwise', function() {
		var projection = new proiect.Projection();
		projection
			.init(function(s) {
				s.count = 0;
				s.other = 0;
			}).property('key', 'test', function(s, i) {
				s.count++;
			}).otherwise(function(s, i) {
				s.other++;
			});
		var projector = new proiect.Projector(projection);
		var result = projector.project([{ key:'test'}, {}, {}]);
		result.count.should.equal(1);
		result.other.should.equal(2);
	});	
});