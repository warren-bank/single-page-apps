# Release Notes #

### 0.1.1 (2022-07-18) ###

* Removed the Legacy Players
* Multiple plotting bugfixes

### 0.1.0 (2022-05-12) ###

* Added the option to enable/disable CMCD for hls.js/dash.js
* Added the option to provide a JSON configuration for hls.js
* Removed Google Analytics

### 0.0.5 (2022-02-24) ###

* Upgrade to dash.js 4.2.1.
* Upgrade to hls.js 1.1.5.
* Added a player info widget that shows the version number of the player.
* Enabled [CMCD](https://cdn.cta.tech/cta/media/media/resources/standards/pdfs/cta-5004-final.pdf) for hls.js. The CMCD content-id is computed as a prefix of the SHA-1 hash of the played master manifest for both dash.js and hls.js.

### 0.0.4 (2020-08-26) ###

* Safari users trying to playing streams with Token Authentication will receive an error notification. Unfortunately, playback of Token Authenticated streams on Safari is not yet supported on players.akamai.com.
* Added a button to easily share a link referencing the player and the test URL.
* Added basic stream URL input checks.
* Fixed a bug: on smaller screen sizes, the navbar menu would not collapse after selecting a menu item.
* Removed old streams which were not any more available.


### 0.0.3 (2020-07-01) ###

* Added support for Token Authentication (dash.js and hls.js).
* Added a release notes page.
