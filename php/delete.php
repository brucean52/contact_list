<?php
    require_once('../config/mysql_connect.php');

//    if(!empty($LOCAL_ACCESS)){
//        die('direct access not allowed');
//    }
    
    //$_POST = json_decode(file_get_contents('php://input'), true);
    //print_r($_POST);
//    $name = $_POST['name'];
//    $grade = $_POST['grade'];
//    $course = $_POST['course'];
    $id = $_POST['id'];
    $output = [
        'success' => false,
        'error' => []
    ];
    
    $query = "DELETE FROM `list` WHERE `id`='$id'";
    $result = mysqli_query($conn, $query);
    //print($result);

    if(!empty($result)){
        if(mysqli_affected_rows($conn)){
            $output['success'] = true;
            //$output['id'] = mysqli_insert_id($conn);
        } else {
            $output['errors'][] = 'unable to insert data';
        }
    } else {
        $output['errors'][] = 'invalid query';
    }

    $json_output = json_encode($output);

    print($json_output);

?>