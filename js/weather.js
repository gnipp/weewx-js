$(document).ready(function() {
	reloadPage();
});

$(window).bind( 'hashchange', function(e) { 
	reloadPage();
});


function reloadPage() {
	var hash = window.location.hash;
	if (hash == "") {
		hash = "#current";
	}
	var url = "data/daily.json";
	if (hash == "#current") {
		url = "data/daily.json";
	} else if (hash == "#week") {
		url = "data/week.json";
	} else if (hash == "#month") {
		url = "data/month.json";
	} else if (hash == "#year") {
		url = "data/year.json";
	}

	jQuery.get(url, function(data) {
		$("#headline").html(data.title + "- Stand: " + data.time);
		fillPlotDiv(data,hash);
		fillStatDiv(data,hash);
		fillInfoDiv(data,hash);
	});
}

function fillStatDiv(data,hash) {
	var res = "";
	if (hash == "#current") {
		res += getCurrent(data.stats.current);
		res += getSummary(data.stats,"day");
	} else if (hash == "#week") {
		res += getSummary(data.stats,"week");
		res += getSummary(data.stats,"month");
	} else if (hash == "#month") {
		res += getSummary(data.stats,"month");
		res += getSummary(data.stats,"year");
	} else if (hash == "#year") {
		res += getSummary(data.stats,"year");
	}
	$("#current_values").html(res);
}

function fillInfoDiv(data,hash) {
	var res = "";
	if (hash == "#current") {
		res += getStationInfo(data);
		res += getAlmanach(data.almanach);
	}
	$("#almanach").html(res);
}

function fillPlotDiv(data,range) {
	var prefix = "day";
	if (range == "#current") {
		prefix = "day";
	} else if (range == "#week") {
		prefix = "week";
	} else if (range == "#month") {
		prefix = "month";
	} else if (range == "#year") {
		prefix = "year";
	}
	
	var res ="";

	res += "<img class=\"plot\" src=\"data/"+prefix + "barometer.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "tempdew.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "temp.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "radiation.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "humidity.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "rain.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "winddir.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "wind.png\"/>";
	res += "<img class=\"plot\" src=\"data/"+prefix + "windvec.png\"/>";
	var gauges = "";
	if (range == "#current") {
			var gauges	= "<svg id=\"barometer\" style=\"width:201px; height:202px;\"></svg>";
			gauges		 += "<svg id=\"temp\" style=\"width:201px; height:202px;\"></svg>";
			gauges		 += "<svg id=\"humidity\" style=\"width:201px; height:202px;\"></svg>";
			res = gauges + res;
			var pressure = data.stats.current.barometer.replace(",",".").replace(" hPa","");
			var temp = data.stats.current.outTemp.replace(",",".");
			var humidity = data.stats.current.humidity.replace("%","");
	}
	$("#plots").html(res);
	if (gauges != "") {

		var b = new wg.Gauge("#barometer",200,200,960,1060, "hPa", pressure);
		var t = new wg.Gauge("#temp",200,200,-40,40, "°C", temp);
		var h = new wg.Gauge("#humidity",200,200,0,100, "% rel.", humidity);
	}
}

function getStationInfo(data) {
	var res = "";
	res += "<table class=\"table table-condensed table-striped\">";
	res += "<caption>Station info</caption>";
	res += "<tr><th class=\"col-md-6\">Location</th><td>"+data.location+"</td></tr>";
	res += "<tr><th>Latitude</th><td>"+data.lat+"</td></tr>";
	res += "<tr><th>Longitude</th><td>"+data.lon+"</td></tr>";
	res += "<tr><th>Altitude</th><td>"+data.alt+"</td></tr>";
	res += "<tr><th>Weewx-uptime</th><td>"+data.uptime+"</td></tr>";
	res += "<tr><th>Server-uptime</th><td>"+data.serverUptime+"</td></tr>";
	res += "<tr><th>Weewx-version</th><td>"+data.weewxVersion+"</td></tr>";
	res += "</table>";
	return res;
}

