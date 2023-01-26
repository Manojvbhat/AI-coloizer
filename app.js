
const express =require("express");
const path=require("path")
const bodyparser= require("body-parser");
// require('dotenv').config();
const fs = require('fs');
var multer = require('multer');
const PORT = process.env.PORT || 8080;

const app=express();

app.use(express.static(__dirname+"/public"));
app.set("views",path.join(__dirname+"/views"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));

const uploaddir=path.join(__dirname+"/public/upload");
var storage=multer.diskStorage
(
	{
		destination:(req,file,cb)=>
		{
			cb(null,uploaddir)
		},
		filename:(req,file,cb)=>{
			cb(null,"original.png")
		}
	}
);
var upload = multer({ storage: storage });

//Create a new promise to run a python  script
// let runPy = new Promise(function(success, nosuccess)
//  {

//     const { spawn } = require('child_process');
//     const pyprog = spawn('python', ['demo_release.py']);
// 	// pyprog.stdout.on('data', function(data) {

//     //     success(data);
//     // });

//     // pyprog.stderr.on('data', (data) => {

//     //     nosuccess(data);
//     // });
// });

//Home route
app.get("/",async(req,res)=>
{
	const directory1= path.join(__dirname+"/public/colorimg");
	fs.readdir(directory1, (err, files) => {
		if (err) throw err;
	  
		for (const file of files) {
		  fs.unlink(path.join(directory1, file), (err) => {
			if (err) throw err;
		  });
		}
	});
	const directory2= path.join(__dirname+"/public/upload");
	fs.readdir(directory2, (err, files) => {
		if (err) throw err;
	  
		for (const file of files) {
		  fs.unlink(path.join(directory2, file), (err) => {
			if (err) throw err;
		  });
		}
	});
	res.render("home");
})

//Display Images
app.get("/image",(req,res)=>
{
	res.render("image");//to render the images 
})

//upload images
app.post("/image",upload.single("bwimage"),async(req,res)=>
{
	const { spawn } = require('child_process');
    const pyProg = spawn('python', ['demo_release.py']);

    pyProg.stdout.on('data', function(data) {

        //console.log(data.toString());
        //res.write(data);
        //res.end('end');
		
    });

	pyProg.on("close",(code)=>
	{
		console.log(code);
		res.redirect("image");
	})
	
})

//redrect to home page
app.post("/backtohome",(req,res)=>
{

res.redirect("/");

}
)

app.listen(PORT,()=>
{
	console.log("Server is up and running");
})

