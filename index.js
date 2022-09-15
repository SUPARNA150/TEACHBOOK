

//Required modules

const express = require('express');
const fs = require('fs');
const bodyparser = require("body-parser");
const mongoose = require("mongoose")
//const { homedir } = require('os');
const path = require('path');
const app = express();

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended:true
}))
//Middle ware
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","hbs");
app.set("views", path.join(__dirname, 'views'));

// database connections

mongoose.connect('mongodb://localhost:27017/Training');
const db = mongoose.connection;
db.on('error',()=>{
    console.log("error in connecting to database");
})
db.once('once',()=>{
    console.log("Connected to database");
})

// database connections done




// Getting Data from register form and saving to db

app.post("/register",(req,res)=>{
    console.log(req.body);
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    let data={
        "name" : name,
        "email": email,
        "password": password
        
    }

    db.collection('newreaders').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }

        console.log("Record inserted successfully");


    })

   // return res.redirect("/login");
})



// Getting Data from contactus form and saving to db

app.post("/contactus",(req,res)=>{
  //console.log(req.body);
  let name = req.body.name;
  let email = req.body.email;
  let textarea = req.body.textarea;

  let data={
      "name" : name,
      "email": email,
      "textarea": textarea
      
  }

  db.collection('reviews').insertOne(data,(err,collection)=>{
      if(err){
          throw err;
      }

      console.log("Record inserted successfully");


  })

 
})



//Checking the saved data with login form data

app.post("/login",async(req,res)=>{
    
  const name = req.body.name;
  const password = req.body.password;
  //console.log(`${name} and ${password}`);
  
  const useremail = await db.collection("newreaders").findOne({name:name});
  if(useremail.password==password)
      {
          res.status(201).redirect("/readblog")
      }
      else{
          res.send("password is not matching");
      }



})




//RESTFULL apis


app.get("",(req,res)=>{
  res.set({
    "Allow-access-Allow-Origin":'*'
})
  res.render("index.hbs");
  
})
app.get("/contactus",(req,res)=>{
  res.render("contactus.hbs");
})

app.get("/blog",(req,res)=>{
  res.render("blog.hbs");
})

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get("/coursepage",(req,res)=>{
  res.render("login");
})

app.get("/coursemore",(req,res)=>{
  res.render("coursemore");
})

app.get("/readblog",(req,res)=>{
  res.render("readblog");
})


app.get("/aboutus",(req,res)=>{
  res.render("aboutus");
})



//Server listening 
app.listen(4000);