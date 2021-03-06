// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Encodes a string in base64
 * @param {String} input The string to encode in base64.
 */
function encode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
         enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
         enc4 = 64;
      }

      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
         keyStr.charAt(enc3) + keyStr.charAt(enc4);
   } while (i < input.length);

   return output;
}

/**
 * Decodes a base64 string.
 * @param {String} input The string to decode.
 */
function decode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  var olda, oldb, oldc, oldd;
  for(var i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return [a, b, c, d];
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) { bkey = core_md5(bkey, key.length * chrsz); }

  var ipad = new Array(16), opad = new Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = [];
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
  {
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  }
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
  {
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  var triplet, j;
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16) |
              (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 ) |
              ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) { str += b64pad; }
      else { str += tab.charAt((triplet >> 6*(3-j)) & 0x3F); }
    }
  }
  return str;
}
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = new Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  var i, j, t, olda, oldb, oldc, oldd, olde;
  for (i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
    olde = e;

    for (j = 0; j < 80; j++)
    {
      if (j < 16) { w[j] = x[i + j]; }
      else { w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1); }
      t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return [a, b, c, d, e];
}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if (t < 20) { return (b & c) | ((~b) & d); }
  if (t < 40) { return b ^ c ^ d; }
  if (t < 60) { return (b & c) | (b & d) | (c & d); }
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if (bkey.length > 16) { bkey = core_sha1(bkey, key.length * chrsz); }

  var ipad = new Array(16), opad = new Array(16);
  for (var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = [];
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < str.length * chrsz; i += chrsz)
  {
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  }
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < bin.length * 32; i += chrsz)
  {
    str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  var triplet, j;
  for (var i = 0; i < binarray.length * 4; i += 3)
  {
    triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16) |
              (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 ) |
               ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
    for (j = 0; j < 4; j++)
    {
      if (i * 8 + j * 6 > binarray.length * 32) { str += b64pad; }
      else { str += tab.charAt((triplet >> 6*(3-j)) & 0x3F); }
    }
  }
  return str;
}
/*
    This program is distributed under the terms of the MIT license.
    Please see the LICENSE file for details.

    Copyright 2006-2008, OGG, LLC
*/

/** File: strophe.js
 *  A JavaScript library for XMPP BOSH.
 * 
 *  This is the JavaScript version of the Strophe library.  Since JavaScript
 *  has no facilities for persistent TCP connections, this library uses
 *  Bidirectional-streams Over Synchronous HTTP (BOSH) to emulate
 *  a persistent, stateful, two-way connection to an XMPP server.  More
 *  information on BOSH can be found in XEP 124.
 */

/** PrivateFunction: Function.prototype.bind
 *  Bind a function to an instance.
 * 
 *  This Function object extension method creates a bound method similar
 *  to those in Python.  This means that the 'this' object will point
 *  to the instance you want.  See 
 *  <a href='http://benjamin.smedbergs.us/blog/2007-01-03/bound-functions-and-function-imports-in-javascript/'>Bound Functions and Function Imports in JavaScript</a>
 *  for a complete explanation.
 * 
 *  This extension already exists in some browsers (namely, Firefox 3), but
 *  we provide it to support those that don't.
 * 
 *  Parameters:
 *    (Object) obj - The object that will become 'this' in the bound function.
 *  
 *  Returns:
 *    The bound function.
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (obj)
    {
	var func = this;
	return function () { return func.apply(obj, arguments); };
    };
}

/** PrivateFunction: Function.prototype.prependArg
 *  Prepend an argument to a function.
 *
 *  This Function object extension method returns a Function that will
 *  invoke the original function with an argument prepended.  This is useful 
 *  when some object has a callback that needs to get that same object as 
 *  an argument.  The following fragment illustrates a simple case of this
 *  > var obj = new Foo(this.someMethod);</code></blockquote>
 *  
 *  Foo's constructor can now use func.prependArg(this) to ensure the 
 *  passed in callback function gets the instance of Foo as an argument.  
 *  Doing this without prependArg would mean not setting the callback
 *  from the constructor.
 * 
 *  This is used inside Strophe for passing the Strophe.Request object to
 *  the onreadystatechange handler of XMLHttpRequests.
 *
 *  Parameters:
 *    arg - The argument to pass as the first parameter to the function.
 *
 *  Returns:
 *    A new Function which calls the original with the prepended argument.
 */
if (!Function.prototype.prependArg) {
    Function.prototype.prependArg = function (arg)
    {
	var func = this;
	
	return function () { 
	    var newargs = [arg];
	    for (var i = 0; i < arguments.length; i++)
		newargs.push(arguments[i]);
	    return func.apply(this, newargs); 
	};
    };
}

/** PrivateFunction: Array.prototype.indexOf
 *  Return the index of an object in an array.
 *
 *  This function is not supplied by some JavaScript implementations, so
 *  we provide it if it is missing.  This code is from:
 *  http://developer.mozilla.org/En/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
 *
 *  Parameters:
 *    (Object) elt - The object to look for.
 *    (Integer) from - The index from which to start looking. (optional).
 * 
 *  Returns:
 *    The index of elt in the array or -1 if not found.
 */
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(elt /*, from*/)
    {
	var len = this.length;
	
	var from = Number(arguments[1]) || 0;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0)
	    from += len;
	
	for (; from < len; from++) {
	    if (from in this && this[from] === elt)
		return from;
	}

	return -1;
    };
}


/** Function: $build
 *  Create a Strophe.Builder.
 *  This is an alias for 'new Strophe.Builder(name, attrs)'.
 *
 *  Parameters:
 *    (String) name - The root element name.
 *    (Object) attrs - The attributes for the root element in object notation.
 * 
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $build(name, attrs) { return new Strophe.Builder(name, attrs); }
/** Function: $msg
 *  Create a Strophe.Builder with a <message/> element as the root.
 *
 *  Parmaeters:
 *    (Object) attrs - The <message/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $msg(attrs) { return new Strophe.Builder("message", attrs); }
/** Function: $iq
 *  Create a Strophe.Builder with an <iq/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <iq/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $iq(attrs) { return new Strophe.Builder("iq", attrs); }
/** Function: $pres
 *  Create a Strophe.Builder with a <presence/> element as the root.
 *
 *  Parameters:
 *    (Object) attrs - The <presence/> element attributes in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder object.
 */
function $pres(attrs) { return new Strophe.Builder("presence", attrs); }

/** Class: Strophe
 *  An object container for all Strophe library functions.
 *
 *  This class is just a container for all the objects and constants
 *  used in the library.  It is not meant to be instantiated, but to 
 *  provide a namespace for library objects, constants, and functions.
 */
