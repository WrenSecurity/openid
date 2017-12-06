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
  var Register = {
    renderIntro: function () {
      var form = $("#form");

      form.html(
          "<form id=\"form\" action=\"#\">" +
          "<label>OpenAM URL" +
          "<input id=\"baseUrl\" value=\"" + common.getBaseURL() + "/openam\"" +
          "       name=\"base\" type=\"text\" /></label>" +
          "<label>Access Token (bearer token to POST registration)" +
          "<input id=\"bearerToken\" name=\"bearerToken\" type=\"text\" /></label>"
          +
          "<button type=\"submit\">Submit</button>" +
          "</form>"
      );

      $("#command").html(
          "<pre>$ curl --request POST --user \"myClientID:password\" " +
          "--data \"grant_type=password&amp;username=amadmin&amp;password=password\" "
          +
          common.getBaseURL() + "/openam/oauth2/access_token</pre>"
      );

      form.submit(function () {
        var baseUrl = $("#baseUrl").val();
        var configurationUrl = baseUrl + "/oauth2/.well-known/openid-configuration";
        var registrationUrl = baseUrl + "/oauth2/connect/register"; // Default
        /*
         * Dynamic registration requires an access token from the provider
         * that authorizes registration.
         *
         * This access token is requested out-of-band using a separate client
         * that is already registered.
         */
        var bearerToken = $("#bearerToken").val();

        $.ajax({
          url: configurationUrl,
          type: "GET"
        }).done(function (data) {
          $("#config").html(
              "<h3>Provider Configuration</h3>" +
              "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
          );

          registrationUrl = data["registration_endpoint"];

          $.ajax({
            url: registrationUrl,
            type: "POST",
            beforeSend: function (xhr) {
              if (bearerToken) {
                xhr.setRequestHeader("Authorization", "Bearer " + bearerToken);
              }
            },
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
              "redirect_uris":  [
                config.basic_profile.getRedirectUri(),
                config.implicit_profile.getRedirectUri()
              ],
              "client_name": "Dynamically Registered Client"
            })
          }).done(function (data) {
            $("#info").html(
                "<h3>Registration Response</h3>" +
                "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
            );
          }).fail(function (data) {
            $("#info").html(
                "<p>Error registering client with " +
                "provider at " + registrationUrl + "</p>" +
                "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
            );
          });
        }).fail(function (data) {
          $("#config").html(
              "<p>Error obtaining provider configuration at " +
              configurationUrl + "</p>" +
              "<pre>" + JSON.stringify(data, undefined, 2) + "</pre>"
          );

          return false;
        });

        return false; // Override normal submit behavior
      });
    }
  };

  return Register;
});
