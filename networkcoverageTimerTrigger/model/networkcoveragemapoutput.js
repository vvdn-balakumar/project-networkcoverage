var objdaoimpl = require('../dao/mysqldaoimpl.js');
var objConfig = require('../config.js');
var moment = require("moment");
var forEach = require('async-foreach').forEach;
var objNetworkCoverageMapModel = require('../model/sqltables/networkcoveragemodel.js');
var objNetworkCoverageMapModelDAO = require('../model/networkcoveragemapdaoimpl.js');
var async = require('async');
var fs = require('fs');
var path = require('path');
var dbConMysql = require('../dao/mysqlconnector.js');
const json2csv = require('json2csv').parse;
var intnumofdays = objConfig.numberofDaysTransMeterTransaction;
const dateTime = new Date().toLocaleString().slice(-24).replace(/\D/g, '').slice(0, 14);
require('dotenv').config('../.env');
//var connection = dbConMysql.getDbconnection
// /** When uploading from Ubuntu system*/
var filePath = process.env.csvPath + "/csv_MeterCoverage-" + dateTime + ".csv";
var filePath2 = process.env.csvPath + "/csv_TransformerCoverage-" + dateTime + ".csv";
var filePath3 = process.env.csvPath + "/csv_CircuitCoverage-" + dateTime + ".csv";
var filePath4 = process.env.csvPath + "/csv_DlCoverage-" + dateTime + ".csv";
/**while uploading from the local system */
// var filePath = path.join(__dirname, "../../../", "project-datamart", "networkcoverage", "public", "csv-" + dateTime + ".csv");
// var filePath2 = path.join(__dirname, "../../../", "project-datamart", "networkcoverage", "public", "csv-2" + dateTime + ".csv");
// var filePath3 = path.join(__dirname, "../../../", "project-datamart", "networkcoverage", "public", "csv-3" + dateTime + ".csv");
const fields = [
    'TypeID', 'Shape', 'Latitude', 'Longitude', 'Gen_Latitude', 'Gen_Longitude', 'Angle(degrees)', 'Angle(radians)', 'Network Coverage', 'Connected Circuit', 'Connected Transformer', 'Circuit ID', 'Transformer ID', 'Meter ID','Transformer_CellID','Hypersprout_SerialNumber','IsHyperHub', 'NoOfDeltalinkAllocated', 'Master_DeltalinkSerialNumber', 'Master_DeltalinkID', 'Slave_DeltalinkSerialNumber', 'Slave_DeltalinkID','IsSelfHeal', 'createdAt',
    'updatedAt'
];
var loopIndex = 0;
var loopCount = 0;
var logger = console;
/**
* @description - Code to post network coverage map
* @param objData - object data
* @return callback
*/
function postAllNetworkCoverageMapRelatedDetails(objData, callback) {
    try {
        loopIndex = 0;
        loopCount = 0;
        objdaoimpl.synctable("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
            objNetworkCoverageMapModel.objTableProps, function (err) {
                if (err) {
                    logger.log(err);
                }
                var network_coverage, i, objAngleRadians, genLatitude, genLongitude;
                objdaoimpl.truncateEntries("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                    objNetworkCoverageMapModel.objTableProps, {}, function (err) {
                        if (err) {
                            logger.log(err);
                        }
                        var objAngle;
                        for (var objCircuit in objData.circuitobj) {
                            if (objData.circuitobj.hasOwnProperty(objCircuit)) {
                                var circuitLatitude = objData.circuitobj[objCircuit].CircuitLatitude;
                                var circuitLongitude = objData.circuitobj[objCircuit].CircuitLongitude;
                                network_coverage = objConfig.networkcoverage.hyperSprouts;
                                for (i = 1; i <= 360; i = i + 5) {
                                    objAngle = i;
                                    objAngleRadians = objAngle * Math.PI / 180;
                                    genLatitude = parseFloat(circuitLatitude) + network_coverage * Math.sin(objAngleRadians) / 110540;
                                    genLongitude = parseFloat(circuitLongitude) + network_coverage * Math.cos(objAngleRadians) / (111320 * Math.cos((Math.PI * circuitLatitude) / 180));
                                    objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel(objData, objCircuit, 'Circuit', objAngle, objAngleRadians, genLatitude, genLongitude, responseCallback);
                                    loopCount++;
                                }
                            }
                        }

                        for (var objTransformer in objData.transformerobj) {
                            if (objData.transformerobj.hasOwnProperty(objTransformer)) {
                                var transformerLatitude = objData.transformerobj[objTransformer].TransformerLatitude;
                                var transformerLongitude = objData.transformerobj[objTransformer].TransformerLongitude;
                                var isHyperHub = objData.transformerobj[objTransformer].IsHyperHub;
                                network_coverage = objConfig.networkcoverage.hyperSprouts;
                                for (i = 1; i <= 360; i = i + 5) {
                                    objAngle = i;
                                    objAngleRadians = objAngle * Math.PI / 180;
                                    genLatitude = parseFloat(transformerLatitude) + network_coverage * Math.sin(objAngleRadians) / 110540;
                                    genLongitude = parseFloat(transformerLongitude) + network_coverage * Math.cos(objAngleRadians) / (111320 * Math.cos((Math.PI * transformerLatitude) / 180));
                                    objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel(objData, objTransformer, 'Transformer', objAngle, objAngleRadians, genLatitude, genLongitude, responseCallback);
                                    if (isHyperHub) {
                                        objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel(objData, objTransformer, 'HyperHub', objAngle, objAngleRadians, genLatitude, genLongitude, responseCallback);
                                        loopCount++;
                                    }
                                    loopCount++;
                                }
                            }
                        }

                        for (var objMeter in objData.meterobj) {
                            if (objData.meterobj.hasOwnProperty(objMeter)) {
                                var meterLatitude = objData.meterobj[objMeter].MeterLatitude;
                                var meterLongitude = objData.meterobj[objMeter].MeterLongitude;
                                network_coverage = objConfig.networkcoverage.meters;
                                for (i = 1; i <= 360; i = i + 5) {
                                    objAngle = i;
                                    objAngleRadians = objAngle * Math.PI / 180;
                                    genLatitude = parseFloat(meterLatitude) + network_coverage * Math.sin(objAngleRadians) / 110540;
                                    genLongitude = parseFloat(meterLongitude) + network_coverage * Math.cos(objAngleRadians) / (111320 * Math.cos((Math.PI * meterLatitude) / 180));
                                    objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel(objData, objMeter, 'Meter', objAngle, objAngleRadians, genLatitude, genLongitude, responseCallback);
                                    loopCount++;
                                }
                            }
                        }
                        if (loopCount === 0) {
                            callback(null, true);
                        }
                    });
            });
    } catch (err) {
        logger.error(err);
    }

    function responseCallback(err) {
        if (err) {
            logger.error("Error", err);
        }
        loopIndex++;
        if (loopIndex >= loopCount) {
            callback(err, true);
        }
    }
}

