import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [PlayerComponent, CommonModule],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {
  readonly ROWS = 5;
  readonly COLUMNS = 5;

  playerPosition = [0, 0];
  finishPosition = (this.ROWS * this.COLUMNS) - 1;
  matrix: number[][];
  reachedFinish = false;

  adjacentCells: AdjacentCells = {
    indices: new Set(),
    left: null,
    right: null,
    top: null,
    bottom: null
  };

  constructor() {
    this.matrix = new Array(this.ROWS).fill(0).map(() => new Array(this.COLUMNS).fill(0));
    this.determineAdjacentCells();
  }

  determineAdjacentCells() {
    const x = this.playerPosition[0];
    const y = this.playerPosition[1];

    let top: number | null = null;
    let bot: number | null = null;
    let left: number | null = null;
    let right: number | null = null;

    if (x > 0) {
      top = (this.playerPosition[0] - 1) * this.COLUMNS + this.playerPosition[1];
    }
    if (x < this.ROWS - 1) {
      bot = (this.playerPosition[0] + 1) * this.COLUMNS + this.playerPosition[1];
    }
    if (y > 0) {
      left = (this.playerPosition[1] - 1) + this.COLUMNS * this.playerPosition[0];
    }
    if (y < this.COLUMNS - 1) {
      right = (this.playerPosition[1] + 1) + this.COLUMNS * this.playerPosition[0];
    }

    const indices = new Set<number>();
    for (const num of [top, bot, left, right]) {
      if (num !== null) {
        indices.add(num);
      }
    }
    this.adjacentCells.indices = new Set<number>(indices);
    this.adjacentCells.left = left;
    this.adjacentCells.right = right;
    this.adjacentCells.bottom = bot;
    this.adjacentCells.top = top;
  }

  movePlayer(index: number) {
    if (!this.adjacentCells.indices.has(index)) {
      return;
    }

    const x = Math.floor(index / this.COLUMNS);
    const y = index % this.COLUMNS;
    this.playerPosition = [x, y];

    if (index === this.finishPosition) {
      this.reachedFinish = true;
      this.adjacentCells = {
        indices: new Set(),
        left: null,
        right: null,
        bottom: null,
        top: null,
      }
      return;
    }

    this.determineAdjacentCells();
  }
}

interface AdjacentCells {
  indices: Set<number>;
  left: number | null;
  right: number | null;
  top: number | null;
  bottom: number | null;
}
