var express = require('express');
var router = express.Router();

function initPayment(db){
    var paymentModel = require('./payment.model')(db);


    router.get('/all', (req,res)=>{
        paymentModel.getPayments((err, payment)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(payment);
        });//getPayments
    });//get

    router.post('/new',(req,res)=>{
        var data = req.body;
        paymentModel.addNewPayment(data, (err, addedPayment)=>{
            if(err){
                console.log(err);
               return  res.status(500).json({"error":"error"});
            }
            return res.status(200).json(addedPayment);
        });//addNewPayment
    });//Post
    router.put('/update/:id', (req, res)=>{
        var id = req.params.id;
        var data = {
          "_id":id,
          ...req.body
        };
        paymentModel.updatePayment(data, (err, updatedDoc)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(updatedDoc);
        });//updatePayment
    });//put

    return router;
}

module.exports = initPayment;