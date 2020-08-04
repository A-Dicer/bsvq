
const fs = require('fs');
const multer = require('multer')

module.exports = {
//-------------------------- findOne --------------------------------
	findOne: function(req, res, next){
		const dir = `./bsvq/src/assets/${req.body.data}`;
		let data = new Object
		data.name = req.body.data;
		fs.stat(dir, function(err, stats){data.updated = stats.mtime})
		fs.readdir(dir, (err, files) => { 
			if(err) res.json({err: err})
			data.slides = files.filter(item => item !== '.DS_Store')
		});
		setTimeout(() => {res.json({project: data})}, 100);	
	},

//-------------------------- deleteFile -----------------------------
	deleteFile: function(req, res, next){
		const dir = `./bsvq/src/assets/${req.body.data}`;
		fs.rmdirSync(dir, {recursive: true })
		res.json({response: `${req.body.data} was deleted`})			
	},

//--------------------------- addFile -------------------------------
	addFile: function(req, res, next){
		const storage = multer.diskStorage({
			destination: function (req, file, cb) {
				const dir = `./bsvq/src/assets/${req.body.name}`;
				fs.mkdirSync(dir, { recursive: true })
				cb(null, `./bsvq/src/assets/${req.body.name}`)
		  	},
			filename: function (req, file, cb) {cb(null, file.originalname )}
		})

		const upload = multer({ storage: storage }).array('file')

		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) return res.status(500).json(err)
			else if (err) return res.status(500).json(err)
	  	 	return res.status(200).send(req.files)
		})	
	},

//--------------------------- findAll -------------------------------
	findAll: function(req, res, next){
		const dir = `./bsvq/src/assets/`;
		fs.readdir(dir, (err, files) => {
			let data = []
			files.forEach(file =>{
				if(file !== '.DS_Store' && file !== 'images'){					
					let project = new Object
					project.name = file
					fs.stat(`${dir}${file}`, function(err, stats){project.updated = stats.mtime})
					fs.readdir(`${dir}${file}`, (err, slides) => {project.slides = slides.filter(item => item !== '.DS_Store')})
					data.push(project)
				} 
			})
			setTimeout(() => {res.json({projects: data})}, 100);	
		});		
	},
}
