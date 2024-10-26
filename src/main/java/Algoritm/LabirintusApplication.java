package Algoritm;

import org.json.JSONArray;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import org.json.JSONObject;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

@SpringBootApplication
public class LabirintusApplication {

	private static final int THREAD_POOL_SIZE = 10;
	private static ExecutorService executorService;
	private static AtomicBoolean mainTaskFailed = new AtomicBoolean(false);

	public static void main(String[] args) throws IOException, SQLException {
		SpringApplication.run(LabirintusApplication.class, args);

		// Initialize the thread pool
		executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

		StartNode();

		// Submit the ReadAndRespond task to the thread pool
		submitReadAndRespondTask();

		// Add a shutdown hook to properly shut down the thread pool
		Runtime.getRuntime().addShutdownHook(new Thread(() -> {
			try {
				executorService.shutdown();
				if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
					executorService.shutdownNow();
				}
			} catch (InterruptedException e) {
				executorService.shutdownNow();
			}
		}));
	}

	private static void submitReadAndRespondTask() {
		executorService.submit(() -> {
			try {
				while (true) {
					ReadAndRespond();
				}
			} catch (IOException | SQLException e) {
				e.printStackTrace();
				mainTaskFailed.set(true);
				submitReadAndRespondTask(); // Resubmit the task if it fails
			}
		});
	}

	public static void StartNode() {
		try {
			ProcessBuilder processBuild = new ProcessBuilder("node", "server.js");
			processBuild.inheritIO();
			Process process = processBuild.start();
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static boolean hasData() {
		File file = new File("userData.json");
		return file.exists() && file.length() > 0;
	}

	public static void ReadAndRespond() throws IOException, SQLException {
		while (!hasData());

		// Read data from JSON
		JSONObject jsonObject = null;
		while (jsonObject == null) {
			try {
				String content = new String(Files.readAllBytes(Paths.get("userData.json")));
				jsonObject = new JSONObject(content);
			} catch (Exception e) {
				throw new IOException(e);
			}
		}

		// Extract data
		int history = jsonObject.getInt("history");
		int density = jsonObject.getInt("density");
		int width = jsonObject.getInt("lines");
		int height = jsonObject.getInt("columns");
		int startY = jsonObject.getInt("start_x");
		int startX = jsonObject.getInt("start_y");
		int endY = jsonObject.getInt("end_x");
		int endX = jsonObject.getInt("end_y");

		if (history == 0) {
			// Delete data
			File file = new File("userData.json");
			file.delete();

			// Generate labyrinth
			Labirint labirint = null;
			while (labirint == null) {
				try {
					labirint = new Labirint(width, height, startX, startY, endX, endY, density);
				} catch (Exception e) {
					// Handle exception if needed
				}
			}

			// Create JSON with labyrinth
			JSONObject labirintJson = new JSONObject();
			labirintJson.put("lines", height);
			labirintJson.put("columns", width);
			labirintJson.put("start_x", startX);
			labirintJson.put("start_y", startY);
			labirintJson.put("end_x", endX);
			labirintJson.put("end_y", endY);

			JSONArray matrixJsonArray = new JSONArray();
			for (int[] row : labirint.getMatrix()) {
				JSONArray rowArray = new JSONArray();
				for (int value : row) {
					rowArray.put(value);
				}
				matrixJsonArray.put(rowArray);
			}
			labirintJson.put("matrix", matrixJsonArray);

			// Write JSON to file
			String path = "public/userDataResponse.json";
			File resultFile = new File(path);
			try {
				resultFile.createNewFile();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}

			try (PrintWriter writer = new PrintWriter(new FileWriter(path, false))) {
				writer.println(labirintJson.toString());
			} catch (IOException e) {
				throw new IOException(e);
			}

			// Send to database
			insertIntoDatabase(labirintJson.toString());
		} else {
			String lastLabirint = getNthLastLabirintEntry(history);

			// Write JSON to file
			String path = "public/userDataResponse.json";
			File resultFile = new File(path);
			try {
				resultFile.createNewFile();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}

			try (PrintWriter writer = new PrintWriter(new FileWriter(path, false))) {
				writer.println(lastLabirint);
			} catch (IOException e) {
				throw new IOException(e);
			}
		}
	}

	private static void insertIntoDatabase(String labirintJsonString) throws SQLException {
		String url = "jdbc:mariadb://localhost:3306/harta";
		String user = "minotaur";
		String password = "123";

		String query = "INSERT INTO harta (labirint) VALUES (?)";

		try (Connection connection = DriverManager.getConnection(url, user, password);
			 PreparedStatement preparedStatement = connection.prepareStatement(query)) {

			preparedStatement.setString(1, labirintJsonString);
			preparedStatement.executeUpdate();

		} catch (SQLException e) {
			throw new SQLException("Database insertion error: " + e.getMessage(), e);
		}
	}

	private static String getNthLastLabirintEntry(int n) throws SQLException {
		String url = "jdbc:mariadb://localhost:3306/harta";
		String user = "minotaur";
		String password = "123";

		String query = "SELECT labirint FROM harta ORDER BY time DESC LIMIT 1 OFFSET ?";

		try (Connection connection = DriverManager.getConnection(url, user, password);
			 PreparedStatement preparedStatement = connection.prepareStatement(query)) {

			preparedStatement.setInt(1, n - 1);

			ResultSet resultSet = preparedStatement.executeQuery();

			if (resultSet.next()) {
				return resultSet.getString("labirint");
			}
		} catch (SQLException e) {
			throw new SQLException("Database retrieval error: " + e.getMessage(), e);
		}
		return null;
	}
}