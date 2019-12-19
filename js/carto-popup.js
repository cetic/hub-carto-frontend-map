/**
 * Created by js on 24-07-19.
 */

function build_popup(properties, width, height) {
    var txt_size = "large";
    if(height < 400){txt_size = "small";}
    else if(height < 600){txt_size = "medium";}
    var popup_max_width = Math.min(width/2, 600);
    var popup_max_height = Math.min(width/2, height/2, 600);

    var popup= "<table style='max-width: " + popup_max_width +"px; max-height: " + popup_max_height +"px; min-width: " + popup_max_width +"px; font-size: " + txt_size + ";'><tr><td>";

    var name = "";

    if (typeof properties.long_name != "undefined"){
        name = properties.long_name;
    }else if (typeof properties.name != "undefined"){
        name = properties.name;
    }

    var first_content = '<h4>' + name + '</h4>';
    var img_max_width = popup_max_width/2;
    var img_max_height = popup_max_height/2;
    if (typeof properties.logo != "undefined"){
        first_content += "<br/><img src='" + properties.logo + "' style='max-width: " + img_max_width +"px; max-height: " + img_max_height +"px;'/>";
    }

    if (typeof properties.slug != "undefined"){
        popup += "<p><a href='https://www.digitalwallonia.be/fr/annuaire/"+properties.slug+"' target='_blank'>" + first_content + "</a></p>";
    }else{
        popup += "<p>" + first_content + "</p>";
    }

    popup += "</td><td>";


    if (typeof properties.nature != "undefined") {
        var nature_content = "<h4>Nature et type:</h4><ul>";
        properties.nature.forEach(function (element) {
            nature_content += "<li>" + element + "</li>"
        });
        nature_content += "</ul>"
        popup += "<p>" + nature_content + "</p>";
    }

    if (typeof properties.address != "undefined"){
        var address_content = "<h4>Adresse: </h4>";

        if (typeof properties.address.thoroughfare != "undefined" && properties.address.thoroughfare != null){
            address_content += properties.address.thoroughfare;
        }

        if (typeof properties.address.number != "undefined"&& properties.address.number != null){
            address_content += ", " +properties.address.number;
        }

        if (typeof properties.address.box != "undefined"&& properties.address.box != null){
            address_content += "/" +properties.address.box;
        }

        address_content += "<br/>";

        if (typeof properties.address.postalCode != "undefined"&& properties.address.postalCode != null){
            address_content += properties.address.postalCode;
        }

        if (typeof properties.address.locality != "undefined"&& properties.address.locality != null){
            address_content += " " + properties.address.locality;
        }

        if (typeof properties.address.countryCode != "undefined"&& properties.address.countryCode != null){
            address_content += ", " + properties.address.countryCode;
        }

        address_content += "<p/>";

        popup += "<p>" + address_content + "</p>";
    }

    popup += "</td></tr></table>";

    return popup
}
