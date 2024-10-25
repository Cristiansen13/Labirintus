package Algoritm;

public class SolutionCell {
    int row, col;
    int parentRow, parentCol;
    boolean visited;
    int time;

    public SolutionCell() {
        this.parentRow = -1; // Default to no parent
        this.parentCol = -1; // Default to no parent
        this.visited = false; // Default to not visited
        this.time = 0; // Default time
    }

    public SolutionCell(int row, int col, int time, boolean visited) {
        this.row = row;
        this.col = col;
        this.time = time;
        this.visited = visited;
        this.parentRow = -1; // Default to no parent
        this.parentCol = -1; // Default to no parent
    }

    @Override
    public String toString() {
        return parentRow + "," + parentCol + ","+ row + "," + col + "," + time + "," + visited;
    }
}