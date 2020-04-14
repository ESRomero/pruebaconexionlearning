var ObjectID = require('mongodb').ObjectID;

module.exports = (db)=>{
    var accessModel = {};
    var accessCollection = db.collection('access');
    var accessTemplate = {
        pageName:"",
        pageURL:"",
        pageClass:"",
        hasAccess:[]
    }
    accessModel.getPages = (handler)=>{
        accessCollection.find({}).toArray(handler);
    }
    accessModel.getPagesByCod = (id,handler)=>{
        var query = {"_id":new ObjectID(id)}
        accessCollection.find(query).toArray(handler);
    }
    accessModel.modifyPage = (id,modyfingData,handler)=>{
        var query={"_id": new ObjectID(id)};
        var {pageName, pageURL, pageClass} = modyfingData;
        var updateCommand = {
            "$set":{
                pageName:pageName,
                pageURL:pageURL,
                pageClass:pageClass
            }
        }
        accessCollection.updateOne(query,updateCommand,(err, updatedPage)=>{
            if(err){
                console.log(err);
                return handler(err, null);
              }
              return handler(null, updatedPage);
        })
    }
    accessModel.newPage = (pageData, handler)=>{
        var {pageName,pageURL,pageClass} = pageData;
        var accessToAdd = Object.assign({},accessTemplate,
            {
                pageName:pageName,
                pageURL:pageURL,
                pageClass:pageClass,
                hasAccess:[]
            });
        accessCollection.insertOne(accessToAdd, (err, newAccess)=>{
            if(err){
                console.log(err);
                return handler(err,null);
            }
            return handler(null,newAccess.ops[0]);
        });
    }
    accessModel.giveAccess = (_id,type,handler)=>{
        var query = {"_id":new ObjectID(_id)};
        var updateCommand = {
            "$push":{
              "hasAccess":type
            }
        };
        accessCollection.updateOne(query,updateCommand,(err,result)=>{
            if(err){
                console.log(err);
                return handler(err, null);
              }
              return handler(null, result);
        });
    }//giveAccess
    accessModel.removeAccess = (_id,type,handler)=>{
        var query = {"_id":new ObjectID(_id)};
        var updateCommand = {
            "$pull":{
              "hasAccess":type
            }
        };
        accessCollection.updateOne(query,updateCommand,(err,result)=>{
            if(err){
                console.log(err);
                return handler(err, null);
              }
              return handler(null, result);
        });
    }//removeAccess
    accessModel.hasAccess = (userType,handler)=>{
        var query = {"hasAccess":userType};
        var projection = {"pageName":1,"pageURL":1};
        return accessCollection.find(query,{"projection":projection}).toArray(handler);
    }//hasAccess
    accessModel.deniedAccess = (type,handler)=>{
        var query = {"hasAccess":{$ne:type}};
        var projection = {"pageName":1,"pageURL":1};
        return accessCollection.find(query,{"projection":projection}).toArray(handler);
    }//deniedAccess
    accessModel.makeMenu = (userType,handler)=>{
        var query = {"hasAccess":userType,"pageClass":"MNU"};
        var projection = {"pageName":1,"pageURL":1};
        return accessCollection.find(query,{"projection":projection}).toArray(handler);
    }//hasAccess
    return accessModel;
}