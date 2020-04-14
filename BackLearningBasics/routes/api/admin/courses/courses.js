var express = require('express');
var router = express.Router();

function initCourses(db){
    var coursesModel = require('./courses.model')(db);

    router.get('/all',(req,res)=>{
        coursesModel.showCourses((err, courses)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(courses);
        });
    });

    router.get('/:id',(req, res)=>{
        var id =  req.params.id ;
        coursesModel.getById(id, (err, doc)=>{
          if(err){
            console.log(err);
            return res.status(500).json({"error":"error"});
          }
          return res.status(200).json(doc);
        });
    }); //Obtener curso por ID

    router.post('/new', (req, res)=>{
        var act = req.body.act;
        var chours = parseInt(req.body.chours);
        if(act.toLowerCase()=="true")
            act = true;
        else
            act = false;
        var data = {
            "active":act, 
            "hours":chours, 
            ...req.body
        };
        coursesModel.addNewCourse(data, (err, newCourse)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(newCourse);
        });//addNewCourse
    });//post

    router.put('/update/:id', (req, res)=>{
        var id = req.params.id;
        var act = req.body.act;
        var chours = parseInt(req.body.chours);
        if(act.toLowerCase()=="true")
            act = true;
        else
            act = false;
        var data = {
            "_id": id,
            "active":act, 
            "hours":chours, 
            ...req.body
        };
        coursesModel.update(data, (err, updatedDoc)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(updatedDoc);
        });
    });//put


    //Nodos

    router.get('/nodes/all/:id',(req,res)=>{
        var id = req.params.id;
        coursesModel.showNodes(id, (err, node)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(node);
        });
    });

    router.put('/node/new/:id', (req, res)=>{
        var id = req.params.id;
        var num = parseInt(req.body.num);
        var data = {
            "_id":id,
            "number":num,
            ...req.body
        };
        coursesModel.addNode(data, (err, newNode)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(newNode);
        });
    });

    router.put('/node/upd/:idc/:idn', (req, res)=>{
        var idCourse = req.params.idc;
        var numNode = parseInt(req.params.idn);
        var data = {
            "_id": idCourse,
            "_nodeNumber": numNode,
            ...req.body
        };
        coursesModel.updateNode(data, (err, updatedNode)=>{
            if(err){
                console.log(err);
                return res.status(500).json({"error":"error"});
            }
            return res.status(200).json(updatedNode);
        });
    });

    return router;
}
module.exports = initCourses;