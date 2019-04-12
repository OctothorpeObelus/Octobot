const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'subnet_table.csv',
  header: [
    {id: 'sn', title: 'Subnet #'},
    {id: 'gw', title: 'Gateway Address'},
    {id: 'us', title: 'Usable Address Range'},
    {id: 'br', title: 'Brodcast Address'},
  ]
});

exports.subnettable = function(hosts, table) {
  let netclass = ""
  let subnets = 0
  let cidr = ""
  let mn = 0

  netclass = (hosts <= 256)?"C": ((hosts <= 65535)?"B": ((hosts <= 16777215)?"A": "NaN"))
  for (let i = 0; i <= 24; i++) {
    if (hosts <= Math.pow(2, i)) {
      mn = Math.pow(2, i)
      subnets = (netclass == "C")?Math.pow(2, 8-i): ((netclass == "B")?Math.pow(2, 16-i): (netclass == "A")?Math.pow(2, 24-i): -1)
      cidr = "/"+(32-i)
      break;
    }
  }

  if (table) {
    let sn = 0; var tableout = [];
    for (let i = 0; i < mn*subnets; i++) {
      if (i == 0 | i%mn === 0) {
        tableout.push({
          sn: sn+1,
          gw: i,
          us: (mn*sn+1)+"-"+(mn*sn+mn-2),
          br: mn*sn+mn-1
        })
        sn++
      }
    }
  }
  
  csvWriter
  .writeRecords(tableout)
  .then(() => console.log('[Subnetting Table] The CSV file was written successfully'));
}
