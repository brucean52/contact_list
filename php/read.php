<?php

    require_once('../config/mysql_connect.php');
    //if(!empty($LOCAL_ACCESS)){
    //    die('direct access not allowed');
    //}

    $query = "SELECT * FROM list";

    $result = mysqli_query($conn, $query);

    $output = [
        'success' => false,
        'error' => [],
        'data' => []
    ];

    if(!empty($result)){
        if(mysqli_num_rows( $result ) !== 0) {
            $output['success'] = true;
            while( $row = mysqli_fetch_assoc($result)){
                $output['data'][] = $row;
            }
        } else {
        $output['error'][] = 'No data available';
        }

    } else {
        $output['errors'][] = mysqli_error($conn);
    }

    $json_output = json_encode($output);

    print($json_output);

?>