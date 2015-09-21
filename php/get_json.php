<?php
    if (isset($_POST['q'])) { $query = $_POST['q']; }
    
    $query = str_replace(" ", "%20", $query);
    $ch = curl_init("https://ecfs.link/search.json?q=".htmlspecialchars($query));

    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER , true);

    $json_data = curl_exec($ch);
    echo $json_data;
    curl_close($ch);
?>
