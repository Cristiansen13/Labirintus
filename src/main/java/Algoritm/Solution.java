package Algoritm;

import java.util.LinkedList;
import java.util.Queue;

public class Solution {

    int maxX, maxY, startX, startY, endX, endY;
    int[][] labirint;
    SolutionCell[][] solveGrid;

    public Solution(int maxX, int maxY, int startX, int startY, int endX, int endY, int[][] labirint) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.labirint = labirint;
        solveGrid = new SolutionCell[maxX][maxY];

        // Initialize solveGrid with Algoritm.SolutionCell instances
        for (int i = 0; i < maxX; i++) {
            for (int j = 0; j < maxY; j++) {
                solveGrid[i][j] = new SolutionCell();
                solveGrid[i][j].row = i; // Set cell coordinates
                solveGrid[i][j].col = j; // Set cell coordinates
            }
        }

        // Set up the starting cell
        solveGrid[startX][startY].visited = true;
        solveGrid[startX][startY].time = 0;

        Queue<SolutionCell> queue = new LinkedList<>();
        queue.add(solveGrid[startX][startY]);
        int[][] MOVES = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};

        while (!queue.isEmpty()) {
            SolutionCell cell = queue.remove();

            // Process all possible moves
            for (int i = 0; i < MOVES.length; i++) {
                int newRow = cell.row + MOVES[i][0];
                int newCol = cell.col + MOVES[i][1];
                if (newRow >= 0 && newRow < maxX && newCol >= 0 && newCol < maxY
                        && !solveGrid[newRow][newCol].visited
                        && labirint[newRow][newCol] == 0) {
                    solveGrid[newRow][newCol].visited = true;
                    solveGrid[newRow][newCol].parentRow = cell.row; // Set parent cell's row
                    solveGrid[newRow][newCol].parentCol = cell.col; // Set parent cell's column
                    solveGrid[newRow][newCol].time = cell.time + 1; // Increment time
                    queue.add(solveGrid[newRow][newCol]); // Add the new cell to the queue
                }
            }
        }

        int currentRow = endX;
        int currentCol = endY;

        while (currentRow != startX || currentCol != startY) {

            labirint[currentRow][currentCol] = 2;

            SolutionCell parentCell = solveGrid[currentRow][currentCol];
            currentRow = parentCell.parentRow;
            currentCol = parentCell.parentCol;

            if (currentRow == startX && currentCol == startY) {
                labirint[currentRow][currentCol] = 2;
                break;
            }
        }

    }
}