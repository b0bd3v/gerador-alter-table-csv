var csv = require('fast-csv');

let command = ''
process.argv.forEach(function(val, index, array) {
	switch (val) {
		case "create":
			command = 'create'
			break;

		case "drop":
			command = 'drop'
			break;

		default:
			command = 'create'
			break;
	}

});

let retorno = ''

if (command == 'create') {
	// const csvPath = "data/campos.csv"
	const csvPath = "data/campos_bab.csv"

	var csvStream = csv.fromPath(csvPath, { headers: true, objectMode: true })
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
	var csvStream = csv.fromPath("data/campos.csv", { headers: true, objectMode: true })
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




// stream.pipe(csvStream);


// csv.from.path('../THEPATHINYOURPROJECT/TOTHE/csv_FILE_YOU_WANT_TO_LOAD.csv').to.array(function (data: any) {
//     for (var index = 0; index < data.length; index++) {

//     }
// });
// //Reads the CSV file from the path you specify, and the data is stored in the array we specified using callback function.  This function iterates through an array and each line from the CSV file will be pushed as a record to another array called MyData , and logs the data into the console to ensure it worked.
// ​
// var http = require('http');
// //Load the http module.
// ​
// var server = http.createServer(function (req: any, resp: any) {
//     resp.writeHead(200, { 'content-type': 'application/json' });
//     // resp.end(JSON.stringify(MyData));
// });
// // Create a webserver with a request listener callback.  This will write the response header with the content type as json, and end the response by sending the MyData array in JSON format.
// ​
// server.listen(8181);