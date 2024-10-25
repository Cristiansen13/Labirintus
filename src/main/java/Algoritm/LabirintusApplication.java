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

		// functie care se blocheaza pana cand am date
		while (true) {
			ReadAndRspond();
		}
	}

	public static boolean hasData() {
		File file = new File("/home/mihai/IdeaProjects/Labirintus/userData.json");
		System.out.println(file.exists());
		return file.exists() && file.length() > 0;
	}

	public static void ReadAndRspond() throws IOException, SQLException {
		while (!hasData());

		// citire date din json
		JSONObject jsonObject = null;
		while (jsonObject == null) {
			try {
				String content = new String(Files.readAllBytes(Paths.get("/home/mihai/IdeaProjects/Labirintus/userData.json")));
				jsonObject = new JSONObject(content);
			} catch (Exception e) {
				throw new IOException(e);
			}
		}

		// preluare date
		String str = jsonObject.get("density").toString();
		if (str.charAt(0) != 'n') {
			int density = jsonObject.getInt("density");
			int width = jsonObject.getInt("lines");
			int height = jsonObject.getInt("columns");
			int startX = jsonObject.getInt("start_x");
			int startY = jsonObject.getInt("start_y");
			int endX = jsonObject.getInt("end_x");
			int endY = jsonObject.getInt("end_y");

			// stergere date
			File file = new File("/home/mihai/IdeaProjects/Labirintus/userData.json");
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
			String path = "/home/mihai/IdeaProjects/Labirintus/userDataResponse.json";
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
			// Get the last labyrinth entry
			String lastLabirint = getLastLabirintEntry();
		}
	}

	private static void insertIntoDatabase(String labirintJsonString) throws SQLException {
		String url = "jdbc:mariadb://localhost:3306/harta";
		String user = "minotaur";
		String password = "123";

		String query = "INSERT INTO harta (labirint) VALUES (?)";

		try (Connection connection = DriverManager.getConnection(url, user, password);
			 PreparedStatement preparedStatement = connection.prepareStatement(query)) {

			preparedStatement.setString(1, labirintJsonString);  // Set labyrinth JSON in the query
			preparedStatement.executeUpdate();

			System.out.println("Labyrinth data inserted successfully!");

		} catch (SQLException e) {
			throw new SQLException("Database insertion error: " + e.getMessage(), e);
		}
	}

	private static String getLastLabirintEntry() throws SQLException {
		String url = "jdbc:mariadb://localhost:3306/harta";
		String user = "minotaur";
		String password = "123";

		String query = "SELECT labirint FROM harta ORDER BY time DESC LIMIT 1";

		try (Connection connection = DriverManager.getConnection(url, user, password);
			 PreparedStatement preparedStatement = connection.prepareStatement(query);
			 ResultSet resultSet = preparedStatement.executeQuery()) {

			if (resultSet.next()) {
				return resultSet.getString("labirint");
			}
		} catch (SQLException e) {
			throw new SQLException("Database retrieval error: " + e.getMessage(), e);
		}
		return null;
	}

}
