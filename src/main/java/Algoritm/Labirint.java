package Algoritm;

import java.util.Random;

public class Labirint {
    static int maxim = 101;
    int maxX, maxY, startX, startY, endX, endY ,density;
    int[][] labirint;
    Solution solution;

    public Labirint(int maxX, int maxY, int startX, int startY, int endX, int endY ,int density) {
        this.maxX = maxX;
        this.maxY = maxY;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.density = density;

        //initialize the labirint
        labirint = new int[maxX][maxY];
        for (int i = 0; i < maxX; i++) {
            for (int j = 0; j < maxY; j++) {
                labirint[i][j] = 0;
            }
        }

        //get the actual number of walls
        int numberOfObstacles = (int) Math.floor((((double) (maxX*maxY)) * ((double)density))/100.0);

        //Random variables for generating walls
        Random random = new Random();
        int wallX, wallY;

        while (numberOfObstacles > 0)
        {
            wallX = random.nextInt(maxX);
            wallY = random.nextInt(maxY);
            if(labirint[wallX][wallY] == 0 && (wallX != startX && wallY != startY) || (wallX != endX && wallY != endY)) {
                labirint[wallX][wallY] = 1;
                numberOfObstacles--;
            }
        }

        // generate the solution for the labirinth above
        solution = new Solution(maxX,maxY,startX,startY,endX,endY,labirint);
    }

    @Override
    public String toString() {
        StringBuffer aux = new StringBuffer();
        for (int i = 0; i < maxX; i++) {
            for (int j = 0; j < maxY; j++) {
                aux.append(labirint[i][j] + " ");
            }
            aux.append("\n");
        }
        return aux.toString();
    }

    public int[][] getMatrix() {
        return labirint;
    }
}
