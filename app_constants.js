/**
 * This module provides absolute module path constants for requiring modules and not having to use relative,
 * installation dependent paths
 * @module backend/app_constants
 * @author Holger Heymanns
 * @since 13.09.2014
 */
var path = require('path');
// current path of node.js root = process.cwd()  //cwd() = current working directory
var rootPath = path.resolve(process.cwd());
var appPath = path.resolve(rootPath, 'app');

var resolve_any_app_module = function(module_name) {
    return path.join(appPath, module_name);
};

// Create some static paths
var predefined_routes = resolve_any_app_module('routes');
var predefined_data = resolve_any_app_module('data');
var predefined_entities = resolve_any_app_module('entities');

// This object defines the known modules and their path
var module_packages = {
    data: {
        path: predefined_data
    },
    routes: {
        path: predefined_routes
    },
    entities: {
        path: predefined_entities
    }
};

var app_constants = {
    /**
     * Returns the root path of the application
     */
    rootPath: rootPath,
    /**
     * Returns the root path of the application
     */
    appPath: appPath,
    /**
     * Returns the module for a given package
     * @param {String} packageName Name of the package
     * @param {String} module Name of the module
     * @returns {String} fully qualified path to the module
     */
    packagedModule: function(packageName, module) {
        if (module_packages[packageName] && module) {
            return path.join(module_packages[packageName].path, module);
        }
        throw "undefined package or module";
    },

    /**
     * Object containing security relevant information
     */
    secret: {
        secretToken: "ABC"
    }
};

module.exports = app_constants;