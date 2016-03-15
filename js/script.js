/*
	Callback function when JSON resoure is loaded.
	This function receives raw json text as input.
*/
function onLoadJSONResource(rawJsonText)
{
	// parse raw json text
	var jsonObj = JSON.parse(rawJsonText);

	clearSVGSpace();
	drawLines(jsonObj);
	drawAnnotation(jsonObj);

	// when window resizes then we redraw all lines
	window.onresize = function(event) {
		clearSVGSpace();
		drawLines(jsonObj);
		drawAnnotation(jsonObj);
	};
}

/*
	Draw all lines for all projects.
	Input
		jsonObj - input parsed json object
*/
function drawLines(jsonObj)
{
	// show summary for each summary except empty, or 'unknown' project
	if (jsonObj.Summary.length > 0)
	{
		var columnCount = Object.keys(jsonObj.Summary[0]).length;
		// consider only project name
		// cut out 'Date', 'Total' in column name
		for (var i=2; i<columnCount; i++)
		{
			var columnNames = Object.keys(jsonObj.Summary[0]);

			// add polyline
			addPolyline(columnNames[i], getStyleText(jsonConfig.linestyles[i-2]), jsonObj);
		}
	}
}

/*
	Draw all annotation for all projects.
	Input
		jsonObj - input parsed json object
*/
function drawAnnotation(jsonObj)
{
	if (jsonObj.Summary.length > 0)
	{
		var columnCount = Object.keys(jsonObj.Summary[0]).length;

		// consider only project name
		// cut out 'Date', 'Total' in column name
		for (var i=2; i<columnCount; i++)
		{
			var columnNames = Object.keys(jsonObj.Summary[0]);

			// add annotation
			addAnnotation(columnNames[i], getStyleText(jsonConfig.linestyles[i-2]));
		}
	}
}

/*
	Form style text from style config json object.
*/
function getStyleText(linestyleConfig)
{
	var style = "fill:" + linestyleConfig.fill + ";" + 
			"stroke:" + linestyleConfig.stroke + ";" +
			"stroke-width:" + linestyleConfig.stroke_width + ";" +
			"stroke-linecap:" + linestyleConfig.stroke_linecap + ";";
	if (linestyleConfig.stroke_dasharray != null)
	{
		style += "stroke-dasharray:" + linestyleConfig.stroke_dasharray + ";";
	}

	return style;
}

/*
	Add polyline to svg element.
*/
function addPolyline(projectKey, styleText, jsonObj)
{
	var currentDate = new Date();

	// get element by id='svgroot'
	var svg = document.getElementById("svgroot");
	var SCALE_FACTOR_X = 2;
	var SCALE_FACTOR_Y = 10;

	// loop for input project-key
	var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	var points_string = "";

	// calculate the number of days to plot graph
	var numDays = 0;	// this is granularity of zoomness for the graph
	for (var i=0; i<jsonObj.Summary.length-1; i++)
	{
		var date = new Date(jsonObj.Summary[i].Date);
		if (date.getMonth() < currentDate.getMonth() &&
			date.getFullYear() <= currentDate.getFullYear())
		{
			numDays++;
		}
		else if (date.getMonth() == currentDate.getMonth() &&
			date.getDate() <= currentDate.getDate() &&
			date.getFullYear() <= currentDate.getFullYear())
		{
			numDays++;	
		}
		else
		{
			break;
		}
	}

	if (numDays < 15)
		numDays = 15;

	var divElement = document.getElementById("div-graph-section");
	var mapToMin = divElement.offsetLeft;
	var mapToMax = divElement.offsetWidth + mapToMin;

	// not take into account the final 'Total' row whose 'Date' column is 'Total' in text
	for (var i=0; i<numDays; i++)
	{
		var date = new Date(jsonObj.Summary[i].Date);
			
		var x = mapToRange(i, mapToMax, mapToMin, numDays, 0);
		var y = (150 - jsonObj.Summary[i][projectKey]*SCALE_FACTOR_Y);
		
		points_string += x + "," + y + " ";
	}

	polyline.setAttribute("points", points_string);
	polyline.setAttribute("style", styleText);
	svg.appendChild(polyline);
}

/*
	Add annotation for project with style.
	Input
		projectKey - Project name
		lineStyleText - line css style text
*/
function addAnnotation(projectKey, lineStyleText)
{
	// create a span tag
	var span = document.createElement("span");
	span.setAttribute("class", "span-annotate");

	// create svg tag
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	// create line tag
	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	line.setAttribute("x1", "0");
	line.setAttribute("y1", "0");
	line.setAttribute("x2", "40");
	line.setAttribute("y2", "0");
	line.setAttribute("style", lineStyleText);
	svg.appendChild(line);

	// add svg to span
	span.appendChild(svg);

	// create a text node
	var text = document.createTextNode(projectKey);
	span.appendChild(text);

	// add span to div
	var div = document.getElementById("div-annotate-section");
	div.appendChild(span);
}

/*
	Clear svg space.
*/
function clearSVGSpace()
{
	// remove all children from svg
	var svg = document.getElementById("svgroot");
	removeAllChildrenFrom(svg);

	// remove all children from div
	var divAnnotate = document.getElementById("div-annotate-section");
	removeAllChildrenFrom(divAnnotate);
}

/*
	Remove all the child from input node.
*/
function removeAllChildrenFrom(node)
{
	if (node != null)
	{
		while (node.firstChild)
		{
			node.removeChild(node.firstChild);
		}
	}
}

/*
	Do a linear mapping from [fromMin, fromMax] to [min, max] with value.
	Return value in range of [min, max].
*/
function mapToRange(value, toMax, toMin, fromMax, fromMin)
{
	return (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + fromMin;
}