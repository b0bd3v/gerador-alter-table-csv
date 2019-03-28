const csv = require('fast-csv')
const fs = require('fs')
const fileHelper = require('./FileHelper')

let csvPath = "data/campos.csv"
let command = 'create'

process.argv.forEach(function(val, index, array) {
	
	if( val.split('=')[1]  !== undefined ){
		val = val.split('=')[1]
	}
	
	if(fileHelper.isFilePathCSV(val)){
		try {
			var stats = fs.statSync(val)
			csvPath = val
		}
		catch(err) {
			console.log(`Arquivo ${val} não existe.`)
			process.exit()
		}
	}
	
	switch (val) {
		case "create":
			command = 'create'
			break
		case "drop":
			command = 'drop'
			break
	}

});


let retorno = ''
if (command == 'create') {
	
	let csvStream = csv.fromPath(csvPath, { headers: true, objectMode: true })
		.on("data", function(data: any) {

			let stringTipo = ''
			let tamanhoMax = data.tammax.split(':')

			switch (data.tipo) {
				case "C":
					stringTipo = `VARCHAR(${data.tammax})`
					break;
				case "N":
					if(tamanhoMax.length > 1 ){
						stringTipo = `NUMBER(${tamanhoMax[0]}, ${tamanhoMax[1]})`
					}else{
						stringTipo = `NUMBER(${tamanhoMax[0]})`
					}
					break;
				case "xml":
					stringTipo = `CLOB`
					break;
				default:
					console.log(`----> Tipo ${data.tipo} não tem definição.`)
					process.exit();
			}

			retorno = retorno + '\n' + `ALTER TABLE DEMO.${data.tabela} ADD ${data.nome} ${stringTipo};`

		})
		.on("end", function() {
			console.log(retorno);
		});

} else if(command = 'drop'){
	var csvStream = csv.fromPath(csvPath, { headers: true, objectMode: true })
	.on("data", function(data: any) {

		let stringTipo = ''

		switch (data.tipo) {
			case "C":
				stringTipo = `VARCHAR(${data.tammax})`
				break;
			case "N":
				let tamanhoMax = data.tammax.split(':')
				stringTipo = `NUMBER(${tamanhoMax[0]}, ${tamanhoMax[1]})`
				break;
			case "xml":
				stringTipo = `CLOB(${data.tammax})`
				break;
			default:
				console.log(`----> Tipo ${data.tipo} não tem definição.`)
				process.exit();
		}

		retorno = retorno + '\n' + `ALTER TABLE DEMO.${data.tabela} DROP COLUMN ${data.nome};`

	})
	.on("end", function() {
		console.log(retorno);
	});
}
