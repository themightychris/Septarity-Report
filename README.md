Tested on Mac OS X Lion with Chrome 14

# Requirements
*   DepthJS browser extension: http://depthjs.media.mit.edu/
*   Kinect sensor with power adapter (only comes with standalone Kinects)

# Contents
*   `septarity-report.html` - Load this file in your browser to open the interface
*   `rail-next_to_arrive.php` - A one-line PHP script that proxies requests to SEPTA's API
*   `css` - Styles
*   `img` - Images
*   `js`
    *  `depth-ext.js` - An ExtJS 4-powered alternative to the jQuery-powered depth.js file distributed with DepthJS
    *  `septarity-report.js` - Main application code

# Notes
*   DepthJS seems to only work on webpages loaded through http:, I wasn't able to get it working loading locally through file:


The include and the php script that proxies requests to septa so they are available locally.

depth-ext.js is a replacement the depth.js file distributed with DepthJS for using ExtJS 4 instead of jQuery
