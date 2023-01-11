<?php
require("./mysql.php");

$sth = $dbh->prepare("SELECT * FROM `tasks` ORDER BY FIELD(`status`, 'not_started', 'in_progress', 'finished'), `ORDER`;");
$sth->execute();

$result = $sth->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);

?>