const cheerio = require('cheerio');
const axios = require('axios');
var qs = require('qs');
const fs = require('fs');

const dist_file_dir = 'dist/';

let provinsi = [];
let kabupaten = [];
let kecamatan = [];

let dariBps = {
    url_target: 'http://mfdonline.bps.go.id/index.php?link=hasil_pencarian',
    provinsi: function () {
        console.log('Mulai ambil data provinsi...');

        let params = qs.stringify({
            pilihcari:'kec',
            kata_kunci:'a',
            submit:'Cari'
        });

        return axios.post(dariBps.url_target, params)
        .then(function (response) {
            let $ = cheerio.load(response.data);
            let list = $('tr.table_content');
            list.each( (i, elmt) => {
                var child = elmt.children;
                var province_id = child[3].children[0].data.replace(/[\n\t\r]/g,"");
                var province_name = child[5].children[0].data.replace(/[\n\t\r]/g,"");
                var city_id = child[7].children[0].data.replace(/[\n\t\r]/g,"");
                var city_name = child[9].children[0].data.replace(/[\n\t\r]/g,"");
                var suburb_id = child[11].children[0].data.replace(/[\n\t\r]/g,"");
                var suburb_name = child[13].children[0].data.replace(/[\n\t\r]/g,"");

                provinsi.push({id_propinsi: province_id, nama_propinsi: province_name, id_kota: city_id, nama_kota: city_name, id_kecamatan: suburb_id, nama_kecamatan: suburb_name});
            });
            return provinsi;
        })
        .then((provinsi) => {
            return dariBps.simpanKeFile(provinsi);
        })
        .catch((error) => {
            return error;
        });
    },
    simpanKeFile: function (resp) {
        let message = "File gagal ditulis";
        let data = JSON.stringify(resp);
        var filePath = dist_file_dir + 'provinsi-kabupaten-kecamatan.json';
        var file = fs.openSync(filePath, 'w');
        var stats = fs.statSync(filePath);

        if (stats.isFile()){
            if (fs.writeFileSync(file, data) === undefined) {
                message = "File berhasil ditulis.";
            }
        }

        return message;
    }
}

axios.all([dariBps.provinsi()])
    .then(axios.spread(function (data) {
        console.log(data);
    }));