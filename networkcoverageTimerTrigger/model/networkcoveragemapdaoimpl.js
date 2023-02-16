var objdaoimpl = require('../dao/mysqldaoimpl.js');
var moment = require("moment");
var objConfig = require('../config.js');
var objNetworkCoverageMapModel = require('../model/sqltables/networkcoveragemodel.js');
/**
* @description - Code to update network coverage map
* @param objData - object data
* @param objindex - index
* @param param - parameter
* @param objAngle - angle
* @param objAngleRadians - Angle radians
* @param genLatitude- latitude
* @param genLongitude - longitude
* @param objTransformerData - transformer data
* @return callback
*/
function updateNetworkCoverageMapModel(objData, objindex, param, objAngle, objAngleRadians, genLatitude, genLongitude, callback) {
    var objectToInsert = {};
    if (param === 'Circuit') {
        objectToInsert.TypeID = objindex;
        objectToInsert.Shape = 'CR';
        objectToInsert.Latitude = objData.circuitobj[objindex].CircuitLatitude;
        objectToInsert.Longitude = objData.circuitobj[objindex].CircuitLongitude;
        objectToInsert.Gen_Latitude = genLatitude;
        objectToInsert.Gen_Longitude = genLongitude;
        objectToInsert["Angle(degrees)"] = objAngle;
        objectToInsert["Angle(radians)"] = objAngleRadians;
        objectToInsert["Network Coverage"] = objConfig.networkcoverage.hyperSprouts;
        objectToInsert["Connected Circuit"] = objindex;
        objectToInsert["Connected Transformer"] = null;
        objectToInsert["Circuit ID"] = objindex;
        objectToInsert["Transformer ID"] = null;
        objectToInsert["Meter ID"] = null;
        objdaoimpl.insertData("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
            objNetworkCoverageMapModel.objTableProps,
            objectToInsert, function name(err, objCircuitData) {
                if (err) {
                    console.error("Error", err);
                }
                callback(err, objCircuitData);
            });
    }

    if (param === 'Transformer' || param === 'HyperHub') {
        if (param === 'Transformer') {
            objectToInsert.TypeID = objData.transformerobj[objindex].TransformerSerialNumber;
            objectToInsert.Shape = 'TR';
        } else {
            objectToInsert.TypeID = objData.transformerobj[objindex].HypersproutSerialNumber;
            objectToInsert.Shape = 'HH';
        }
        objectToInsert.Latitude = objData.transformerobj[objindex].TransformerLatitude;
        objectToInsert.Longitude = objData.transformerobj[objindex].TransformerLongitude;
        objectToInsert.Gen_Latitude = genLatitude;
        objectToInsert.Gen_Longitude = genLongitude;
        objectToInsert["Angle(degrees)"] = objAngle;
        objectToInsert["Angle(radians)"] = objAngleRadians;
        objectToInsert["Network Coverage"] = objConfig.networkcoverage.hyperSprouts;
        objectToInsert["Connected Circuit"] = objData.transformerobj[objindex].CircuitID;
        objectToInsert["Connected Transformer"] = objData.transformerobj[objindex].TransformerSerialNumber;
        objectToInsert["Circuit ID"] = objData.transformerobj[objindex].CircuitID;
        objectToInsert["Transformer ID"] = objData.transformerobj[objindex].TransformerSerialNumber;
        objectToInsert["Meter ID"] = null;
        objdaoimpl.insertData("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
            objNetworkCoverageMapModel.objTableProps,
            objectToInsert, function name(err, objTransformerData) {
                if (err) {
                    console.error("Error", err);
                }
                callback(err, objTransformerData);
            });
    }

    if (param === 'Meter') {
        if (objData.meterobj[objindex].Status === 'Registered' && typeof (objData.meterobj[objindex].TransformerID) !== 'undefined') {
            objectToInsert.TypeID = objData.meterobj[objindex].MeterSerialNumber;
            objectToInsert.Shape = 'MR';
            objectToInsert.Latitude = objData.meterobj[objindex].MeterLatitude;
            objectToInsert.Longitude = objData.meterobj[objindex].MeterLongitude;
            objectToInsert.Gen_Latitude = genLatitude;
            objectToInsert.Gen_Longitude = genLongitude;
            objectToInsert["Angle(degrees)"] = objAngle;
            objectToInsert["Angle(radians)"] = objAngleRadians;
            objectToInsert["Network Coverage"] = objConfig.networkcoverage.meters;
            var connectedTransformer = objData.meterobj[objindex].TransformerID;
            objectToInsert["Connected Circuit"] = objData.transformerobj[connectedTransformer].CircuitID;
            objectToInsert["Connected Transformer"] = objData.transformerobj[connectedTransformer].TransformerSerialNumber;
            objectToInsert["Circuit ID"] = objData.transformerobj[connectedTransformer].CircuitID;
            objectToInsert["Transformer ID"] = objData.transformerobj[connectedTransformer].TransformerSerialNumber;
            objectToInsert["Meter ID"] = objData.meterobj[objindex].MeterSerialNumber;
            objdaoimpl.insertData("networkcoverage", objNetworkCoverageMapModel.objNetworkCoverage,
                objNetworkCoverageMapModel.objTableProps,
                objectToInsert, function name(err, objMeterData) {
                    if (err) {
                        console.error("Error", err);
                    }
                    callback(err, objMeterData);
                });
        }
    }

}

 
function updateNetworkCoverageMapModel2(objData, objindex, param, objAngle, objAngleRadians, genLatitude, genLongitude, bulkInsert, isHyperHub, transformerID, callback) {
   
    var objectToInsert = {};
   var datetime = new Date(Date.now());
   var now = datetime.toISOString();
   objectToInsert["createdAt"] = now;
   objectToInsert["updatedAt"] = now;
   if (param === 'Circuit') {
       objectToInsert.TypeID = objindex;
       objectToInsert.Shape = 'CR';
       objectToInsert.Latitude = objData.circuitobj[objindex].CircuitLatitude;
       objectToInsert.Longitude = objData.circuitobj[objindex].CircuitLongitude;
       objectToInsert.Gen_Latitude = genLatitude;
       objectToInsert.Gen_Longitude = genLongitude;
       objectToInsert["Angle(degrees)"] = objAngle;
       objectToInsert["Angle(radians)"] = objAngleRadians;
       objectToInsert["Network Coverage"] = objConfig.networkcoverage.hyperSprouts;
       objectToInsert["Connected Circuit"] = objindex;
       objectToInsert["Connected Transformer"] = null;
       objectToInsert["Circuit ID"] = objindex;
       objectToInsert["Transformer ID"] = null;
       objectToInsert["Meter ID"] = null;
       objectToInsert.Transformer_CellID = null;
       objectToInsert.Hypersprout_SerialNumber = null;
       objectToInsert.IsHyperHub = isHyperHub ? 1 : 0;
       objectToInsert.IsSelfHeal = 0;
       bulkInsert.push(objectToInsert);
       callback(bulkInsert);
   }
 
   if (param === 'Transformer' || param === 'HyperHub') {
       if (param === 'Transformer') {
           objectToInsert.TypeID = objData.transformerobj[objindex].TransformerSerialNumber;
           objectToInsert.Shape = 'TR';
       } else {
           objectToInsert.TypeID = objData.transformerobj[objindex].HypersproutSerialNumber;
           objectToInsert.Shape = 'HH';
       }
       objectToInsert.Latitude = objData.transformerobj[objindex].TransformerLatitude;
       objectToInsert.Longitude = objData.transformerobj[objindex].TransformerLongitude;
       objectToInsert.Gen_Latitude = genLatitude;
       objectToInsert.Gen_Longitude = genLongitude;
       objectToInsert["Angle(degrees)"] = objAngle;
       objectToInsert["Angle(radians)"] = objAngleRadians;
       objectToInsert["Network Coverage"] = objConfig.networkcoverage.hyperSprouts;
       objectToInsert["Connected Circuit"] = objData.transformerobj[objindex].CircuitID;
       objectToInsert["Connected Transformer"] = objData.transformerobj[objindex].TransformerSerialNumber;
       objectToInsert["Circuit ID"] = objData.transformerobj[objindex].CircuitID;
       objectToInsert["Transformer ID"] = objData.transformerobj[objindex].TransformerSerialNumber;
       objectToInsert["Meter ID"] = null;
       objectToInsert.Transformer_CellID = transformerID;
       objectToInsert.Hypersprout_SerialNumber = objData.transformerobj[objindex].HypersproutSerialNumber;
       objectToInsert.IsHyperHub = isHyperHub ? 1 : 0;
       objectToInsert.IsSelfHeal = 0;
       bulkInsert.push(objectToInsert);
       callback(bulkInsert);
   }
 
   if (param === 'Meter') {
       if (objData.meterobj[objindex].Status === 'Registered' && typeof (objData.meterobj[objindex].TransformerID) !== 'undefined') {
           objectToInsert.TypeID = objData.meterobj[objindex].MeterSerialNumber;
           objectToInsert.Shape = 'MR';
           objectToInsert.Latitude = objData.meterobj[objindex].MeterLatitude;
           objectToInsert.Longitude = objData.meterobj[objindex].MeterLongitude;
           objectToInsert.Gen_Latitude = genLatitude;
           objectToInsert.Gen_Longitude = genLongitude;
           objectToInsert["Angle(degrees)"] = objAngle;
           objectToInsert["Angle(radians)"] = objAngleRadians;
           objectToInsert["Network Coverage"] = objConfig.networkcoverage.meters;
         //  if (objData.meterobj[objindex].self_heal == 1) {
            connectedTransformer = objData.meterobj[objindex].HypersproutID;
        //} else {
        //    connectedTransformer = objData.meterobj[objindex].TransformerID;
        //}
        if (objData.transformerobj[connectedTransformer]) {
               objectToInsert["Connected Circuit"] = objData.transformerobj[connectedTransformer].CircuitID ? objData.transformerobj[connectedTransformer].CircuitID : 0;
               objectToInsert["Connected Transformer"] = objData.transformerobj[connectedTransformer].TransformerSerialNumber;
               objectToInsert["Circuit ID"] = objData.transformerobj[connectedTransformer].CircuitID ? objData.transformerobj[connectedTransformer].CircuitID : 0;
               objectToInsert["Transformer ID"] = objData.transformerobj[connectedTransformer].TransformerSerialNumber;
               objectToInsert["Meter ID"] = objData.meterobj[objindex].MeterSerialNumber;
               objectToInsert.Transformer_CellID = connectedTransformer;
               objectToInsert.Hypersprout_SerialNumber =   objData.transformerobj[connectedTransformer].HypersproutSerialNumber;
               objectToInsert.IsHyperHub = objData.transformerobj[connectedTransformer].IsHyperHub ? 1 : 0;
               objectToInsert["NoOfDeltalinkAllocated"] = objData.meterobj[objindex].NoOfDeltalinkAllocated;
            //    objectToInsert["Master_DeltalinkSerialNumber"] = objData.meterobj[objindex].Master_DeltalinkSerialNumber ? objData.meterobj[objindex].Master_DeltalinkSerialNumber : null;
            //    objectToInsert["Master_DeltalinkID"] = objData.meterobj[objindex].Master_DeltalinkID ? objData.meterobj[objindex].Master_DeltalinkID : null;
            //    objectToInsert["Slave_DeltalinkSerialNumber"] = objData.meterobj[objindex].Slave_DeltalinkSerialNumber ? objData.meterobj[objindex].Slave_DeltalinkSerialNumber : null;
            //    objectToInsert["Slave_DeltalinkID"] = objData.meterobj[objindex].Slave_DeltalinkID ? objData.meterobj[objindex].Slave_DeltalinkID : null;
               objectToInsert.IsSelfHeal = objData.meterobj[objindex].self_heal ? objData.meterobj[objindex].self_heal : 0;
               bulkInsert.push(objectToInsert);
            }
            else{
                if ((objData.meterobj[objindex].self_heal == 1) && (objData.meterobj[objindex].TransformerID !== null || typeof objData.meterobj[objindex].TransformerID !== 'string')) {
                    var connectedTransformer1 = objData.meterobj[objindex].TransformerID;
                    objectToInsert["Connected Circuit"] = objData.transformerobj[connectedTransformer1].CircuitID ? objData.transformerobj[connectedTransformer1].CircuitID : 0;
                    objectToInsert["Connected Transformer"] = objData.transformerobj[connectedTransformer1].TransformerSerialNumber;
                    objectToInsert["Circuit ID"] = objData.transformerobj[connectedTransformer1].CircuitID ? objData.transformerobj[connectedTransformer1].CircuitID : 0;
                    objectToInsert["Transformer ID"] = objData.transformerobj[connectedTransformer1].TransformerSerialNumber;
                    objectToInsert["Meter ID"] = objData.meterobj[objindex].MeterSerialNumber;
                    objectToInsert.Transformer_CellID = connectedTransformer1;
                    objectToInsert.Hypersprout_SerialNumber = objData.transformerobj[connectedTransformer1].HypersproutSerialNumber;
                    objectToInsert.IsHyperHub = objData.transformerobj[connectedTransformer1].IsHyperHub ? 1 : 0;
                    objectToInsert["NoOfDeltalinkAllocated"] = objData.meterobj[objindex].NoOfDeltalinkAllocated;
                    // objectToInsert["Master_DeltalinkSerialNumber"] = objData.meterobj[objindex].Master_DeltalinkSerialNumber ? objData.meterobj[objindex].Master_DeltalinkSerialNumber : null;
                    // objectToInsert["Master_DeltalinkID"] = objData.meterobj[objindex].Master_DeltalinkID ? objData.meterobj[objindex].Master_DeltalinkID : null;
                    // objectToInsert["Slave_DeltalinkSerialNumber"] = objData.meterobj[objindex].Slave_DeltalinkSerialNumber ? objData.meterobj[objindex].Slave_DeltalinkSerialNumber : null;
                    // objectToInsert["Slave_DeltalinkID"] = objData.meterobj[objindex].Slave_DeltalinkID ? objData.meterobj[objindex].Slave_DeltalinkID : null;
                    objectToInsert.IsSelfHeal = objData.meterobj[objindex].self_heal ? objData.meterobj[objindex].self_heal : 0;
                    bulkInsert.push(objectToInsert);
                }
              }
            callback(bulkInsert);
        }
    }

    if (param === 'DeltaLink') {
        objectToInsert.TypeID = objData.dlobj[objindex].Master_DeltalinkSerialNumber;
        objectToInsert.Shape = 'DL';
        objectToInsert.Latitude = objData.dlobj[objindex].DlLatitude;
        objectToInsert.Longitude = objData.dlobj[objindex].DlLongitude;
        objectToInsert.Gen_Latitude = genLatitude;
        objectToInsert.Gen_Longitude = genLongitude;
        objectToInsert["Angle(degrees)"] = objAngle;
        objectToInsert["Angle(radians)"] = objAngleRadians;
        objectToInsert["Network Coverage"] = objConfig.networkcoverage.meters;
        let HypersproutID = objData.dlobj[objindex].HypersproutID;
        if (objData.transformerobj[HypersproutID]) {
            objectToInsert["Connected Circuit"] = objData.transformerobj[HypersproutID].CircuitID ? objData.transformerobj[HypersproutID].CircuitID : 0;
            objectToInsert["Connected Transformer"] = objData.transformerobj[HypersproutID].TransformerSerialNumber;
            objectToInsert["Circuit ID"] = objData.transformerobj[HypersproutID].CircuitID ? objData.transformerobj[HypersproutID].CircuitID : 0;
            objectToInsert["Transformer ID"] = objData.transformerobj[HypersproutID].TransformerSerialNumber;
            objectToInsert["Meter ID"] = 0;
            objectToInsert.Transformer_CellID = HypersproutID;
            objectToInsert.Hypersprout_SerialNumber = objData.transformerobj[HypersproutID].HypersproutSerialNumber;
            objectToInsert.IsHyperHub = objData.transformerobj[HypersproutID].IsHyperHub ? 1 : 0;
            objectToInsert["NoOfDeltalinkAllocated"] = objData.meterobj[objindex].NoOfDeltalinkAllocated;
            objectToInsert["Master_DeltalinkSerialNumber"] = objData.dlobj[objindex].Master_DeltalinkSerialNumber ? objData.dlobj[objindex].Master_DeltalinkSerialNumber : null;
            objectToInsert["Master_DeltalinkID"] = objData.dlobj[objindex].Master_DeltalinkID ? objData.dlobj[objindex].Master_DeltalinkID : null;
            objectToInsert["Slave_DeltalinkSerialNumber"] = objData.dlobj[objindex].Slave_DeltalinkSerialNumber ? objData.dlobj[objindex].Slave_DeltalinkSerialNumber : null;
            objectToInsert["Slave_DeltalinkID"] = objData.dlobj[objindex].Slave_DeltalinkID ? objData.dlobj[objindex].Slave_DeltalinkID : null;
            bulkInsert.push(objectToInsert);
        }
        callback(bulkInsert);
    }
}

module.exports = {
    updateNetworkCoverageMapModel: updateNetworkCoverageMapModel,
    updateNetworkCoverageMapModel2: updateNetworkCoverageMapModel2
};

