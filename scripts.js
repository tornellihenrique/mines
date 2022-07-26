// Mines game made by Henrique Tornelli Duarte :)

let gameEnded = false;
const size = Number(prompt('Board size', '10')) || 10;

const mines = getMines();

/**
class Tile {
	x: number;
	y: number;
	mine: boolean;
	clicked: boolean;
	minesAround: number;
}
*/

const tiles = [];

for (let i = 0; i < size; i++) {
  const col = [];

  for (let j = 0; j < size; j++) {
    col.push({
      x: i,
      y: j,
      mine: hasMine(i, j),
      clicked: false,
      exploded: false,
      getTilesAround: function () {
        const t = [];

        for (let i = this.x - 1; i <= this.x + 1; i++) {
          for (let j = this.y - 1; j <= this.y + 1; j++) {
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
      minesAround: function () {
        let q = 0;

        for (let i = this.x - 1; i <= this.x + 1; i++) {
          for (let j = this.y - 1; j <= this.y + 1; j++) {
            if (
              i >= 0 &&
              i < size &&
              j >= 0 &&
              j < size &&
              (i != this.x || j != this.y)
            ) {
              const t = tiles[i][j];

              if (t.mine) q++;
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

      str += `<td><button class="tile${t.mine && t.clicked ? ' mine' : ''}${
        t.clicked ? ' clicked' : ''
      }${t.exploded ? ' exploded' : ''}${t.clicked ? ' clicked' : ''}${
        t.clicked && !t.mine && minesAround ? ' num' : ''
      }" onclick="onClick(${i}, ${j})">
	  	${t.clicked && !t.mine && minesAround ? minesAround : ''}
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

  if (t.mine) {
    t.exploded = true;
    gameEnded = true;
    clickAll();

    return;
  }

  const queue = [[x, y]];

  while (queue.length > 0) {
    const [i, j] = queue.shift();

    const tile = tiles[i][j];

    if (tile.mine) continue;

    if (tile.clicked) continue;
    tile.clicked = true;

    if (!tile.mine) queue.push(...tile.getTilesAround());
  }
}

function onClick(x, y) {
  if (gameEnded) return;

  handle(x, y);

  renderBoard();
}

function hasMine(x, y) {
  return !!mines.find((m) => m[0] == x && m[1] == y);
}

function getMines() {
  const m = [];

  const n = size * 3;

  for (let i = 0; i < n; i++) {
    m.push([genNum(0, size), genNum(0, size)]);
  }

  return m;
}

function genNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
