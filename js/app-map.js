// global variables cleanup

if (typeof width == "undefined"){
    var width = 1200;
}
if (typeof height == "undefined"){
    var height = 800;
}
if (typeof margin == "undefined"){
    var margin = 5;
}
if (typeof pad == "undefined"){
    var pad = 6; //not used for now
}
if (typeof div_outer_map == "undefined"){
    var div_outer_map = d3.select("#hub-carto-outer");
}

if (typeof environment == "undefined"){
    var environment = "prod";
}

if (typeof data_addr == "undefined"){
    var data_addr= "https://carto-hub-creatif.cetic.be/map-data.json";//default: CETIC backend
}

if (typeof show_timestamp == "undefined"){
    var show_timestamp = true;
}

// objects initialization and functions declaration

var d3_map = div_outer_map
    .append("div")
    .attr("id", "hub-carto-map")
    .style("width", width + 'px')
    .style('height', height + 'px');

var map = L.map('hub-carto-map').setView([50.4741027,4.4801437], 9);
L.tileLayer("https://tile.openstreetmap.be/osmbe-fr/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, Tiles courtesy of <a href=\"https://geo6.be/\">GEO-6</a>",
  maxZoom: 18,
}).addTo(map);

var markers = L.markerClusterGroup();

function onEachFeature(feature, layer) {
    var popupContent = build_popup(feature.properties, width, height)

    layer.bindPopup(popupContent, {minWidth : Math.min(width/2, 300), maxWidth : Math.max(width/2, 600)});
}


// retrieve json data from CETIC backend.
//
// address for retrieving map data json from CETIC backend is https://carto-hub-creatif.cetic.be/map-data.json
// you need to pass some parameters to select which data you want.
// here is a list of possible parameters:
//  - You need to add at least one of these parameters (you can add more than one)
//     - hub_creatif=on --> show elements related to hub_creatif
//     - living_lab=on --> show elements related to living_lab
//     - fab_lab=on --> show elements related to fab_lab
//     - espace_coworking=on --> show elements related to fab_lab
//     - creative_wallonia=on --> show elements related to fab_lab
//  - By default, only elements validated by digital wallonia will be included.
//    If you want to include also elements NOT validated by digital wallonia, you can add this parameter
//     - not_only_digital_wallonia=on

var params="";

if ((typeof request_hub_creatif !== "undefined") && (request_hub_creatif)) {
    params = params + "hub_creatif=on&";
}
if ((typeof request_living_lab !== "undefined") && (request_living_lab)) {
    params = params + "living_lab=on&";
}
if ((typeof request_fab_lab !== "undefined") && (request_fab_lab)) {
    params = params + "fab_lab=on&";
}
if ((typeof request_espace_coworking !== "undefined") && (request_espace_coworking)) {
    params = params + "espace_coworking=on&";
}
if ((typeof request_creative_wallonia !== "undefined") && (request_creative_wallonia)) {
    params = params + "creative_wallonia=on&";
}

if ((typeof filter_not_only_digital_wallonia === "boolean") && (filter_not_only_digital_wallonia)) {
    params = params + "not_only_digital_wallonia=on&";
}

if (params.length > 1){
    data_addr = data_addr + "?" + params;
    data_addr = data_addr.substring(0, data_addr.length - 1);
}

d3.json(data_addr).then(function (collection) {
    div_outer_map.selectAll("#waiting_div").remove()

    if (show_timestamp){
        var date = new Date(collection.properties.date);
        var date_text = "Horodatage des données: " + date.toLocaleString();
        if (environment === "prod"){
            date_text +=  " (Durée du cache: 24 heures)";
        }else if (environment === "dev"){
            date_text +=  " (Pas de cache)";
        }
        div_outer_map.insert("div") // div_outer_map.insert("div",":first-child")
            .attr("class", "hub-carto-date-div")
            .text(function(d){
                return date_text;
            });
    }

    var geoJsonLayer = L.geoJSON(collection, {

		onEachFeature: onEachFeature,

        pointToLayer: function (feature, latlng) {
            var icon = pointerIcon;
            if(feature.properties.type === "hub-creatif"){
                icon = hubCreatifIcon;
            }else if(feature.properties.type === "living-lab"){
                icon = livingLabIcon;
            }else if(feature.properties.type === "fab-lab"){
                icon = fabLabIcon;
            }else if(feature.properties.type === "espace-coworking"){
                icon = coworkingIcon;
            }else if(feature.properties.type === "creative-wallonia"){
                icon = creativeWalloniaIcon;
            }

			return L.marker(latlng, {icon: icon});
		},

		/*pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: "#ff7800",
				color: "#000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}*/
	});

    markers.addLayer(geoJsonLayer);
    map.addLayer(markers);
    map.fitBounds(markers.getBounds());
});
