<?php
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        echo "connection";
    }
    $to = "blake.rogers757@gmail.com";
    $from = $_POST['name'];
    $headers = "Content-type: text/html;From: $from";

    $fields = array();
    $fields["name"] = $_POST['name'];
    $fields["email"] = $_POST['email'];
    $fields["message"] = $_POST['message'];

    $body = "Here is what was sent:\n\n";
    $body .= 'Name : '.$fields['name']. '<br>';
    $body .= 'Email : '.$fields['email']. '<br>';
    $body .= 'Message : '.$fields['message']. '<br>';

    $send = mail($to, $body, $headers);
    
?>