function postAllNetworkCoverageMapRelatedDetails2(context, objData, callback) {

    // objdaoimpl.synctable("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
    //     objNetworkCoverageMapModel.objTableProps, function (err) {
    //         if (err) {
    //             context.log(err);
           //s }
            objdaoimpl.truncateEntries("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                objNetworkCoverageMapModel.objTableProps, {}, function (err) {
                    if (err) {
                        context.log(err);
                    } else {

                        async.parallel({
                            meterData: function (innercallback) {
                                processMeterCoverage(context, objData, innercallback);
                            },
                            transformerData: function (innercallback) {
                                processTransformerCoverage(context, objData, innercallback);
                            },
                            circuitData: function (innercallback) {
                                processCircuitCoverage(context, objData, innercallback);
                            },
                            deltalinkData: function (innercallback) {
                                processDlCoverage(context, objData, innercallback);
                            },
                        }, function (err, results) {
                            if (err) {
                                context.log(err);
                                callback(err, null);
                            } else {
                                console.log('this is the results----->')
                                context.log(results)
                                callback(null, true);
                            }
                        });
                    }
                });
       // });
}

function processMeterCoverage(context, objData, callback1) {
    try {
        var network_coverage, i, objAngleRadians, genLatitude, genLongitude, bulkInsert, meterLatitude, meterLongitude;
        var loopInd = 0;
        bulkInsert = [];
        if (Object.keys(objData.meterobj).length === 0) {
            callback1(null, true);
        } else {
            for (var objMeter in objData.meterobj) {
                if (objData.meterobj.hasOwnProperty(objMeter)) {
                    meterLatitude = objData.meterobj[objMeter].MeterLatitude;
                    meterLongitude = objData.meterobj[objMeter].MeterLongitude;
                    network_coverage = objConfig.networkcoverage.meters;
                    for (i = 1; i <= 360; i = i + 5) {
                        objAngle = i;
                        objAngleRadians = objAngle * Math.PI / 180;
                        genLatitude = parseFloat(meterLatitude) + network_coverage * Math.sin(objAngleRadians) / 110540;
                        genLongitude = parseFloat(meterLongitude) + network_coverage * Math.cos(objAngleRadians) / (111320 * Math.cos((Math.PI * meterLatitude) / 180));
                        if (i == 356) {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objMeter, 'Meter', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert,null,null, function (insertData) {
                                //console.log(insertData);
                                // objdaoimpl.bulkInsert("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                                //     objNetworkCoverageMapModel.objTableProps,
                                //     insertData, function name(err, objTransformerData) {
                                //         if (err) {
                                //             console.log("Error", err);
                                //         }
                                //     });
                            });
                        } else {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objMeter, 'Meter', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert,null,null, function (insertData) {
                            });
                        }
                    }

                }
                loopInd++;
                if (loopInd == Object.keys(objData.meterobj).length) {
                    context.log("bulk array-->", bulkInsert.length)
                    try {
                        csv = json2csv(bulkInsert, { fields });
                    } catch (err) {
                        context.log("error in csv", err);
                        callback1(err,null);
                    }
                    fs.appendFile(filePath, csv, function (err) {
                        if (err) {
                            context.log("this is the error-->", err);
                            callback1(err,null);
                        } else {
                            insertCsvtomysql(context,filePath,function(err,res){
                                if(err){
                                    callback1(err,null);
                                }else{
                                    callback1(null,true);
                                }
                               
                            });
                           // insertCsvtomysql(context, filePath);
                        }
                    });
                }
            }
        }

    } catch (err) {
        context.log(err);
        callback1(err, null);
    }
}
function insertCsvtomysqlold(context, filepath) {
    dbConMysql.pool.getConnection(function (err, connection) {
        if (err) {
            context.log("Error in GetConnection : " + err);
        }
        else {
            connection.query('START TRANSACTION', function (err, rows) {
                // do all sql statements with connection and then
                var sql = "LOAD DATA LOCAL INFILE '" + filepath + "' REPLACE INTO TABLE networkcoverage FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES ( `TypeID`,`Shape`,`Latitude`,`Longitude`,`Gen_Latitude`,`Gen_Longitude` ,`Angle(degrees)`,`Angle(radians)` ,`Network Coverage` ,`Connected Circuit`,`Connected Transformer`,`Circuit ID`,`Transformer ID`,`Meter ID`, `NoOfDeltalinkAllocated`, `Master_DeltalinkSerialNumber`, `Master_DeltalinkID`, `Slave_DeltalinkSerialNumber`, `Slave_DeltalinkID`,`IsSelfHeal`,`createdAt`,`updatedAt`) set id = NULL;"
                connection.query(sql, function (err, result) {
                    if (err) {
                        context.log(err);
                    }
                    if (result) {
                        context.log(result);
                        fs.unlinkSync(filepath);
                        context.log('unlinking temp file -->' + filepath)
                        //connection.end;

                    }
                });
                connection.query('COMMIT', function (err, rows) {
                    connection.release();
                });
                context.log('inside the insertion');

            });
        }
    })
}
function insertCsvtomysql(context, filepath,callback) {
    dbConMysql.pool.getConnection(function (err, connection) {
        if (err) {
            context.log("Error in GetConnection : " + err);
            callback(err,null);
        }
        else {
            connection.beginTransaction(function (err) {
                if (err) {                  //Transaction Error (Rollback and release connection)
                    connection.rollback(function () {
                        connection.release();
                        callback(err,null);
                        //Failure
                    });
                } else {
                    var sql = "LOAD DATA LOCAL INFILE '" + filepath + "' REPLACE INTO TABLE networkcoverage FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES ( `TypeID`,`Shape`,`Latitude`,`Longitude`,`Gen_Latitude`,`Gen_Longitude` ,`Angle(degrees)`,`Angle(radians)` ,`Network Coverage` ,`Connected Circuit`,`Connected Transformer`,`Circuit ID`,`Transformer ID`,`Meter ID`,`Transformer_CellID`,`Hypersprout_SerialNumber`,`IsHyperHub`, `NoOfDeltalinkAllocated`, `Master_DeltalinkSerialNumber`, `Master_DeltalinkID`, `Slave_DeltalinkSerialNumber`, `Slave_DeltalinkID`,`IsSelfHeal`, `createdAt`,`updatedAt`) set id = NULL;"
                    connection.query(sql, function (err, result) {
                        if (err) {         
                             //Query Error (Rollback and release connection)
                            connection.rollback(function () {
                                connection.release();
                                callback(err,null);
                                //Failure
                            });
                        } else {
                            connection.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        connection.release();
                                        callback(err,null);
                                        //Failure
                                    });
                                } else {
                                    if (result) {
                                        context.log(result);
                                        fs.unlinkSync(filepath);
                                        context.log('unlinking temp file -->' + filepath)
                                        //connection.end;
                                        connection.release();
                                        callback(null,true);
                                    }
                                    
                                    //Success
                                }
                            });
                        }
                    });
                }
            });
        }


    })
}


