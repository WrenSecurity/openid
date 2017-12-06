/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * If applicable, add the following below this MPL 2.0 HEADER, replacing
 * the fields enclosed by brackets "[]" replaced with your own identifying
 * information:
 *     Portions Copyright [yyyy] [name of copyright owner]
 *
 *     Copyright 2017 Rosie Applications, Inc.
 *     Portions Copyright 2013-2014 ForgeRock AS
 *
 */
define(['./common'], function (common) {
  //============================================================================
  // Global Configuration
  //============================================================================
  var config = {
    sample_app: {
      // This application is assumed to be deployed under /openid.
      app_root: "/openid-sample",

      client_agent: {
        client_id:     "myClientID",
        client_secret: "password",
        client_realm:  "/"
      }
    },

    sso_app: {
      // OpenAM is assumed to be deployed under /openam.
      app_root: "/openam",

      endpoints: {
        authorize:  "oauth2/authorize",
        access:     "oauth2/access_token",
        info:       "oauth2/userinfo"
      }
    },

    getSamplePath: function (filename) {
      var hostPath      = common.getBaseURL(),
          sampleAppPath = config.sample_app.app_root;

      return hostPath + sampleAppPath + "/" + filename;
    },

    getSsoPath: function (filename) {
      var hostPath   = common.getBaseURL(),
          ssoAppPath = config.sso_app.app_root;

      return hostPath + ssoAppPath + "/" + filename;
    },

    getSsoAuthorizePath: function (authRequestParameters) {
      var authorizeEndpoint = config.sso_app.endpoints.authorize;
      var encodedParams = common.encodeQueryData(authRequestParameters);
      var relativePath = authorizeEndpoint + "?" + encodedParams;

      return config.getSsoPath(relativePath);
    }
  };

  //============================================================================
  // OpenID 1.0 Basic Profile Settings
  //============================================================================
  config.basic_profile = {
    state: "af0ifjsldkj",

    getRedirectUri: function () {
      return config.getSamplePath("cb-basic.html");
    }
  };

  //============================================================================
  // OpenID 1.0 Implicit Profile Settings
  //============================================================================
  config.implicit_profile = {
    state:  "af0ifjsldkj",
    nonce:  "n-0S6_WzA2Mj",

    getRedirectUri: function () {
      return config.getSamplePath("cb-implicit.html");
    }
  };

  //============================================================================
  // OpenID Mobile Connect Profile
  //============================================================================
  config.mobile_connect_profile = {
    acr_values: "loa-2",
    nonce:      "n-0S6_WzA2Mj",
    login_hint: "msisdn=15554567890"
  };

  return config;
});
