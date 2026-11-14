'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),yaml=require('js-yaml');
const root=path.join(__dirname,'..'),pkg=require('../package.json');
const feed=yaml.load(fs.readFileSync(path.join(root,'dist/beta.yml'),'utf8'));assert.equal(feed.version,pkg.version);
for(const record of feed.files){const name=decodeURIComponent(record.url);assert.equal(name,path.basename(name));const bytes=fs.readFileSync(path.join(root,'dist',name));assert.equal(bytes.length,record.size);assert.equal(crypto.createHash('sha512').update(bytes).digest('base64'),record.sha512);assert.ok(fs.existsSync(path.join(root,'dist',name+'.blockmap')));}
const config=yaml.load(fs.readFileSync(path.join(root,'dist/win-unpacked/resources/app-update.yml'),'utf8'));assert.equal(config.owner,pkg.build.publish[0].owner);assert.equal(config.repo,pkg.build.publish[0].repo);assert.equal(config.channel,'beta');
console.log('PASS: beta version, installer SHA-512/size, blockmap and embedded GitHub feed match.');
