<?php
/**
 * Created by PhpStorm.
 * User: Gert
 * Date: 26/12/2016
 * Time: 19:41
 */

$command = $_GET["cmd"];

$file = 'savePeerId.txt';
// Open the file to get existing content
$id = file_get_contents($file);



if ($command == "get") {


    echo $id;
    return;

} else if ($command == "put") {
    $id = $_GET["id"];
    file_put_contents($file, $id);
    echo "saved " . $id ;
}

?>