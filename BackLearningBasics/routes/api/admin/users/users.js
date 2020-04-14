var express =  require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

function initUser (db) {

var userModel = require('./users.model')(db);

router.get('/all', (req, res)=>{
    userModel.getAll((err, users)=>{
      if(err){
        console.log(err);
        return res.status(500).json({"error":"error"});
      }
      return res.status(200).json(users);
    });
} ); //Ver todos los usuarios

router.post('/register', (req, res)=>{
    var edad = parseInt(req.body.edad);
    var data = {
      "userage": edad,
      ...req.body
    };
    userModel.addNew(data, (err, addedDoc)=>{
      if(err){
        console.log(err);
        return res.status(500).json({error:'error'});
      }
      return res.status(200).json(addedDoc);
      }); 
  }); //Registrarse como Usuario

router.get('/:id',(req, res)=>{
    var id =  req.params.id ;
    userModel.getById(id, (err, doc)=>{
      if(err){
        console.log(err);
        return res.status(500).json({"error":"error"});
      }
      return res.status(200).json(doc);
    });
}); //Gestionar Usuario


  router.put('/upd/:id', (req, res)=>{
    var id = req.params.id;
    var edad = parseInt(req.body.edad);
    var activo = req.body.active;
    if(activo.toLowerCase()=="true")
        activo = true;
    else
        activo=false;
    var data = {
      "_id": id,
      "userage": edad,
      "useractive": activo, 
      ...req.body
    };
    userModel.update(data, (err, updatedDoc)=>{
      if(err){
        console.log(err);
        return res.status(500).json({"error":"error"});
      }
      return res.status(200).json(updatedDoc);
    });
  });//Modificar Caracteristicas de Usuario

  return router;
}
module.exports = initUser;