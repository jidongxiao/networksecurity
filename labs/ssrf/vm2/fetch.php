<?php
// Intentionally vulnerable to SSRF.
// For use in an isolated security lab only.

$url = $_GET['url'] ?? '';

if (empty($url)) {
    die("Usage: fetch.php?url=http://example.com");
}

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    die("Request failed: " . curl_error($ch));
}

curl_close($ch);

header("Content-Type: text/plain");
echo $response;
?>
