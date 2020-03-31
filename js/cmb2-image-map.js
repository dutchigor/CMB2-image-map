// Create map in Image Map field based on variables passed by backend CMB2_img_map class
var myMap = {
    showLayers: function() {
        if ( cmb2ImgMap.baseType === 'image' ) {
            // If the base layer should be an image
            // Add minimum zoom level and coordinate type set to the map options
            minZoom = this.imgMinZoom()
            cmb2ImgMap.mapOpts.minZoom = cmb2ImgMap.mapOpts.minZoom || minZoom;
            cmb2ImgMap.mapOpts.crs = L.CRS.Simple

            // Create and store the map
            this.map = L.map( cmb2ImgMap.container, cmb2ImgMap.mapOpts );

            // Set the image layer boundaries and scroll limits, and create & store it
            var bounds = L.latLngBounds(
                [0,0],
                [cmb2ImgMap.baseLayer[2], cmb2ImgMap.baseLayer[1]]
            );
            this.map.setMaxBounds( bounds );
            this.baseLayer = L.imageOverlay( cmb2ImgMap.baseLayer[0], bounds );

            // Set the map view port based on the zoom level set on the field
            if ( cmb2ImgMap.zoom === '' ) {
                // if zoom level is not set, use the minimum zoom level and center the image
                this.map.setView(
                    [ cmb2ImgMap.baseLayer[2] / 2, cmb2ImgMap.baseLayer[1] / 2 ],
                    minZoom
                );
            } else {
                // Otherwise use the provided zoom level and center
                this.map.setView( [ cmb2ImgMap.lat, cmb2ImgMap.lng ], cmb2ImgMap.zoom );
            }
        } else {
            // If the base layer should be a geographical map
            // Create and store the map and the base layer using the options set on the field
            this.map = L.map( cmb2ImgMap.container, cmb2ImgMap.mapOpts );
            this.baseLayer = L.tileLayer( cmb2ImgMap.baseLayer, cmb2ImgMap.layerOpts );

            // Set the map view port based on the zoom level and center set on the field
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

    // Calculate minimum zoom level for current image in current view port
    imgMinZoom: function() {
        // Only applicable for image base layers
        if ( cmb2ImgMap.baseType !== 'image' ) return 0;

        // Determine the tiles needed vertically and horizontally
        map = document.getElementById( cmb2ImgMap.container )
        maxTilesX = map.offsetWidth / cmb2ImgMap.baseLayer[1];
        maxTilesY = map.offsetHeight / cmb2ImgMap.baseLayer[2];
        maxTiles = Math.min( maxTilesX, maxTilesY );

        // number of tiles needed for one side = 2 ^ zoomlevel
        return Math.floor(Math.log(maxTiles) / Math.log(2));
    }
};

myMap.showLayers();
