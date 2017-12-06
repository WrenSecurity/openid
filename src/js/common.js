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
define(function (require, _exports, _module) {
  var CryptoJS = {
    HmacSHA256: require('crypto-js/hmac-sha256'),
    enc: {
      Base64: "crypto-js/enc-base64"
    }
  };

  var Common = {
    /* Returns a base64url-encoded version of the base64-encoded input
       string. */
    b64tob64u: function (string) {
      var result = string;

      result = result.replace(/\+/g, "-");
      result = result.replace(/\//g, "_");
      result = result.replace(/=/g, "");

      return result;
    },

    // http://stackoverflow.com/ has lots of useful snippets...
    encodeQueryData: function (data) {
      var ret = [];

      for (var d in data) {
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
      }

      return ret.join("&");
    },

    // To avoid cross-site scripting questions,
    // this demo should be in the same container
    // as the OpenID Connect provider (OpenAM).
    getBaseURL: function () {
      var protocol = window.location.protocol;
      var hostname = window.location.hostname;
      var port     = window.location.port;

      var url = protocol + "//" + hostname;

      if (port) {
        url += ":" + port;
      }

      return url;
    },

    /* Returns a map of query string parameters. */
    parseQueryString: function () {
      var query = {};
      var args  = document.location.search.substring(1).split('&');

      for (var arg in args) {
        var m = args[arg].split('=');

        query[decodeURIComponent(m[0])] = decodeURIComponent(m[1]);
      }

      return query;
    },

    /* Validates a JWS signature according to
       https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-33#section-5.2
       cheating a bit by taking the pre-encoded header and payload.
     */
    validateSignature: function (encodedHeader, encodedPayload,
                                          signature) {
      var signingInput = encodedHeader + "." + encodedPayload;
      var signed = CryptoJS.HmacSHA256(signingInput, client_secret);
      var encodedSigned = Common.b64tob64u(signed.toString(CryptoJS.enc.Base64));

      return encodedSigned == signature;
    }
  };

  return Common;
});
