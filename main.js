// let request= require("request");
let request=require("request");
let matchfile=require("./matchallfiles.js");
let url="https://www.espncricinfo.com/series/_/id/8039/season/2015/icc-cricket-world-cup";
 request(url, cb);
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
   let $=cheerio.load(body);
   let apageanchor=$("a[data-hover='View All Results']");
   let link=apageanchor.attr("href");
   let clink="https://www.espncricinfo.com/"+link;
   matchfile.allmatchhandler(clink);
}