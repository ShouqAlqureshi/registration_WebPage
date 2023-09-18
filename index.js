const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const database = require("./database/database.js"); 


app.use('/', express.static(path.join(__dirname, 'public', 'login')));
app.use('/signup', express.static(path.join(__dirname, 'public', 'signup')));

app.get('/login', (req, res) => {
  const { username, password } = req.query;
  const user = {
    username : username,
    password : password
  }
  database.authenticate(user)
  .then((result) => {
    if(result.length > 0){
      res.json(result);
    }
    else{
      res.redirect('/?error=true');
    }
  }
  )
});

app.get('/submitSignup', (req, res) => {
  const { username, password } = req.query;
  const user = {
    username : username,
    password : password
  }
  database.signup(user)
  .then((result) => {
    if(result){
      res.json("user created! please login");
    }
    else{
      res.redirect('/signup?error=true');
    }
  }
  )
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});