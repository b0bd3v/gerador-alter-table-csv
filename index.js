var csv = require('fast-csv');
var command = '';
process.argv.forEach(function (val, index, array) {
    switch (val) {
        case "create":
            command = 'create';
            break;
        case "drop":
            command = 'drop';
            break;
        default:
            command = 'create';
            break;
    }
});
var retorno = '';
if (command == 'create') {
    // const csvPath = "data/campos.csv"
    var csvPath = "data/campos_bab.csv";
    var csvStream = csv.fromPath(csvPath, { headers: true, objectMode: true })
        .on("data", function (data) {
        var stringTipo = '';
        var tamanhoMax = data.tammax.split(':');
        switch (data.tipo) {
            case "C":
                stringTipo = "VARCHAR(" + data.tammax + ")";
                break;
            case "N":
                if (tamanhoMax.length > 1) {
                    stringTipo = "NUMBER(" + tamanhoMax[0] + ", " + tamanhoMax[1] + ")";
                }
                else {
                    stringTipo = "NUMBER(" + tamanhoMax[0] + ")";
                }
                break;
            case "xml":
                stringTipo = "CLOB";
                break;
            default:
                console.log("----> Tipo " + data.tipo + " n\u00E3o tem defini\u00E7\u00E3o.");
                process.exit();
        }
        retorno = retorno + '\n' + ("ALTER TABLE DEMO." + data.tabela + " ADD " + data.nome + " " + stringTipo + ";");
    })
        .on("end", function () {
        console.log(retorno);
    });
}
else if (command = 'drop') {
    var csvStream = csv.fromPath("data/campos.csv", { headers: true, objectMode: true })
        .on("data", function (data) {
        var stringTipo = '';
        switch (data.tipo) {
            case "C":
                stringTipo = "VARCHAR(" + data.tammax + ")";
                break;
            case "N":
                var tamanhoMax = data.tammax.split(':');
                stringTipo = "NUMBER(" + tamanhoMax[0] + ", " + tamanhoMax[1] + ")";
                break;
            case "xml":
                stringTipo = "CLOB(" + data.tammax + ")";
                break;
            default:
                console.log("----> Tipo " + data.tipo + " n\u00E3o tem defini\u00E7\u00E3o.");
                process.exit();
        }
        retorno = retorno + '\n' + ("ALTER TABLE DEMO." + data.tabela + " DROP COLUMN " + data.nome + ";");
    })
        .on("end", function () {
        console.log(retorno);
    });
}
