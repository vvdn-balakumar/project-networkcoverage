var objInputModel = require('../model/networkcoveragemapinput.js');
var objOutputModel = require('../model/networkcoveragemapoutput.js');
var logger = console;

/**
 * @description - Code to retrieve the data for Network Coverage table and insert 
 * to mysql
 * @param  context - console
 * @param {Respose to be returned} callback
 * @return - callback
 */
function getNetworkCoverageMap(context, callback) {
    logger = context;
    logger.log("get Network Coverage Map invoked", new Date());
    objInputModel.getAllNetworkCoverageMapRelatedDetails(function (err, data) {
        if (data) {
            logger.log("data received", new Date());
            objOutputModel.postAllNetworkCoverageMapRelatedDetails2(context,data, callback);
        } else {
            logger.log('error in parsing'+err);
            callback("No data", false);
        }
    });
}

module.exports = {
    getNetworkCoverageMap: getNetworkCoverageMap
};