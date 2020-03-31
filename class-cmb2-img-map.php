<?php
/**
 * The Image Map field. This class renders a map or image with the ability
 * to place a marker and stores the result as an array of lat, lng
 */
class CMB2_img_map extends CMB2_Type_Base
{
    /** @var Integer $lat Default latitude for map center */
    protected $lat = 60.1699;

    /** @var Integer $lng Default longitude for map center */
    protected $lng = 24.9384;

    /** @var Integer $zoom description */
    protected $zoom = 11;

    /**
     * Render image map field html
     **/
    public function render() {
        // Set script localization variables
        $containter = 'cmb2-img-map-' . $this->types->_name();
        $lat_input = $this->types->_id( '_lat' );
        $lng_input = $this->types->_id( '_lng' );
        $coordinates = $this->field->escaped_value();
        
        // Enqueue leaflet styles and javascript
        $this->enqueue_assets();

        // Pass field variables on to javascript
        $field_args = $this->field->args;

        wp_localize_script( 'cmb2-image-map', 'cmb2ImgMap', [
            'container' => $containter,
            'latInput'  => $lat_input,
            'lngInput'  => $lng_input,
            'lat'       => $coordinates['lat'] ?: $field_args['base_lat'] ?: $this->lat,
            'lng'       => $coordinates['lng'] ?: $field_args['base_lng'] ?: $this->lng,
            // For zoom, do not set default for base type image
            'zoom'      => $field_args['base_zoom'] ?:
                ( ( $field_args['base_type'] === 'image' ) ? '' : $this->zoom ),
            // Base layer is image array for base type image or url string for base type map
            'baseLayer' => ( $field_args['base_type'] === 'image' ) ?
                wp_get_attachment_image_src( $field_args['base_layer'], 'full' ) :
                $field_args['base_layer'],
            'baseType'  => $field_args['base_type'] ?: 'map',
            'mapOpts'   => $field_args['map_options'] ?: [],
            'layerOpts' => $field_args['layer_options'] ?: [],
        ] );

        // display latitude hidden input
        echo $this->types->input( [
            'name'  => $this->types->_name( '[lat]' ),
            'id'    => $lat_input,
            'value' => $coordinates['lat'],
            'type'  => 'hidden',
            'desc'  => ''
        ] );

        // display longitude hidden input
        echo $this->types->input( [
            'name'  => $this->types->_name( '[lng]' ),
            'id'    => $lng_input,
            'value' => $coordinates['lng'],
            'type'  => 'hidden',
            'desc'  => ''
        ] );

        // display leaflet container
        echo '<div id="' . $containter . '" style="height: 400px"></div>';
    }

    /**
     * Enqueue Leaflet styles and scripts
     **/
    public function enqueue_assets() {
        // Enqueue leaflet css
        wp_enqueue_style(
            'leaflet-core',
            plugins_url( 'vendor/drmonty/leaflet/css/leaflet.css', __FILE__ ),
            null,
            CMB2_IMG_MAP_VERSION
        );

        // Enqueue leaflet script
        wp_enqueue_script(
            'leaflet-core',
            plugins_url( 'vendor/drmonty/leaflet/js/leaflet.min.js', __FILE__ ),
            null,
            CMB2_IMG_MAP_VERSION,
            true
        );
        wp_enqueue_script(
            'cmb2-image-map',
            plugins_url( 'js/cmb2-image-map.js', __FILE__ ),
            [ 'leaflet-core' ],
            CMB2_IMG_MAP_VERSION,
            true
        );
    }

    /**
     * Sanitize image map field before saving
     * 
     * @param bool|mixed $override_value Sanitization/Validation override value to return.
     *                                   Default: null. false to skip it.
     * @param mixed      $value      The value to be saved to this field.
     **/
    public static function sanitize( $override_value, $value )
    {
        if ( isset( $value['lat'] ) && isset( $value['lng'] ) ) {
            return $value;
        } else {
            return [
                'lat' => null,
                'lng' => null
            ];
        }
    }
}
