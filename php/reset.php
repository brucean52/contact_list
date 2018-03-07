<?php
    require_once('../config/mysql_connect.php');
    
    $drop = "DROP TABLE `list`";
    $drop_result = mysqli_query($conn, $drop);

    $create = "CREATE TABLE `list` (
      `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
      `firstName` varchar(25) NOT NULL,
      `lastName` varchar(25) NOT NULL,
      `email` varchar(100) NOT NULL,
      `phone` varchar(20) NOT NULL
        )";

    $create_result = mysqli_query($conn, $create);

    if (!empty($create_result)) {
        echo "Table list created successfully";
    } else {
        echo "Error creating table: ";
    }

    $query = "INSERT INTO `list` (`id`, firstName`, `lastName`, `email`, `phone`) VALUES
    ('1', 'John', 'Wayne', 'test@gmail.com', '(243) 234-3920'),
    ('2', 'Britney', 'Spears', 'winwin@gmail.com', '(583) 098-0980'),
    ('3', 'Justine', 'Chen', 'moocow@hotmail.com', '(342) 083-2094'),
    ('4', 'William', 'Wong', 'haha@mail.com', '(329) 484-0930'),
    ('5', 'Angela', 'Smith', 'harhar@hotmail.com', '(230) 498-9800'),
    ('6', 'Jeff', 'Greene', 'poor@gmail.com', '(932) 048-0880'),
    ('7', 'Harry', 'Allen', 'rightnow@aol.com', '(043) 298-0943'),
    ('8', 'Whitney', 'Houston', 'singer@gmail.com', '(543) 438-0309');";

    $query_result = mysqli_query($conn, $query);
    print($query_result);

    mysqli_close($conn);
?>