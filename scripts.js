// Mines game made by Henrique Tornelli Duarte :)

let gameEnded = false;
let addedMines = false;

const size = Number(prompt('Board size', '10')) || 10;

const tiles = [];
let mines = [];

for (let i = 0; i < size; i++) {
  const col = [];

  for (let j = 0; j < size; j++) {
    col.push({
      x: i,
      y: j,
      mine: function () {
        const x = this.x;
        const y = this.y;

        return !!mines.find(function (m) {
          return m[0] == x && m[1] == y;
        });
      },
      clicked: false,
      exploded: false,
      getTilesAround: function (d = 1) {
        const t = [];

        for (let i = this.x - d; i <= this.x + d; i++) {
          for (let j = this.y - d; j <= this.y + d; j++) {
            if (
              i >= 0 &&
              i < size &&
              j >= 0 &&
              j < size &&
              (i != this.x || j != this.y)
            )
              t.push([i, j]);
          }
        }

        return t;
      },
      minesAround: function (d = 1) {
        let q = 0;

        for (let i = this.x - d; i <= this.x + d; i++) {
          for (let j = this.y - d; j <= this.y + d; j++) {
            if (
              i >= 0 &&
              i < size &&
              j >= 0 &&
              j < size &&
              (i != this.x || j != this.y)
            ) {
              const t = tiles[i][j];

              if (t.mine()) q++;
            }
          }
        }

        return q;
      },
    });
  }

  tiles.push(col);
}

renderBoard();

function renderBoard() {
  $('.board').empty();

  let str = '';

  for (let i = 0; i < size; i++) {
    str += '<tr>';

    for (let j = 0; j < size; j++) {
      const t = tiles[i][j];

      const minesAround = t.minesAround();
      const mine = t.mine();

      str += `<td><button class="tile${mine && t.clicked ? ' mine' : ''}${
        t.clicked ? ' clicked' : ''
      }${t.exploded ? ' exploded' : ''}${
        t.clicked && !mine && minesAround ? ' num' : ''
      }" onclick="onClick(${i}, ${j})">
	  	${t.clicked && !mine && minesAround ? minesAround : ''}
	  </button></td>`;
    }

    str += '</tr>';
  }

  $('.board').append(str);
}

function clickAll() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const tile = tiles[i][j];

      tile.clicked = true;
    }
  }
}

function handle(x, y) {
  const t = tiles[x][y];

  if (t.mine()) {
    t.exploded = true;
    gameEnded = true;
    clickAll();

    return;
  }

  const queue = [[x, y]];

  while (queue.length > 0) {
    const [i, j] = queue.shift();

    const tile = tiles[i][j];

    if (tile.mine()) continue;

    if (tile.clicked) continue;
    tile.clicked = true;

    if (!addedMines) {
      addedMines = true;

      createMines(x, y);
    }

    if (!tile.mine() && !tile.minesAround())
      queue.push(...tile.getTilesAround());
  }
}

function onClick(x, y) {
  if (gameEnded) return;

  handle(x, y);

  renderBoard();
}

function createMines(x, y) {
  const n = size;

  for (let i = 0; i < n; i++) {
    const mine = [genNum(0, size), genNum(0, size)];

    if (
      (x == mine[0] && y == mine[1]) ||
      tiles[x][y].getTilesAround(2).find(function ([a, b]) {
        return a == mine[0] && b == mine[1];
      }) ||
      mines.find(function ([a, b]) {
        return a == mine[0] && b == mine[1];
      })
    ) {
      i--;
      continue;
    }

    mines.push(mine);
  }
}

function genNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
