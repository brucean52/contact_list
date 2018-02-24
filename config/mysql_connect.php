<?php

$conn = mysqli_connect('localhost', 'root', 'root', 'contact', 3306);
    
if(empty($conn)){
    print('No database connection available!');
    die('no database');
}
?>