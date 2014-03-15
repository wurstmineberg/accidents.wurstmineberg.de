var latestTimestamp = null;

// Save the DOM elements for faster access
var daysValue = $('#days-value');
var plural = $('#plural');

$("abbr").tooltip();

getData();
setInterval(getData, 60000);

function dateObjectFromUTC(s) { // from http://stackoverflow.com/a/15518848/667338
    s = s.split(/\D/);
      return new Date(Date.UTC(+s[0], --s[1], +s[2], +s[3], +s[4], +s[5], 0));
}

function padNumber(num, size) {
    var s = num + '';
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}

function getData() {
    var apiURL = 'http://api.wurstmineberg.de/server/deaths/latest.json';
    $.ajax(apiURL, {
        dataType: 'json',
        error: function(request, status, error) {
            daysValue.html('??');
            daysValue.attr('data-original-title', 'Could not load API');
            plural.html('s');
        },
        success: function(data) {
            if ('lastPerson' in data) {
                var lastPerson = data['lastPerson'];
                if ('deaths' in data && lastPerson in data['deaths'] && 'timestamp' in data['deaths'][lastPerson]) {
                    latestTimestamp = dateObjectFromUTC(data['deaths'][lastPerson]['timestamp']);
                }
            }
            if (latestTimestamp == null) {
                daysValue.html('??');
                daysValue.attr('data-original-title', 'I have no idea. Seriously. Something is broken');
                plural.html('s');
            } else {
                var days = Math.floor((new Date() - latestTimestamp) / 86400000);
                daysValue.html(padNumber(days, 2));
                daysValue.attr('data-original-title', 'These are real life days.');
                if (days == 1) {
                    plural.html('');
                } else {
                    plural.html('s');
                }
            }
        }
    });
}