function getAlmanach(data) {
	var res = "";
	res += "<table class=\"table table-condensed table-striped\">";
	res += "<caption>Sun</caption>";
	res += "<tr><th class=\"col-md-6\">Start civil twilight</th><td>"+data.sun.startCivilTwilight+"</td></tr>";
	res += "<tr><th>Sunrise</th><td>"+data.sun.sunrise+"</td></tr>";
	res += "<tr><th>Transit</th><td>"+data.sun.transit+"</td></tr>";
	res += "<tr><th>Sunset</th><td>"+data.sun.sunset+"</td></tr>";
	res += "<tr><th>End civil twilight</th><td>"+data.sun.endCivilTwilight+"</td></tr>";
	res += "</table>";
	res += "<table class=\"table table-condensed table-striped\">";
	res += "<caption>Moon</caption>";
	res += "<tr><th>Moonrise</th><td>"+data.moon.rise+"</td></tr>";
	res += "<tr><th>Transit</th><td>"+data.moon.transit+"</td></tr>";
	res += "<tr><th>Moonset</th><td>"+data.moon.set+"</td></tr>";
	res += "<tr><th>Full moon</th><td>"+data.moon.fullMoon+"</td></tr>";
	res += "<tr><th>New moon</th><td>"+data.moon.newMoon+"</td></tr>";
	res += "<tr><th>Phase</th><td>"+data.moon.phase+" ("+data.moon.fullness+")</td></tr>";
	res += "</table>";
	return res;
}

function getSummary(statdata,range) {
	var key = "sinceMidnight";
	var headline = "Seit Mitternacht";
	if (range == "week") {
		key = "thisWeek";
		headline = "Diese Woche";
	} else if (range == "month") {
		key = "thisMonth";
		headline = "Dieser Monat";
	} else if (range == "year") {
		key = "thisYear";
		headline = "Dieses Jahr";
	}
	var data = statdata[key];
	var res = "";
	res += "<table class=\"table table-condensed table-striped\">";
	res += "<caption>"+headline+"</caption>";
	res += "<tr><th style=\"width:40%\">High Temperature<br/>Low Temperature</th><td>"+data.tempMaxValue+" °C at "+data.tempMaxTime+"<br/>"+data.tempMinValue+" °C at "+data.tempMinTime+"</td></tr>";
	res += "<tr><th>High Humidity<br/>Low Humidity</th><td>"+data.humidityMaxValue+" at "+data.humidityMaxTime+"<br/>"+data.humidityMinValue+" at "+data.humidityMinTime+"</td></tr>";
	res += "<tr><th>High Barometer<br/>Low Barometer</th><td>"+data.barometerMaxValue+" at "+data.barometerMaxTime+"<br/>"+data.barometerMinValue+" at "+data.barometerMinTime+"</td></tr>";
	res += "<tr><th>Today's Rain</th><td>"+data.rainSum+"</td></tr>";
	res += "<tr><th>Max Rain Rate</th><td>"+data.rainRateMaxValue+" at "+data.rainRateMaxTime+"</td></tr>";
	res += "<tr><th>High Wind</th><td>"+data.windMaxValue + " (" + getBeaufort(data.windMaxValue) + " Bft) at " + data.rainRateMaxTime + "</td></tr>";
	res += "</table>";
	return res;
}

function getBeaufort(kmhtext) {
	var kmh = kmhtext.split(" ")[0];
	if (kmh <= 1) return 0;
	if (kmh <= 5) return 1;
	if (kmh <= 11) return 2;
	if (kmh <= 19) return 3;
	if (kmh <= 28) return 4;
	if (kmh <= 38) return 5;
	if (kmh <= 49) return 6;
	if (kmh <= 61) return 7;
	if (kmh <= 74) return 8;
	if (kmh <= 88) return 9;
	if (kmh <= 102) return 10;
	if (kmh <= 117) return 11;
	if (kmh > 117) return 12;
}

function getCurrent(data) {
	var res = "<table class=\"table table-condensed table-striped\">";
	res+="<caption>Aktuelle Werte</caption>";
	res += "<tr><th class=\"col-md-6\">Outside Temperature</th><td>" + data.outTemp + " °C</td></tr>";
	res += "<tr><th>Outside Humidity</th><td>"+data.humidity+"</td></tr>";
	res += "<tr><th>Barometer</th><td>"+data.barometer+"</td></tr>";
	res += "<tr><th>Barometer Trend ("+data.barometerTrendDelta+")</th><td>"+data.barometerTrendData+"</td></tr>";
	res += "<tr><th>Wind</th><td>"+data.windDirText + " " + data.windSpeed + " (" + getBeaufort(data.windSpeed) + " Bft)</td></tr>";
	res += "<tr><th>Rain Rate</th><td>"+data.rainRate+"</td></tr>";
	res += "<tr><th>Solar Radiation</th><td>"+data.solarRadiation+"</td></tr>";
	res += "</table>";
	return res;
}

