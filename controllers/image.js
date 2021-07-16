// const Clarifai =require('clarifai');

// //**************API Key***************
// const app = new Clarifai.App({
// 	apiKey: '21c4440ee1f9488f9374c86be7e3d950'
// });

// const handleApiCall= (req,res) => {
//  app.models
//  	.predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
//  	.then(data =>{
//  	 res.json(data);
//  	})
//  	.catch(err=>res.status(400).json('unable to work API'))
// }
// const handleImage=(req,res,db)=>{
// 	const {id}=req.body;
//   db('users').where('id', '=', id)
//   .increment('entries',1)
//   .returning('entries')
//   .then(entries=>{
//   	res.json(entries[0]);
//   })
//   .catch(err=>res.status(400).json('unable to get entries'))
// }

// module.exports={
// 	handleImage,
// 	handleApiCall
// }

const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '21c4440ee1f9488f9374c86be7e3d950'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}