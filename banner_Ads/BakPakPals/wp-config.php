<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'i2051476_wp1');

/** MySQL database username */
define('DB_USER', 'i2051476_wp1');

/** MySQL database password */
define('DB_PASSWORD', 'M#h*1oFFR6]X46S&t#.73((1');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'Kaa9WqwYNsSTIcioWG6EezxAL8PmwPE3tLkSFdGYe2oRj0hEtQncgxshln8bydVF');
define('SECURE_AUTH_KEY',  'q8OZLHI5TSRBRUNGByH3qF3VwjyD7OT4mA2SbYVI6U66qUiz9gsqslcGLUjaFo4d');
define('LOGGED_IN_KEY',    '8YhCWN9oxrYkQIrXyEJQvpUpyVx5pEoVNpK6DJCyicMNMteIDdY1q9m1Nz2ODozp');
define('NONCE_KEY',        'wUDeVTrqDVkcMS1yPxDus35wiTPwoB0hdTCriijX8eTxmdFzVfOj86iylv9zvuBD');
define('AUTH_SALT',        '5P0MBepiP7hmmYzY5bTeW2rcHsuW98rO0gq0lj1TsBB2RZy8hqdfvtB05NWbbGLr');
define('SECURE_AUTH_SALT', 'jflnswEJIaSCTNQyffqgZadEY9RenswYsRbKokaphboKZFRrObid9WJaw6vzFLeA');
define('LOGGED_IN_SALT',   '1yKVNJs7Ap4vXdMG8Tg9ER2UXkDIGQysaIftJAI6AO7g86msLqIN7KS2emuBP3q7');
define('NONCE_SALT',       'ICTbAmKiLDienaMI1c8krwbr7BtmFco7ohTmvN2hyQ8lpZBr6y3mxNYoPJufQScS');

/**
 * Other customizations.
 */
define('FS_METHOD','direct');define('FS_CHMOD_DIR',0755);define('FS_CHMOD_FILE',0644);
define('WP_TEMP_DIR',dirname(__FILE__).'/wp-content/uploads');

/**
 * Turn off automatic updates since these are managed upstream.
 */
define('AUTOMATIC_UPDATER_DISABLED', true);


/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
