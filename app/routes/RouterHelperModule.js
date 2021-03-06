/**
 * This module contains helper methods for router modules
 * @module backend/routes/RouterHelperModule
 * @author Holger Heymanns
 * @since 12.10.2014
 */

module.exports = function() {
    return {
        /**
         * This function registers the paramId and functions from a given module
         * @param router The express router in which the parameter module shall be registered
         * @param paramModule The parameter module that shall be registered
         * @private
         */
        registerParamModule: function registerParamModule(router, paramModule) {
            for (var i = 0, len = paramModule.length; i < len; i++) {
                router.param(paramModule[i].paramId, paramModule[i].paramFunction);
            }
        },
        /**
         * This function sends a "not yet implemented error" (501)
         */
        notYetImplementedHandler: function(req, res) {
            res.status(501).send("Not yet implemented");
        }
    }
};