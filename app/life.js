export default {

  start: function() {
    setInterval(this.tick.bind(this), 100);
  },

  props: {
    el: $('table.life'),
    width: 60,
    height: 40,
    generation: 1,
    startingCoords: [
      [0,0],
      [0,1],
      [1,0],
      [0,2],
      [0,3],
      [1,1],
      [3,4],
      [5,0],
      [0,3],
      [1,3],
      [2,3]
    ]
  },

  initialize: function() {
    this.createWorld();
    this.updateWorld();

    return this;
  },

  withEach: function(options) {

    var defaults = {
      onEachRow: function(x) {},
      onEachCell: function(x, y, value) {}
    }

    var config = $.extend({},defaults, options);

    var world = this.props.world;

    for (var r = 0; r < world.length; r += 1) {
      config.onEachRow.call(null, r);
      for (var c = 0; c < world[r].length; c += 1) {
        config.onEachCell.call(world, r, c, String(world[r][c]));
      }
    }

    return this;
  },

  updateWorld: function() {

    var self = this;

    self.props.el.html('');

    var world = this.props.world;

    for (var r = 0; r < world.length; r += 1) {
      var rows = '';
      for (var c = 0; c < world[r].length; c += 1) {
        if (world[r][c] === 'a') {
          rows = rows + '<td class="' + c + ' alive"></td>';
        } else {
          rows = rows + '<td class="' + c + '"></td>';
        }
      }
      self.props.el.append('<tr class="' + r + '">' + rows + '</tr>');
    }
  },

  tick: function() {
    $('.generation').text(this.props.generation);
    this.props.generation++;
    this.updateCells();
    this.updateWorld();
  },

  lookupCell: function(x, y) {
    return $('tr.' + x).find('td.' + y);
  },

  toggleLife: function(cell) {
    var $cell = $(cell);

    if ($cell.hasClass('alive')) {
      $cell.removeClass('alive');
    } else {
      $cell.addClass('alive');
    }
  },

  createWorld: function() {
    
    var world = [];
    var self = this;

    for(var r = 0; r < this.props.height; r++) {
      var row = [];
      for(var c = 0; c < this.props.width; c++) {
        if (self.inStartingCoords(r,c)) {
          row.push('a');
        } else {
          row.push('d');
        }
      }
      world.push(row);
    }
    this.props.world = world;
    return world;
  },

  inStartingCoords: function(x, y) {
    var startingAlive = false
    $.each(this.props.startingCoords, function(index, value) {
      if ( (value[0] == x) && (value[1] == y) ) {
        startingAlive = true;
      }
    })

    return startingAlive;
  },

  updateCells: function() {
    var self = this;

    this.withEach({
      onEachCell: function(x,y, state) {
        var neighbors = self.getNeighbors(x,y);

        if (state === 'a') {
          if (self.rules.underPopulated(neighbors)) {
            this[x][y] = 'd';
          }
          if (self.rules.equilibrium(neighbors) == true) {
            this[x][y] = 'a';
          }
          if (self.rules.overcrowded(neighbors) == true) {
            this[x][y] = 'd';
          }
        } else {
          if (self.rules.reproduction(neighbors) == true) {
            this[x][y] = 'a';
          }
        }
      }
    });

    this.updateWorld();
  },


  rules: {

    underPopulated: function(neighbors) {
      // Any live cell with fewer than two live neighbours dies
       
      var aliveNeighbors = $.map(neighbors, function(neighbor) {
        if (neighbor == 'a') {
          return neighbor;
        }
      });

      if ( aliveNeighbors['length'] < 2 ) {
        return true;
      } else {
        return false;
      } 
    },

    equilibrium: function(neighbors) {
      // Any live cell with two or three live neighbours lives on to the next generation
      
      var aliveNeighbors = $.map(neighbors, function(neighbor) {
        if (neighbor === 'a') {
          return neighbor;
        }
      });

      if ( (aliveNeighbors['length'] === 2) || (aliveNeighbors['lengh'] == 3) ) {
        return true;
      } else {
        return false;
      }
    },

    overcrowded: function(neighbors) {
      // Any live cell with more than three live neighbours dies

      var aliveNeighbors = $.map(neighbors, function(neighbor) {
        if (neighbor === 'a') {
          return neighbor;
        }
      });

      if ( aliveNeighbors['length'] > 3 ) {
        return true;
      } else {
        return false;
      }

    },

    reproduction: function(neighbors) {
      // Any dead cell with exactly three live neighbours becomes a live cell

      var aliveNeighbors = $.map(neighbors, function(neighbor) {
        if (neighbor === 'a') {
          return neighbor;
        }
      });

      if (aliveNeighbors['length'] === 3) {
        return true;
      } else {
        return false;
      }

    }
  },

  getNeighbors: function(x, y) {
    var neighbors = [];
    var world = this.props.world;

    if (x > 0) {
      neighbors.push(world[x - 1][y]);
      if (y < world[0].length) {
        neighbors.push(world[x - 1][y + 1]);
      }

      if ( y > 0 ) {   
        neighbors.push(world[x - 1][y - 1]);
      }
    }

    if (y > 0) {
      neighbors.push(world[x][y - 1]);

      if ( x < world.length - 1) {
        neighbors.push(world[x + 1][y - 1]);
      }
    }
    
    if ( x < world.length - 1 ) {
      neighbors.push(world[x + 1][y]);
    }

    if ( (x < world.length - 1) && (y < world[0].length)) {
      neighbors.push(world[x + 1][y + 1]);
    }

    if ( y < world[0].length - 1) {
      neighbors.push(world[x][y + 1]);
    }

    return $.map(neighbors, function(value) {
      if (value !== undefined) {
        return value;
      }
    });
  }

};
