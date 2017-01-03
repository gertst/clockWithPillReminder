<?php
/**
 * Created by PhpStorm.
 * User: Gert
 * Date: 26/12/2016
 * Time: 19:41
 */

$command = $_GET["cmd"];

$file = 'saveDate.txt';
// Open the file to get existing content
$dateString = file_get_contents($file);



if ($command == "get") {

    if ($dateString) {
        $date = strtotime($dateString);
    } else {
        $date = null;
    }
    echo $dateString;
    return;

} else if ($command == "put") {
    $dateString = $_GET["date"];
    file_put_contents($file, $dateString);
    echo "saved " . $dateString ;
}

?>