var api = require('../'),
    assert = require('assert');

describe('mapshaper-svg-style.js', function () {
  describe('isSvgColor()', function () {
    var isSvgColor = api.internal.isSvgColor;
    it('hits', function () {
      assert(isSvgColor('#eee'))
      assert(isSvgColor('blue'))
      assert(isSvgColor('none'))
      assert(isSvgColor('rgb(0,32,0)'))
      assert(isSvgColor('rgba(0, 255, 92, 0.2)'))
    })
    it('misses', function() {
      assert.equal(isSvgColor('#'), false)
      assert.equal(isSvgColor('33'), false)
    })
  })

  describe('isSvgNumber()', function () {
    var isSvgNumber = api.internal.isSvgNumber;
    it('hits', function () {
      assert(isSvgNumber('4'))
      assert(isSvgNumber('0'))
      assert(isSvgNumber('-4'))
      assert(isSvgNumber(4))
      assert(isSvgNumber('0.003'))
    })
    it('misses', function () {
      assert.equal(isSvgNumber('#eee'), false)
      assert.equal(isSvgNumber('none'), false)
      assert.equal(isSvgNumber(''), false)
    })
  })

  describe('isSvgClassName()', function () {
    var isSvgClassName = api.internal.isSvgClassName;
    it('hits', function () {
      assert(isSvgClassName('_'))
      assert(isSvgClassName('black opaque'))
      assert(isSvgClassName('class-0'))
    })
    it('misses', function () {
      assert.equal(isSvgClassName('-somevar'), false)
      assert.equal(isSvgClassName(''), false)
      assert.equal(isSvgClassName('5'), false)
    })
  })

  describe('svgStyle()', function () {
    it('expressions', function () {
      var records = [{foo: 2, bar: 'a', baz: 'white'}, {foo: 0.5, bar: 'b', baz: 'black'}]
      var lyr = {
        data: new api.internal.DataTable(records)
      };
      var opts = {
        stroke: 'baz',
        'stroke-width': 'foo / 2',
        fill: 'bar == "a" ? "pink" : "green"'
      };
      var target = [{
        foo: 2,
        bar: 'a',
        baz: 'white',
        stroke: 'white',
        'stroke-width': 1,
        fill: 'pink'
      }, {
        foo: 0.5,
        bar: 'b',
        baz: 'black',
        stroke: 'black',
        'stroke-width': 0.25,
        fill: 'green'
      }];
      api.svgStyle(lyr, {}, opts);
      assert.deepEqual(lyr.data.getRecords(), target);
    })

    it('literals', function() {
      var records = [{}]
      var lyr = {
        data: new api.internal.DataTable(records)
      };
      var opts = {
        stroke: '#222222',
        'stroke-width': '4',
        fill: 'rgba(255,255,255,0.2)'
      };
      var target = [{
        stroke: '#222222',
        'stroke-width': 4,
        fill: 'rgba(255,255,255,0.2)'
      }];
      api.svgStyle(lyr, {}, opts);
      assert.deepEqual(lyr.data.getRecords(), target);
    })
  })
});