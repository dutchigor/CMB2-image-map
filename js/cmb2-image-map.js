// Create map in Image Map field based on variables passed by backend CMB2_img_map class
var myMap = {
    // Create map in the field's container
    // map: L.map( cmb2ImgMap.container )
    //     .setView( [ cmb2ImgMap.lat, cmb2ImgMap.lng ], cmb2ImgMap.zoom ),

    // Add baselayer using basemap and options set up in field definition
    // baseLayer: L.tileLayer( cmb2ImgMap.baseLayer, cmb2ImgMap.layerOpts ),

    // Add available layers to map
    showLayers: function() {
        if ( cmb2ImgMap.baseType === 'image' ) {
            minZoom = this.imgMinZoom()

            cmb2ImgMap.mapOpts.minZoom = cmb2ImgMap.mapOpts.minZoom || minZoom;
            cmb2ImgMap.mapOpts.crs = L.CRS.Simple
            this.map = L.map( cmb2ImgMap.container, cmb2ImgMap.mapOpts );

            var bounds = L.latLngBounds(
                [0,0],
                [cmb2ImgMap.baseLayer[2], cmb2ImgMap.baseLayer[1]]
            );
            this.map.setMaxBounds( bounds );
            this.baseLayer = L.imageOverlay( cmb2ImgMap.baseLayer[0], bounds );

            if ( cmb2ImgMap.zoom === '' ) {
                this.map.setView(
                    [ cmb2ImgMap.baseLayer[2] / 2, cmb2ImgMap.baseLayer[1] / 2 ],
                    minZoom
                );
            } else {
                this.map.setView( [ cmb2ImgMap.lat, cmb2ImgMap.lng ], cmb2ImgMap.zoom );
            }
        } else {
            this.map = L.map( cmb2ImgMap.container, cmb2ImgMap.mapOpts );

            this.baseLayer = L.tileLayer( cmb2ImgMap.baseLayer, cmb2ImgMap.layerOpts );

            this.map.setView( [ cmb2ImgMap.lat, cmb2ImgMap.lng ], cmb2ImgMap.zoom );
        }

        // Add baselayer if it loaded properly
        if ( this.baseLayer ) this.baseLayer.addTo( this.map );

        // Determine potential coordinates of the marker
        const coordinates = L.latLng(
            document.getElementById( cmb2ImgMap.latInput ).value,
            document.getElementById( cmb2ImgMap.lngInput ).value   
        )

        // Initialize marker
        this.marker = L.marker();
        
        // If coordinates are set update marker and whow it on the map
        if ( coordinates.lat || coordinates.lng ) {
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

    imgMinZoom: function() {
        const tileSize = Math.max( cmb2ImgMap.baseLayer[1], cmb2ImgMap.baseLayer[2] );

        const maxTiles = 400 / tileSize;

        return Math.floor(Math.log(maxTiles) / Math.log(2));

    }
};

myMap.showLayers();
