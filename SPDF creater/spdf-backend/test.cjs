const fs = require('fs');
const path = require('path');
const http = require('http');

// create dummy pdf
fs.writeFileSync('test1.pdf', '%PDF-1.4\n%EOF');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
let postData = '';

// Add file
postData += `--${boundary}\r\n`;
postData += `Content-Disposition: form-data; name="pdfFile"; filename="test1.pdf"\r\n`;
postData += `Content-Type: application/pdf\r\n\r\n`;
postData += fs.readFileSync('test1.pdf');
postData += `\r\n`;

// Add fields
const addField = (name, value) => {
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="${name}"\r\n\r\n`;
    postData += `${value}\r\n`;
};

addField('expiry', '2030-12-31T23:59:59');
addField('maxOpen', '10');
addField('maxPrint', '5');
addField('password', '1234');

postData += `--${boundary}--\r\n`;

const req = http.request({
    method: 'POST',
    host: 'localhost',
    port: 3000,
    path: '/api/create-spdf',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postData)
    }
}, (res) => {
    console.log('STATUS:', res.statusCode);
    const chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => {
        const buf = Buffer.concat(chunks);
        console.log('RESPONSE SIZE:', buf.length);
        if (res.statusCode >= 400) {
            console.log('ERROR:', buf.toString());
        }
    });
});

req.on('error', console.error);
req.write(postData);
req.end();
