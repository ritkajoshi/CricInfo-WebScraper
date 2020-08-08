let request= require("request");
// let url="https://www.espncricinfo.com/series/8039/scorecard/656495/australia-vs-new-zealand-final-icc-cricket-world-cup-2014-15";
//  request(url, cb);
let xlsx=require("xlsx");
let path=require("path");
let fs=require("fs");
let cheerio=require("cheerio");
// const { fstat } = require("fs");
function matchhandler(url){
    request(url,cb);
}
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
function excelreader(filepath, name){
    if(!fs.existsSync(filepath)){
        return null;
    }
    let wt=xlsx.readFile(filepath);
    let exceldata=wt.Sheets[name];
    let ans=xlsx.utils.sheet_to_json(exceldata);
    return ans;
}
function excelwriter(filepath,json,name){
    var newwb=xlsx.utils.bool_new();
    var newws=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newwb,newws,name);
    xlsx.writeFile(newwb,filepath);
}
function parseHtml(body){
    let $ =cheerio.load(body);
    let venelm=$(".desc.text-truncate");
    let venue=venelm.text().trim();
    let reselm=$(".summary span");
    let result=reselm.text().trim();
    let bothinings=$(".card.content-block.match-scorecard-table .Collapsible");
    for(let i=0;i<bothinings.length;i++){
        let teamnameelm=$(bothinings[i]).find("h5");
        let teamname=teamnameelm.text().split("Innings");
        console.log(teamname[0].trim());
        let Allrows=$(bothinings[i]).find(".table.batsman tbody tr");
        for(let j=0;j<Allrows.length;j++){
            let allcolns=$(Allrows[j]).find("td");
            let player=$(allcolns[0]).hasClass("batsman-cell");
            if(player==true){
                let pname=$(allcolns[0]).text().trim();
                let runs=$(allcolns[2]).text().trim();
                let balls=$(allcolns[3]).text().trim();
                let fours=$(allcolns[5]).text().trim();
                let sixes=$(allcolns[6]).text().trim();
                let sr=$(allcolns[7]).text().trim();
                console.log(result+" "+venue+" "+pname+" "+runs+" "+balls+" "+fours+" "+sixes+" "+sr);
                 processplayer(teamname,pname,result,venue,runs,balls,sixes,fours,sr);
            }
        }
        console.log("######################");
    }
    console.log("*********************************************");
}
function processplayer(team,name,result,venue,runs,balls,sixes,fours,sr){
    let obj={
        runs, balls, fours, sixes, sr, team, result, venue
    };
    let teampath=team;

    if(!fs.existsSync(teampath)){
        fs.mkdirSync(teampath);
    }

    let playerfile=path.join(teampath,name)+'.xlsx';
     let filedata=excelreader(playerfile,name);
     let json=[];
     if(filedata!==null){
         json=filedata;
     }
     json.push(obj);
     excelwriter(playerfile,json,name);
}

module.exports.expfunc=matchhandler;
