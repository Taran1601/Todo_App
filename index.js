// require express for setting up the express server
const express=require('express');
// set up the path
const path=require('path');

// set up the port number
const port=8000;

// importing the DataBase
const db=require('./config/mongoose');

// importng the Schema For tasks
const Task=require('./models/todo');

// using express
const app=express();

// set up the view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// to use encrypted data
app.use(express.urlencoded());

// using static files
app.use(express.static('assets'));
var taskList =[
    {
        description:"Add a task",
        date:"16/01/2022",
        category:"Others"
    }
]

// rendering the App Page
app.get('/',function(req,res){
    // return res.render('todo',{
    //     title:"Todo App",
    //     task_list:taskList
    // });
    Task.find({},function(err,tasks){
      if(err){
          console.log(`Error in fetching tasks from database`);
          return;
      }
      return res.render('todo',{
          title:"Todo App",
          task_list:tasks
      });
    });
});

//for adding a task
app.post('/add_task',function(req,res){
    //  taskList.push(req.body);
    //  return res.redirect('back');
    
    
    Task.create({
        description:req.body.description,
        date:req.body.date,
        category:req.body.category
    },function(err,newTask){
      if(err){
          console.log(`Error in creating a task.`);
          return;
      }
      console.log('****',newTask);
      return res.redirect('back');
    });
});
 // for deleting a task
app.get('/delete_task',function(req,res){
// var count=Object.keys(req.query).length;
// let id=Object.keys(req.query);

//    for(var i=0;i<count;i++){
//     let taskIndex=taskList.findIndex(task => task.date == id[i])
//     if(taskIndex!=-1){
//       taskList.splice(taskIndex,1);
//   }
//    }

//     return res.redirect('back');

// get the id from query
var id = req.query;

// checking the number of tasks selected to delete
var count = Object.keys(id).length;
for(let i=0; i < count ; i++){
    
    // finding and deleting tasks from the DB one by one using id
    Task.findByIdAndDelete(Object.keys(id)[i], function(err){
    if(err){
        console.log('Error in deleting task from databse.');
        }
    })
}
return res.redirect('back'); 

});
// make the app to listen on asigned port number
app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});