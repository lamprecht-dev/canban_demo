<?php
require("./mysql.php");

$sth = $dbh->prepare("TRUNCATE TABLE `tasks`");
$sth->execute();


$sth = $dbh->prepare("INSERT INTO `tasks` (`title`, `description`, `status`, `order`) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?);");
$sth->execute(
    ["Read Client Brief", "Extra details not covered in meeting", "in_progress", 0, 
    "Attend Project Briefing", "Conference Room 023 - At 10:30am", "finished", 0,
    "Assign Sprint Roles", "", "not_started", 1,
    "Create Git Repository", "", "finished", 1,
    "Prepare Project Folder", "Use new company folder structure", "not_started", 0
    ]
);

header("Location: /");
?>