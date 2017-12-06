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
define(['./common', './config', 'jquery'], function (common, config, $) {
  var Basic = {
    /* Returns the value of the named query string parameter. */
    getParameterByName: function (name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(window.location.search);

      if (results == null) {
        return "";
      }

      return decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    /* Returns an HTTP Basic Authentication header string. */
    authHeader: function (user, password) {
      var tok = user + ':' + password;
      var hash = btoa(tok); // Default: bXlDbGllbnRJRDpwYXNzd29yZA==

      // console.log("hash: " + hash);
      return "Basic " + hash;
    },

    renderIntro: function () {
      var client_id     = config.sample_app.client_agent.client_id;
      var client_realm  = config.sample_app.client_agent.client_realm;
      var client_secret = config.sample_app.client_agent.client_secret;

      var redirect_uri  = config.basic_profile.getRedirectUri();

      var authRequestParameters = {
        "response_type":  "code",
        "scope":          "openid profile",
        "client_id":      client_id,
        "realm":          client_realm,
        "redirect_uri":   redirect_uri,
        "state":          config.basic_profile.state
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
          + "<tr><td>client_secret</td><td>" + client_secret + "</td></tr>"
          + "<tr><td>realm</td><td>" + client_realm + "</td></tr>"
          + "<tr><td>redirect_uri</td><td>" + redirect_uri + "</td></tr>"
          + "</table>"

          + "<p>In OpenAM, create an OAuth 2.0 agent using the "
          + "<code>client_id</code>, <code>client_secret</code>, "
          + "and <code>redirect_uri</code>, and then edit the "
          + "configuration to add the scopes \"openid\" and "
          + "\"profile\".</p>"

          + "<p>Furthermore, set ID Token Signed Response Algorithm "
          + "to <code>HS256</code>.</p>"

          + "<p>After you have configured everything, log out of "
          + "OpenAM. Then click the link to start the authorization "
          + "process.</p>"
      );
    },

    renderResult: function () {
      var code = Basic.getParameterByName("code");
      var state = Basic.getParameterByName("state");

      if (code != "" && state != "") {
        $("#code").html(
            "<h3>Authorization Code</h3>" +
            "<p><code>" + code + "</code></p>");
      } else {
        var error = common.parseQueryString();
        $("#info").html(
            "<h3>Authorization Code Response</h3>" +
            "<pre>" + JSON.stringify(error, undefined, 2) + "</pre>"
        );
        return;
      }

      var client_id     = config.sample_app.client_agent.client_id;
      var client_realm  = config.sample_app.client_agent.client_realm;
      var client_secret = config.sample_app.client_agent.client_secret;

      // Use authorization code to retrieve access token & id_token.
      $.ajax({
        url: config.getSsoPath(config.sso_app.endpoints.access),
        type: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization",
              Basic.authHeader(client_id, client_secret));
        },
        data: {
          "grant_type":   "authorization_code",
          "code":         code,
          "realm":        client_realm,
          "redirect_uri": config.basic_profile.getRedirectUri()
        },
        accepts: "json"
      }).done(function (data) {
        $("#token").html(
            "<h3>Token Response</h3>" +
            "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
        );

        var idToken = data.id_token;
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
        var isValid =
            common.validateSignature(idToken[0], idToken[1], signature);

        if (!isValid) {
          $("#info").html("Invalid id_token signature");

          return;
        }

        var openamPath = config.getSsoPath("");

        // Validate id_token.
        // In 12, issuer path is /openam. In 13, issuer path is /openam/oauth2.
        if (payload.iss.lastIndexOf(openamPath, 0) !== 0) { // ~ startsWith
          $("#info").html("Invalid id_token issuer: " + payload.iss);

          return;
        }

        if (((payload.aud instanceof Array) &&
             (payload.aud.indexOf(client_id) == -1)) ||
            (payload.aud != client_id)) {
          $("#info").html("Invalid id_token audience: " + payload.aud);

          return;
        }

        if ((payload.aud instanceof Array) && (payload.azp != client_id)) {
          $("#info").html(
            "Invalid id_token authorized party: " + payload.azp);
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

        // acr (Authentication Context Class Reference) not requested

        // max_age not requested

        // Use the access token to get user information.
        var access_token = data.access_token.toString();
        $.ajax({
          url: server + openam + info,
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + access_token);
          }
        }).done(function (data) {
          $("#info").html(
              "<h3>End User Info</h3>" +
              "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
          );
        }).fail(function (data) {
          $("#info").html(
              "<p>Error obtaining user info:</p>" +
              "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
          );
        });
      }).fail(function (data) {
        $("#info").html(
            "<p>Error obtaining access token:</p>" +
            "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
        );
      });
    }
  };

  return Basic;
});
