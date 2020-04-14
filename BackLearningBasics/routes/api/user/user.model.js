var ObjectID = require("mongodb").ObjectID;
var bcrypt = require("bcrypt");
var hasIndexEmail = false;
var nodemailer = require("nodemailer");
var paypal = require("paypal-rest-sdk");
function pswdGenerator(pswdRaw) {
  var hashedPswd = bcrypt.hashSync(pswdRaw, 10);
  return hashedPswd;
}
module.exports = (db) => {
  var userModel = {};
  var userCollection = db.collection("user");
  var coursesCollection = db.collection("courses");
  var accessCollection = db.collection("access");
  var mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "learningbasicshn@gmail.com",
      pass: "LBTeam2020!",
    },
  });
  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
      "AVo9h4lEfxoIYMZtAsb7YwOIy0JBk-MvM9NzBNlAMHZkVyARYPEQjqPAcfZC7btUzOOwiDkWgM-NoXIe",
    client_secret:
      "EMUYK6FtPgpkJbT3mHgyvKpE-_qALfjtihJUJDW6vN42t2sL0656Lb9RxGfh7HWogfcHL7kYozGUgjNf",
  });

  if (!hasIndexEmail) {
    userCollection.indexExists("userEmail_1", (err, rslt) => {
      if (!rslt) {
        userCollection.createIndex(
          { userEmail: 1 },
          { unique: true, name: "userEmail_1" },
          (err, rslt) => {
            console.log(err, rslt);
            hasIndexEmail = true;
          }
        );
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
    userActive: false,
    userDateCreated: null,
    userType: "",
    userSubscription: "",
    userNextPaymentDue: null,
  };

  userModel.addNew = (dataToAdd, handler) => {
    var {
      usernames,
      userage,
      usergender,
      useremail,
      userpassword,
      months,
    } = dataToAdd;
    var dateNow = new Date().getTime();
    var date = new Date();
    var paymentDue = new Date(
      date.setMonth(date.getMonth() + months)
    ).getTime();
    var userToAdd = Object.assign({}, userTemplate, {
      userCompleteName: usernames,
      userAge: userage,
      userGender: usergender,
      userEmail: useremail,
      userPassword: pswdGenerator(userpassword),
      userCourses: [],
      userActive: false,
      userDateCreated: dateNow,
      userType: "CLI",
      userSubscription: "PND",
      userNextPaymentDue: paymentDue,
    });

    userCollection.insertOne(userToAdd, (err, rslt) => {
      if (err) {
        return handler(err, null);
      }
      //console.log(rslt);
      return handler(null, rslt.ops[0]);
    });
  }; //Registrar un Usuario

  userModel.update = (dataToUpdate, handler) => {
    var { _id, usernames, userage, usergender } = dataToUpdate;
    var query = { _id: new ObjectID(_id) };
    var updateCommad = {
      $set: {
        userCompleteName: usernames,
        userAge: userage,
        userGender: usergender,
        lastUpdated: new Date().getTime(),
      },
      $inc: {
        updates: 1,
      },
    };
    userCollection.updateOne(query, updateCommad, (err, rslt) => {
      if (err) {
        return handler(err, null);
      }
      return handler(null, rslt.result);
    });
  }; //Modificar Caracteristicas de un Usuario

  userModel.updatepass = (dataToUpdate, handler) => {
    var { _id, password } = dataToUpdate;
    var query = { _id: new ObjectID(_id) };
    var updateCommad = {
      $set: {
        userPassword: pswdGenerator(password),
        lastUpdated: new Date().getTime(),
      },
      $inc: {
        updates: 1,
      },
    };
    userCollection.updateOne(query, updateCommad, (err, rslt) => {
      if (err) {
        return handler(err, null);
      }
      return handler(null, rslt.result);
    });
  }; //Modificar Caracteristicas de un Usuario

  userModel.getById = (id, handler) => {
    var query = { _id: new ObjectID(id) };
    userCollection.findOne(query, (err, doc) => {
      if (err) {
        return handler(err, null);
      }
      return handler(null, doc);
    });
  }; //Gesitonar un Usuario

  userModel.getMyCoursesById = async (id, _page, items, handler) => {
    var query = { _id: new ObjectID(id) };
    var projection = { userCourses: 1, _id: 0 };
    userCollection.findOne(query, { projection: projection }, (err, docs) => {
      if (err) {
        console.log(err);
        return handler(err, null);
      }
      userCoursesArray = docs.userCourses;
      if (userCoursesArray !== []) {
        var idsArray = [];
        for (y = 0; y < userCoursesArray.length; y++) {
          idsArray.push(userCoursesArray[y]._id);
        }
      }
      var page = _page || 1;
      var itemsPerPage = items || 10;
      var arr = [];
      var tempID = "";
      for (z = 0; z <= userCoursesArray.length; z++) {
        tempID = new ObjectID(idsArray[z]);
        arr.push({ _id: tempID });
      }
      var options = {
        limit: itemsPerPage,
        skip: (page - 1) * itemsPerPage,
        projection: {
          courseName: 1,
          courseHours: 1,
        },
      };
      let cursor = coursesCollection.find({ $or: arr }, options);
      cursor.toArray((err, finaldocs) => {
        if (err) {
          return handler(err, null);
        }
        return handler(null, {
          allcourses: finaldocs || { at: "least", print: "this" },
          total: userCoursesArray.length,
        });
      });
    });
  }; //Gesitonar los cursos de un Usuario

  userModel.comparePswd = (hash, raw) => {
    return bcrypt.compareSync(raw, hash);
  };

  userModel.getByEmail = (email, handler) => {
    var query = { userEmail: email };
    var projection = {
      userEmail: 1,
      userPassword: 1,
      userCompleteName: 1,
      userActive: 1,
      userType: 1,
      forgotToken: 1,
    };
    userCollection.findOne(query, { projection: projection },handler);
  };

  userModel.RegisterToCourse = (userID, courseID, handler) => {
    var query1 = { _id: new ObjectID(courseID) };

    var query2 = { _id: new ObjectID(userID) };

    var courseJSON = {};

    coursesCollection.findOne(query1, (err, course) => {
      if (err) {
        console.log(err);
        return handler(err, null);
      }
      courseJSON = course;
      if (courseJSON.courseActive && true) {
        var query = { _id: new ObjectID(userID) };
        var projection = { userCourses: 1, _id: 0 };
        userCollection.findOne(
          query,
          { projection: projection },
          (err, courses) => {
            if (err) {
              return handler(err, null);
            }
            var x = 0;
            for (x = 0; x < courses.userCourses.length; x++) {
              if (
                courses.userCourses[x]._id == courseJSON._id.toString() &&
                true
              ) {
                return handler(null, { msg: "Ya tiene agregado este curso!" });
              }
            }

            var updateCommand = {
              $push: {
                userCourses: courseJSON,
              },
            }; //updateCommand

            userCollection.updateOne(query2, updateCommand, (err, rslt) => {
              if (err) {
                return handler(err, null);
              }
              query3 = { _id: new ObjectID(courseID) };
              updateCommand3 = {
                $inc: {
                  courseParticipants: 1,
                },
              };
              coursesCollection.findOneAndUpdate(
                query3,
                updateCommand3,
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return handler(err, null);
                  }
                  return handler(null, rslt.result);
                }
              );
            }); //UpdateOne
          }
        );
      } else {
        return handler(null, {
          msg:
            "Lastimosamente, no puede agregar este curso. Pruebe con otro curso",
        });
      }
    }); //findOne
  };

  //Used for Complete Node
  userModel.getCourseNodes = (courseID, userId, handler) => {
    var query = {
      _id: new ObjectID(userId),
      "userCourses._id": new ObjectID(courseID),
    };
    var projection = { "userCourses.courseNodes": 1, _id: 0 };
    userCollection.findOne(query, { projection: projection }, (err, course) => {
      if (err) {
        return handler(err, null);
      }
      return handler(null, course.userCourses[0].courseNodes);
    });
  };

  //Used for Complete Node
  userModel.extractCorrectAnswer = (nodes, nodeNumber) => {
    for (var x = 0; x < nodes.length; x++) {
      if (nodes[x].nodeNumber === nodeNumber) {
        return { correctAnswer: nodes[x].rightAnswer, index: x };
      }
    }
  };

  userModel.completeNode = (userID, id, nodeNumber, handler) => {
    var query = { _id: new ObjectID(userID) };
    var updateCommand = {
      $set: {
        "userCourses.$[c].courseNodes.$[node].nodeCompletion": true,
      },
    };
    var filter = {
      arrayFilters: [
        {
          "c._id": new ObjectID(id),
        },
        {
          "node.nodeNumber": nodeNumber,
        },
      ],
      multi: true,
    };
    userCollection.findOneAndUpdate(
      query,
      updateCommand,
      filter,
      (err, course) => {
        if (err) {
          return handler(err, null);
        }
        return handler(null, course.value.courseNodes);
      }
    );
  };

  userModel.sendEmail = (mailOptions, handler) => {
    mailer.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return handler(err, null);
      }
      return handler(null, info);
    });
  };
  userModel.paypalPayment = (paymentData, handler) => {
    var { _id, plan, planDsc, planFrequency, price } = paymentData;
    var url = require("url");
    var isoDate = new Date();
    isoDate.setSeconds(isoDate.getSeconds() + 4);
    isoDate.toISOString().slice(0, 19) + "Z";

    var billingPlanAttributes = {
      description: "Pago de Subscripcion de Learning Basics",
      merchant_preferences: {
        auto_bill_amount: "yes",
        cancel_url: "http://localhost:3001/canceled",
        initial_fail_amount_action: "continue",
        max_fail_attempts: "1",
        return_url: "http://localhost:3001/approved/",
        setup_fee: {
          currency: "USD",
          value: price,
        },
      },
      name: "Subscripcion",
      payment_definitions: [
        {
          amount: {
            currency: "USD",
            value: "0.00",
          },
          charge_models: [],
          cycles: "1",
          frequency: planFrequency,
          frequency_interval: plan,
          name: "Pago " + planDsc,
          type: "TRIAL",
        },
        {
          amount: {
            currency: "USD",
            value: "5.99",
          },
          charge_models: [],
          cycles: "0",
          frequency: "MONTH",
          frequency_interval: "1",
          name: "Pago Mensual",
          type: "REGULAR",
        },
      ],
      type: "INFINITE",
    };
    if (plan === "0") {
      billingPlanAttributes.payment_definitions = [
        {
          amount: {
            currency: "USD",
            value: "5.99",
          },
          charge_models: [],
          cycles: "0",
          frequency: "MONTH",
          frequency_interval: "1",
          name: "Pago Mensual",
          type: "REGULAR",
        },
      ];
    }
    var billingPlanUpdateAttributes = [
      {
        op: "replace",
        path: "/",
        value: {
          state: "ACTIVE",
        },
      },
    ];

    var billingAgreementAttributes = {
      name: "Pago de Subscripcion " + planDsc,
      description: "Subscripción " + planDsc + " $ " + price,
      start_date: isoDate,
      plan: {
        id: _id,
      },
      payer: {
        payment_method: "paypal",
      },
      shipping_address: {
        line1: "Col. Kennedy 1ra entrada",
        city: "Tegucigalpa",
        state: "Francisco Morazan",
        postal_code: "11101",
        country_code: "HN",
      },
    };

    // Create the billing plan
    paypal.billingPlan.create(billingPlanAttributes, function (
      error,
      billingPlan
    ) {
      if (error) {
        console.log(error);
        return handler(error, null);
      } else {
        //console.log("Create Billing Plan Response");
        //console.log(billingPlan);

        // Activate the plan by changing status to Active
        paypal.billingPlan.update(
          billingPlan.id,
          billingPlanUpdateAttributes,
          function (error, response) {
            if (error) {
              console.log(error);
              return handler(error, null);
            } else {
              // console.log("Billing Plan state changed to " + billingPlan.state);
              billingAgreementAttributes.plan.id = billingPlan.id;

              // Use activated billing plan to create agreement
              paypal.billingAgreement.create(
                billingAgreementAttributes,
                function (error, billingAgreement) {
                  if (error) {
                    console.log(error);
                    return handler(error, null);
                  } else {
                    //console.log("Create Billing Agreement Response");
                    //console.log(billingAgreement);
                    for (
                      var index = 0;
                      index < billingAgreement.links.length;
                      index++
                    ) {
                      if (
                        billingAgreement.links[index].rel === "approval_url"
                      ) {
                        var approval_url = billingAgreement.links[index].href;
                        /*console.log(
                          "For approving subscription via Paypal, first redirect user to"
                        );
                        console.log(approval_url);
                        
                        console.log("Payment token is");
                        console.log(url.parse(approval_url, true).query.token);*/

                        let token = url.parse(approval_url, true).query.token;
                        return handler(null, {
                          redirect: approval_url,
                          token: token,
                        });
                        // See billing_agreements/execute.js to see example for executing agreement
                        // after you have payment token
                      }
                    }
                  }
                }
              );
            }
          }
        );
      }
    });
  }; //paypalPayment
  userModel.executePaypal = (paymentToken, handler) => {
    paypal.billingAgreement.execute(paymentToken, {}, function (
      error,
      billingAgreement
    ) {
      if (error) {
        console.log(error);
        return handler(error, null);
      } else {
        console.log("Billing Agreement Execute Response");
        //console.log(JSON.stringify(billingAgreement));
        return handler(null, billingAgreement);
      }
    });
  };
  userModel.billingPaypal = (id, handler) => {
    paypal.billingAgreement.get(id, function (error, billingAgreement) {
      if (error) {
        console.log(error);
        return handler(error, null);
      } else {
        console.log("Get Billing Agreement");
        //console.log(JSON.stringify(billingAgreement));
        return handler(null, billingAgreement);
      }
    });
  };
  userModel.unsubscribe = (id, handler) => {
    var query = { _id: new ObjectID(id) };
    userCollection.deleteOne(query, (error, deletedUser) => {
      if (error) {
        console.log(error);
        return handler(error, null);
      }
      return handler(null, deletedUser);
    });
  };
  userModel.activateSubscription = (id, billingId, handler) => {
    var query = { _id: new ObjectID(id) };
    var updateCommad = {
      $set: {
        billingId: billingId,
        userSubscription: "ACT",
        userActive: true,
      },
    };
    userCollection.updateOne(query, updateCommad, (error, updatedUser) => {
      if (error) {
        console.log(error);
        return handler(error, null);
      }
      return handler(null, updatedUser);
    });
  };
  userModel.createForgotToken = (email, token, handler) => {
    var query = { userEmail: email };

    var updateCommad = {
      $set: {
        forgotToken: token,
      },
    };
    userCollection.updateOne(query, updateCommad, (error, updatedUser) => {
      if (error) {
        console.log(error);
        return handler(error, null);
      }
      return handler(null, updatedUser);
    });
  };
  userModel.deleteToken = (id, handler) => {
    var query = { _id: new ObjectID(id) };
    var updateCommad = {
      $unset: {
        forgotToken: "",
      },
    };
    userCollection.updateOne(query, updateCommad, (error, updatedUser) => {
      if (error) {
        console.log(error);
        return handler(error, null);
      }
      return handler(null, updatedUser);
    });
  };
  userModel.getBillingId = (id, handler) => {
    var query = { _id: new ObjectID(id) };
    var projection = { billingId: 1 };
    userCollection.findOne(
      query,
      { projection: projection },
      (error, result) => {
        if (error) {
          console.log(error);
          return handler(error, null);
        }
        return handler(null, result);
      }
    );
  };
  
  userModel.cancelSubscription = (billingId, handler) => {
    var cancel_note = {
      note: "Cancelación de Subscripción",
    };

    paypal.billingAgreement.cancel(billingId, cancel_note, function (
      error,
      response
    ) {
      if (error) {
        console.log(error);
        return handler(error, null);
      } else {
        console.log("Cancel Billing Agreement Response");
        console.log(response);

        paypal.billingAgreement.get(billingId, function (
          error,
          billingAgreement
        ) {
          if (error) {
            console.log(error.response);
            return handler(error, null);
          } else {
            console.log(billingAgreement.state);
            return handler(null, billingAgreement.state);
          }
        });
      }
    });
  };
  userModel.inactivateUser = (id, handler) => {
    var query = { _id: new ObjectID(id) };
    var updateCommad = {
      $set: {
        userSubscription: "INA",
        userActive: false,
      },
      $unset: {
        billingId: "",
      },
    };
    userCollection.updateOne(query, updateCommad, (error, result) => {
      if (error) {
        console.log(error);
        return handler(error, null);
      }
      return handler(null, result);
    });
  };
  return userModel;
};
