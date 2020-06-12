
const fs = require('fs');

module.exports = {
//-------------------------- slideAmt -------------------------------
	slideAmt: function(req, res, next){
		const dir = `./bsvq/src/assets/${req.body.data}/Presentation`;
		fs.readdir(dir, (err, files) => {res.json({amt: files.length})});			
	},
}
