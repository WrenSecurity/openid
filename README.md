# OpenID Connect Examples

## Warning
**This code is not supported by ForgeRock and it is your responsibility to verify that the software is suitable and safe for use.**

## About

These simple examples use the OpenID Connect 1.0 provider support in
OpenAM 11.0.0 and later.

### Using a Packaged Version
If you are fine configuring OpenAM to match the default configuration of the sample project, you
can use it as-is from the packaged version. Here's how:

1.   Download the packaged version.
2.   Unpack the package in a new folder called `openid` inside the webroot for the Tomcat
     instance that's running OpenAM (e.g. create the folder `/var/lib/tomcat8/webapps/openid`).
3.   Restart Tomcat.
4.   Create the agent profile as described in the examples.
5.   Try it out.

### Compiling from Source
If you need to adjust the configuration of the sample project, you will need to compile it from
source. Here's how:

1.   Clone the project for deployment in your container alongside OpenAM.
     For example, with OpenAM in `/path/to/tomcat/webapps/openam`,
     clone this under `/path/to/tomcat/webapps`
     into `/path/to/tomcat/webapps/openid`.
2.   Install [Yarn](https://yarnpkg.com/lang/en/docs/install/).
3.   Install dependencies (i.e. run `yarn install` from within the folder that contains this 
     `README.md` file).
4.   Adjust the configuration in `src/js/config.js` as necessary.
5.   Compile the project through Webpack (`yarn run compile`).
6.   Assets will be generated under `dist/`. Follow steps 2-5 under "Using a Packaged Version"
     above, copying the contents of the `dist/` folder to the location where you would normally
     unpack a packaged version.

The examples are not secure. Instead they are completely transparent,
showing the requests and the steps for the Basic and Implicit Profiles,
showing how to register with OpenID Connect Dynamic Client Registration,
and showing OpenAM as OP and Authenticator for GSMA Mobile Connect.
(Mobile Connect support requires OpenAM 12 or later.)

* * *
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

Copyright 2013-2015 ForgeRock AS.
