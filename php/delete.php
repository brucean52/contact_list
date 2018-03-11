<?php
    require_once('../config/mysql_connect.php');

    $id = $_POST['id'];
    $output = [
        'success' => false,
        'error' => []
    ];
    
    $query = "DELETE FROM `list` WHERE `id`='$id'";
    $result = mysqli_query($conn, $query);

    if(!empty($result)){
        if(mysqli_affected_rows($conn)){
            $output['success'] = true;
        } else {
            $output['errors'][] = 'unable to insert data';
        }
    } else {
        $output['errors'][] = 'invalid query';
    }

    $json_output = json_encode($output);

    print($json_output);

?>