// Create map in Image Map field based on variables passed by backend CMB2_img_map class
var myMap = {
    // Create map in the field's container
    map: L.map( cmb2ImgMap.container )
        .setView( [ cmb2ImgMap.lat, cmb2ImgMap.lng ], cmb2ImgMap.zoom ),

    // Add baselayer using basemap and options set up in field definition
    baselayer: L.tileLayer( cmb2ImgMap.basemap, cmb2ImgMap.layerOpts ),

    // Initialize marker
    marker: L.marker(),

    // Add available layers to map
    showLayers: function() {
        // Add baselayer if it loaded properly
        if ( this.baselayer ) this.baselayer.addTo( this.map );

        // Determine potential coordinates of the marker
        coordinates = L.latLng(
            document.getElementById( cmb2ImgMap.latInput ).value,
            document.getElementById( cmb2ImgMap.lngInput ).value   
        )

        // If coordinates are set update marker and whow it on the map
        if ( coordinates.lat || coordinates ) {
            this.marker.setLatLng( coordinates ).addTo( this.map );
        }

        // Update marker when map is clicked
        this.map.on( 'click', this.setMarker.bind( this ) );
    },

    // Update marker coordinates and the image map field's lat and lng hidden inputs
    setMarker: function( e ) {
        this.marker.setLatLng( e.latlng )
            .addTo( this.map );

        document.getElementById( cmb2ImgMap.latInput ).value = e.latlng.lat;
        document.getElementById( cmb2ImgMap.lngInput ).value = e.latlng.lng;
    },
};

myMap.showLayers();
