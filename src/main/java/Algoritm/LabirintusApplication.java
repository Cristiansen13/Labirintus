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

@SpringBootApplication
public class LabirintusApplication {

	public static void main(String[] args) throws IOException, SQLException {
		SpringApplication.run(LabirintusApplication.class, args);

		StartNode();

		// functie care se blocheaza pana cand am date
		while (true) {
			ReadAndRspond();
		}
	}

	public static void StartNode()
	{
		try{
			ProcessBuilder processBuild = new ProcessBuilder("node", "server.js");
			processBuild.inheritIO();
			Process process = processBuild.start();
		}
		catch (IOException e){
			throw new RuntimeException(e);
		}
	}

	public static boolean hasData() {
		File file = new File("userData.json");
		return file.exists() && file.length() > 0;
	}

	public static void ReadAndRspond() throws IOException, SQLException {
		while (!hasData());

		// citire date din json
		JSONObject jsonObject = null;
		while (jsonObject == null) {
			try {
				String content = new String(Files.readAllBytes(Paths.get("userData.json")));
				jsonObject = new JSONObject(content);
			} catch (Exception e) {
				throw new IOException(e);
			}
		}

		// preluare date
		int history = jsonObject.getInt("history");
		int density = jsonObject.getInt("density");
		int width = jsonObject.getInt("lines");
		int height = jsonObject.getInt("columns");
		int startY = jsonObject.getInt("start_x");
		int startX = jsonObject.getInt("start_y");
		int endY = jsonObject.getInt("end_x");
		int endX = jsonObject.getInt("end_y");
		if (history == 0) {
			// stergere date
			File file = new File("userData.json");
			file.delete();

			// generare labirint
			Labirint labirint = null;
			while (labirint == null) {
				try {
					labirint = new Labirint(width, height, startX, startY, endX, endY, density);
				} catch (Exception e) {
					// Handle exception if needed
				}
			}

			// creare JSON cu labirintul
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

			// Scrie in fisier JSON-ul
			String path = "public/userDataResponse.json";
			File resultFile = new File(path);
			try {
				resultFile.createNewFile();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}

			try (PrintWriter writer = new PrintWriter(new FileWriter(path, false))) { // Set to true for append mode
				writer.println(labirintJson.toString());
			} catch (IOException e) {
				throw new IOException(e);
			}

			// Trimite la baza de date
			insertIntoDatabase(labirintJson.toString());
		} else {
			String lastLabirint = getNthLastLabirintEntry(history);

			// Scrie in fisier JSON-ul
			String path = "public/userDataResponse.json";
			File resultFile = new File(path);
			try {
				resultFile.createNewFile();
			} catch (IOException e) {
				throw new RuntimeException(e);
			}

			try (PrintWriter writer = new PrintWriter(new FileWriter(path, false))) { // Set to true for append mode
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

			// Set the OFFSET to position - 1 since it is 0-indexed
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
