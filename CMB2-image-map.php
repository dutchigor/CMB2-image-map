<?php
/**
 * Add image map field to CMB2.
 *
 * @package      CMB2-image-map
 * @author       Igor Honhoff
 * @copyright    2020 Igor Honhoff
 * @license      GPL-3.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       CMB2 image map field
 * Plugin URI:        https://github.com/dutchigor/CMB2-image-map
 * Description:       Add image map field to CMB2.
 * Version:           0.1.0
 * Author:            Igor Honhoff
 * Author URI:        https://github.com/dutchigor
 * License:           GPL-3.0-or-later
 * Requires PHP:      7.0
 * Requires at least: 5.3
 */

define( 'CMB2_IMG_MAP_VERSION', '0.1.0' );

/**
 * Register CMB2 Image Map filters
 **/
function cmb2_img_map_init() {
    // initiate CMB2_img_map class
    if ( file_exists( './vendor/autoload.php' ) ) require_once './vendor/autoload.php';
    require_once 'class-cmb2-img-map.php';

    // Register filters
    add_filter( 'cmb2_render_class_image_map', function() { return CMB2_img_map::class; } );
    add_filter( 'cmb2_sanitize_image_map', [ 'CMB2_img_map', 'sanitize' ], 10, 2 );
}

add_action( 'cmb2_init', 'cmb2_img_map_init');
