# OpenID Connect Examples

## Warning
**This code is not supported by ForgeRock and it is your responsibility to verify that the software 
is suitable and safe for use.**

## About

These simple examples use the OpenID Connect 1.0 provider support in
OpenAM 11.0.0 and later.

## Running the Samples
### Using an Existing Packaged Version (Using the Default Config)
If you are fine configuring OpenAM to match the default configuration of the sample project, you
can use it as-is from the packaged version. Here's how:

1. Download the packaged version.
2. Unpack the package for deployment in your container alongside OpenAM.
   For example, with OpenAM in `/path/to/tomcat/webapps/openam`, clone this under
   `/path/to/tomcat/webapps` into `/path/to/tomcat/webapps/openid-sample`.
3. Restart Tomcat.
4. Create the "OAuth 2.0/OpenID Connect Client" agent profile in OpenAM as described in the
   examples. The agent must have a matching secret and client ID.
5. Try out the samples.

### Creating a Custom Package from Source (Using a Custom Config)
If you need to adjust the configuration of the sample project, you will need to create a custom
package from source. Here's how:

1. Clone the project.
2. Install [NodeJS and Yarn](https://yarnpkg.com/lang/en/docs/install/).
3. Install dependencies (i.e. run `yarn install` from within the folder that contains this 
   `README.md` file).
4. Adjust the configuration in `src/js/config.js` as necessary.
5. Package up the project through Gulp + Webpack (`yarn run package`).
6. The assets that make up the "package" will be generated under `dist/`.
   Follow steps 2-5 under "Using a Packaged Version" above, copying the contents of the `dist/`
   folder to the location where you would normally unpack a pre-packaged version.

## A Note About Security
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
Portions Copyright 2017 Rosie Applications, Inc.
