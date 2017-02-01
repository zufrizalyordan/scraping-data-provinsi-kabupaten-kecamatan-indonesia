let cheerio = require('cheerio');
let axios = require('axios');
let fs = require('fs');

const dist_file_dir = 'dist/';

let provinsi = [];
let kabupaten = [];
let kecamatan = [];

let dariWikipedia = {
    url_provinsi: 'https://id.wikipedia.org/wiki/Daftar_provinsi_di_Indonesia',
    provinsi: function () {
        let that = this;
        console.log('Mulai ambilProvinsiDariWikipedia...');
        axios.get(that.url_provinsi)
        .then(function (response) {
            let $ = cheerio.load(response.data);
            let list = $(".wikitable tr th[scope=row] a");
            list.each( (i, elmt) => {
                provinsi.push({id: i+1, title: elmt.attribs.title});
            });
            return provinsi;
        })
        .then ( (provinsi) => {
            let message = "File provinsi gagal disimpan";
            let data = JSON.stringify(provinsi)

            fs.stat(dist_file_dir + 'provinsi.json', function(err, stat) {
                if(err == null) {
                } else if(err.code == 'ENOENT') {
                    fs.openSync(dist_file_dir + 'provinsi.json', 'w');
                } else {
                    console.log('Error lainnya: ', err.code);
                }

                fs.writeFile(dist_file_dir + "provinsi.json", data, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    message = "File provinsi berhasil disimpan.";
                });
            });
            return message
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

let dariBps = {
    url_provinsi: 'http://mfdonline.bps.go.id/index.php?link=_RS8usGM1LvosR2hh1cfaGGR8a8PhNDIY5JrJLOUGpI',
    url_kabupaten: 'http://mfdonline.bps.go.id/index.php?link=_RS8usGM1LvosR2hh1cfaGGR8a8PhNDIY5JrJLOUGpI',
    provinsi: function () {
        axios.get(url_provinsi)
        .then(function (response) {
            let data = [];
            let $ = cheerio.load(response.data);

            return data;
        })
        .then ( (data) => {
            console.log(data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}

axios.all([dariWikipedia.provinsi()])
    .then(axios.spread(function (pesan) {
        console.log(pesan);
    }));
