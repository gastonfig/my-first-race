$(document).ready(function() {

/* FITTEXT
----------------------------------------------- */
$('header h1').fitText(2.1, { minFontSize: '51px', maxFontSize: '87px' });

//
Modernizr.addTest("viewportunits", function() { 
    var viewportBool;
    
    Modernizr.testStyles("#modernizr { width: 50vw; }", function(elem, rule) {   
        var width = parseInt(window.innerWidth/2,10),
            compStyle = parseInt((window.getComputedStyle ?
                      getComputedStyle(elem, null) :
                      elem.currentStyle)["width"],10);
        
        viewportBool= !!(compStyle == width);
    });
    
    return viewportBool;
});

if (Modernizr.viewportunits === false) {
    var winHeight = $(window).height();
    $('header').css('height', winHeight);
}


/* MAP
----------------------------------------------- */

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



/* Tooltips using jUQuery QTip plugin
 ----------------------------------------------- */
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

/* Pie Chart Using D3.js
----------------------------------------------- */

    var data = [
        {"value": 66.7, "label": "Planned", "sublabel": 27},
        {"value": 33.4, "label": "Actual", "sublabel": 9}
    ];

    var width = 410,
        height = 410,
        radius = Math.min(width, height) / 2,
        innerRadius = radius - 142,
        outerRadius = radius - 100,
        labelRadius = radius - 70,
        textColor = '#292826',
        lineColor = '#8b8b8b';

    var color = d3.scale.ordinal()
        .range(['#F3B845', '#E9EAEB']);

    // var svg = d3.select("#pie-chart")
    //     .append("svg")
    //     .attr("viewBox", "0 0 800 500")
    //     .append("g")

    var canvas = d3.select('#pie-chart')
        .append('svg')
        .attr("viewBox", "60 60 300 300")
        .attr('fill', 'red')
        // .attr('width', width)
        // .attr('height', height);

    var group = canvas.append('g')
        .attr('transform', 'translate('+ radius + ',' + radius + ')')

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var pie = d3.layout.pie()
        .value(function(d) { return d.value; });

    var pieData = pie(data);

    var arcs = group.selectAll('.arc')
        .data(pieData)
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', function(d){ return color(d.value); });

    // Outer Labels
    var textLoc;
    arcs.append('text')
        .attr("transform", function(d) {
            // http://stackoverflow.com/questions/8053424/label-outside-arc-pie-chart-d3-js
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],                    
                hypotenuse = Math.sqrt(x*x + y*y); // Get hypotenuse
                return "translate(" + (x/hypotenuse * labelRadius) + "," + (y/hypotenuse * labelRadius) + ")";
        })       
        .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ?
            "end" : "start";
        })
        .attr('font-size', '.7em')
        .attr('fill', textColor)
        .text(function(d,i) { return data[i].label })


    // Line
    var line = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    arcs.append('polyline')
        .attr('points', 
            function(d) {
                var c = arc.centroid(d);
                res = [c[0], c[1], c[0] * 1.54, c[1] * ((d.endAngle + d.startAngle)/2 > Math.PI ? 1.65 : 1.48)];
                return res;
        })
        .attr('fill', 'none')
        .attr('stroke', lineColor)
        .attr('opacity', .8)
        .attr('stroke-width', .5);

    // Dots
    arcs.append('circle')
        .attr('r', 1.5)
        .attr('fill', lineColor)
        .attr("cx", function(d) { return arc.centroid(d)[0]; })       
        .attr("cy", function(d) { return arc.centroid(d)[1]; });
});