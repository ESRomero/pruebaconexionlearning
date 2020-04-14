var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var hasIndexEmail = false;

function pswdGenerator( pswdRaw ){
  var hashedPswd = bcrypt.hashSync(pswdRaw, 10);
  return hashedPswd;
}


module.exports = (db)=>{
  var userModel = {}
  var userCollection = db.collection("user");
  var mycoursesCollection = db.collection("user.userCourses");

  var coursesCollection = db.collection("courses");

  if(!hasIndexEmail) {
    userCollection.indexExists("userEmail_1", (err, rslt)=>{
        if(!rslt){
            userCollection.createIndex(
            { userEmail: 1 },
            { unique: true, name:"userEmail_1"},
            (err, rslt)=>{
              console.log(err, rslt);
              hasIndexEmail = true;
            });
        } else {
          hasIndexEmail = true;
        }
    });
  }

  var userTemplate = {
    userCompleteName: "",
    userAge: "",
    userGender: "",
    userEmail: "",
    userPassword: "",
    userCourses: [],
    userRoles: [],
    userActive: false,
    userDateCreated: null
  }

  userModel.addNew = (dataToAdd, handler)=>{
    var { usernames, userage, usergender, useremail, userpassword} = dataToAdd;
    var userToAdd = Object.assign(
      {},
      userTemplate,
      {
        userCompleteName:usernames,
        userAge:userage,
        userGender:usergender,
        userEmail:useremail,
        userPassword: pswdGenerator(userpassword),
        userCourses: [],
        userRoles: ["user"],
        userActive: true,
        userDateCreated: new Date().getTime()
      }
    );
    userCollection.insertOne(userToAdd, (err, rslt)=>{
      if(err){
        return handler(err, null);
      }
      console.log(rslt);
      return handler(null, rslt.ops[0]);
    }); 
  } //Registrar un Usuario


  userModel.getAll = (handler)=>{
    userCollection.find({}).toArray(handler);
  }//obtener todos los usuarios

  userModel.update = ( dataToUpdate , handler )=>{
    var { _id, usernames, userage, useractive} = dataToUpdate;
    var query = { "_id": new ObjectID(_id)};
    var updateCommad = {
      "$set":{
        userCompleteName: usernames,
        userAge:userage,
        userActive: useractive,
        lastUpdated: new Date().getTime()
      },
      "$inc" :{
        "updates": 1
      }
    };
    userCollection.updateOne(
      query,
      updateCommad,
      (err, rslt)=>{
        if(err){
          return handler(err, null);
        }
        return handler(null, rslt.result);
      }
    );
  }//Modificar Caracteristicas de un Usuario

  userModel.getById = (id, handler) => {
    var query = { "_id": new ObjectID(id) };
    userCollection.findOne(
      query,
      (err, doc) => {
        if (err) {
          return handler(err, null);
        }
        return handler(null, doc);
      }
    ); 
  }//Gesitonar un Usuario

  

  return userModel;
}