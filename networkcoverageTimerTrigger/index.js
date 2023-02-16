var objNetworkCoverageMap = require('./controllers/networkcoveragemapcontroller.js');
var dbCon = require('./dao/mongodaoimpl');

module.exports = function (context, myTimer) {
    context.log('Network Coverage Map map initiated');
    objNetworkCoverageMap.getNetworkCoverageMap(context, function (err, obj) {
        context.log('Error getNetworkCoverageMap', err);
       // dbCon.closeConnection();
        context.done();
    });
};