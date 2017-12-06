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
 *     Copyright 2014 ForgeRock AS
 *     Portions Copyright 2017 Rosie Applications, Inc.
 *
 */
define(['./common', './config', 'jquery'], function (common, config, $) {
  var Mobile = {
    renderIntro: function () {
      var client_id     = config.sample_app.client_agent.client_id;
      var client_realm  = config.sample_app.client_agent.client_realm;
      var client_secret = config.sample_app.client_agent.client_secret;

      var acr_values  = config.mobile_connect_profile.acr_values;
      var nonce       = config.mobile_connect_profile.nonce;
      var login_hint  = config.mobile_connect_profile.login_hint;

      var redirect_uri = config.basic_profile.getRedirectUri();

      var authRequestParameters = {
        "response_type":  "code",
        "scope":          "openid profile",
        "client_id":      client_id,
        "redirect_uri":   redirect_uri,
        "state":          config.basic_profile.state,
        "acr_values":     acr_values,
        "nonce":          nonce,
        "login_hint":     login_hint
      };

      var url = config.getSsoAuthorizePath(authRequestParameters);

      var openam_uri = config.getSsoPath("");
      var sample_uri = config.getSamplePath("");

      $("#link").attr("href", url);

      $("#config").html(
          "<hr>"
          + "<h3>Prerequisite Configuration</h3>"

          + "<p>OpenAM should be running and configured as an "
          + "OpenID Provider (OP) in the top level realm, "
          + "and in the same container as this application.</p>"

          + "<p>In addition, configure the OP as follows:</p>"
          + "<ul>"
          + "<li>Map \"acr_value\" <code>" + acr_values + "</code> "
          + "to the <code>ldapService</code> auth chain</li>"
          + "<li>Set the default acr claim to <code>" + acr_values
          + "</code></li>"
          + "<li>Map the \"amr\" value <code>UID_PWD</code> to DataStore</li>"
          + "</ul>"

          + "<p>Furthermore, add the following "
          + "to LDAP User Attributes for the data store:</p>"
          + "<ul>"
          + "<li><code>createTimestamp</code></li>"
          + "<li><code>modifyTimestamp</code></li>"
          + "</ul>"

          + "<p>This sample GSMA Mobile Connect relying party "
          + "reuses the settings for the Basic Client sample, "
          + "and reuses the Basic Client redirect URI. "
          + "This sample adds additional settings for Mobile Connect.</p>"

          + "<p>Adjust the settings as necessary for your configuration.</p>"

          + "<p>Current settings from <code>config.js</code>:</p>"
          + "<table style='width: 100%; font-family: monospace'>"
          + "<tr><td>OpenAM URI</td><td>" + openam_uri + "</td></tr>"
          + "<tr><td>Sample App URI</td><td>" + sample_uri + "</td></tr>"
          + "<tr><td>client_id</td><td>" + client_id + "</td></tr>"
          + "<tr><td>client_secret</td><td>" + client_secret + "</td></tr>"
          + "<tr><td>redirect_uri</td><td>" + redirect_uri + "</td></tr>"
          + "</table>"

          + "<table style='width: 100%; font-family: monospace'>"
          + "<tr><td>acr_values</td><td>" + acr_values + "</td></tr>"
          + "<tr><td>nonce</td><td>" + nonce + "</td></tr>"
          + "<tr><td>login_hint</td><td>" + login_hint + "</td></tr>"
          + "</table>"

          + "<p>In OpenAM, create an OAuth 2.0 agent using the "
          + "<code>client_id</code>, <code>client_secret</code>, "
          + "and <code>redirect_uri</code>, and then edit the "
          + "configuration to add the scopes <code>openid</code> and "
          + "<code>profile</code>.</p>"

          + "<p>Furthermore, set ID Token Signed Response Algorithm "
          + "to <code>HS256</code>.</p>"

          + "<p>After you have configured everything, log out of "
          + "OpenAM. Then click the link to start the authorization "
          + "process.</p>"
      );
    }
  };

  return Mobile;
});