function processTransformerCoverage(context, objData, callback1) {
    try {
        var network_coverage, i, objAngleRadians, genLatitude, genLongitude, bulkInsert, transformerLatitude, transformerLongitude, isHyperHub,transformerId;
        var loopInd = 0;
        var count = 0;
        bulkInsert1 = [];
        if (Object.keys(objData.transformerobj).length === 0) {
            callback1(null, true);
        } else {
            for (var objTransformer in objData.transformerobj) {
                if (objData.transformerobj.hasOwnProperty(objTransformer)) {
                    transformerLatitude = objData.transformerobj[objTransformer].TransformerLatitude;
                    transformerLongitude = objData.transformerobj[objTransformer].TransformerLongitude;
                   
                    isHyperHub = objData.transformerobj[objTransformer].IsHyperHub;
                   // context.log('Is Hyper Hub ============> ');
                   // context.log(isHyperHub);
                    transformerId = objData.transformerobj[objTransformer].TransformerID;
                   // context.log('transformerId ============> ');
                   // context.log(transformerId);
                    network_coverage = objConfig.networkcoverage.hyperSprouts;
                    for (i = 1; i <= 360; i = i + 5) {
                        count++;
                        objAngle = i;
                        objAngleRadians = objAngle * Math.PI / 180;
                        genLatitude = parseFloat(transformerLatitude) + network_coverage * Math.sin(objAngleRadians) / 110540;
                        genLongitude = parseFloat(transformerLongitude) + network_coverage * Math.cos(objAngleRadians) / (111320 * Math.cos((Math.PI * transformerLatitude) / 180));
                        if (i == 356) {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objTransformer, 'Transformer', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert1,isHyperHub,transformerId, function (insertData) {
                                // objdaoimpl.bulkInsert("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                                //     objNetworkCoverageMapModel.objTableProps,
                                //     insertData, function name(err, objTransformerData) {
                                //         if (err) {
                                //             console.log("Error", err);
                                //         }
                                //     });
                            });
                            if (isHyperHub) {
                                objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objTransformer, 'HyperHub', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert1,isHyperHub,transformerId, function (insertData) {
                                    // objdaoimpl.bulkInsert("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                                    //     objNetworkCoverageMapModel.objTableProps,
                                    //     insertData, function name(err, objTransformerData) {
                                    //         if (err) {
                                    //             console.log("Error", err);
                                    //         }
                                    //     });
                                });
                            }
                        } else {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objTransformer, 'Transformer', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert1,isHyperHub,transformerId, function (insertData) {
                            });
                            if (isHyperHub) {
                                objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objTransformer, 'HyperHub', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert1,isHyperHub,transformerId, function (insertData) {
                                });
                            }
                        }
                    }
                }
                loopInd++;
                if (loopInd == Object.keys(objData.transformerobj).length) {
                    context.log("bulk1  array-->", bulkInsert1.length)
                    try {
                        csv = json2csv(bulkInsert1, { fields });
                    } catch (err) {
                        context.log("error in csv", err);
                        callback1(err,null);
                    }
                    fs.appendFile(filePath2, csv, function (err) {
                        if (err) {
                            context.log("this is the error-->", err);
                            callback1(err,null);
                        } else {
                      
                            insertCsvtomysql(context,filePath2,function(err,res){
                                if(err){
                                    callback1(err,null);
                                }else
                                callback1(null,true);
                            });
                        }
                    });
                }
            }
        }

    } catch (err) {
        callback1(err, null);
    }
}

