<?php
require("./mysql.php");

// Read Old Data

$sth = $dbh->prepare("SELECT * FROM tasks");
$sth->execute();

$read_db = $sth->fetchAll(PDO::FETCH_ASSOC);

// Compare
    $new_db_data = json_decode(file_get_contents('php://input'));

    $update_data = [];
    $new_data = [];
    $remove_data = [];

    for($i = 0; $i < count($read_db); $i++){
        $match = false;
        for($j = 0; $j < count($new_db_data); $j++){
            if($new_db_data[$j]->id == $read_db[$i]['id']){
                $match = true;
                if($new_db_data[$j]->title != $read_db[$i]['title'] ||
                    $new_db_data[$j]->description != $read_db[$i]['description'] ||
                    $new_db_data[$j]->status != $read_db[$i]['status'] ||
                    $new_db_data[$j]->order != $read_db[$i]['order']){
                    
                    array_push($update_data, $new_db_data[$j]);
                }
                break;
            }
        }

        if(!$match){
            array_push($remove_data, $read_db[$i]['id']);
        }
    }

    for($i = 0; $i < count($new_db_data); $i++){
        if($new_db_data[$i]->id == -1){
            array_push($new_data, $new_db_data[$i]);
        }
    }

// Update Current
    for($i = 0; $i < count($update_data); $i++){
        $sth = $dbh->prepare("UPDATE `tasks` SET `title` = :title, `description` = :descr, `order` = :order, `status` = :stat WHERE `id` = :id;");
        $sth->bindValue(':id', $update_data[$i]->id, PDO::PARAM_INT);
        $sth->bindValue(':title', $update_data[$i]->title, PDO::PARAM_STR);
        $sth->bindValue(':descr', $update_data[$i]->description, PDO::PARAM_STR);
        $sth->bindValue(':order', $update_data[$i]->order, PDO::PARAM_INT);
        $sth->bindValue(':stat', $update_data[$i]->status, PDO::PARAM_STR);
        $sth->execute();
    }


// Add New
    for($i = 0; $i < count($new_data); $i++){
        $sth = $dbh->prepare("INSERT INTO `tasks` (`title`, `description`, `order`, `status`) VALUES (:title, :descr, :order, :stat);");
        $sth->bindValue(':title', $new_data[$i]->title, PDO::PARAM_STR);
        $sth->bindValue(':descr', $new_data[$i]->description, PDO::PARAM_STR);
        $sth->bindValue(':order', $new_data[$i]->order, PDO::PARAM_INT);
        $sth->bindValue(':stat', $new_data[$i]->status, PDO::PARAM_STR);
        $sth->execute();
    }


// Delete Old
    for($i = 0; $i < count($remove_data); $i++){
        $sth = $dbh->prepare("DELETE FROM `tasks` WHERE `id` = :id;");
        $sth->bindValue(':id', $remove_data[$i], PDO::PARAM_INT);
        $sth->execute();
    }

// Re-Read for fresh data

$sth = $dbh->prepare("SELECT * FROM `tasks` ORDER BY FIELD(`status`, 'not_started', 'in_progress', 'finished'), `ORDER`;");
$sth->execute();

$result = $sth->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result);

?>