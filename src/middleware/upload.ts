import multer from "multer"
const appRoot = require("app-root-path")
const path = require("path")
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, `${appRoot}/../public/`);
    },
    filename: function (req: any, file: any, cb: any) {
        const files: string = (file.originalname).replace(/\s/g, "");
        cb(null, + Date.now() + files);
    }
});

const storagePDF = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const winnerId = req.query.winnerId
        const type = req.query.type
        const dir = `${appRoot}/../upload/`
        if (!fs.existsSync(`${dir}${winnerId}`)) {
            fs.mkdirSync(`${dir}${winnerId}`);
        }
        const pathFile = `${dir}${winnerId}/${type == 1 ? 'Upload1' : 'Upload2'}`
        if (!fs.existsSync(pathFile)) {
            fs.mkdirSync(pathFile, { recursive: true });
        }
        cb(null, pathFile);
    },
    filename: function (req: any, file: any, cb: any) {
        const files: string = (file.originalname).replace(/\s/g, "");
        cb(null, + Date.now() + '_' + files);
    }
});

//check file type
function checkFileType(file: any, cb: any) {
    const filetypes = /xls|xlsx|csv|vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel/; //alowed ext
    //check ext
    const extname = filetypes.test(path.extname((file.originalname).replace(/\s/g, "")).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    //check if ext is true
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Extension Suport XLS/XLSX/CSV"));
    }
}

//check file type
function checkFileTypePDF(file: any, cb: any) {
    const filetypes = /pdf/ //alowed ext
    //check ext
    const extname = filetypes.test(path.extname((file.originalname).replace(/\s/g, "")).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    //check if ext is true
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Extension Suport PDF"));
    }
}

//init upload
export const upload: any = multer({
    storage: storage, //get from variable name at storage engine
    limits: { fileSize: 20 * 1024 * 1024 * 1024 }, //ex : limit 200MB
    fileFilter: function (req: any, file: any, cb: any) {
        checkFileType(file, cb);
    }
});

export const uploadPDF: any = multer({
    storage: storagePDF, //get from variable name at storage engine
    limits: { fileSize: 20 * 1024 * 1024 * 1024 }, //ex : limit 200MB
    fileFilter: function (req: any, file: any, cb: any) {
        checkFileTypePDF(file, cb);
    }
});
