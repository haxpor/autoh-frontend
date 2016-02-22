<!DOCTYPE html>
<?php
// make a request to apps script immediately
$URL = "https://script.googleusercontent.com/macros/echo?user_content_key=2EPeQs2ALuTh1DiatN8jQC1AVXb6wbjJj2yzUqxT2lAHWBoiq6m2Dltcp6X_03k-Fp3zLAiBF3JA0bvcElFESfW8Xm6QJqSaOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa1GhPSVukpSQTydEwAEXFXgt_wltjJcH3XHUaaPC1fv5o9XyvOto09QuWI89K6KjOu0SP2F-BdwUi8BrYajeRCIvM4f8D08gXKdc3uhFQTNYuqjhROwSQLTW_MOCXR66UFMbz98LFn415y7FLqOV0Tn7KV_zKQeAAA&lib=MnrE7b2I2PjfH799VodkCPiQjIVyBAxva";
$rawJson = file_get_contents($URL);
?>

<html>
<head>
	<title>Autoh - Track work-hours</title>
	<link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="graph-section" id="div-graph-section">
	<svg id="svgroot" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg">
	</svg>
	<div class="annotate-section" id="div-annotate-section">
	</div>
</div>

<script src="js/config.js" type="text/javascript"></script>
<script src="js/script.js" type="text/javascript"></script>
<script>
	var jsonObj = <?php print json_encode($rawJson); ?>;
	onLoadJSONResource(jsonObj);
</script>
</body>
</html>