#!/usr/bin/env node
let inputArr=process.argv.slice(2);
let fs=require("fs");
let path=require("path");
//console.log(inputArr);
let command=inputArr[0];
let types={
    media:["mp4","mkv"],
    archives:['zip','7z','rar','tar','ar','gz','iso',"xz"],
    documents:["docx",'doc','pdf','xlsx','xls','odt','odp','ods','odg','odf','txt','ps','tex'],
    app:['exe','dmg','pkg','deb']
}
switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please input right command");
        break;
}


function treeFn(dirpath){
    //let destpath;
    //input is the directory path(dirpath) given
    if(dirpath == undefined){
        treeHelper(process.cwd(),"");
        return;
    }
    else{
        let doesExist=fs.existsSync(dirpath);
        if(doesExist){
            treeHelper(dirpath, "");
        }
        else{
            console.log("kindly enter the correct path");
            return;
        }
    }
}
function treeHelper(dirPath,indent){
    //is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile==true){
        let fileName=path.basename(dirPath);
        console.log(indent+"├──"+fileName);
    }
    else{
        let dirName=path.basename(dirPath)
        console.log(indent+"└──"+dirName);
        let childrens=fs.readdirSync(dirPath);
        for(let i=0;i<childrens.length;i++){
            let childPath=path.join(dirPath,childrens[i]);
            treeHelper(childPath,indent+"\t");
        }
    }
}


function organizeFn(dirpath){
    let destpath;
    //console.log("organise command implemented for ",dirpath);
    //input->directory path given
    if(dirpath == undefined){
        destpath=process.cwd();
        return;
    }
    else{
        let doesExist=fs.existsSync(dirpath);
        if(doesExist){
            //create->organised files directory
            let destpath = path.join(dirpath,"organized_files");
            console.log(destpath);
            if(fs.existsSync(destpath)==false){
                fs.mkdirSync(destpath);
            }      
            organizehelper(dirpath,destpath);
        }
        else{
            console.log("kindly enter the correct path");
            return;
        }
    }
    //identify categories of all the files present in that inhput directory
    
}
function organizehelper(src,dest){
    //identify categories of all the files present in that input directory
    let childnames=fs.readdirSync(src);
    for(let i=0;i<childnames.length;i++){
        let childaddress=path.join(src,childnames[i]);
        let isFile=fs.lstatSync(childaddress).isFile();
        if(isFile){
            let category=getCategory(childnames[i]);
            console.log(childnames[i],"belongs to -->",category);
            //cut/copy files to that organized directory inside their respective type folders
            sendFiles(childaddress,dest,category);
        }
    }
}
function sendFiles(srcFilePath,dest,category){
    let categorypath=path.join(dest,category);
    if(fs.existsSync(categorypath)==false){
        fs.mkdirSync(categorypath);
    }
    let fileName=path.basename(srcFilePath);
    let destFilePath=path.join(categorypath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName,"copied to ",category);
}
function getCategory(name){
 let ext=path.extname(name);
 //console.log(ext);
 ext=ext.slice(1);
 for(let type in types){
    let cTypeArray=types[type];
    for(let i=0;i<cTypeArray.length;i++){
        if(ext == cTypeArray[i]){
            return type;
        }
    }
 }
 
 return "others";
}


function helpFn(dirpath){
    console.log(`List of all the commands
    node main.js tree "directorypath"
    node main.js organise "directorypath"
    node main.js help
    `);
}
