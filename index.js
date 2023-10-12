const bcrypt = require('bcrypt'); 
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const rounds =10;
const salt = bcrypt.genSaltSync(rounds) ;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const database = require("./database/database.js"); 


app.use('/', express.static(path.join(__dirname, 'public', 'login')));
app.use('/signup', express.static(path.join(__dirname, 'public', 'signup')));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword1 = bcrypt.hashSync(password, salt);
  const user = {
    username : username,
    password : hashedPassword1
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

app.post('/submitSignup', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword2 = bcrypt.hashSync(password, salt);
  const user = {
    username : username,
    password : hashedPassword2
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


const fetch = require('node-fetch');
const recaptchaSecretKey = '6LfyCJMoAAAAAJKO01Y8KZZbIWgyECENVqnTyHRn';

// endpoint for handling the reCAPTCHA verification
app.post('/verify-recaptcha', async (req, res) => {
  const recaptchaResponse = req.body['g-recaptcha-response'];

  //POST request to Google's reCAPTCHA verification endpoint
  const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
  const params = new URLSearchParams({
    secret: recaptchaSecretKey,
    response: recaptchaResponse,
  });

  const response = await fetch(verificationURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const data = await response.json();

  if (data.success) {
    res.json(result);
    res.status(200).json({ message: 'reCAPTCHA verification successful' });
  } else {
    res.redirect('/?error=true');
    res.status(400).json({ error: 'reCAPTCHA verification failed' });
  }
});

