//jshint esversion:6

//....https://afternoon-hollows-69523.herokuapp.com     ...herokuIP where web is deployed

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');    //this will find views folder in our project which contain ejs files

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



//mongoose.connect("mongodb://localhost:27017/todolistDB",{         //....make connection with mongodb proveds local host server


mongoose.connect("mongodb+srv://abhijit:Abhijit@1234@cluster0.bxbyt.mongodb.net/todolistDB",{      //conection using mongodb atlas
  useNewUrlParser:true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];



const itemsSchema=new mongoose.Schema({           //...schema created
  name:String
});



const Item=mongoose.model("Item",itemsSchema);      //....model created




const item1=new Item({
  name:"Welcom to your todolist!"
});

const item2=new Item({
  name:"Hit + button to add new item "
});

const item3=new Item({
  name:"<-- Hit this to delete an item"
});

const defaultItems=[item1,item2,item3];


const listSchema={
  name: String,
  items: [itemsSchema]
};
 const List =mongoose.model("List",listSchema);         //list model from list schema
// Item.insertMany(defaultItems,function(err){                   //..inserting items into Item collection
//   if(err)
//     console.log(err);
//     else
//     console.log("succesfully")
//
// });





app.get("/", function(req, res) {

//const day = date.getDate();

  //res.render("list", {listTitle: day, newListItems: items});         //...external module
  Item.find({},function(err,foundItems){                               //data from Item model--to callback function( foundItems)

    if(foundItems.length===0){

      Item.insertMany(defaultItems,function(err){                   //..inserting items into Item collection
        if(err)
          console.log(err);
          else
          console.log("Succesfully saved default Items");

      });
   res.redirect("/");
    }
    else
    res.render("list",{listTitle:"Today",newListItems:foundItems});   //..render newly addedd atoms into list(find function)
  });
  //res.render("list", {listTitle:"Today", newListItems: items});

});



app.get("/:customListName",function(req,res){          //using params
  const customListName= req.params.customListName;
  List.findOne({name:customListName},function(err,foundList){
    if(!err){
    if(!foundList){
      //create new list
      const list=new List({
        name:customListName,
        items:defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
    }
    else
      //show existing list
      res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
    }
  });

});




app.post("/", function(req, res){

  // const item = req.body.newItem;
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }

  const itemName=req.body.newItem;
  const item =new Item({
    name:itemName,
  });
  item.save();
  res.redirect("/");


});


app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("deleted succesfully!");
      res.redirect("/");
    }
  });   //remove item whose checkboxid got
});




app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});





// app.listen(3000, function() {                    //...to use local host 3000
//   console.log("Server started on port 3000");
// });

let port=process.env.PORT;
if(port==null || port==""){
  port=3000;
}

app.listen(port, function() {                    //...to use heroku server(dynamic port)
  console.log("Server has started succesfully");
});
