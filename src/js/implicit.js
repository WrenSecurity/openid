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
 *     Copyright 2013-2014 ForgeRock AS
 *     Portions Copyright 2017 Rosie Applications, Inc.
 *
 */
define(['./config', './common', 'jquery'], function (config, common, $) {
  var Implicit = {
    /* Returns a map of parameters present in the document fragment. */
    getParamsFromFragment: function () {
      var params = {};
      var postBody = location.hash.substring(1);
      var regex = /([^&=]+)=([^&]*)/g, m;

      while (m = regex.exec(postBody)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }

      return params;
    },

    renderIntro: function () {
      var client_id     = config.sample_app.client_agent.client_id;
      var client_realm  = config.sample_app.client_agent.client_realm;

      var redirect_uri  = config.implicit_profile.getRedirectUri();
      var state         = config.implicit_profile.state;
      var nonce         = config.implicit_profile.nonce;

      var authRequestParameters = {
        "response_type":  "id_token token",
        "scope":          "openid profile",
        "client_id":      client_id,
        "realm":          client_realm,
        "redirect_uri":   redirect_uri,
        "state":          state,
        "nonce":          nonce
      };

      var url = config.getSsoAuthorizePath(authRequestParameters);

      var openam_uri = config.getSsoPath("");
      var sample_uri = config.getSamplePath("");

      $("#link").attr("href", url);

      $("#config").html(
          "<hr>"
          + "<h3>Prerequisite Configuration</h3>"

          + "<p>OpenAM should be running and configured as an "
          + "OpenID Connect Provider in the same container as this "
          + "application.</p>"

          + "<p>Current settings from <code>config.js</code>:</p>"
          + "<table style='width: 100%; font-family: monospace'>"
          + "<tr><td>OpenAM URI</td><td>" + openam_uri + "</td></tr>"
          + "<tr><td>Sample App URI</td><td>" + sample_uri + "</td></tr>"
          + "<tr><td>client_id</td><td>" + client_id + "</td></tr>"
          + "<tr><td>realm</td><td>" + client_realm + "</td></tr>"
          + "<tr><td>redirect_uri</td><td>" + redirect_uri + "</td></tr>"
          + "</table>"

          + "<table style='width: 100%; font-family: monospace'>"
          + "<tr><td>nonce</td><td>" + nonce + "</td></tr>"
          + "<tr><td>state</td><td>" + state + "</td></tr>"
          + "</table>"

          + "<p>In OpenAM, create an OAuth 2.0 agent using the "
          + "<code>client_id</code>, then edit the configuration to "
          + "add the <code>redirect_uri</code>, and scopes \"openid\" "
          + "and  \"profile\".</p>"

          + "<p>Furthermore, set ID Token Signed Response Algorithm "
          + "to <code>HS256</code>.</p>"

          + "<p>After you have configured everything, log out of "
          + "OpenAM. Then click the link to start the authorization "
          + "process.</p>"
      );
    },

    renderResult: function () {
      $(document).ready(function () {
        var params = getParamsFromFragment();
        if (params.id_token != undefined) {
          $("#code").html(
              "<h3>Response From Provider</h3>" +
              "<pre>" + JSON.stringify(params, undefined, 2) + "</pre>"
          );
        } else {
          var error = parseQueryString();
          $("#info").html(
              "<h3>Response From Provider</h3>" +
              "<pre>" + JSON.stringify(error, undefined, 2) + "</pre>"
          );

          return;
        }

        var idToken = params["id_token"];
        idToken = idToken.split(/\./);

        var header = JSON.parse(atob(idToken[0]));
        $("#header").html(
            "<h3>Decoded ID Token Header</h3>" +
            "<pre>" + JSON.stringify(header, undefined, 2) + "</pre>"
        );

        var payload = JSON.parse(atob(idToken[1]));
        $("#decoded").html(
            "<h3>Decoded ID Token Content</h3>" +
            "<pre>" + JSON.stringify(payload, undefined, 2) + "</pre>"
        );

        var signature = idToken[2];
        $("#signature").html(
            "<h3>ID Token Signature</h3>" +
            "<pre>" + signature + "</pre>"
        );

        // Validate signature.
        var isValid = validateSignature(idToken[0], idToken[1], signature);
        if (!isValid) {
          $("#info").html("Invalid id_token signature");

          return;
        }

        // Validate id_token.
        if (((payload.aud instanceof Array) &&
             (payload.aud.indexOf(client_id) == -1)) ||
            (payload.aud != client_id)) {
          $("#info").html("Invalid id_token audience: " + payload.aud);

          return;
        }

        if ((payload.aud instanceof Array) && (payload.azp != client_id)) {
          $("#info").html("Invalid id_token authorized party: " + payload.azp);

          return;
        }

        var openamPath = config.getSsoPath("");

        // In 12, issuer path is /openam. In 13, issuer path is /openam/oauth2.
        if (payload.iss.lastIndexOf(openamPath, 0) !== 0) { // ~ startsWith
          $("#info").html("Invalid id_token issuer: " + payload.iss);

          return;
        }

        var now = new Date().getTime() / 1000;
        if (now >= payload.exp) {
          $("#info").html("The id_token has expired.");

          return;
        }

        if (now < payload.iat) {
          $("#info").html("The id_token was issued in the future.");

          return;
        }

        if (payload.nonce != nonce) {
          $("#info").html("Invalid id_token nonce: " + payload.nonce);

          return;
        }

        // acr (Authentication Context Class Reference) not requested

        // max_age not requested

        $.ajax({
          url:        config.getSsoPath(config.sso_app.endpoints.info),
          beforeSend: function (xhr) {
            xhr.setRequestHeader(
              "Authorization", "Bearer " + params["access_token"]);
          },
          data: {
            "scope": "openid profile",
            "realm": client_realm
          }
        }).done(function (data) {
          $("#info").html(
              "<h3>Profile Information</h3>" +
              "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
          );
        }).fail(function (data) {
          $("#info").html(
              "<p>Error obtaining token info:</p>" +
              "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
          );
        });
      });
    }
  };

  return Implicit;
});
