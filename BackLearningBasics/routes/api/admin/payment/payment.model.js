var ObjectId = require('mongodb').ObjectID;

module.exports = (db)=>{
    var paymentModel = {};
    var paymentCollection = db.collection("metodoPago");
    var paymentTemplate = {
        namePymnt: "",
        descPymnt: "",
        statusPymnt: "",
        libPymnt:""
    }
    paymentModel.getPayments = (handler)=>{
        paymentCollection.find({}).toArray(handler);
    }//getPayments

    paymentModel.addNewPayment = (dataToAdd, handler) =>{
        var {name, dsc, status, lib} = dataToAdd;
        var paymentToAdd = Object.assign({},paymentTemplate,
            {
                namePymnt: name,
                descPymnt: dsc,
                statusPymnt: status,
                libPymnt:lib    
            });//paymentToAdd
        paymentCollection.insertOne(paymentToAdd, (err, newPayment)=>{
            if(err){
                console.log(err);
                return handler(err,null);
            }
            return handler(null,newPayment.ops[0]);
        });//insertOne
    }//addNewPayment
    paymentModel.updatePayment = (dataToUpdate , handler )=>{
        var {_id,name,dsc,status,lib} = dataToUpdate;
        var query = {"_id": new ObjectId(_id)};
        var updateCommad = {
          "$set":{
            "namePymnt": name,
            "descPymnt": dsc,
            "statusPymnt": status,
            "libPymnt":lib ,
            "lastUpdated": new Date().getTime()
          },
          "$inc":{
            "updates": 1
          }
        };
        paymentCollection.updateOne(
          query,
          updateCommad,
          (err, updatedPayment)=>{
            if(err){
                console.log(err);
              return handler(err, null);
            }
            return handler(null, updatedPayment.result);
          }
        );// updateOne
    }
    return paymentModel;
}