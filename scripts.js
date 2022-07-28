// Mines game made by Henrique Tornelli Duarte :)

let gameEnded = false;
let addedMines = false;

const size = 10;
// const size = Number(prompt('Board size', '10')) || 10;

const tiles = [];
let mines = [];

for (let i = 0; i < size; i++) {
  const col = [];

  for (let j = 0; j < size; j++) {
    col.push({
      x: i,
      y: j,
      mine: false,
      clicked: false,
      exploded: false,
      flag: false,
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

              if (t.mine) q++;
            }
          }
        }

        return q;
      },
      getClasses: function () {
        const c = ['tile'];

        if (this.clicked) c.push('clicked');
        if (this.mine && this.clicked && !this.flag) c.push('mine');
        if (this.flag) c.push('flag');
        if (this.exploded) c.push('exploded');
        if (this.clicked && !this.mine && !this.flag && this.minesAround()) c.push('num');

        return c.join(' ');
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

      const id = `tile-${i}-${j}`;

      str += `<td><button class="${t.getClasses()}" id="${id}" onmousedown="onClick(${i}, ${j}, event)">
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

  if (t.flag) {
    return;
  }

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

    if (!addedMines) {
      addedMines = true;

      createMines(x, y);
    }

    if (!tile.mine && !tile.minesAround()) queue.push(...tile.getTilesAround());
  }
}

function handleFlag(x, y) {
  const t = tiles[x][y];

  if (t.clicked) return;

  t.flag = !t.flag;
}

function onClick(x, y, { which }) {
  if (gameEnded) return;

  if (which == 1) handle(x, y);
  if (which == 3) handleFlag(x, y);

  if (checkWin()) {
    alert('Nice');

    clickAll();
  }

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

    tiles[mine[0]][mine[1]].mine = true;

    mines.push(mine);
  }
}

function checkWin() {
  let notClickedCount = 0;
  let correctFlagCount = 0;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const t = tiles[i][j];

      if (!t.clicked) notClickedCount++;
      if (t.mine && t.flag) correctFlagCount++;
    }
  }

  return notClickedCount == mines.length || correctFlagCount == mines.length;
}

function genNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
