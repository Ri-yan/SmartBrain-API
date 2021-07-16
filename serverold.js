const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const image = require('./controllers/image');
const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'psql',
    database : 'smart-brain'
  }
});

const app = express();
      app.use(cors());
      app.use(bodyParser.json());

/*
  //for database
  const database={
  	users:[
  	{
  		id:'1',
  		name:'admin',
  		email:'admin',
  		password:'admin',
  		entries:0,
  		joined:new Date()
  	},
  	{
  		id:'123',
  		name:'john',
  		email:'john@gmail.com',
  		password:'cookies',
  		entries:0,
  		joined:new Date()
  	},
  	{
  		id:'124',
  		name:'sally',
  		email:'sally@gmail.com',
  		password:'banana',
  		entries:0,
  		joined:new Date()
  	}
  ]}
*/

//root
app.get('/',(req,res)=>{
	res.send(db.users);
})


//signin
app.post('/signin', (req, res) => {
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json('incorrect form submisson');
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})


//register
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  if(!email||!name||!password){
    return res.status(400).json('incorrect form submisson');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
})


//profile for future use
app.get('/profile/:id',(req,res)=>{
	const {id}=req.params;
	db.select('*').from('users').where({id})
	.then(user=>{
		if (user.lenth){
		res.json(user[0])
	}else{
		res.status(400).json('not found')
	}
})
	.catch(err=>res.status(400).json('getting error'))
	
	})


//image search entries
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000,()=>{
	console.log('app is running on port 3000')
});



