var moment = require("moment");
const AuthUser = require("../models/authUser");
var jwt = require('jsonwebtoken')






//l1
const user_index_get = (req, res) => {
  // result ==> array of objects
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWTSECRET_KEY);
  AuthUser.findById(decoded.id)
  .then((result) => {
    res.render("index", { arr: result.customerinfo, moment: moment });
  })
  .catch((err) => {
    console.log(err);
    });
};

const user_add_post = (req, res) => {
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWTSECRET_KEY);
  console.log(req.body)
  AuthUser
  .updateOne( {_id: decoded.id},{ $push: { customerinfo: 
    {
      firseName: req.body.firseName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      age: req.body.age,
      gender: req.body.gender,
      country: req.body.country,
      createdAt: new Date()
    }
  } } )
  .then(() => {
    res.redirect("/home")
  })
  .catch((err) => {
    console.log(err);
  });
}

const user_delete = (req, res) => {
  AuthUser.updateOne({"customerinfo._id" : req.params.id },{ $pull: { customerinfo: {_id: req.params.id}  } })
    .then((result) => {
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
}

const user_view_get = (req, res) => {
  // result ==> object
  AuthUser.findOne({"customerinfo._id" : req.params.id } )
    .then((result) => {

      const clickedObject = result.customerinfo.find((item) => {
        return item._id == req.params.id
      })

      res.render("user/view", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
}

const user_edit_get = (req, res) => {
  AuthUser.findOne( {"customerinfo._id" : req.params.id })
    .then((result) => {
      const clickedObject = result.customerinfo.find((item) => {
        return item._id == req.params.id
      })
      res.render("user/edit", { obj: clickedObject, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_edit_put = (req, res) => {

  AuthUser.updateOne({ "customerinfo._id" : req.params.id },{
     "customerinfo.$.firseName":  req.body.firseName, 
     "customerinfo.$.lastName":  req.body.lastName, 
     "customerinfo.$.email":  req.body.email, 
     "customerinfo.$.phoneNumber":  req.body.phoneNumber, 
     "customerinfo.$.age":  req.body.age, 
     "customerinfo.$.country":  req.body.country, 
     "customerinfo.$.gender":  req.body.gender, 
     "customerinfo.$.updatedAt":  new Date(), 
     }  )
    .then((result) => {
      res.redirect("/home");
      console.log(result)
    })
    .catch((err) => {
      console.log(err);
    });
}

const user_search_post = (req, res) => {
  const searchText = req.body.searchText.trim()
  var decoded = jwt.verify(req.cookies.jwt, process.env.JWTSECRET_KEY);
  AuthUser.findOne( {_id:decoded.id} )
    .then((result) => {
      const searchCustomers = result.customerinfo.filter((item) => {
        return item.firseName.includes(searchText) || item.lastName.includes(searchText) 
      })
      res.render("user/search", { arr: searchCustomers });
    })
    .catch((err) => {
      console.log(err);
    });
}




const user_add_get = (req, res) => {
  res.render("user/add");
}


module.exports = {
  user_edit_get,
  user_index_get,
  user_view_get,
  user_search_post,
  user_delete,
  user_edit_put,
  user_add_get,
  user_add_post,
}
