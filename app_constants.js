/**
 * Created by Holger on 13.09.2014.
 * This script provides absolute module path constants for requiring modules and not having to use relative,
 * installation dependent paths
 */
var path = require('path');
// current path of node.js root = process.cwd()  //cwd() = current working directory
var rootPath = path.resolve(process.cwd());
var appPath = path.resolve(rootPath, 'app');

var resolve_any_app_module = function(module_name) {
    return path.join(appPath, module_name);
};

// Create some static paths
var predefined_infrastructure = resolve_any_app_module('infrastructure');
var predefined_routes = resolve_any_app_module('routes');
var predefined_data = resolve_any_app_module('data');

// This object defines the known modules and their path
var module_packages = {
    data: {
        path: predefined_data
    },
    routes: {
        path: predefined_routes
    },
    infrastructure: {
        path: predefined_infrastructure
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
     * @param {String} package Name of the package
     * @param {String} module Name of the module
     * @returns {String} fully qualified path to the module
     */
    packagedModule: function(package, module) {
        if (module_packages[package] && module) {
            return path.join(module_packages[package].path, module);
        }
        throw "undefined package or module";
    }
};

module.exports = app_constants;