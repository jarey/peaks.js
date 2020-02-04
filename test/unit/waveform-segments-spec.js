'use strict';

require('./setup');

var Peaks = require('../../src/main');

describe('SegmentsLayer', function() {
  var p;

  beforeEach(function(done) {
    p = Peaks.init({
      container: document.getElementById('container'),
      mediaElement: document.getElementById('media'),
      dataUri: {
        json: 'base/test_data/sample.json'
      },
      keyboard: true,
      height: 240
    });

    p.on('peaks.ready', done);
  });

  afterEach(function() {
    if (p) {
      p.destroy();
    }
  });

  context('when adding a segment', function() {
    it('should redraw the view if the segment is visible', function() {
      var zoomview = p.views.getView('zoomview');

      expect(zoomview).to.be.ok;

      var spy = sinon.spy(zoomview._segmentsLayer._layer, 'draw');

      p.segments.add({ startTime: 0, endTime: 10, editable: true, id: 'segment1' });

      expect(spy.callCount).to.equal(1);
    });

    it('should not redraw the view if the segment is not visible', function() {
      var zoomview = p.views.getView('zoomview');

      expect(zoomview).to.be.ok;

      var spy = sinon.spy(zoomview._segmentsLayer._layer, 'draw');

      p.segments.add({ startTime: 28, endTime: 32, editable: true, id: 'segment2' });

      expect(spy.callCount).to.equal(0);
    });
  });
});

describe('SegmentShape', function() {
  var p;

  beforeEach(function(done) {
    p = Peaks.init({
      container: document.getElementById('container'),
      mediaElement: document.getElementById('media'),
      dataUri: {
        json: 'base/test_data/sample.json'
      },
      keyboard: true,
      height: 240
    });

    p.on('peaks.ready', done);
  });

  afterEach(function() {
    if (p) {
      p.destroy();
    }
  });

  it('should create marker handles for non-editable segments', function() {
    var spy = sinon.spy(p.options, 'createSegmentMarker');

    p.segments.add({
      startTime: 0,
      endTime:   10,
      editable:  true,
      id:        'segment1'
    });

    // 2 for zoomview, as overview forces segments to be non-editable by default.
    expect(spy.callCount).to.equal(2);

    var call = spy.getCall(0);

    expect(call.args).to.have.lengthOf(1);
    expect(call.args[0].segment.startTime).to.equal(0);
    expect(call.args[0].segment.endTime).to.equal(10);
    expect(call.args[0].segment.editable).to.equal(true);
    expect(call.args[0].segment.id).to.equal('segment1');
    expect(call.args[0].draggable).to.equal(true);
    expect(call.args[0]).to.have.property('startMarker');
    expect(call.args[0].color).to.equal('#aaaaaa');
    expect(call.args[0]).to.have.property('layer');
    expect(call.args[0].view).to.equal('zoomview');
  });

  it('should not create marker handles for non-editable segments', function() {
    var spy = sinon.spy(p.options, 'createSegmentMarker');

    p.segments.add({ startTime: 0, endTime: 10, editable: false, id: 'segment1' });

    expect(spy.callCount).to.equal(0);
  });
});
