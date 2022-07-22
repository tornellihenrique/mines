// Mines game made by Henrique Tornelli Duarte :)

const size = 10;
// const size = Number(prompt('Board size', '10'));

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

for (let i=0; i<size; i++) {
	const col = [];
	
	for (let j=0; j<size; j++) {
		col.push({
			x: i,
			y: j,
			mine: hasMine(i, j),
			clicked: false,
			minesAround: 0,
			getTilesAround: function() {
				const t = [];
				
				for (let i=this.x-1; i<=this.x+1; i++) {
					for (let j=this.y-1; j<=this.y+1; j++) {
						console.log(i, j);
						if (i >= 0 && i < size && j >= 0 && j < size && i != this.x && j != this.y)
							t.push([i, j]);
					}
				}
				
				return t;
			}
		});
	}
	
	tiles.push(col);
}

renderBoard();

function renderBoard() {
	$('.board').empty();
	
	let str = '';
	
	for (let i=0; i<size; i++) {
		str += '<tr>';
		
		for (let j=0; j<size; j++) {
			const t = tiles[i][j];
			
			str += `<td><button class="tile${t.mine ? ' mine' : ''}" onclick="handleClick(${i}, ${j})"></button></td>`;
		}
		
		str += '</tr>';
	}
	
	$('.board').append(str);
}

function handleClick(x, y) {
	const t = tiles[x][y];
	
	console.log(t.getTilesAround());
}

function hasMine(x, y) {
	return !!mines.find(m => m[0] == x && m[1] == y);
}

function getMines() {
	const m = [];

	for (let i=0; i<size; i++) {
		m.push([genNum(0, size), genNum(0, size)]);
	}
	
	return m;
}

function genNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
