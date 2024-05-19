<?php
require_once 'config.php';

$name = $_POST['name'];
$points = $_POST['points'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
	die("Помилка підключення: " . $conn->connect_error);
}

$sql = "INSERT INTO users (username, points) VALUES ('$name', $points)";

if ($conn->query($sql) === TRUE) {
    echo "Новий запис успішно додано до бази даних";
} else {
    echo "Помилка: " . $sql . "<br>" . $conn->error;
}

$conn->close();