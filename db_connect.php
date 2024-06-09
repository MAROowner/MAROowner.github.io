<?php
require_once 'config.php';

function addRecord($name, $points)
{
	global $servername, $username, $password, $dbname;

	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		return json_encode(array('success' => false, 'message' => "Помилка підключення: " . $conn->connect_error));
	}

	$sql = "INSERT INTO users (username, points) VALUES ('$name', $points)";

	if ($conn->query($sql) === TRUE) {
		$response = json_encode(array('success' => true, 'message' => "Новий запис успішно додано до бази даних"));
	} else {
		$response = json_encode(array('success' => false, 'message' => "Помилка: " . $sql . "<br>" . $conn->error));
	}

	$conn->close();
	return $response;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$name = $_POST['name'];
	$points = $_POST['points'];
	echo addRecord($name, $points);
}
