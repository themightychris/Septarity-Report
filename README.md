Tested on Mac OS X Lion with Chrome 14

# Requirements
*   [DepthJS browser extension](http://depthjs.media.mit.edu/)
*   Kinect sensor with power adapter (only comes with standalone Kinects)

# Contents
*   `septarity-report.html` - Load this file in your browser to open the interface
*   `rail-next_to_arrive.php` - A one-line PHP script that proxies requests to SEPTA's API
*   `js` - folder for javascripts
    *  `depth-ext.js` - An ExtJS 4-powered alternative to the jQuery-powered depth.js file distributed with DepthJS
    *  `septarity-report.js` - Main application code
*   `css` - folder for CSS
*   `img` - folder for images

# Notes
*   I wasn't able to get DepthJS working in Safari
*   DepthJS seems to only work on webpages loaded through http:, I wasn't able to get it working loading locally through file:
*   I had to reload Chrome once before DepthJS worked after launching Chrome
*   DepthJS would only work with the first web page I opened, so I set SEPTArity Report as my homepage

# Links
*   [Hackathon report with demo videos](http://technicallyphilly.com/2011/10/10/apps-for-septa-hackathon-features-new-data-sources-and-mass-transit-projects-video)