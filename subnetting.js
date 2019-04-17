const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'subnet_table.csv',
    header: [
        { id: 'sn', title: 'Subnet #' },
        { id: 'gw', title: 'Gateway Address' },
        { id: 'us', title: 'Usable Address Range' },
        { id: 'br', title: 'Broadcast Address' }
    ]
});

exports.subnetinfo = function (hosts) {
    let netclass = ""
    let subnets = 0
    let cidr = ""
    let mn = 0

    netclass = (hosts <= 256) ? "C" : ((hosts <= 65535) ? "B" : ((hosts <= 16777215) ? "A" : "NaN"))
    for (let i = 0; i <= 24; i++) {
        if (hosts <= Math.pow(2, i)) {
            mn = Math.pow(2, i)
            subnets = (netclass == "C") ? Math.pow(2, 8 - i) : ((netclass == "B") ? Math.pow(2, 16 - i) : (netclass == "A") ? Math.pow(2, 24 - i) : -1)
            cidr = "/" + (32 - i)
            break;
        }
    }
    return "Network Class: " + netclass + "\n# of Subnets: " + subnets + "\nCIDR Notation: " + cidr + "\nMN: " + mn
}

exports.subnettable = async function (hosts) {
    let subnets = 0
    let mn = 0

    let netclass = (hosts <= 256) ? "C" : ((hosts <= 65535) ? "B" : ((hosts <= 16777215) ? "A" : "NaN"))
    for (let i = 0; i <= 24; i++) {
        if (hosts <= Math.pow(2, i)) {
            mn = Math.pow(2, i)
            subnets = (netclass == "C") ? Math.pow(2, 8 - i) : ((netclass == "B") ? Math.pow(2, 16 - i) : (netclass == "A") ? Math.pow(2, 24 - i) : -1)
            break;
        }
    }

    try {
        fs.unlinkSync('./subnet_table.csv')
    } catch (err) { console.log(err) }

    let sn = 0; var tableout = []; let loop = 0;
    for (let i = 0; i < mn * subnets; i++) {
        if (i == 0 | i % mn === 0) {
            tableout.push({
                sn: (netclass=="C")?(sn + 1):((loop/255)+ "." + (sn+1)),
                gw: i,
                us: (mn * sn + 1) + "-" + (mn * sn + mn - 2),
                br: (mn * sn + mn - 1)
            })
            if (i > 255-loop) {loop = loop+255}
            sn++
        }
    }


    await csvWriter.writeRecords(tableout)
        .then(() => {
            console.log('[Subnetting Table] The CSV file was written successfully')
        });
}
