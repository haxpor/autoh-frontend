function beginLoadingJSONResource()
{
	// get json data from url
	var xmlhttp = new XMLHttpRequest();
	var url = 'https://script.googleusercontent.com/macros/echo?user_content_key=2EPeQs2ALuTh1DiatN8jQC1AVXb6wbjJj2yzUqxT2lAHWBoiq6m2Dltcp6X_03k-Fp3zLAiBF3JA0bvcElFESfW8Xm6QJqSaOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa1GhPSVukpSQTydEwAEXFXgt_wltjJcH3XHUaaPC1fv5o9XyvOto09QuWI89K6KjOu0SP2F-BdwUi8BrYajeRCIvM4f8D08gXKdc3uhFQTNYuqjhROwSQLTW_MOCXR66UFMbz98LFn415y7FLqOV0Tn7KV_zKQeAAA&lib=MnrE7b2I2PjfH799VodkCPiQjIVyBAxva';

	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        	onLoadJSONResource(xmlhttp.responseText);
    	}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

/*
	Callback function when JSON resoure is loaded.
	This function receives raw json text as input.
*/
function onLoadJSONResource(rawJsonText)
{
	// parse raw json text
	var jsonObj = JSON.parse(rawJsonText);

	var styles = new Array();
	styles[0] = "fill:none;stroke:black;stroke-width:2";
	styles[1] = "fill:none;stroke:red;stroke-width:2";
	styles[2] = "fill:none;stroke:#72dec2;stroke-width:2";
	styles[3] = "fill:none;stroke:#333333;stroke-width:2";
	styles[4] = "fill:none;stroke:#0000FF;stroke-width:2";

	// show summary for each summary except empty, or 'unknown' project
	if (jsonObj.Summary.length > 0)
	{
		var columnCount = Object.keys(jsonObj.Summary[0]).length;
		// consider only project name
		// cut out 'Date', 'Total', and '' in column name
		for (var i=2; i<columnCount-1; i++)
		{
			var columnNames = Object.keys(jsonObj.Summary[0]);
			alert(columnNames[i]);
			addPolyline(columnNames[i], styles[i-2], jsonObj);
		}
	}
}

/*
	Add polyline to svg element.
*/
function addPolyline(projectKey, styleText, jsonObj)
{
	var currentDate = new Date();

	// get element by id='svgroot'
	var svg = document.getElementById("svgroot");
	var SCALE_FACTOR_X = 10;
	var SCALE_FACTOR_Y = 10;

	// loop for input project-key
	var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	var points_string = "";
	for (var i=0; i<jsonObj.Summary.length; i++)
	{
		var date = new Date(jsonObj.Summary[i].Date);
		if (date.getMonth() <= currentDate.getMonth() &&
			date.getDate() <= 15 &&
			date.getFullYear() <= currentDate.getFullYear())
		{
			points_string += (i*SCALE_FACTOR_X) + "," + (150 - jsonObj.Summary[i][projectKey]*SCALE_FACTOR_Y) + " ";
		}
		else
		{
			break;
		}
	}

	polyline.setAttribute("points", points_string);
	polyline.setAttribute("style", styleText);
	svg.appendChild(polyline);
}