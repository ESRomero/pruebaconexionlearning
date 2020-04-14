var ObjectID = require('mongodb').ObjectID;

module.exports = (db)=>{
    var courseModel = {};
    var coursesCollection = db.collection('courses');

    courseModel.getActiveCourses = async (_page, _itemsPerPage, handler)=>{
        var page = _page || 1;
        var itemsPerPage = _itemsPerPage||10;
        var filter = {"courseActive":true};
        var options = {
            "limit": itemsPerPage,
            "skip": ((page-1)*itemsPerPage),
            "projection":{
                "courseName":1, "courseHours":1,"courseDesc":1,"_id":1
            }
        }
        let cursor = coursesCollection.find(filter, options);
        let totalCourses = await cursor.count();
        cursor.toArray((err, docs)=>{
            if(err){
                console.log(err);
                return handler(err, null);
            }
            return handler(null, {total: totalCourses, courses: docs});
        });
    }

    courseModel.getCourseInfo = (id, handler) => {
        var query = {"_id":new ObjectID(id)};
        var projection = { "courseName": 1, "courseDesc": 1, "courseHours":1};
        coursesCollection.findOne(
          query,
          {"projection":projection},
          (err, Course)=>{
            if(err){
              return handler(err,null);
            }
            return handler(null, Course);
          }
        );
    }
    
    return courseModel;
}