function processCircuitCoverage(context, objData, callback1) {
    try {
        var network_coverage, i, objAngleRadians, genLatitude, genLongitude, bulkInsert, circuitLatitude, circuitLongitude;
        var loopInd = 0;
        bulkInsert2 = [];
        if (Object.keys(objData.circuitobj).length === 0) {
            callback1(null, true);
        } else {
            for (var objCircuit in objData.circuitobj) {
                if (objData.circuitobj.hasOwnProperty(objCircuit)) {
                    circuitLatitude = objData.circuitobj[objCircuit].CircuitLatitude;
                    circuitLongitude = objData.circuitobj[objCircuit].CircuitLongitude;
                    network_coverage = objConfig.networkcoverage.hyperSprouts;
                    for (i = 1; i <= 360; i = i + 5) {
                        objAngle = i;
                        objAngleRadians = objAngle * Math.PI / 180;
                        genLatitude = parseFloat(circuitLatitude) + network_coverage * Math.sin(objAngleRadians) / 110540;
                        genLongitude = parseFloat(circuitLongitude) + network_coverage * Math.cos(objAngleRadians) / (111320 * Math.cos((Math.PI * circuitLatitude) / 180));
                        if (i == 356) {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objCircuit, 'Circuit', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert2,null,null, function (insertData) {
                                // objdaoimpl.bulkInsert("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                                //     objNetworkCoverageMapModel.objTableProps,
                                //     insertData, function name(err, objTransformerData) {
                                //         if (err) {
                                //             console.log("Error", err);
                                //         }
                                //     });
                            });
                        } else {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objCircuit, 'Circuit', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert2,null,null, function (insertData) {
                            });
                        }
                    }
                }
                loopInd++;
                if (loopInd == Object.keys(objData.circuitobj).length) {
                    context.log("bulk 2 length -- array-->", bulkInsert2.length)
                    try {
                        csv = json2csv(bulkInsert2, { fields });
                    } catch (err) {
                        context.log("error in csv", err);
                        callback1(err,null);
                    }
                    fs.appendFile(filePath3, csv, function (err) {
                        if (err) {
                            context.log("this is the error-->", err);
                             callback1(err,null);
                        } else {
                            insertCsvtomysql(context,filePath3,function(err,res){
                                if(err){
                                    callback1(err,null);
                                }else
                                callback1(null,true);
                            });
                        }
                    });
                }
            }
        }


    } catch (err) {
        callback1(err, null);
    }
}
function processDlCoverage(context, objData, callback1) {
    try {
        var network_coverage, i, objAngleRadians, genLatitude, genLongitude, bulkInsert, DlLatitude, DlLongitude;
        var loopInd = 0;
        bulkInsert2 = [];
        if (Object.keys(objData.dlobj).length === 0) {
            callback1(null, true);
        } else {
            for (var objCircuit in objData.dlobj) {
                if (objData.dlobj.hasOwnProperty(objCircuit)) {
                    DlLatitude = objData.dlobj[objCircuit].DlLatitude;
                    DlLongitude = objData.dlobj[objCircuit].DlLongitude;
                    network_coverage = objConfig.networkcoverage.meters;
                    for (i = 1; i <= 360; i = i + 5) {
                        objAngle = i;
                        objAngleRadians = objAngle * Math.PI / 180;
                        genLatitude = parseFloat(DlLatitude) + network_coverage * Math.sin(objAngleRadians) / 110540;
                        genLongitude = parseFloat(DlLongitude) + network_coverage * Math.cos(objAngleRadians) / (111320 * Math.cos((Math.PI * DlLatitude) / 180));
                        if (i == 356) {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objCircuit, 'DeltaLink', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert2,null,null, function (insertData) {
                                // objdaoimpl.bulkInsert("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                                //     objNetworkCoverageMapModel.objTableProps,
                                //     insertData, function name(err, objTransformerData) {
                                //         if (err) {
                                //             console.log("Error", err);
                                //         }
                                //     });
                            });
                        } else {
                            objNetworkCoverageMapModelDAO.updateNetworkCoverageMapModel2(objData, objCircuit, 'DeltaLink', objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert2,null,null, function (insertData) {
                            });
                        }
                    }
                }
                loopInd++;
                if (loopInd == Object.keys(objData.dlobj).length) {
                    context.log("bulk 2 length -- array-->", bulkInsert2.length)
                    try {
                        csv = json2csv(bulkInsert2, { fields });
                    } catch (err) {
                        context.log("error in csv", err);
                        callback1(err,null);
                    }
                    fs.appendFile(filePath4, csv, function (err) {
                        if (err) {
                            context.log("this is the error-->", err);
                             callback1(err,null);
                        } else {
                            insertCsvtomysql(context,filePath4,function(err,res){
                                if(err){
                                    callback1(err,null);
                                }else
                                callback1(null,true);
                            });
                        }
                    });
                }
            }
        }


    } catch (err) {
        callback1(err, null);
    }
}
module.exports = {
    postAllNetworkCoverageMapRelatedDetails: postAllNetworkCoverageMapRelatedDetails,
    postAllNetworkCoverageMapRelatedDetails2: postAllNetworkCoverageMapRelatedDetails2
};