Strophe = {
    /** Constants: XMPP Namespace Constants
     *  Common namespace constants from the XMPP RFCs and XEPs.
     *
     *  NS.HTTPBIND - HTTP BIND namespace from XEP 124.
     *  NS.BOSH - BOSH namespace from XEP 206.
     *  NS.CLIENT - Main XMPP client namespace.
     *  NS.AUTH - Legacy authentication namespace.
     *  NS.ROSTER - Roster operations namespace.
     *  NS.PROFILE - Profile namespace.
     *  NS.DISCO_INFO - Service discovery info namespace from XEP 30.
     *  NS.DISCO_ITEMS - Service discovery items namespace from XEP 30.
     *  NS.MUC - Multi-User Chat namespace from XEP 45.
     *  NS.SASL - XMPP SASL namespace from RFC 3920.
     *  NS.STREAM - XMPP Streams namespace from RFC 3920.
     *  NS.BIND - XMPP Binding namespace from RFC 3920.
     *  NS.SESSION - XMPP Session namespace from RFC 3920.
     */
    NS: {
	HTTPBIND: "http://jabber.org/protocol/httpbind",
	BOSH: "urn:xmpp:xbosh",
	CLIENT: "jabber:client",
	AUTH: "jabber:iq:auth",
	ROSTER: "jabber:iq:roster",
	PROFILE: "jabber:iq:profile",
	DISCO_INFO: "http://jabber.org/protocol/disco#info",
	DISCO_ITEMS: "http://jabber.org/protocol/disco#items",
	MUC: "http://jabber.org/protocol/muc",
	SASL: "urn:ietf:params:xml:ns:xmpp-sasl",
	STREAM: "http://etherx.jabber.org/streams",
	BIND: "urn:ietf:params:xml:ns:xmpp-bind",
	SESSION: "urn:ietf:params:xml:ns:xmpp-session",
	VERSION: "jabber:iq:version"
    },
    
    /** Constants: Connection Status Constants
     *  Connection status constants for use by the connection handler
     *  callback.
     *  
     *  Status.ERROR - An error has occurred
     *  Status.CONNECTING - The connection is currently being made
     *  Status.CONNFAIL - The connection attempt failed
     *  Status.AUTHENTICATING - The connection is authenticating
     *  Status.AUTHFAIL - The authentication attempt failed
     *  Status.CONNECTED - The connection has succeeded
     *  Status.DISCONNECTED - The connection has been terminated
     *  Status.DISCONNECTING - The connection is currently being terminated
     */
    Status: {
	ERROR: 0,
	CONNECTING: 1,
	CONNFAIL: 2,
	AUTHENTICATING: 3,
	AUTHFAIL: 4,
	CONNECTED: 5,
	DISCONNECTED: 6,
	DISCONNECTING: 7
    },

    /** Constants: Log Level Constants
     *  Logging level indicators.
     *
     *  LogLevel.DEBUG - Debug output
     *  LogLevel.INFO - Informational output
     *  LogLevel.WARN - Warnings
     *  LogLevel.ERROR - Errors
     *  LogLevel.FATAL - Fatal errors
     */
    LogLevel: {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	FATAL: 4
    },

    /** PrivateConstants: DOM Element Type Constants
     *  DOM element types.
     *
     *  ElementType.NORMAL - Normal element.
     *  ElementType.TEXT - Text data element.
     */
    ElementType: {
	NORMAL: 1,
	TEXT: 3
    },

    /** PrivateConstants: Timeout Values
     *  Timeout values for error states.  These values are in seconds.  
     *  These should not be changed unless you know exactly what you are 
     *  doing.
     *
     *  TIMEOUT - Time to wait for a request to return.  This defaults to
     *      70 seconds.
     *  SECONDARY_TIMEOUT - Time to wait for immediate request return. This
     *      defaults to 7 seconds.
     */
    TIMEOUT: 70,
    SECONDARY_TIMEOUT: 7,

    /** Function: forEachChild
     *  Map a function over some or all child elements of a given element.
     *
     *  This is a small convenience function for mapping a function over
     *  some or all of the children of an element.  If elemName is null, all
     *  children will be passed to the function, otherwise only children
     *  whose tag names match elemName will be passed.
     *
     *  Parameters:
     *    (XMLElement) elem - The element to operate on.
     *    (String) elemName - The child element tag name filter.
     *    (Function) func - The function to apply to each child.  This 
     *      function should take a single argument, a DOM element.
     */
    forEachChild: function (elem, elemName, func) 
    {
	var i, childNode;
	
	for (i = 0; i < elem.childNodes.length; i++) {
            childNode = elem.childNodes[i];
            if (childNode.nodeType == Strophe.ElementType.NORMAL &&
                (!elemName || this.isTagEqual(childNode, elemName))) {
                func(childNode);
	    }
	}
    },

    /** Function: isTagEqual
     *  Compare an element's tag name with a string.
     *
     *  This function is case insensitive.
     *
     *  Parameters:
     *    (XMLElement) el - A DOM element.
     *    (String) name - The element name.
     * 
     *  Returns:
     *    true if the element's tag name matches _el_, and false
     *    otherwise.
     */
    isTagEqual: function (el, name)
    {
	return el.tagName.toLowerCase() == name.toLowerCase();
    },

    /** Function: xmlElement
     *  Create an XML DOM element.
     *
     *  This function creates an XML DOM element correctly across all 
     *  implementations. Specifically the Microsoft implementation of
     *  document.createElement makes DOM elements with 43+ default attributes
     *  unless elements are created with the ActiveX object Microsoft.XMLDOM.
     *
     *  Most DOMs force element names to lowercase, so we use the
     *  _realname attribute on the created element to store the case
     *  sensitive name.  This is required to generate proper XML for
     *  things like vCard avatars (XEP 153).  This attribute is stripped
     *  out before being sent over the wire or serialized, but you may
     *  notice it during debugging.
     *
     *  Parameters:
     *    (String) name - The name for the element.
     *    (Array) attrs - An optional array of key/value pairs to use as 
     *      element attributes in the following format [['key1', 'value1'], 
     *      ['key2', 'value2']]
     *    (String) text - The text child data for the element.
     *
     *  Returns:
     *    A new XML DOM element.
     */
    xmlElement: function (name)
    {
	// FIXME: this should also support attrs argument in object notation
	if (!name) { return null; }

	var node = null;
	if (window.ActiveXObject) {
	    node = new ActiveXObject("Microsoft.XMLDOM").createElement(name);
	} else {
	    node = document.createElement(name);
	}
	// use node._realname to store the case-sensitive version of the tag
	// name, since some browsers will force tagnames to all lowercase.
	// this is needed for the <vCard/> tag in XMPP specifically.
	if (node.tagName != name)
	    node.setAttribute("_realname", name);
	
	// FIXME: this should throw errors if args are the wrong type or
        // there are more than two optional args 
	var a, i;
	for (a = 1; a < arguments.length; a++) {
	    if (!arguments[a]) { continue; }
	    if (typeof(arguments[a]) == "string" ||
		typeof(arguments[a]) == "number") {
		node.appendChild(Strophe.xmlTextNode(arguments[a]));
	    } else if (typeof(arguments[a]) == "object" && 
		       typeof(arguments[a]['sort']) == "function") {
		for (i = 0; i < arguments[a].length; i++) {
		    if (typeof(arguments[a][i]) == "object" && 
			typeof(arguments[a][i]['sort']) == "function") {
			node.setAttribute(arguments[a][i][0], 
					  arguments[a][i][1]);
		    }
		}
	    }
	}

	return node;
    },

    /** Function: xmlTextNode
     *  Creates an XML DOM text node.
     *
     *  Provides a cross implementation version of document.createTextNode.
     *
     *  Parameters:
     *    (String) text - The content of the text node.
     *
     *  Returns:
     *    A new XML DOM text node.
     */
    xmlTextNode: function (text)
    {
	if (window.ActiveXObject) {
	    return new ActiveXObject("Microsoft.XMLDOM").createTextNode(text);
	} else {
	    return document.createTextNode(text);
	}
    },

    /** Function: getText
     *  Get the concatenation of all text children of an element.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    A String with the concatenated text of all text element children.
     */
    getText: function (elem)
    {
	if (!elem) return null;

	var str = "";
	if (elem.childNodes.length === 0 && elem.nodeType == 
	    Strophe.ElementType.TEXT) {
	    str += elem.nodeValue;
	}

	for (var i = 0; i < elem.childNodes.length; i++) {
	    if (elem.childNodes[i].nodeType == Strophe.ElementType.TEXT) {
		str += elem.childNodes[i].nodeValue;
	    }
	}

	return str;
    },

    /** Function: copyElement
     *  Copy an XML DOM element.
     *
     *  This function copies a DOM element and all its descendants and returns
     *  the new copy.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    A new, copied DOM element tree.
     */
    copyElement: function (elem)
    {
	var i, el;
	if (elem.nodeType == Strophe.ElementType.NORMAL) {
	    el = Strophe.xmlElement(elem.tagName);
	    
	    for (i = 0; i < elem.attributes.length; i++) {
		el.setAttribute(elem.attributes[i].nodeName.toLowerCase(),
				elem.attributes[i].value);
	    }
	    
	    for (i = 0; i < elem.childNodes.length; i++) {
		el.appendChild(Strophe.copyElement(elem.childNodes[i]));
	    }
	} else if (elem.nodeType == Strophe.ElementType.TEXT) {
	    el = Strophe.xmlTextNode(elem.nodeValue);
	}

	return el;
    },

    /** Function: escapeJid
     *  Escape a JID.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    An escaped JID String.
     */
    escapeJid: function (jid)
    {
	var user = jid.split("@");
	if (user.length == 1) 
	    // no user so nothing to escape
	    return jid;

	var host = user.splice(user.length - 1, 1)[0];
	user = user.join("@")
	    .replace(/^\s+|\s+$/g, '')
	    .replace(/\\/g,  "\\5c")
	    .replace(/ /g,   "\\20")
	    .replace(/\"/g,  "\\22")
	    .replace(/\&/g,  "\\26")
	    .replace(/\'/g,  "\\27")
	    .replace(/\//g,  "\\2f")
	    .replace(/:/g,   "\\3a")
	    .replace(/</g,   "\\3c")
	    .replace(/>/g,   "\\3e")
	    .replace(/@/g,   "\\40");
	
	return [user, host].join("@");
    },

    /** Function: unescapeJid
     *  Unescape a JID.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    An unescaped JID String.
     */
    unescapeJid: function (jid)
    {
	return jid.replace(/\\20/g, " ")
	    .replace(/\\22/g, '"')
	    .replace(/\\26/g, "&")
	    .replace(/\\27/g, "'")
	    .replace(/\\2f/g, "/")
	    .replace(/\\3a/g, ":")
	    .replace(/\\3c/g, "<")
	    .replace(/\\3e/g, ">")
	    .replace(/\\40/g, "@")
	    .replace(/\\5c/g, "\\");
    },

    /** Function: getNodeFromJid
     *  Get the node portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the node.
     */
    getNodeFromJid: function (jid)
    {
	if (jid.indexOf("@") < 0)
	    return null;
	return Strophe.escapeJid(jid).split("@")[0];
    },

    /** Function: getDomainFromJid
     *  Get the domain portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the domain.
     */
    getDomainFromJid: function (jid)
    {
	var bare = Strophe.escapeJid(Strophe.getBareJidFromJid(jid));
	if (bare.indexOf("@") < 0)
	    return bare;
	else
	    return bare.split("@")[1];
    },

    /** Function: getResourceFromJid
     *  Get the resource portion of a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the resource.
     */
    getResourceFromJid: function (jid)
    {
	var s = Strophe.escapeJid(jid).split("/");
	if (s.length < 2) return null;
	return s[1];
    },

    /** Function: getBareJidFromJid
     *  Get the bare JID from a JID String.
     *
     *  Parameters:
     *    (String) jid - A JID.
     *
     *  Returns:
     *    A String containing the bare JID.
     */
    getBareJidFromJid: function (jid)
    {
	return this.escapeJid(jid).split("/")[0];
    },

    /** Function: log
     *  User overrideable logging function.
     *
     *  This function is called whenever the Strophe library calls any
     *  of the logging functions.  The default implementation of this 
     *  function does nothing.  If client code wishes to handle the logging
     *  messages, it should override this with
     *  > Strophe.log = function (level, msg) {
     *  >   (user code here)
     *  > };
     *
     *  Please note that data sent and received over the wire is logged
     *  via Strophe.Connection.rawInput() and Strophe.Connection.rawOutput().
     *
     *  The different levels and their meanings are
     *
     *    DEBUG - Messages useful for debugging purposes.
     *    INFO - Informational messages.  This is mostly information like
     *      'disconnect was called' or 'SASL auth succeeded'.
     *    WARN - Warnings about potential problems.  This is mostly used
     *      to report transient connection errors like request timeouts.
     *    ERROR - Some error occurred.
     *    FATAL - A non-recoverable fatal error occurred.
     *
     *  Parameters:
     *    (Integer) level - The log level of the log message.  This will 
     *      be one of the values in Strophe.LogLevel.
     *    (String) msg - The log message.
     */
    log: function (level, msg)
    {
	return;
    },

    /** Function: debug
     *  Log a message at the Strophe.LogLevel.DEBUG level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    debug: function(msg)
    {
	this.log(this.LogLevel.DEBUG, msg);
    },

    /** Function: info
     *  Log a message at the Strophe.LogLevel.INFO level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    info: function (msg)
    {
	this.log(this.LogLevel.INFO, msg);
    },

    /** Function: warn
     *  Log a message at the Strophe.LogLevel.WARN level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    warn: function (msg)
    {
	this.log(this.LogLevel.WARN, msg);
    },

    /** Function: error
     *  Log a message at the Strophe.LogLevel.ERROR level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    error: function (msg)
    {
	this.log(this.LogLevel.ERROR, msg);
    },

    /** Function: fatal
     *  Log a message at the Strophe.LogLevel.FATAL level.
     *
     *  Parameters:
     *    (String) msg - The log message.
     */
    fatal: function (msg)
    {
	this.log(this.LogLevel.FATAL, msg);
    },

    /** Function: serialize
     *  Render a DOM element and all descendants to a String.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    The serialized element tree as a String.
     */
    serialize: function (elem)
    {
	var result;

	if (!elem) return null;

	var nodeName = elem.nodeName.toLowerCase();
	var i, child;

	if (elem.getAttribute("_realname")) {
	    nodeName = elem.getAttribute("_realname");
	}

	result = "<" + nodeName;
	for (i = 0; i < elem.attributes.length; i++) {
               if(elem.attributes[i].nodeName != "_realname") {
		 result += " " + elem.attributes[i].nodeName.toLowerCase() + 
	        "='" + elem.attributes[i].value
	            .replace("'", "&#39;").replace("&", "&#x26;") + "'";
	       }
	}

	if (elem.childNodes.length > 0) {
	    result += ">";
	    for (i = 0; i < elem.childNodes.length; i++) {
		child = elem.childNodes[i];
		if (child.nodeType == Strophe.ElementType.NORMAL) {
		    // normal element, so recurse
		    result += Strophe.serialize(child);
		} else if (child.nodeType == Strophe.ElementType.TEXT) {
		    // text element
		    result += child.nodeValue;
		}
	    }
	    result += "</" + nodeName + ">";
	} else {
	    result += "/>";
	}

	return result;
    },

    /** PrivateVariable: _requestId
     *  _Private_ variable that keeps track of the request ids for 
     *  connections.
     */
    _requestId: 0
};

/** Class: Strophe.Builder
 *  XML DOM builder.
 *
 *  This object provides an interface similar to JQuery but for building
 *  DOM element easily and rapidly.  All the functions except for toString()
 *  and tree() return the object, so calls can be chained.  Here's an
 *  example using the $iq() builder helper.
 *  > $iq({to: 'you': from: 'me': type: 'get', id: '1'})
 *  >     .c('query', {xmlns: 'strophe:example'})
 *  >     .c('example')
 *  >     .toString()
 *  The above generates this XML fragment
 *  > <iq to='you' from='me' type='get' id='1'>
 *  >   <query xmlns='strophe:example'>
 *  >     <example/>
 *  >   </query>
 *  > </iq>
 *  The corresponding DOM manipulations to get a similar fragment would be
 *  a lot more tedious and probably involve several helper variables.
 *
 *  Since adding children makes new operations operate on the child, up()
 *  is provided to traverse up the tree.  To add two children, do
 *  > builder.c('child1', ...).up().c('child2', ...)
 *  The next operation on the Builder will be relative to the second child.
 */

/** Constructor: Strophe.Builder
 *  Create a Strophe.Builder object.
 *
 *  The attributes should be passed in object notation.  For example
 *  > var b = new Builder('message', {to: 'you', from: 'me'});
 *  or
 *  > var b = new Builder('messsage', {'xml:lang': 'en'});
 *
 *  Parameters:
 *    (String) name - The name of the root element.
 *    (Object) attrs - The attributes for the root element in object notation.
 *
 *  Returns:
 *    A new Strophe.Builder.
 */
Strophe.Builder = function (name, attrs)
{
    // Set correct namespace for jabber:client elements
    if (name == "presence" || name == "message" || name == "iq") {
        if (attrs && !attrs.xmlns)
            attrs.xmlns = Strophe.NS.CLIENT;
        else if (!attrs)
            attrs = {xmlns: Strophe.NS.CLIENT};
    }

    // Holds the tree being built.
    this.nodeTree = this._makeNode(name, attrs);

    // Points to the current operation node.
    this.node = this.nodeTree;
};

Strophe.Builder.prototype = {
    /** Function: tree
     *  Return the DOM tree.
     *
     *  This function returns the current DOM tree as an element object.  This
     *  is suitable for passing to functions like Strophe.Connection.send().
     *
     *  Returns:
     *    The DOM tree as a element object.
     */
    tree: function ()
    {
	return this.nodeTree;
    },

    /** Function: toString
     *  Serialize the DOM tree to a String.
     *
     *  This function returns a string serialization of the current DOM
     *  tree.  It is often used internally to pass data to a 
     *  Strophe.Request object.
     *
     *  Returns:
     *    The serialized DOM tree in a String.
     */
    toString: function ()
    {
	return Strophe.serialize(this.nodeTree);
    },

    /** Function: up
     *  Make the current parent element the new current element.
     *
     *  This function is often used after c() to traverse back up the tree.
     *  For example, to add two children to the same element
     *  > builder.c('child1', {}).up().c('child2', {});
     *
     *  Returns:
     *    The Stophe.Builder object.
     */
    up: function ()
    {
	this.node = this.node.parentNode;
	return this;
    },

    /** Function: attrs
     *  Add or modify attributes of the current element.
     *  
     *  The attributes should be passed in object notation.  This function
     *  does not move the current element pointer.
     *
     *  Parameters:
     *    (Object) moreattrs - The attributes to add/modify in object notation.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    attrs: function (moreattrs)
    {
	for (var k in moreattrs)
	    this.node.setAttribute(k, moreattrs[k]);
	return this;
    },

    /** Function: c
     *  Add a child to the current element and make it the new current 
     *  element.
     *
     *  This function moves the current element pointer to the child.  If you
     *  need to add another child, it is necessary to use up() to go back
     *  to the parent in the tree.
     *
     *  Parameters:
     *    (String) name - The name of the child.
     *    (Object) attrs - The attributes of the child in object notation.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    c: function (name, attrs)
    {
	var child = this._makeNode(name, attrs);
	this.node.appendChild(child);
	this.node = child;
	return this;
    },

    /** Function: cnode
     *  Add a child to the current element and make it the new current
     *  element.
     *
     *  This function is the same as c() except that instead of using a
     *  name and an attributes object to create the child it uses an
     *  existing DOM element object.
     *
     *  Parameters:
     *    (XMLElement) elem - A DOM element.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    cnode: function (elem)
    {
	this.node.appendChild(elem);
	this.node = elem;
	return this;
    },

    /** Function: t
     *  Add a child text element.
     *
     *  This *does not* make the child the new current element since there
     *  are no children of text elements.
     *
     *  Parameters:
     *    (String) text - The text data to append to the current element.
     *
     *  Returns:
     *    The Strophe.Builder object.
     */
    t: function (text)
    {
	var child = Strophe.xmlTextNode(text);
	this.node.appendChild(child);
	return this;
    },

    /** PrivateFunction: _makeNode
     *  _Private_ helper function to create a DOM element.
     *
     *  Parameters:
     *    (String) name - The name of the new element.
     *    (Object) attrs - The attributes for the new element in object 
     *      notation.
     *
     *  Returns:
     *    A new DOM element.
     */
    _makeNode: function (name, attrs) 
    {
	var node = Strophe.xmlElement(name);
	for (var k in attrs)
	    node.setAttribute(k, attrs[k]);
	return node;
    }
};


/** PrivateClass: Strophe.Handler
 *  _Private_ helper class for managing stanza handlers.
 *
 *  A Strophe.Handler encapsulates a user provided callback function to be
 *  executed when matching stanzas are received by the connection.
 *  Handlers can be either one-off or persistant depending on their 
 *  return value. Returning true will cause a Handler to remain active, and
 *  returning false will remove the Handler.
 *
 *  Users will not use Strophe.Handler objects directly, but instead they
 *  will use Strophe.Connection.addHandler() and
 *  Strophe.Connection.deleteHandler().
 */

/** PrivateConstructor: Strophe.Handler
 *  Create and initialize a new Strophe.Handler.
 *
 *  Parameters:
 *    (Function) handler - A function to be executed when the handler is run.
 *    (String) ns - The namespace to match.
 *    (String) name - The element name to match.
 *    (String) type - The element type to match.
 *    (String) id - The element id attribute to match.
 *    (String) from - The element from attribute to match.
 *
 *  Returns:
 *    A new Strophe.Handler object.
 */
Strophe.Handler = function (handler, ns, name, type, id, from)
{
    this.handler = handler;
    this.ns = ns;
    this.name = name;
    this.type = type;
    this.id = id;
    this.from = from;
    
    // whether the handler is a user handler or a system handler
    this.user = true;
};

Strophe.Handler.prototype = {
    /** PrivateFunction: isMatch
     *  Tests if a stanza matches the Strophe.Handler.
     *
     *  Parameters:
     *    (XMLElement) elem - The XML element to test.
     *
     *  Returns:
     *    true if the stanza matches and false otherwise.
     */
    isMatch: function (elem)
    {
	var nsMatch, i;

	nsMatch = false;
	if (!this.ns) {
	    nsMatch = true;
	} else {
	    var self = this;
	    Strophe.forEachChild(elem, null, function (elem) {
		if (elem.getAttribute("xmlns") == self.ns)
		    nsMatch = true;
	    });

	    nsMatch = nsMatch || elem.getAttribute("xmlns") == this.ns;
	}

	if (nsMatch &&
	    (!this.name || Strophe.isTagEqual(elem, this.name)) &&
	    (!this.type || elem.getAttribute("type") == this.type) &&
	    (!this.id || elem.getAttribute("id") == this.id) &&
	    (!this.from || elem.getAttribute("from") == this.from)) {
		return true;
	}

	return false;
    },

    /** PrivateFunction: run
     *  Run the callback on a matching stanza.
     *
     *  Parameters:
     *    (XMLElement) elem - The DOM element that triggered the 
     *      Strophe.Handler.
     *
     *  Returns:
     *    A boolean indicating if the handler should remain active.
     */
    run: function (elem)
    {
	var result = null;
	try {
	    result = this.handler(elem);
	} catch (e) {
	    if (e.sourceURL) {
		Strophe.fatal("error: " + this.handler + 
			      " " + e.sourceURL + ":" + 
			      e.line + " - " + e.name + ": " + e.message);
	    } else if (e.fileName) {
		if (typeof(console) != "undefined") {
		    console.trace();
		    console.error(this.handler, " - error - ", e, e.message);
		}
		Strophe.fatal("error: " + this.handler + " " + 
			      e.fileName + ":" + e.lineNumber + " - " + 
			      e.name + ": " + e.message);
	    } else {
		Strophe.fatal("error: " + this.handler);
	    }
	    
	    throw e;
	}

	return result;
    },

    /** PrivateFunction: toString
     *  Get a String representation of the Strophe.Handler object.
     *
     *  Returns:
     *    A String.
     */
    toString: function ()
    {
	return "{Handler: " + this.handler + "(" + this.name + "," +
            this.id + "," + this.ns + ")}";
    }
};

/** PrivateClass: Strophe.TimedHandler
 *  _Private_ helper class for managing timed handlers.
 * 
 *  A Strophe.TimedHandler encapsulates a user provided callback that
 *  should be called after a certain period of time or at regular
 *  intervals.  The return value of the callback determines whether the
 *  Strophe.TimedHandler will continue to fire.
 *
 *  Users will not use Strophe.TimedHandler objects directly, but instead 
 *  they will use Strophe.Connection.addTimedHandler() and
 *  Strophe.Connection.deleteTimedHandler().
 */

/** PrivateConstructor: Strophe.TimedHandler
 *  Create and initialize a new Strophe.TimedHandler object.
 *
 *  Parameters:
 *    (Integer) period - The number of milliseconds to wait before the
 *      handler is called.
 *    (Function) handler - The callback to run when the handler fires.  This
 *      function should take no arguments.
 *
 *  Returns:
 *    A new Strophe.TimedHandler object.
 */
Strophe.TimedHandler = function (period, handler)
{
    this.period = period;
    this.handler = handler;
    
    this.lastCalled = new Date().getTime();
    this.user = true;
};

Strophe.TimedHandler.prototype = {
    /** PrivateFunction: run
     *  Run the callback for the Strophe.TimedHandler.
     *
     *  Returns:
     *    true if the Strophe.TimedHandler should be called again, and false
     *      otherwise.
     */
    run: function ()
    {
	this.lastCalled = new Date().getTime();
	return this.handler();
    },

    /** PrivateFunction: reset
     *  Reset the last called time for the Strophe.TimedHandler.
     */
    reset: function ()
    {
	this.lastCalled = new Date().getTime();
    },

    /** PrivateFunction: toString
     *  Get a string representation of the Strophe.TimedHandler object.
     *
     *  Returns:
     *    The string representation.
     */
    toString: function ()
    {
	return "{TimedHandler: " + this.handler + "(" + this.period +")}";
    }
};

/** PrivateClass: Strophe.Request
 *  _Private_ helper class that provides a cross implementation abstraction 
 *  for a BOSH related XMLHttpRequest.
 *
 *  The Strophe.Request class is used internally to encapsulate BOSH request
 *  information.  It is not meant to be used from user's code.
 */

/** PrivateConstructor: Strophe.Request
 *  Create and initialize a new Strophe.Request object.
 *
 *  Parameters:
 *    (String) data - The data to be sent in the request.
 *    (Function) func - The function that will be called when the
 *      XMLHttpRequest readyState changes.
 *    (Integer) rid - The BOSH rid attribute associated with this request.
 *    (Integer) sends - The number of times this same request has been
 *      sent.
 */
Strophe.Request = function (data, func, rid, sends)
{
    this.id = ++Strophe._requestId;
    this.data = data;
    // save original function in case we need to make a new request
    // from this one.
    this.origFunc = func;
    this.func = func;
    this.rid = rid;
    this.date = NaN;
    this.sends = sends || 0;
    this.abort = false;
    this.dead = null;
    this.age = function () {
	if (!this.date) return 0;
	var now = new Date();
	return (now - this.date) / 1000;
    };
    this.timeDead = function () {
	if (!this.dead) return 0;
	var now = new Date();
	return (now - this.dead) / 1000;
    };
    this.xhr = this._newXHR();
};

Strophe.Request.prototype = {
    /** PrivateFunction: getResponse
     *  Get a response from the underlying XMLHttpRequest.
     *
     *  This function attempts to get a response from the request and checks
     *  for errors.
     *
     *  Throws:
     *    "parsererror" - A parser error occured.
     *
     *  Returns:
     *    The DOM element tree of the response.
     */
    getResponse: function ()
    {
	var node = null;
	if (this.xhr.responseXML && this.xhr.responseXML.documentElement) {
	    node = this.xhr.responseXML.documentElement;
	    if (node.tagName == "parsererror") {
		Strophe.error("invalid response received");
		Strophe.error("responseText: " + this.xhr.responseText);
		Strophe.error("responseXML: " + 
			      Strophe.serialize(this.xhr.responseXML));
		throw "parsererror";
	    }
	} else if (this.xhr.responseText) {
	    Strophe.error("invalid response received");
	    Strophe.error("responseText: " + this.xhr.responseText);
	    Strophe.error("responseXML: " + 
			  Strophe.serialize(this.xhr.responseXML));
	}
	
	return node;
    },

    /** PrivateFunction: _newXHR
     *  _Private_ helper function to create XMLHttpRequests.
     *
     *  This function creates XMLHttpRequests across all implementations.
     * 
     *  Returns:
     *    A new XMLHttpRequest.
     */
    _newXHR: function ()
    {
	var xhr = null;
	if (window.XMLHttpRequest) {
	    xhr = new XMLHttpRequest();
	    if (xhr.overrideMimeType) {
		xhr.overrideMimeType("text/xml");
	    }
	} else if (window.ActiveXObject) {
	    xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
		
	xhr.onreadystatechange = this.func.prependArg(this);

	return xhr;
    }
};

/** Class: Strophe.Connection
 *  XMPP Connection manager.
 *
 *  Thie class is the main part of Strophe.  It manages a BOSH connection
 *  to an XMPP server and dispatches events to the user callbacks as
 *  data arrives.  It supports SASL PLAIN, SASL DIGEST-MD5, and legacy
 *  authentication.
 *
 *  After creating a Strophe.Connection object, the user will typically
 *  call connect() with a user supplied callback to handle connection level
 *  events like authentication failure, disconnection, or connection 
 *  complete.
 * 
 *  The user will also have several event handlers defined by using 
 *  addHandler() and addTimedHandler().  These will allow the user code to
 *  respond to interesting stanzas or do something periodically with the
 *  connection.  These handlers will be active once authentication is 
 *  finished.
 *
 *  To send data to the connection, use send().
 */

/** Constructor: Strophe.Connection
 *  Create and initialize a Strophe.Connection object.
 *
 *  Parameters:
 *    (String) service - The BOSH service URL.
 *
 *  Returns:
 *    A new Strophe.Connection object.
 */
Strophe.Connection = function (service)
{
    /* The path to the httpbind service. */
    this.service = service;
    /* The connected JID. */
    this.jid = "";
    /* request id for body tags */
    this.rid = Math.floor(Math.random() * 4294967295);
    /* The current session ID. */
    this.sid = null;
    this.streamId = null;
    
    // SASL
    this.do_session = false;
    this.do_bind = false;
    
    // handler lists
    this.timedHandlers = [];
    this.handlers = [];
    this.removeTimeds = [];
    this.removeHandlers = [];
    this.addTimeds = [];
    this.addHandlers = [];
    
    this._idleTimeout = null;
    this._disconnectTimeout = null;
    
    this.authenticated = false;
    this.disconnecting = false;
    this.connected = false;
    
    this.errors = 0;

    this.paused = false;

    // default BOSH window
    this.window = 5;
    
    this._data = [];
    this._requests = [];
    this._uniqueId = Math.round(Math.random() * 10000);

    this._sasl_success_handler = null;
    this._sasl_failure_handler = null;
    this._sasl_challenge_handler = null;
    
    // setup onIdle callback every 1/10th of a second
    this._idleTimeout = setTimeout(this._onIdle.bind(this), 100);
};

Strophe.Connection.prototype = {
    /** Function: reset
     *  Reset the connection.
     *
     *  This function should be called after a connection is disconnected
     *  before that connection is reused.
     */
    reset: function ()
    {
	this.rid = Math.floor(Math.random() * 4294967295);
	
	this.sid = null;
	this.streamId = null;
	
	// SASL
	this.do_session = false;
	this.do_bind = false;
	
	// handler lists
	this.timedHandlers = [];
	this.handlers = [];
	this.removeTimeds = [];
	this.removeHandlers = [];
	this.addTimeds = [];
	this.addHandlers = [];
	
	this.authenticated = false;
	this.disconnecting = false;
	this.connected = false;
	
	this.errors = 0;
	
	this._requests = [];
	this._uniqueId = Math.round(Math.random()*10000);
    },

    /** Function: pause
     *  Pause the request manager.
     *
     *  This will prevent Strophe from sending any more requests to the
     *  server.  This is very useful for temporarily pausing while a lot
     *  of send() calls are happening quickly.  This causes Strophe to
     *  send the data in a single request, saving many request trips.
     */
    pause: function ()
    {
 	this.paused = true;
    },
    
    /** Function: resume
     *  Resume the request manager.
     *
     *  This resumes after pause() has been called.
     */
    resume: function ()
    {
 	this.paused = false;
    },
    
    /** Function: getUniqueId
     *  Generate a unique ID for use in <iq/> elements.
     *
     *  All <iq/> stanzas are required to have unique id attributes.  This
     *  function makes creating these easy.  Each connection instance has
     *  a counter which starts from zero, and the value of this counter 
     *  plus a colon followed by the suffix becomes the unique id. If no 
     *  suffix is supplied, the counter is used as the unique id.
     *
     *  Suffixes are used to make debugging easier when reading the stream
     *  data, and their use is recommended.  The counter resets to 0 for
     *  every new connection for the same reason.  For connections to the
     *  same server that authenticate the same way, all the ids should be
     *  the same, which makes it easy to see changes.  This is useful for
     *  automated testing as well.
     *
     *  Parameters:
     *    (String) suffix - A optional suffix to append to the id.
     *
     *  Returns:
     *    A unique string to be used for the id attribute.
     */
    getUniqueId: function (suffix)
    {
	if (typeof(suffix) == "string" || typeof(suffix) == "number") {
	    return ++this._uniqueId + ":" + suffix;
	} else {
	    return ++this._uniqueId + "";
	}
    },
    
    /** Function: connect
     *  Starts the connection process.
     *
     *  As the connection process proceeds, the user supplied callback will
     *  be triggered multiple times with status updates.  The callback
     *  should take two arguments - the status code and the error condition.
     *
     *  The status code will be one of the values in the Strophe.Status
     *  constants.  The error condition will be one of the conditions
     *  defined in RFC 3920 or the condition 'strophe-parsererror'.
     *
     *  Please see XEP 124 for a more detailed explanation of the optional
     *  parameters below.
     *
     *  Parameters:
     *    (String) jid - The user's JID.  This may be a bare JID,
     *      or a full JID.  If a node is not supplied, SASL ANONYMOUS
     *      authentication will be attempted.
     *    (String) pass - The user's password.
     *    (Function) callback The connect callback function.
     *    (Integer) wait - The optional HTTPBIND wait value.  This is the 
     *      time the server will wait before returning an empty result for 
     *      a request.  The default setting of 60 seconds is recommended.  
     *      Other settings will require tweaks to the Strophe.TIMEOUT value.
     *    (Integer) hold - The optional HTTPBIND hold value.  This is the 
     *      number of connections the server will hold at one time.  This 
     *      should almost always be set to 1 (the default).
     *    (Integer) wind - The optional HTTBIND window value.  This is the
     *      allowed range of request ids that are valid.  The default is 5.
     */
    connect: function (jid, pass, callback, wait, hold, wind)
    {
	this.jid = jid;
	this.pass = pass;
	this.connect_callback = callback;
	this.disconnecting = false;
	this.connected = false;
	this.authenticated = false;
	this.errors = 0;

	if (!wait) wait = 60;
        if (!hold) hold = 1;
	if (wind) this.window = wind;

	// parse jid for domain and resource
	this.domain = Strophe.getDomainFromJid(this.jid);

	// build the body tag
	var body = this._buildBody().attrs({
	    to: this.domain,
	    "xml:lang": "en",
	    wait: wait,
	    hold: hold,
	    window: this.window,
	    content: "text/xml; charset=utf-8",
	    ver: "1.6",
	    "xmpp:version": "1.0",
	    "xmlns:xmpp": Strophe.NS.BOSH
	});

	this.connect_callback(Strophe.Status.CONNECTING, null);

	this._requests.push(
	    new Strophe.Request(body.toString(),
				this._onRequestStateChange.bind(this)
				    .prependArg(this._connect_cb.bind(this)),
				body.tree().getAttribute("rid")));
	this._throttledRequestHandler();
    },

    /** Function: attach
     *  Attach to an already created and authenticated BOSH session.
     *
     *  This function is provided to allow Strophe to attach to BOSH
     *  sessions which have been created externally, perhaps by a Web
     *  application.  This is often used to support auto-login type features
     *  without putting user credentials into the page.
     *
     *  Parameters:
     *    (String) jid - The full JID that is bound by the session.
     *    (String) sid - The SID of the BOSH session.
     *    (String) rid - The current RID of the BOSH session.  This RID
     *      will be used by the next request.
     *    (Function) callback The connect callback function.
     */
    attach: function (jid, sid, rid, callback)
    {
	this.jid = jid;
	this.sid = sid;
	this.rid = rid;
	this.connect_callback = callback;

	this.domain = Strophe.getDomainFromJid(this.jid);
	
	this.authenticated = true;
	this.connected = true;
    },

    /** Function: rawInput
     *  User overrideable function that receives raw data coming into the 
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > Strophe.Connection.rawInput = function (data) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (String) data - The data received by the connection.
     */
    rawInput: function (data)
    {
	return;
    },

    /** Function: rawOutput
     *  User overrideable function that receives raw data sent to the
     *  connection.
     *
     *  The default function does nothing.  User code can override this with
     *  > Strophe.Connection.rawOutput = function (data) {
     *  >   (user code)
     *  > };
     *
     *  Parameters:
     *    (String) data - The data sent by the connection.
     */
    rawOutput: function (data)
    {
	return;
    },

    /** Function: send
     *  Send a stanza.
     *
     *  This function is called to push data onto the send queue to
     *  go out over the wire.  Whenever a request is sent to the BOSH
     *  server, all pending data is sent and the queue is flushed.
     *
     *  Parameters:
     *    (XMLElement) elem - The stanza to send.
     */
    send: function (elem)
    {
	if (elem !== null && typeof(elem["sort"]) == "function") {
	    for (var i = 0; i < elem.length; i++) {
		this._data.push(elem[i]);
	    }
	} else {
	    this._data.push(elem);
	}

	this._throttledRequestHandler();
	clearTimeout(this._idleTimeout);
	this._idleTimeout = setTimeout(this._onIdle.bind(this), 100);
    },

    /** PrivateFunction: _sendRestart
     *  Send an xmpp:restart stanza.
     */
    _sendRestart: function ()
    {
	this._data.push("restart");

	this._throttledRequestHandler();
	clearTimeout(this._idleTimeout);
	this._idleTimeout = setTimeout(this._onIdle.bind(this), 100);
    },

    /** Function: addTimedHandler
     *  Add a timed handler to the connection.
     *
     *  This function adds a timed handler.  The provided handler will
     *  be called every period milliseconds until it returns false,
     *  the connection is terminated, or the handler is removed.  Handlers
     *  that wish to continue being invoked should return true.
     *
     *  Because of method binding it is necessary to save the result of 
     *  this function if you wish to remove a handler with 
     *  deleteTimedHandler().
     *
     *  Note that user handlers are not active until authentication is
     *  successful.
     *
     *  Parameters:
     *    (Integer) period - The period of the handler.
     *    (Function) handler - The callback function.
     *
     *  Returns:
     *    A reference to the handler that can be used to remove it.
     */
    addTimedHandler: function (period, handler)
    {
	var thand = new Strophe.TimedHandler(period, handler);
	this.addTimeds.push(thand);
	return thand;
    },

    /** Function: deleteTimedHandler
     *  Delete a timed handler for a connection.
     *  
     *  This function removes a timed handler from the connection.  The 
     *  handRef parameter is *not* the function passed to addTimedHandler(),
     *  but is the reference returned from addTimedHandler().
     *
     *  Parameters:
     *    (Strophe.TimedHandler) handRef - The handler reference.
     */
    deleteTimedHandler: function (handRef)
    {
	// this must be done in the Idle loop so that we don't change
	// the handlers during iteration
	this.removeTimeds.push(handRef);
    },
    
    /** Function: addHandler
     *  Add a stanza handler for the connection.
     *
     *  This function adds a stanza handler to the connection.  The 
     *  handler callback will be called for any stanza that matches
     *  the parameters.  Note that if multiple parameters are supplied,
     *  they must all match for the handler to be invoked.
     *
     *  The handler will receive the stanza that triggered it as its argument.
     *  The handler should return true if it is to be invoked again;
     *  returning false will remove the handler after it returns.
     *
     *  As a convenience, the ns parameters applies to the top level element
     *  and also any of its immediate children.  This is primarily to make
     *  matching /iq/query elements easy.
     *
     *  The return value should be saved if you wish to remove the handler
     *  with deleteHandler().
     *
     *  Parameters:
     *    (Function) handler - The user callback.
     *    (String) ns - The namespace to match.
     *    (String) name - The stanza name to match.
     *    (String) type - The stanza type attribute to match.
     *    (String) id - The stanza id attribute to match.
     *    (String) from - The stanza from attribute to match.
     *
     *  Returns:
     *    A reference to the handler that can be used to remove it.
     */
    addHandler: function (handler, ns, name, type, id, from)
    {
	var hand = new Strophe.Handler(handler, ns, name, type, id, from);
	this.addHandlers.push(hand);
	return hand;
    },

    /** Function: deleteHandler
     *  Delete a stanza handler for a connection.
     *  
     *  This function removes a stanza handler from the connection.  The 
     *  handRef parameter is *not* the function passed to addHandler(),
     *  but is the reference returned from addHandler().
     *
     *  Parameters:
     *    (Strophe.Handler) handRef - The handler reference.
     */
    deleteHandler: function (handRef)
    {
	// this must be done in the Idle loop so that we don't change
	// the handlers during iteration
	this.removeHandlers.push(handRef);
    },

    /** Function: disconnect
     *  Start the graceful disconnection process.
     *
     *  This function starts the disconnection process.  This process starts
     *  by sending unavailable presence and sending BOSH body of type
     *  terminate.  A timeout handler makes sure that disconnection happens
     *  even if the BOSH server does not respond.
     *
     *  The user supplied connection callback will be notified of the
     *  progress as this process happens.
     */
    disconnect: function ()
    {
	Strophe.info("disconnect was called");
	if (this.connected) {
	    // setup timeout handler
	    this._disconnectTimeout = this._addSysTimedHandler(
		3000, this._onDisconnectTimeout.bind(this));
	    this._sendTerminate();
	}
    },
    
    /** PrivateFunction: _buildBody
     *  _Private_ helper function to generate the <body/> wrapper for BOSH.
     *
     *  Returns:
     *    A Strophe.Builder with a <body/> element.
     */
    _buildBody: function ()
    {
	var bodyWrap = $build('body', {
	    rid: this.rid++,
	    xmlns: Strophe.NS.HTTPBIND
	});

	if (this.sid !== null) {
	    bodyWrap.attrs({sid: this.sid});
	}

	return bodyWrap;
    },

    /** PrivateFunction: _removeRequest
     *  _Private_ function to remove a request from the queue.
     *
     *  Parameters:
     *    (Strophe.Request) req - The request to remove.
     */
    _removeRequest: function (req)
    {
	Strophe.debug("removing request");

	var i;
	for (i = this._requests.length - 1; i >= 0; i--) {
	    if (req == this._requests[i]) {
		this._requests.splice(i, 1);
	    }
	}

	// set the onreadystatechange handler to a null function so
        // that we don't get any misfires
	req.xhr.onreadystatechange = function () {};

	this._throttledRequestHandler();
    },

    /** PrivateFunction: _restartRequest
     *  _Private_ function to restart a request that is presumed dead.
     *
     *  Parameters:
     *    (Integer) i - The index of the request in the queue.
     */
    _restartRequest: function (i)
    {
	var req = this._requests[i];
	if (req.dead === null) {
	    req.dead = new Date();
	}

	this._processRequest(i);
    },

    /** PrivateFunction: _processRequest
     *  _Private_ function to process a request in the queue.
     *
     *  This function takes requests off the queue and sends them and
     *  restarts dead requests.
     *
     *  Parameters:
     *    (Integer) i - The index of the request in the queue.
     */
    _processRequest: function (i)
    {
	var req = this._requests[i];
	var reqStatus = -1;
	
	try {
	    if (req.xhr.readyState == 4) {
		reqStatus = req.xhr.status;
	    }
	} catch (e) {
	    Strophe.error("caught an error in _requests[" + i + 
			  "], reqStatus: " + reqStatus);
	}
		
	if (typeof(reqStatus) == "undefined") { 
	    reqStatus = -1; 
	}

	var now = new Date();
	var time_elapsed = req.age();
	var primaryTimeout = (!isNaN(time_elapsed) &&
			      time_elapsed > Strophe.TIMEOUT);
	var secondaryTimeout = (req.dead !== null &&
				req.timeDead() > Strophe.SECONDARY_TIMEOUT);
	var requestCompletedWithServerError = (req.xhr.readyState == 4 &&
					       (reqStatus < 1 || 
						reqStatus >= 500));
	var oldreq;

	if (primaryTimeout || secondaryTimeout ||
	    requestCompletedWithServerError) {
	    if (secondaryTimeout) {
		Strophe.error("Request " + 
			      this._requests[i].id + 
			      " timed out (secondary), restarting");
	    }
	    req.abort = true;
	    req.xhr.abort();
	    oldreq = req;
	    this._requests[i] = new Strophe.Request(req.data, 
						    req.origFunc, 
						    req.rid, 
						    req.sends);
	    req = this._requests[i];
	}

	if (req.xhr.readyState === 0) {
	    Strophe.debug("request id " + req.id + 
			  "." + req.sends + " posting");

	    req.date = new Date();
	    try {
		req.xhr.open("POST", this.service, true);
	    } catch (e) {
		Strophe.error("XHR open failed.");
		if (!this.connected)
		    this.connect_callback(Strophe.Status.CONNFAIL, 
					  "bad-service");
		this.disconnect();
		return;
	    }

      // Fires the XHR request -- may be invoked immediately
      // or on a gradually expanding retry window for reconnects
      var sendFunc = function () {
	  req.xhr.send(req.data);
      };

      // Implement progressive backoff for reconnects --
      // First retry (send == 1) should also be instantaneous
      if (req.sends > 1) {
          // Using a cube of the retry number creats a nicely
          // expanding retry window
          var backoff = Math.pow(req.sends, 3) * 1000;
          setTimeout(sendFunc, backoff);
      } else {
          sendFunc();
      }

      req.sends++;

	    this.rawOutput(req.data);
	} else {
	    Strophe.debug("_throttledRequestHandler: " + 
			  (i === 0 ? "first" : "second") + 
			  " request has readyState of " + 
			  req.xhr.readyState);
	}
    },

    /** PrivateFunction: _throttledRequestHandler
     *  _Private_ function to throttle requests to the connection window.
     *
     *  This function makes sure we don't send requests so fast that the 
     *  request ids overflow the connection window in the case that one
     *  request died.
     */
    _throttledRequestHandler: function ()
    {
	if (!this._requests) {
	    Strophe.debug("_throttledRequestHandler called with " + 
			  "undefined requests");
	} else {
	    Strophe.debug("_throttledRequestHandler called with " + 
			  this._requests.length + " requests");
	}
	
	if (!this._requests || this._requests.length === 0) {
	    return; 
	}
	
	if (this._requests.length > 0) {
	    this._processRequest(0);
	}
		
	if (this._requests.length > 1 && 
	    Math.abs(this._requests[0].rid - 
		     this._requests[1].rid) < this.window - 1) {
	    this._processRequest(1);
	}
    },
    
    /** PrivateFunction: _onRequestStateChange
     *  _Private_ handler for Strophe.Request state changes.
     *
     *  This function is called when the XMLHttpRequest readyState changes.
     *  It contains a lot of error handling logic for the many ways that
     *  requests can fail, and calls the request callback when requests
     *  succeed.
     *
     *  Parameters:
     *    (Function) func - The handler for the request.
     *    (Strophe.Request) req - The request that is changing readyState.
     */
    _onRequestStateChange: function (func, req)
    {
	Strophe.debug("request id " + req.id + 
		      "." + req.sends + " state changed to " + 
		      req.xhr.readyState);

	if (req.abort) {
	    req.abort = false;
	    return;
	}
	
	// request complete
	var reqStatus;
	if (req.xhr.readyState == 4) {
	    reqStatus = 0;
	    try {
		reqStatus = req.xhr.status;
	    } catch (e) {
		// ignore errors from undefined status attribute.  works
		// around a browser bug
	    }
	    
	    if (typeof(reqStatus) == "undefined") {
		reqStatus = 0;
	    }

	    if (this.disconnecting) {
		if (reqStatus >= 400) {
		    this._hitError(reqStatus);
		    return;
		} 
	    }

	    var reqIs0 = (this._requests[0] == req);
	    var reqIs1 = (this._requests[1] == req);
	    
	    if ((reqStatus > 0 && reqStatus < 500) || req.sends > 5) {
		// remove from internal queue
		this._removeRequest(req);
		Strophe.debug("request id " + 
			      req.id + 
			      " should now be removed"); 
	    }
	    
	    // request succeeded
	    if (reqStatus == 200) {
		// if request 1 finished, or request 0 finished and request
		// 1 is over Strophe.SECONDARY_TIMEOUT seconds old, we need to
		// restart the other - both will be in the first spot, as the
		// completed request has been removed from the queue already
		if (reqIs1 || 
		    (reqIs0 && this._requests.length > 0 && 
 		     this._requests[0].age() > Strophe.SECONDARY_TIMEOUT)) {
		    this._restartRequest(0);
		}
		// call handler
		Strophe.debug("request id " + 
			      req.id + "." + 
			      req.sends + " got 200");
		func(req);
		this.errors = 0;
	    } else {
		Strophe.error("request id " + 
			      req.id + "." + 
			      req.sends + " error " + reqStatus + 
			      " happened");
		if (reqStatus === 0 || 
		    (reqStatus >= 400 && reqStatus < 600) || 
		    reqStatus >= 12000) {
		    this._hitError(reqStatus);
		    if (reqStatus >= 400 && reqStatus < 500) {
			this.connect_callback(Strophe.Status.DISCONNECTING, 
					      null);
			this._doDisconnect();
		    }
		}
	    }

	    if (!((reqStatus > 0 && reqStatus < 10000) || 
		  req.sends > 5)) {
		this._throttledRequestHandler();
	    }
	}
    },

    /** PrivateFunction: _hitError
     *  _Private_ function to handle the error count.
     *
     *  Requests are resent automatically until their error count reaches
     *  5.  Each time an error is encountered, this function is called to
     *  increment the count and disconnect if the count is too high.
     *
     *  Parameters:
     *    (Integer) reqStatus - The request status.
     */
    _hitError: function (reqStatus)
    {
	this.errors++;
	Strophe.warn("request errored, status: " + reqStatus + 
		     ", number of errors: " + this.errors);
	if (this.errors > 4) {
	    this._onDisconnectTimeout();
	}
    },

    /** PrivateFunction: _doDisconnect
     *  _Private_ function to disconnect.
     *
     *  This is the last piece of the disconnection logic.  This resets the
     *  connection and alerts the user's connection callback.
     */
    _doDisconnect: function ()
    {
	Strophe.info("_doDisconnect was called");
	this.authenticated = false;
	this.disconnecting = false;
	this.sid = null;
	this.streamId = null;
	this.rid = Math.floor(Math.random() * 4294967295);

	// tell the parent we disconnected
	if (this.connected) {
	    this.connect_callback(Strophe.Status.DISCONNECTED, null);
	    this.connected = false;
	}

	// delete handlers
	this.handlers = [];
	this.timedHandlers = [];
	this.removeTimeds = [];
	this.removeHandlers = [];
	this.addTimeds = [];
	this.addHandlers = [];
    },
    
    /** PrivateFunction: _dataRecv
     *  _Private_ handler to processes incoming data from the the connection.
     *
     *  Except for _connect_cb handling the initial connection request, 
     *  this function handles the incoming data for all requests.  This
     *  function also fires stanza handlers that match each incoming 
     *  stanza.
     *
     *  Parameters:
     *    (Strophe.Request) req - The request that has data ready.
     */
    _dataRecv: function (req)
    {
	try {
	    var elem = req.getResponse();
	} catch (e) {
	    if (e != "parsererror") throw e;

	    this.connect_callback(Strophe.Status.DISCONNECTING, 
				  "strophe-parsererror");
	    this.disconnect();
	}
	if (elem === null) return;

	// handle graceful disconnect
	if (this.disconnecting && this._requests.length == 0) {
	    this.deleteTimedHandler(this._disconnectTimeout);
	    this._disconnectTimeout = null;
	    this._doDisconnect();
	}

	this.rawInput(Strophe.serialize(elem));

	var typ = elem.getAttribute("type");
	var cond, conflict;
	if (typ !== null && typ == "terminate") {
	    // an error occurred
	    cond = elem.getAttribute("condition");
	    conflict = elem.getElementsByTagName("conflict");
	    if (cond !== null) {
		if (cond == "remote-stream-error" && conflict.length > 0) {
		    cond = "conflict";
		}
		this.connect_callback(Strophe.Status.CONNFAIL, cond);
	    } else {
		this.connect_callback(Strophe.Status.CONNFAIL, "unknown");
	    }
	    this.connect_callback(Strophe.Status.DISCONNECTING, null);
	    this.disconnect();
	    return;
	}

	// remove handlers scheduled for deletion
	var i, hand;
	while (this.removeHandlers.length > 0) {
	    hand = this.removeHandlers.pop();
	    i = this.handlers.indexOf(hand);
	    if (i >= 0) 
		this.handlers.splice(i, 1);
	}

	// add handlers scheduled for addition
	while (this.addHandlers.length > 0) {
	    this.handlers.push(this.addHandlers.pop());
	}
	
	// send each incoming stanza through the handler chain
	var self = this;
	Strophe.forEachChild(elem, null, function (child) {
	    var i, newList;
	    // process handlers
	    newList = self.handlers;
	    self.handlers = [];
	    for (i = 0; i < newList.length; i++) {
		var hand = newList[i];
		if (hand.isMatch(child) && 
		    (self.authenticated || !hand.user)) {
		    if (hand.run(child)) {
			self.handlers.push(hand);
		    }
		} else {
		    self.handlers.push(hand);
		}
	    }
	});
    },

    /** PrivateFunction: _sendTerminate
     *  _Private_ function to send initial disconnect sequence.
     *
     *  This is the first step in a graceful disconnect.  It sends
     *  the BOSH server a terminate body and includes an unavailable
     *  presence if authentication has completed.
     */
    _sendTerminate: function ()
    {
	Strophe.info("_sendTerminate was called");
	var body = this._buildBody().attrs({type: "terminate"});

	var presence, i;
	if (this.authenticated) {
	    body.c('presence', {
		xmlns: Strophe.NS.CLIENT,
		type: 'unavailable'
	    });
	}

	this.disconnecting = true;

	var req = new Strophe.Request(body.toString(),
				      this._onRequestStateChange.bind(this)
					  .prependArg(this._dataRecv.bind(this)),
				      body.tree().getAttribute("rid"));
	
	// abort and clear all waiting requests
	var r;
	while (this._requests.length > 0) {
	    r = this._requests.pop();
	    r.xhr.abort();
	    r.abort = true;
	}

	this._requests.push(req);
	this._throttledRequestHandler();
    },

    /** PrivateFunction: _connect_cb
     *  _Private_ handler for initial connection request.
     *
     *  This handler is used to process the initial connection request
     *  response from the BOSH server. It is used to set up authentication
     *  handlers and start the authentication process.
     *
     *  SASL authentication will be attempted if available, otherwise
     *  the code will fall back to legacy authentication.
     *
     *  Parameters:
     *    (Strophe.Request) req - The current request.
     */
    _connect_cb: function (req)
    {
	Strophe.info("_connect_cb was called");

	this.connected = true;
	var bodyWrap = req.getResponse();
	if (!bodyWrap) return;

	this.rawInput(Strophe.serialize(bodyWrap));

	var typ = bodyWrap.getAttribute("type");
	var cond, conflict;
	if (typ !== null && typ == "terminate") {
	    // an error occurred
	    cond = bodyWrap.getAttribute("condition");
	    conflict = bodyWrap.getElementsByTagName("conflict");
	    if (cond !== null) {
		if (cond == "remote-stream-error" && conflict.length > 0) {
		    cond = "conflict";
		}
		this.connect_callback(Strophe.Status.CONNFAIL, cond);
	    } else {
		this.connect_callback(Strophe.Status.CONNFAIL, "unknown");
	    }
	    return;
	}

	this.sid = bodyWrap.getAttribute("sid");
	this.stream_id = bodyWrap.getAttribute("authid");

	// TODO - add SASL anonymous for guest accounts
	var do_sasl_plain = false;
	var do_sasl_digest_md5 = false;
	var do_sasl_anonymous = false;

	var mechanisms = bodyWrap.getElementsByTagName("mechanism");
	var i, mech, auth_str, hashed_auth_str;
	if (mechanisms.length > 0) {
	    for (i = 0; i < mechanisms.length; i++) {
		mech = Strophe.getText(mechanisms[i]);
		if (mech == 'DIGEST-MD5') {
		    do_sasl_digest_md5 = true;
		} else if (mech == 'PLAIN') {
		    do_sasl_plain = true;
		} else if (mech == 'ANONYMOUS') {
		    do_sasl_anonymous = true;
		}
	    }
	}
	
	if (Strophe.getNodeFromJid(this.jid) === null && 
	    do_sasl_anonymous) {
	    this.connect_callback(Strophe.Status.AUTHENTICATING, null);
	    this._sasl_success_handler = this._addSysHandler(
		this._sasl_success_cb.bind(this), null,
		"success", null, null);
	    this._sasl_failure_handler = this._addSysHandler(
		this._sasl_failure_cb.bind(this), null,
		"failure", null, null);

	    this.send($build("auth", {
		xmlns: Strophe.NS.SASL,
		mechanism: "ANONYMOUS"
	    }).tree());
	} else if (Strophe.getNodeFromJid(this.jid) === null) {
	    // we don't have a node, which is required for non-anonymous
	    // client connections
	    this.connect_callback(Strophe.Status.CONNFAIL, null);
	    this.disconnect();
	} else if (do_sasl_digest_md5) {
	    this.connect_callback(Strophe.Status.AUTHENTICATING, null);
	    this._sasl_challenge_handler = this._addSysHandler(
		this._sasl_challenge1_cb.bind(this), null, 
		"challenge", null, null);
            this._sasl_failure_handler = this._addSysHandler(
		this._sasl_failure_cb.bind(this), null, 
		"failure", null, null);

	    this.send($build("auth", {
		xmlns: Strophe.NS.SASL,
		mechanism: "DIGEST-MD5"
	    }).tree());
	} else if (do_sasl_plain) {
	    // Build the plain auth string (barejid null
	    // username null password) and base 64 encoded.
	    auth_str = Strophe.escapeJid(
		Strophe.getBareJidFromJid(this.jid));
	    auth_str = auth_str + "\u0000";
	    auth_str = auth_str + Strophe.getNodeFromJid(this.jid);
	    auth_str = auth_str + "\u0000";
	    auth_str = auth_str + this.pass;
	    
	    this.connect_callback(Strophe.Status.AUTHENTICATING, null);
	    this._sasl_success_handler = this._addSysHandler(
		this._sasl_success_cb.bind(this), null, 
		"success", null, null);
	    this._sasl_failure_handler = this._addSysHandler(
		this._sasl_failure_cb.bind(this), null,
		"failure", null, null);

	    hashed_auth_str = encode64(auth_str);
	    this.send($build("auth", {
		xmlns: Strophe.NS.SASL,
		mechanism: "PLAIN"
	    }).t(hashed_auth_str).tree());
	} else {
	    this.connect_callback(Strophe.Status.AUTHENTICATING, null);
	    this._addSysHandler(this._auth1_cb.bind(this), null, null, 
				null, "_auth_1");
	    
	    this.send($iq({
		type: "get",
		to: this.domain,
		id: "_auth_1"
	    }).c("query", {
		xmlns: Strophe.NS.AUTH
	    }).c("username", {}).t(Strophe.getNodeFromJid(this.jid)).tree());
	}
    },

    /** PrivateFunction: _sasl_challenge1_cb
     *  _Private_ handler for DIGEST-MD5 SASL authentication.
     *
     *  Parameters:
     *    (XMLElement) elem - The challenge stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_challenge1_cb: function (elem)
    {
	var attribMatch = /([a-z]+)=("[^"]+"|[^,"]+)(?:,|$)/;

        var challenge = decode64(Strophe.getText(elem));
        var cnonce = hex_md5(Math.random() * 1234567890);
	var realm = "";
	var host = null;
	var nonce = "";
	var qop = "";
	var matches;

        // remove unneeded handlers
        this.deleteHandler(this._sasl_failure_handler);

	while (challenge.match(attribMatch)) {
	    matches = challenge.match(attribMatch);
	    challenge = challenge.replace(matches[0], "");
	    matches[2] = matches[2].replace(/^"(.+)"$/, "$1");
	    switch (matches[1]) {
	    case "realm": 
		realm = matches[2]; 
		break;
	    case "nonce": 
		nonce = matches[2]; 
		break;
	    case "qop":
		qop = matches[2]; 
		break;
	    case "host":
		host = matches[2];
		break;
	    }
	}

        var digest_uri = "xmpp/" + this.domain;
	if (host !== null) {
	    digest_uri = digest_uri + "/" + host;
	}
			
        var A1 = str_md5(Strophe.getNodeFromJid(this.jid) + 
			 ":" + realm + ":" + this.pass) + 
	    ":" + nonce + ":" + cnonce;
	var A2 = 'AUTHENTICATE:' + digest_uri;

	var responseText = "";
	responseText += 'username="' + 
            Strophe.getNodeFromJid(this.jid) + '",';
	responseText += 'realm="' + realm + '",';
	responseText += 'nonce="' + nonce + '",';
	responseText += 'cnonce="' + cnonce + '",';
	responseText += 'nc="00000001",';
	responseText += 'qop="auth",';
	responseText += 'digest-uri="' + digest_uri + '",';
	responseText += 'response="' + hex_md5(hex_md5(A1) + ":" + 
					       nonce + ":00000001:" + 
					       cnonce + ":auth:" + 
					       hex_md5(A2)) + '",';
	responseText += 'charset="utf-8"';

        this._sasl_challenge_handler = this._addSysHandler(
	    this._sasl_challenge2_cb.bind(this), null, 
	    "challenge", null, null);
	this._sasl_success_handler = this._addSysHandler(
	    this._sasl_success_cb.bind(this), null, 
	    "success", null, null);
        this._sasl_failure_handler = this._addSysHandler(
	    this._sasl_failure_cb.bind(this), null, 
	    "failure", null, null);

        this.send($build('response', {
	    xmlns: Strophe.NS.SASL
	}).t(encode64(responseText)).tree());

	return false;
    },

    /** PrivateFunction: _sasl_challenge2_cb
     *  _Private_ handler for second step of DIGEST-MD5 SASL authentication.
     *
     *  Parameters:
     *    (XMLElement) elem - The challenge stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_challenge2_cb: function (elem)
    {
	// remove unneeded handlers
	this.deleteHandler(this._sasl_success_handler);
	this.deleteHandler(this._sasl_failure_handler);

	this._sasl_success_handler = this._addSysHandler(
	    this._sasl_success_cb.bind(this), null, 
	    "success", null, null);
	this._sasl_failure_handler = this._addSysHandler(
	    this._sasl_failure_cb.bind(this), null, 
	    "failure", null, null);
	this.send($build('response', {xmlns: Strophe.NS.SASL}).tree());
	return false;
    },

    /** PrivateFunction: _auth1_cb
     *  _Private_ handler for legacy authentication.
     *
     *  This handler is called in response to the initial <iq type='get'/>
     *  for legacy authentication.  It builds an authentication <iq/> and
     *  sends it, creating a handler (calling back to _auth2_cb()) to 
     *  handle the result
     *
     *  Parameters:
     *    (XMLElement) elem - The stanza that triggered the callback.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _auth1_cb: function (elem)
    {
	var use_digest = false;
	var check_query, check_digest;

	if (elem.getAttribute("type") == "result") {
	    // Find digest
	    check_query = elem.childNodes[0];
	    if (check_query) {
		check_digest = check_query.getElementsByTagName("digest")[0];
		if (check_digest) {
		    use_digest = true;
		}
	    }
	}

	// Use digest or plaintext depending on the server features
	var iq = $iq({type: "set", id: "_auth_2"})
	    .c('query', {xmlns: Strophe.NS.AUTH})
	    .c('username', {}).t(Strophe.getNodeFromJid(this.jid));
	if (use_digest) {
	    iq.up().c("digest", {})
	        .t(hex_sha1(this.stream_id + this.pass));
	} else {
	    iq.up().c('password', {}).t(this.pass);
	}
	if (!Strophe.getResourceFromJid(this.jid)) {
	    // since the user has not supplied a resource, we pick
	    // a default one here.  unlike other auth methods, the server
	    // cannot do this for us.
	    this.jid = Strophe.getBareJidFromJid(this.jid) + '/strophe';
	}
	iq.up().c('resource', {}).t(Strophe.getResourceFromJid(this.jid));

	this._addSysHandler(this._auth2_cb.bind(this), null, 
			    null, null, "_auth_2");

	this.send(iq.tree());

	return false;
    },

    /** PrivateFunction: _sasl_success_cb
     *  _Private_ handler for succesful SASL authentication.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_success_cb: function (elem)
    {
	Strophe.info("SASL authentication succeeded.");

	// remove old handlers
	this.deleteHandler(this._sasl_failure_handler);
	this._sasl_failure_handler = null;
	if (this._sasl_challenge_handler) {
	    this.deleteHandler(this._sasl_challenge_handler);
	    this._sasl_challenge_handler = null;
	}

	this._addSysHandler(this._sasl_auth1_cb.bind(this), null, 
			    "stream:features", null, null);

	// we must send an xmpp:restart now
	this._sendRestart();

	return false;
    },

    /** PrivateFunction: _sasl_auth1_cb
     *  _Private_ handler to start stream binding.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_auth1_cb: function (elem)
    {
	var i, child;
	
	for (i = 0; i < elem.childNodes.length; i++) {
	    child = elem.childNodes[i];
	    if (child.nodeName == 'bind') {
		this.do_bind = true;
	    }

	    if (child.nodeName == 'session') {
		this.do_session = true;
	    }
	}

	if (!this.do_bind) {
	    this.connect_callback(Strophe.Status.AUTHFAIL, null);
	    return false;
	} else {
	    this._addSysHandler(this._sasl_bind_cb.bind(this), null, null, 
				null, "_bind_auth_2");
	    
	    var resource = Strophe.getResourceFromJid(this.jid);
	    if (resource)
		this.send($iq({type: "set", id: "_bind_auth_2"})
		          .c('bind', {xmlns: Strophe.NS.BIND})
		          .c('resource', {}).t(resource).tree());
	    else
		this.send($iq({type: "set", id: "_bind_auth_2"})
		          .c('bind', {xmlns: Strophe.NS.BIND})
		          .tree());
	}

	return false;
    },

    /** PrivateFunction: _sasl_bind_cb
     *  _Private_ handler for binding result and session start.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_bind_cb: function (elem)
    {
	if (elem.getAttribute("type") == "error") {
	    Strophe.info("SASL binding failed.");
	    this.connect_callback(Strophe.Status.AUTHFAIL, null);
	    return false;
	}

	// TODO - need to grab errors
	var bind = elem.getElementsByTagName("bind");
	var jidNode;
	if (bind.length > 0) {
	    // Grab jid
	    jidNode = bind[0].getElementsByTagName("jid");
	    if (jidNode.length > 0) {
		this.jid = Strophe.getText(jidNode[0]);
		
		if (this.do_session) {
		    this._addSysHandler(this._sasl_session_cb.bind(this), 
					null, null, null, "_session_auth_2");
		    
		    this.send($iq({type: "set", id: "_session_auth_2"})
			          .c('session', {xmlns: Strophe.NS.SESSION})
			          .tree());
		}
	    }
	} else {
	    Strophe.info("SASL binding failed.");
	    this.connect_callback(Strophe.Status.AUTHFAIL, null);
	    return false;
	}
    },

    /** PrivateFunction: _sasl_session_cb
     *  _Private_ handler to finish successful SASL connection.
     *
     *  This sets Connection.authenticated to true on success, which
     *  starts the processing of user handlers.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_session_cb: function (elem)
    {
	if (elem.getAttribute("type") == "result") {
	    this.authenticated = true;
	    this.connect_callback(Strophe.Status.CONNECTED, null);
	} else if (elem.getAttribute("type") == "error") {
	    Strophe.info("Session creation failed.");
	    this.connect_callback(Strophe.Status.AUTHFAIL, null);
	    return false;
	}

	return false;
    },

    /** PrivateFunction: _sasl_failure_cb
     *  _Private_ handler for SASL authentication failure.
     *
     *  Parameters:
     *    (XMLElement) elem - The matching stanza.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _sasl_failure_cb: function (elem)
    {
	// delete unneeded handlers
	if (this._sasl_success_handler) {
	    this.deleteHandler(this._sasl_success_handler);
	    this._sasl_success_handler = null;
	}
	if (this._sasl_challenge_handler) {
	    this.deleteHandler(this._sasl_challenge_handler);
	    this._sasl_challenge_handler = null;
	}
	
	this.connect_callback(Strophe.Status.AUTHFAIL, null);
	return false;
    },

    /** PrivateFunction: _auth2_cb
     *  _Private_ handler to finish legacy authentication.
     *
     *  This handler is called when the result from the jabber:iq:auth
     *  <iq/> stanza is returned.
     *
     *  Parameters:
     *    (XMLElement) elem - The stanza that triggered the callback.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _auth2_cb: function (elem)
    {
	if (elem.getAttribute("type") == "result") {
	    this.authenticated = true;
	    this.connect_callback(Strophe.Status.CONNECTED, null);
	} else if (elem.getAttribute("type") == "error") {
	    this.connect_callback(Strophe.Status.AUTHFAIL, null);
	    this.disconnect();
	}

	return false;
    },

    /** PrivateFunction: _addSysTimedHandler
     *  _Private_ function to add a system level timed handler.
     *
     *  This function is used to add a Strophe.TimedHandler for the
     *  library code.  System timed handlers are allowed to run before
     *  authentication is complete.
     *
     *  Parameters:
     *    (Integer) period - The period of the handler.
     *    (Function) handler - The callback function.
     */
    _addSysTimedHandler: function (period, handler)
    {
	var thand = new Strophe.TimedHandler(period, handler);
	thand.user = false;
	this.addTimeds.push(thand);
	return thand;
    },

    /** PrivateFunction: _addSysHandler
     *  _Private_ function to add a system level stanza handler.
     *
     *  This function is used to add a Strophe.Handler for the
     *  library code.  System stanza handlers are allowed to run before
     *  authentication is complete.
     *
     *  Parameters:
     *    (Function) handler - The callback function.
     *    (String) ns - The namespace to match.
     *    (String) name - The stanza name to match.
     *    (String) type - The stanza type attribute to match.
     *    (String) id - The stanza id attribute to match.
     */
    _addSysHandler: function (handler, ns, name, type, id)
    {
	var hand = new Strophe.Handler(handler, ns, name, type, id);
	hand.user = false;
	this.addHandlers.push(hand);
	return hand;
    },

    /** PrivateFunction: _onDisconnectTimeout
     *  _Private_ timeout handler for handling non-graceful disconnection.
     *
     *  If the graceful disconnect process does not complete within the 
     *  time allotted, this handler finishes the disconnect anyway.
     *
     *  Returns:
     *    false to remove the handler.
     */
    _onDisconnectTimeout: function ()
    {
	Strophe.info("_onDisconnectTimeout was called");

	// cancel all remaining requests and clear the queue
	var req;
	while (this._requests.length > 0) {
	    req = this._requests.pop();
	    req.xhr.abort();
	    req.abort = true;
	}
	
	// actually disconnect
	this._doDisconnect();
	
	return false;
    },

    /** PrivateFunction: _onIdle
     *  _Private_ handler to process events during idle cycle.
     *
     *  This handler is called every 100ms to fire timed handlers that 
     *  are ready and keep poll requests going.
     */
    _onIdle: function ()
    {
	var i, thand, since, newList;

	// remove timed handlers that have been scheduled for deletion
	while (this.removeTimeds.length > 0) {
	    thand = this.removeTimeds.pop();
	    i = this.timedHandlers.indexOf(thand);
	    if (i >= 0)
		this.timedHandlers.splice(i, 1);
	}

	// add timed handlers scheduled for addition
	while (this.addTimeds.length > 0) {
	    this.timedHandlers.push(this.addTimeds.pop());
	}

	// call ready timed handlers
	var now = new Date().getTime();
	newList = [];
	for (i = 0; i < this.timedHandlers.length; i++) {
	    thand = this.timedHandlers[i];
	    if (this.authenticated || !thand.user) {
		since = thand.lastCalled + thand.period;
		if (since - now <= 0) {
		    if (thand.run()) {
			newList.push(thand);
		    }
		} else {
		    newList.push(thand);
		}
	    }
	}
	this.timedHandlers = newList;
	
	var body, time_elapsed;

	// if no requests are in progress, poll
	if (this.authenticated && this._requests.length === 0 && 
	    this._data.length === 0 && !this.disconnecting) {
	    Strophe.info("no requests during idle cycle, sending " + 
			 "blank request");
	    this.send(null);
	} else {
	    if (this._requests.length < 2 && this._data.length > 0 && 
	       !this.paused) {
		body = this._buildBody();
		for (i = 0; i < this._data.length; i++) {
		    if (this._data[i] !== null) {
			if (this._data[i] === "restart") {
			    body.attrs({
				to: this.domain,
				"xml:lang": "en",
				"xmpp:restart": "true",
				"xmlns:xmpp": Strophe.NS.BOSH
			    })
			} else {
			    body.cnode(this._data[i]).up();
			}
		    }
		}
		delete this._data;
		this._data = [];
		this._requests.push(
		    new Strophe.Request(body.toString(),
					this._onRequestStateChange.bind(this)
					    .prependArg(this._dataRecv.bind(this)),
					body.tree().getAttribute("rid")));
		this._processRequest(this._requests.length - 1);
	    }

	    if (this._requests.length > 0) {
		time_elapsed = this._requests[0].age();
		if (this._requests[0].dead !== null) {
		    if (this._requests[0].timeDead() > 
			Strophe.SECONDARY_TIMEOUT) {
			this._throttledRequestHandler();
		    }
		}
		
		if (time_elapsed > Strophe.TIMEOUT) {
		    Strophe.warn("Request " + 
				 this._requests[0].id + 
				 " timed out, over " + Strophe.TIMEOUT + 
				 " seconds since last activity");
		    this._throttledRequestHandler();
		}
	    }
	}
	
	// reactivate the timer
	clearTimeout(this._idleTimeout);
	this._idleTimeout = setTimeout(this._onIdle.bind(this), 100);
    }
};
