var objdaoimpl = require('../dao/mongodaoimpl.js');
var objManagerialData = require('../model/managerialdatadaoimpl.js');
var async = require('async');
var moment = require("moment");

/**
* @description - Code to get all network coverage map related data
* @return callback
*/
function getAllNetworkCoverageMapRelatedDetailsOld(callback) {
    try {
        async.waterfall([
            function (innercallback) {
                objManagerialData.getMeterByMeterID([], innercallback);
            },

            // function (objInput, innercallback) {
            //     let meterIds = objInput.meterids;
            //     objManagerialData.getDeltaLinkByMeterID(objInput,['MeterID','Status'],[meterIds,'Registered'], innercallback);
            // },
            function (objInput, innercallback) {
                objManagerialData.getHypersproutDataByCellID(objInput, ['HypersproutID'], objInput.transformerids, innercallback);
            },
            function (objInput, innercallback) {
                let transformerIds = objInput.transformerids;
                objManagerialData.getDeltaLinkByHypersproutID(objInput,['HypersproutID','Status'],[transformerIds,'Registered'], innercallback);
            },
            function (objInput, innercallback) {
                objManagerialData.getTransformerDataByCellID(objInput, ['TransformerID'], objInput.transformerids, innercallback);
            },
            function (objInput, innercallback) {
                objManagerialData.getCircuitByCircuitID(objInput, ['CircuitID'], objInput.circuitids, innercallback);
            },

        ], function (err, results) {
            try {
                delete results.transformerids;
                delete results.circuitids;
                console.log(JSON.stringify(results))
                //objdaoimpl.closeConnection();
               //callback(err, results);
            } catch (exc) {
                //objdaoimpl.closeConnection();
               //callback(exc, false);
            }
        });


    } catch (err) {
        console.error(err);
        callback(err, false);
    }
}

function getAllNetworkCoverageMapRelatedDetails(callback) {
    try {
        async.waterfall([


            function (innercallback) {
                objManagerialData.getHypersproutDataByCellID([],innercallback);
            },
            function (objInput, innercallback) {
                let hypersproutids = objInput.hypersproutids;
                objManagerialData.getMeterByMeterID(objInput,['HypersproutID','Status'],[hypersproutids,'Registered'], innercallback);
            },
            function (objInput, innercallback) {
                let hypersproutids = objInput.hypersproutids;
                objManagerialData.getDeltaLinkByHypersproutID(objInput,['HypersproutID','Status'],[hypersproutids,'Registered'], innercallback);
            },
            function (objInput, innercallback) {
                objManagerialData.getTransformerDataByCellID(objInput, ['TransformerID'], objInput.transformerids, innercallback);
            },
            function (objInput, innercallback) {
                objManagerialData.getCircuitByCircuitID(objInput, ['CircuitID'], objInput.circuitids, innercallback);
            },

        ], function (err, results) {
            try {
                delete results.transformerids;
                delete results.circuitids;
                delete results.hypersproutids;

                callback(err, results);
            } catch (exc) {
               callback(exc, false);
            }
        });


    } catch (err) {
        console.error(err);
        callback(err, false);
    }
}

module.exports = {
    getAllNetworkCoverageMapRelatedDetails: getAllNetworkCoverageMapRelatedDetails
};