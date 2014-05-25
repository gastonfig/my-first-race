$(document).ready(function() {

var map = L.map('map').setView([45.52,-122.67762], 14);

L.tileLayer('http://a.tiles.mapbox.com/v3/gastonfig.hjp9813o/{z}/{x}/{y}.png').addTo(map);


// L.tileLayer('http://{s}.tile.cloudmade.com/87f4de8517d74a4e85175a039f032417/125258/256/{z}/{x}/{y}.png', {
// 	attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2012 CloudMade',
// 	key: '87f4de8517d74a4e85175a039f032417'
// }).addTo(map);


// Options
map.scrollWheelZoom.disable();

var multiLineStyle = {
    "color": "#fff",
    "weight": 4,
    "opacity": .9,
    "dashArray": 7,
    "lineCap": "square"
};

L.geoJson(geojsonFeatures,{
    style: multiLineStyle
}).addTo(map);

/**
 * Map tooltips
 * 
 */


// Custom marker
var mapMarker = L.Icon.extend( {
    options: {
        iconUrl: '',
        iconSize: new L.Point(24, 24),
        iconAnchor: new L.Point(14, 14),
        popupAnchor: new L.Point(0, -28)
    },

    createIcon: function () {
        var div = document.createElement('div');
        var img = this._createImg(this.options['iconUrl']);
        var numdiv = document.createElement('div');
        numdiv.setAttribute ( "class", "number" );
        numdiv.innerHTML = this.options['number'] || '';
        div.appendChild ( numdiv );
        this._setIconStyles(div, 'icon');
        return div;
    }
});


$.getJSON("js/15k-songs.js", function(songs) {
    // Build a layer of the songs and set up a popup when the marker is clicked
    var geoJsonLayer = L.geoJson(songs, {
        onEachFeature: function(feature, layer) {
            // var popupHtml = '<div class="row" style="width: 200px;"><p><span>Time</span>1:20hs</p><p><span>Miles</span>6:23</p></div><img src="' + feature.properties.image + '" /><div class="music-info"><a href="' + feature.properties.trackURL + '" target="_blank">' + feature.properties.trackName + '</a><br />' + feature.properties.trackArtist + '<br />';
            // if(feature.properties.spotifyURL) {
            //     popupHtml += '<a href="' + feature.properties.spotifyURL + '" target="_blank">Play on Spotify</a>';
            // }
            var popupHtml = '<img src="' + feature.properties.image + '" /><div class="music-info"><a class="song-name" href="' + feature.properties.trackURL + '" target="_blank">' + feature.properties.trackName + '</a><span class="artist-name">' + feature.properties.trackArtist + '</span>';
            if(feature.properties.spotifyURL) {
                popupHtml += '<a class="spotify-url" href="' + feature.properties.spotifyURL + '" target="_blank">Play on Spotify</a>';
            }
            popupHtml += '</div>';
            layer.bindPopup(popupHtml);
        },

        pointToLayer: function (feature, latlng) {
            // return L.marker(latlng, {icon: new mapMarker({number: feature.properties.trackNumber})});
            var marker = L.marker(latlng, {icon: new mapMarker({number: feature.properties.trackNumber})});
            mapMarker[feature.id] = marker;
            return marker;
        }
    });

    geoJsonLayer.addTo(map);
    // map.fitBounds(geoJsonLayer.getBounds());


});

map.on('popupopen', function(e) {
  var marker = e.popup._source._icon;
  $(marker).addClass('active');
});

map.on('popupclose', function(e) {
  var marker = e.popup._source._icon;
  $(marker).removeClass('active');
});

$('.leaflet-marker-pane').click(function() {
    console.log('clicked');
    $('.leaflet-marker-icon').removeClass('active');
    $(this).toggleClass('active');
});




/**
 * Tooltips using jUQuery QTip plugin
 * 
 */

$('.activity').qtip({
    content: {
        text: function(event, api) {
            return $(this).attr('qtip-content') + '<span>mi</span>';
        },
        title: function(event, api) {
            return $(this).attr('qtip-title');
        }
    },
    position: {
    	my: 'bottom center',
    	at: 'top center',
    	adjust: {
    		y: +5
    	}
    },
    style: {
        tip: {
            corner: 'bottom center',
            width: 14
        }
    },
    show: {
        solo: true,
    	delay: 0,
    	effect: function() {
    		$(this).show();
    		$(this).animate({
    			top: '-=5px',
    			opacity: '1'
    		}, 150);
    	}
    },
    hide: {
    	effect: function() {
    		$(this).show();
    		$(this).animate({
    			top: '+=10px',
    			opacity: '0'
    		}, 100);
    	}
    }
});

// Show the first tooltip on load and hide when others are hovered
$('.first').qtip('show');

/**
 * Pie Chart Using D3.js
 *
 * Inspired by http://bl.ocks.org/dbuezas/9306799
 */

var svg = d3.select("#pie-chart")
    .append("svg")
    .attr("viewBox", "0 0 800 500")
    .append("g")

svg.append("g")
    .attr("class", "slices");
svg.append("g")
    .attr("class", "labels");
svg.append("g")
    .attr("class", "lines");

var width = 750,
    height = 450,
    radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2.2 + "," + height / 1.8 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
    .domain(["Lorem ipsum", "dolor sit"])
    .range(['#e9eaeb', '#f3b845']);


var dataSet = [
        {label:"Planned" + "<br />" + " 27 Days", value: 0.667},
        {label:"Actual" + "<br /> " + " 9 Days", value: 0.334}
    ];

    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(dataSet), key);

    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
        .attr("class", "slice");

    slice       
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })

    slice.exit()
        .remove();

    /* ------- TEXT LABELS -------*/

    var text = svg.select(".labels").selectAll("text")
        .data(pie(dataSet), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .html(function(d) {
            return d.data.label;
        });
    
    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });

    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(dataSet), key);
    
    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };          
        });
    
    polyline.exit()
        .remove();

});