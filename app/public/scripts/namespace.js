'use strict';
/**
 * Created by holger on 22.06.2014.
 */
// namespace ki, see book "JavaScript Patterns, p. 89f
var lnk = lnk || {};
lnk.namespace = function (nsString) {
    var parts = nsString.split('.'),
        parent = lnk,
        i;
// strip redundant leading global
    if (parts[0] === 'lnk') {
        parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
// create a property if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};