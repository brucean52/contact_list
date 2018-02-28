<?php
    require_once('../config/mysql_connect.php');

    $id = $_POST['id'];
    $first_name = $_POST['firstName'];
    $last_name = $_POST['lastName'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $output = [
        'success' => false,
        'error' => []
    ];
    
    $query = "UPDATE `list` SET `firstName`='$first_name', `lastName`='$last_name', `email`='$email', `phone`='$phone' WHERE id='$id'";
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