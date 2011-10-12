<?php

readfile('http://www3.septa.org/hackathon/NextToArrive/'. rawurlencode($_REQUEST["start_station"]) .'/'. rawurlencode($_REQUEST["end_station"]) .'/' . $_REQUEST["count"]);

/*
// initialize and configure cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://www3.septa.org/hackathon/NextToArrive/30th%20Street%20Station/Paoli/2');
//curl_setopt($ch, CURLOPT_REFERER, 'http://www3.septa.org/transitview/'.$_REQUEST['route']);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// execute request
$response = curl_exec($ch);
curl_close($ch);


// print JSON data
header('Content-Type: application/json');
print $response;

//http://www3.septa.org/hackathon/NextToArrive/30th%20Street%20Station/Paoli/2

*/