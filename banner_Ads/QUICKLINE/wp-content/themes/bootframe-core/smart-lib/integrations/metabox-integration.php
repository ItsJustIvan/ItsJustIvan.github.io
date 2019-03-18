<?php
add_filter( 'rwmb_meta_boxes', 'smartlib_register_meta_boxes' );
/**
 * Register meta boxes
 *
 * Remember to change "your_prefix" to actual prefix in your project
 *
 * @param array $meta_boxes List of meta boxes
 *
 * @return array
 */
function smartlib_register_meta_boxes( $meta_boxes )
{

    /**
     * prefix of meta keys (optional)
     * Use underscore (_) at the beginning to make keys hidden
     * Alt.: You also can make prefix empty to disable it
     */
    // Better has an underscore as last sign
    $prefix = 'smartlib_';
    // 1st meta box
    $meta_boxes[] = array(
        // Meta box id, UNIQUE per meta box. Optional since 4.1.5
        'id'         => 'standard',
        // Meta box title - Will appear at the drag and drop handle bar. Required.
        'title'      => __( 'Page Options', 'bootframe' ),
        // Post types, accept custom post types as well - DEFAULT is 'post'. Can be array (multiple post types) or string (1 post type). Optional.
        'post_types' => array(  'page' ),
        // Where the meta box appear: normal (default), advanced, side. Optional.
        'context'    => 'normal',
        // Order of meta box: high (default), low. Optional.
        'priority'   => 'high',
        // Auto save: true, false (default). Optional.
        'autosave'   => true,
        // List of meta fields
        // Show this meta box for posts matched below conditions
        'show'   => array(

            // List of page templates (used for page only). Array. Optional.
            'template'    => array( 'page.php' ),

        ),

        'fields'     => array(
            // TEXT
            array(
                // Field name - Will be used as label
                'name'  => __( 'Page subtitle', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}page_subtitle",
                // Field description (optional)
                'desc'  => __( 'Add page subtitle', 'bootframe' ),
                'type'  => 'text',
                'size' => 100




            ),
            // CHECKBOX
            array(
                'name' => __( 'Show breadcrumb', 'bootframe' ),
                'id'   => "{$prefix}pages_breadcrumb_page",
                'type' => 'checkbox',
                // Value can be 0 or 1
                'std'  =>  (int)get_theme_mod('smartlib_pages_breadcrumb_page', 1)
            ),
            // DIVIDER
            array(
                'type' => 'divider',
                'id'   => 'fake_divider_id1', // Not used, but needed
            ),
            // RADIO BUTTONS
            array(
                'name'    => __( 'Page Layout', 'bootframe' ),
                'id'      => "{$prefix}layout_page",
                'type'    => 'radio',
                // Array of 'value' => 'Label' pairs for radio options.
                // Note: the 'value' is stored in meta field, not the 'Label'
                'options' => array(
                    0 => __( 'No sidebar', 'bootframe' ),
                    1 => __( 'Right Sidebar', 'bootframe' ),
                    2 => __( 'Left Sidebar', 'bootframe' ),
                ),
                'std' => get_theme_mod('smartlib_layout_default', 1)
            ),
            // DIVIDER
            array(
                'type' => 'divider',
                'id'   => 'fake_divider_id', // Not used, but needed
            ),
            array(
                'name'             => __( 'Background image in the header', 'bootframe' ),
                'id'               => "{$prefix}page_header_background",
                'type'             => 'image_advanced',
                'max_file_uploads' => 1,
            ),



            array(
                'name' => __( 'Page Header Dark Section', 'bootframe' ),
                'id'   => "{$prefix}header_dark_section",
                'type' => 'checkbox',
                // Value can be 0 or 1
                'std' => 1,
                'desc' => __( 'Select if uploaded  background is dark', 'bootframe' ),

            ),

            array(
                'name' => __( 'Paralax Heder Effect', 'bootframe' ),
                'id'   => "{$prefix}header_paralax_effect",
                'type' => 'checkbox',
                // Value can be 0 or 1
                'std' => 1,
            ),

            // COLOR
            array(
                'name' => __( 'Page Header Over Layer Background', 'bootframe' ),
                'id'   => "{$prefix}page_header_color_background",
                'type' => 'color',
                'desc'  => __( 'It works only with a background image in the header', 'bootframe' ),
            ),

            /*

            array(
                'name' => __( 'Background Opacity', 'bootframe' ),
                'id'   => "{$prefix}page_header_background_opacity",
                'desc' => __( 'Background Color Opacity Settings: from 0 to 1', 'bootframe' ),
                'type' => 'range',
                'min'  => 0,
                'max'  => 1,
                'step' => 0.1,
                'std'  => 1,
            ),

            */

            // DIVIDER
            array(
                'type' => 'divider',
                'id'   => 'fake_divider_id_3', // Not used, but needed
            ),
            // HEADING
            array(
                'type' => 'heading',
                'name' => __( 'Top Bar Settings', 'bootframe' ),
                'id'   => 'top_bar_id', // Not used but needed for plugin

            ),
            array(
                'name' => __( 'Display navbar over content', 'bootframe' ),
                'id'   => "{$prefix}navbar_over_content",
                'type' => 'checkbox',
                // Value can be 0 or 1
                'std' => get_theme_mod('smartlib_navbar_over_content', 0)



            ),
            array(
                'name' => __( 'Display top bar', 'bootframe' ),
                'id'   => "{$prefix}show_top_bar_page",
                'type' => 'checkbox',
                // Value can be 0 or 1
                'std' => get_theme_mod('smartlib_show_top_bar_default', 1)



            ),
            // Footer
            array(
                'type' => 'heading',
                'name' => __( 'Footer Settings', 'bootframe' ),
                'id'   => 'footer_id', // Not used but needed for plugin

            ),

            array(
                'name' => __( 'Display Footer Sidebar', 'bootframe' ),
                'id'   => "{$prefix}display_sidebar_footer_page",
                'type' => 'checkbox',
                // Value can be 0 or 1
                'std' => get_theme_mod('smartlib_display_sidebar_footer_default' , 1)

            ),
        ),

    );

    $meta_boxes[] = array(
        // Meta box id, UNIQUE per meta box. Optional since 4.1.5
        'id'         => 'standard',
        // Meta box title - Will appear at the drag and drop handle bar. Required.
        'title'      => __( 'Team Member Info', 'bootframe' ),
        // Post types, accept custom post types as well - DEFAULT is 'post'. Can be array (multiple post types) or string (1 post type). Optional.
        'post_types' => array(  'smartlib_team' ),
        // Where the meta box appear: normal (default), advanced, side. Optional.
        'context'    => 'normal',
        // Order of meta box: high (default), low. Optional.
        'priority'   => 'high',
        // Auto save: true, false (default). Optional.
        'autosave'   => true,
        // List of meta fields
        // Show this meta box for posts matched below conditions


        'fields'     => array(
            // TEXT
            array(
                // Field name - Will be used as label
                'name'  => __( 'Position', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}member_position",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),

            array(
                // Field name - Will be used as label
                'name'  => __( 'E-mail', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}user_email",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),

            array(
                // Field name - Will be used as label
                'name'  => __( 'Facebook profile', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}facebook_url",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),
            array(
                // Field name - Will be used as label
                'name'  => __( 'Twitter profile', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}twitter_url",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),

            array(
                // Field name - Will be used as label
                'name'  => __( 'Pinterest profile', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}pinterest_url",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),
            array(
                // Field name - Will be used as label
                'name'  => __( 'Linkedin profile', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}linkedin_url",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),

            array(
                // Field name - Will be used as label
                'name'  => __( 'Google+ profile', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}googlep_url",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),

        ),

    );

    $meta_boxes[] = array(
        // Meta box id, UNIQUE per meta box. Optional since 4.1.5
        'id'         => 'standard',
        // Meta box title - Will appear at the drag and drop handle bar. Required.
        'title'      => __( 'Additional information to the content', 'bootframe' ),
        // Post types, accept custom post types as well - DEFAULT is 'post'. Can be array (multiple post types) or string (1 post type). Optional.
        'post_types' => array(  'smartlib_portfolio' ),
        // Where the meta box appear: normal (default), advanced, side. Optional.
        'context'    => 'normal',
        // Order of meta box: high (default), low. Optional.
        'priority'   => 'high',
        // Auto save: true, false (default). Optional.
        'autosave'   => true,
        // List of meta fields
        // Show this meta box for posts matched below conditions


        'fields'     => array(
            array(
                // Field name - Will be used as label
                'name'  => __( 'Client Name', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}client_name",
                // Field description (optional)

                'type'  => 'text',
                'size' => 100
            ),
            array(
                // Field name - Will be used as label
                'name'  => __( 'Portfolio images', 'bootframe' ),
                // Field ID, i.e. the meta key
                'id'    => "{$prefix}item_image",
                // Field description (optional)

                'type'             => 'image_advanced'
            )
        ),

    );



    return $meta_boxes;
}