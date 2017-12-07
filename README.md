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
4. Open `https://OPENAM_HOST_NAME:OPENAM_PORT/openid-sample` in your browser, where
   `OPENAM_HOST_NAME` and `OPENAM_PORT` are the host name and port number, respectively, of your
   OpenAM server.
5. Open the desired sample.
6. Create the "OAuth 2.0/OpenID Connect Client" agent profile in OpenAM as described in the
   samples. The configuration of the agent must match what the sample you are attempting to run
   specifies.
7. Try out the samples.

### Creating a Custom Package from Source (Using a Custom Config)
If you need to adjust the configuration of the sample project, you will need to create a custom
package from source. Here's how:

1. Clone this project to your machine using GIT.
2. Install [NodeJS and Yarn](https://yarnpkg.com/lang/en/docs/install/).
3. Install dependencies (i.e. run `yarn install` from within the folder that contains this
   `README.md` file).
4. Adjust the configuration in `src/js/config.js` as necessary.
5. Package up the project through Gulp + Webpack (`yarn run package`).
6. The assets that make up the "package" will be generated under `dist/`.
   Follow steps 2-7 under "Using a Packaged Version" above, copying the contents of the `dist/`
   folder to the location where you would normally unpack a pre-packaged version.

### Running the Sample without Deploying It on the OpenAM Server
For convenience and greater security, you can run the sample locally against a remote installation
of OpenAM, without deploying it to the container running OpenAM. The sample ships configured to
run proxy via [BrowserSync](https://www.browsersync.io/) -- a NodeJS plugin for local development --
out of the box. The proxy can serve up all of the sample content locally, while proxying all other
requests to the remote OpenAM installation.

To run the sample locally using the BrowserSync proxy:
1.  Clone this project to your machine using GIT.
2.  Install [NodeJS and Yarn](https://yarnpkg.com/lang/en/docs/install/).
3.  Install dependencies (i.e. run `yarn install` from within the folder that contains this
    `README.md` file).
4.  Adjust the configuration in `src/js/config.js` as necessary.
5.  As root, edit the `hosts` file on your system to add an entry for
    `127.0.0.1 am-sample.local.example.com` (if desired, you can change the hostname by changing the
    value of `proxyHost` in `Gulpfile.js`).
    - On Linux and OSX machines, the `hosts` file is located at `/etc/hosts`.
    - On Windows machines, it is located at `C:\Windows\System32\Drivers\etc\hosts`.
6.  Log-in to the OpenAM admin console.
7.  Launch the proxy using
    `./node_modules/.bin/gulp am-proxy am-proxy --proxy-target=https://OPENAM_HOST_NAME:OPENAM_PORT`,
    where `OPENAM_HOST_NAME` and `OPENAM_PORT` are the host name and port number, respectively, of
    your OpenAM server.
8.  When your browser opens, open the desired sample.
9.  Create the "OAuth 2.0/OpenID Connect Client" agent profile in OpenAM as described in the
    sample you are running. You will need to ensure that the "Redirection URIs" for the agent
    reference a hostname of `am-sample.local.example.com:3000`.
10. Try out the samples as usual.

An additional benefit of using BrowserSync in this fashion is that it can automatically refresh the
sample pages in response to changes you make to the HTML and JS files in the sample project. For
example, if you need to refine the settings you are using in `src/js/config.js`, each time you save
the file, whatever sample page you are viewing should automatically reload.

## Compatibility with Other Open ID Connect Providers
The samples in this project are primarily intended to be used with OpenAM. However, since OpenID is
an industry standard, it should be possible to use these samples with other OIDC providers as well.

This section describes how to use the samples with other implementations with which they are known
to be compatible.

### Keycloak
These samples work with Keycloak out of the box, except for some minor changes to the configuration
file to point at Keycloak's OIDC endpoints.

Here's how to configure it:

1.  Create a new realm in Keycloak called "demo" (all lowercase).
2.  Optionally configure the realm to allow user registration, so that you don't have to pre-create
    accounts.
3.  Within the realm, create a new `openid-connect` client called `openid-sample-client`.
    Use a Root URL and Base URL of `http://am-sample.local.example.com:3000/openid-sample`.
4.  Configure the new client to use an "Access type" of `confidential`, and save the client.
5.  While still editing the client, navigate to the "Credentials" tab that appeared after changing
    the "Access type" to `confidential`.
6.  Click the "Regenerate Secret" button.
7.  Copy the secret out of the box that is to the left of the "Regenerate Secret" button.
8.  Clone this project to your machine using GIT.
9.  Install [NodeJS and Yarn](https://yarnpkg.com/lang/en/docs/install/).
10. Install dependencies (i.e. run `yarn install` from within the folder that contains this
    `README.md` file).
11. Within this project, overwrite the contents of `src/js/config.js` with the contents from the
    `src/js/config.keycloak.js` sample config.
12. Open the `src/js/config.js` file for editing.
13. Replace `SECRET-GENERATED-BY-KEYCLOAK` in the file with the secret that was generated and copied
    in step 7.
14. As root, edit the `hosts` file on your system to add an entry for
    `127.0.0.1 am-sample.local.example.com` (if desired, you can change the hostname by changing the
    value of `proxyHost` in `Gulpfile.js`).  
    - On Linux and OSX machines, the `hosts` file is located at `/etc/hosts`.
    - On Windows machines, it is located at `C:\Windows\System32\Drivers\etc\hosts`.
15. Launch the proxy using
    `./node_modules/.bin/gulp am-proxy --proxy-target=https://KEYCLOAK_HOST_NAME:KEYCLOAK_PORT`,
    where `KEYCLOAK_HOST_NAME` and `KEYCLOAK_PORT` are the host name and port number, respectively,
    of your Keycloak server.
16. When your browser opens, open the desired sample.
17. Try out the samples.

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
