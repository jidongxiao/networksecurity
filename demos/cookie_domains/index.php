<?php

if (isset($_GET['set'])) {
    setcookie("mycookie", "hello123", [
        "expires" => time() + 3600,
        "path" => "/",
        "domain" => "example.test"
    ]);

    echo "Cookie has been set.";
    exit;
}

echo "<h2>Current Host: " . $_SERVER['HTTP_HOST'] . "</h2>";

echo "<h3>Cookies received:</h3>";

echo "<pre>";
print_r($_COOKIE);
echo "</pre>";

?>

<a href="?set=1">Set Cookie</a>
