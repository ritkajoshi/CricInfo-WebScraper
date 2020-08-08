// let request= require("request");
let request=require("request");
let matchfile=require("./makerequest.js");
// let url="https://www.espncricinfo.com/scores/series/8039/season/2015/icc-cricket-world-cup?view=results";
function allmatchhandler(url){
    request(url, cb);
} 

// let fs=require("fs");
let cheerio=require("cheerio");
// const { fstat } = require("fs");
function cb(err ,header,body){
if(err==null&&header.statusCode==200){
//    console.log(body);
//    fs.writeFileSync("index.html",body);
//    console.log("html file is ready");
    parseHtml(body); 
}
else if(header.statusCode==404){
    console.log("Page Not Found");
}else{
    console.log(err);
    console.log(header);
}
}
function parseHtml(body){
    $=cheerio.load(body);
    let Allmatches=$(".col-md-8.col-16");
    for(let i=0;i<Allmatches.length;i++){
        let allanchors=$(Allmatches[i]).find(".match-cta-container a");
        let scorecardA=$(allanchors[0]);
        let link=scorecardA.attr("href");
        let clink="https://www.espncricinfo.com/"+link;
        matchfile.expfunc(clink);
    }
}
module.exports.allmatchhandler=allmatchhandler;
