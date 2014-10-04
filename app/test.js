import app from 'appkit/app'
import life from 'appkit/life';

export default function() {

  module('withEach');
  test('calls function with each cell in nested array', function(assert) {
    var cells = 0;
    life.initialize();

    life.withEach({
      onEachCell: function() {
        cells++;
      }
    });

    assert.equal(cells, 2400);
  });

  test('calls function with each row in nested array', function(assert) {
    var rows = 0;
    life.initialize();

    life.withEach({
      onEachRow: function() {
        rows++;
      }
    });

    assert.equal(rows, 40);
  });

  test('calls function on each cell with x, y coordinates and cell value', function(assert) {

    life.initialize();
    var cells = {};

    life.withEach({
      onEachCell: function(x, y, value) {
        if ((x == 10) && (y == 20)) {
          cells.x = x;
          cells.y = y;
          cells.value = value;
        }
      }
    });

   assert.equal(cells.x, 10);
   assert.equal(cells.y, 20);
   assert.ok((cells.value == 'a') || (cells.value == 'd'), true);
  });

  module('rules#underPopulated');
  test("returns true when less than 2 neighbors are alive", function(assert) {
    var output = life.rules.underPopulated(['a','d','d']);
    assert.equal(output, true);
  });

  test("returns false when more than 2 neighbors are alive", function(assert) {
    var output = life.rules.underPopulated(['a', 'a', 'a', 'd']);
    assert.equal(output, false);
  });

  module('rules#equilibrium');
  test("returns true when aliveNeighbors are equal to 2", function(assert) {
    var output = life.rules.equilibrium(['a', 'a', 'd']);
    assert.equal(output, true);
  });

  test("returns true when aliveNeighbors are equal to 3", function(assert) {
    var output = life.rules.equilibrium(['a', 'a', 'a', 'd']);
    assert.equal(output, true);
  });

  test("returns false when aliveNeighbots is not 2 or 3", function(assert) {
    var output = life.rules.equilibrium(['a', 'a', 'a', 'a', 'd']);
    assert.equal(output, false);
  });

  module('rules#overcrowded');
  test("returns true if aliveNeighbors is greater than 3", function(assert) {
    var output = life.rules.overcrowded(['a', 'a', 'a', 'a']);
    assert.equal(output, true);
  });

  test("returns false if aliveNeighbors is less than than 3", function(assert) {
    var output = life.rules.overcrowded(['a', 'a', 'd', 'd']);
    assert.equal(output, false);
  });

  module('rules#reproduction');
  test('returns true if aliveNeighbors equals 3', function(assert) {
    var output = life.rules.reproduction(['a', 'a', 'a', 'd']);
    assert.equal(output, true);
  });

  test('returns false if aliveNeighbors does not equal 3', function(assert) {
    var output = life.rules.reproduction(['a', 'a', 'a', 'a']);
    assert.equal(output, false);
  });

}
