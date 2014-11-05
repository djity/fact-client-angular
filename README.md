Fact Client Angular
===================

[![Build status](https://travis-ci.org/djity/fact-client-angular.svg)](https://travis-ci.org/djity/fact-client-angular)
[![Code Climate](https://codeclimate.com/github/djity/fact-client-angular/badges/gpa.svg)](https://codeclimate.com/github/djity/fact-client-angular)

*Angular.js client for the fact-api service*

**Disclaimer: this is a small open source module, but it is directly related to a private API. Until this API is more mature and documented, this project is of little interest for outsiders.**

Install
-------

*Not yet published as a bower component. Not yet meaned to be used in other projects that the bundled demos.*

Usage
-----

*The demos and test application are the closest thing to a usage documentation for now.*

Build
-----

Install the dependencies and the build environment:

    npm install -g gulp
    npm install
    bower install

Run the development server. It will open two tabs in your default browser:

    gulp

Contribute
----------

Write re-usable directives and services in the module, each directive should have a small work page in the 'test/app' directory.

Directives should use [angular-material](https://material.angularjs.org/) and generally try to follow the [material-design](http://www.google.com/design/spec/material-design/introduction.html) specifications.

Directives should as much as possible be independent from the services. Meaning that it should be possible to write small offline test pages for directives. This improves testability and decoupling.

Demos should be created next to 'demos/basic' and use this first demo as a seed. When doing some improvements this demo should be maintained to be the best for bootstrapping other demos.

To the demos simply include '[deploy-demos]' in a commit message:

    git commit -m '[deploy-demos] my commit message'
    git push


