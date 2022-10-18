<?php
require("./mysql.php");

$sth = $dbh->prepare("SELECT * FROM tasks");
$sth->execute();

$result = $sth->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);

?>