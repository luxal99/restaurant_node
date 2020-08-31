const express = require('express')
const path = require('path');
const app = express();
const port = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'src/pages'));
app.set('view engine', 'ejs');
//setup public folder
app.use(express.static(__dirname + '/src/public/assets'));

app.get('/',function (req, res) {
    res.render('home')

});

app.get('/login',(req,res)=>{
    res.render('login')
})
app.listen(port,()=>{
    console.log("Runned")
})
