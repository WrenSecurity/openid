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

### Running the Sample without Deploying It on the OpenAM Server
For convenience and greater security, you can run the sample locally against a remote installation
of OpenAM, without deploying it to the container running OpenAM. The sample ships configured to
run proxy via [BrowserSync](https://www.browsersync.io/) -- a NodeJS plugin for local development -- 
out of the box. The proxy can serve up all of the sample content locally, while proxying all other 
requests to the remote OpenAM installation.

To run the sample locally using the BrowserSync proxy:
1. Clone the project.
2. Install [NodeJS and Yarn](https://yarnpkg.com/lang/en/docs/install/).
3. Install dependencies (i.e. run `yarn install` from within the folder that contains this 
   `README.md` file).
4. Adjust the configuration in `src/js/config.js` as necessary.
5. As root, edit the `hosts` file on your system to add an entry for
   `127.0.0.1 am-sample.local.example.com` (if desired, you can change the hostname by changing the
   value of `proxyHost` in `Gulpfile.js`).
   On Linux and OSX machines, the `hosts` file is located at `/etc/hosts`.
   On Windows machines, it is located at `C:\Windows\System32\Drivers\etc\hosts`.
6. Create the "OAuth 2.0/OpenID Connect Client" agent profile in OpenAM as described in the 
   examples. You will need to ensure that the "Redirection URIs" for the agent reference a hostname
   of `am-sample.local.example.com:3000`.
7. Launch the proxy using 
   `./node_modules/.bin/gulp am-proxy --proxy-target=https://OPENAM_HOST_NAME`, where 
   `OPENAM_HOST_NAME` is the host name (with port number, if applicable) of the OpenAM installation
   you wish to target.
8. When your browser opens, try out the samples as usual.

An additional benefit of using BrowserSync in this fashion is that it can automatically refresh the
sample pages in response to changes you make to the HTML and JS files in the sample project. For
example, if you need to refine the settings you are using in `src/js/config.js`, each time you save
the file, whatever sample page you are viewing should automatically reload. 

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
