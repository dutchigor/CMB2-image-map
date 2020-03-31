# CMB2-Image-Map
__Note: This plugin is still under development__
Adds image map field to CMB2, This allows a marker to be set on each field on top of a pre-defined image or map layer.

Requires [CMB2](https://github.com/CMB2/CMB2) to be added to WordPress seperately.

Each field can contain one marker and will store the coordinates of that marker. Clicking anywhere on the map will place or move the marker there.

## How to install
Option one
- Download the latest package and Install as a standard WordPress plugin

Option two
- Add dutchigor/cmb2-image-map to required packages in composer and require CMB2-image-map.php in your code

## How to use
### Creating a field
Create a field with type 'image_map' and give it the following properties:
- basemap: String - The url template for the basemap you wish to use (manditory)
- base_lat: Int - The latitute to center the map on if no marker is set yet (optional)
- base_lng: Int - The longitude to center the map on if no marker is set yet (optional)
- base_zoom: Int - The zoom level with which the map will be initialized on the field (optional)
- layer_options: Array - This array will be converted to a javascript object and used to load the baselayer. For possible values see Options in https://leafletjs.com/reference-1.6.0.html#tilelayer (optional)

#### Example
This is an example of a map field using mapbox
```php
$cmb = new_cmb2_box( array(
    'id'            => 'image_map_metabox',
    'title'         => 'Example',
    'object_types'  => array( 'post' ),
 ) );

$cmb->add_field( array(
    'id'        => 'my_img_map',
    'name'      => 'Test Image Map',
    'type'      => 'image_map',
    'basemap'   => 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
    'base_lat'  => 60.1699,
    'base_lng'  => 24.9384,
    'layer_options' => array( 
        'accessToken' => 'your-token-here',
        'maxZoom'     => 18,
        'id'          => 'mapbox/streets-v11',
        'tileSize'    => 512,
        'zoomOffset'  => -1,
    )
) );
```

### Displaying results
The results are stored in the custom field as an array with a lat and lng value. They can be displayed on a map on the front with E.g. the [Flexible Map plugin](https://flexible-map.webaware.net.au/).

#### Example
```php
$coordinates = get_post_meta( $post->ID, 'my_img_map', true )
flexmap_show_map([
  'center' => $coordinates['lat'] . ',' . $coordinates['lng']
]);
```
