var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var cors = require('cors');
var multer = require('multer');

var MongoClient = require('mongodb').MongoClient;

// var upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var ObjectId = require('mongodb').ObjectId;

// app.use(cors);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));
// Multer File upload settings
const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

// Multer Mime Type Validation
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
// POST User
app.post('/file', upload.single('avatar'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    if (req.body.name) {
        const user = {
            name: req.body.name,
            avatar: url + '/uploads/' + req.file.filename
        };
        MongoClient.connect('mongodb://localhost:27017/emp', function (err, db) {
            if (err) {
                console.log(err)
            }
            else {
                user.save().then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "User registered successfully!",
                        userCreated: {
                            _id: result._id,
                            name: result.name,
                            avatar: result.avatar
                        }
                    })
                }).catch(err => {
                    console.log(err),
                        res.status(500).json({
                            error: err
                        });
                })
            }
        })
    }
    else {
        res.status(400).json({
            message: "something went wrong"
        })

    }
})

// GET All Users
app.get("/", (req, res, next) => {
    User.find().then(data => {
        res.status(200).json({
            message: "Users retrieved successfully!",
            users: data
        });
    });
});

// app.post('/file', upload.single('file'), (req, res, next) => {
//     console.log("hiii")
//     const file = req.file;
//     console.log(file.filename);
//     if(!file){
//         const error = new Error('Please Upload a File')
//         error.httpStatusCode = 400
//         return next(error);
//     }
//     res.send(file);
//   })

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
})

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
    //
    // e.g.
    //  req.files['avatar'][0] -> File
    //  req.files['gallery'] -> Array
    //
    // req.body will contain the text fields, if there were any
})




//insert employee
app.post('/register', (req, res) => {
    console.log(req.body);
    if (req.body.first_name) {
        var emp = {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "department": req.body.department,
            "user_name": req.body.user_name,
            "user_password": req.body.user_password,
            "confirm_password": req.body.confirm_password,
            "email": req.body.email,
            "contact_no": req.body.contact_no
        };



        MongoClient.connect('mongodb://localhost:27017/emp', function (err, db) {
            if (err) {
                throw err;
            }
            else {
                let custRes = {}
                db.collection("employee").insertOne(emp, function (err, result) {
                    if (err) {
                        custRes = {
                            "status": 400,
                            "error": err
                        }
                    }
                    else {
                        custRes = {
                            "status": 200,
                            "result": result
                        }

                    }

                    res.json(custRes);
                });

                //res.send("Database Connected ...!");
            }
        });
    }
    else {
        custRes = {
            "status": 400,
            "error": "Please enter Username"
        }
        res.json(custRes);
    }

});


//Update Function
app.put('/updateCustomer', (req, res) => {

    MongoClient.connect('mongodb://localhost:27017/emp', function (err, db) {
        if (err) {
            throw err;
        }
        else {
            let custRes = {}
            db.collection('employee').update({ "_id": new ObjectId(req.body._id) },
                {
                    $set: {
                        "first_name": req.body.first_name,
                        "last_name": req.body.last_name,
                        "department": req.body.department,
                        "user_name": req.body.user_name,
                        "user_password": req.body.user_password,
                        "confirm_password": req.body.confirm_password,
                        "email": req.body.email,
                        "contact_no": req.body.contact_no
                    }
                }, function (err, result) {
                    if (err) {
                        custRes = {
                            "status": 400,
                            "error": err
                        }
                    }
                    else {
                        custRes = {
                            "status": 200,
                            "result": result
                        }
                    }
                    res.json(custRes);
                });
        }
    });

});

//Delete of Employee
app.delete('/deleteCustomer', (req, res) => {
    console.log(req.body._id);
    let custRes = {}
    MongoClient.connect('mongodb://localhost:27017/emp', function (err, db) {
        if (err) {
            throw err;
        }
        else {
            db.collection('employee').remove({ "_id": new ObjectId(req.body._id) }, function (err, result) {
                if (err)
                    throw err;
                else {
                    if (result) {
                        custRes = {
                            sts: 200,
                            msg: 'Successful',
                            res: result
                        }
                    }
                    else {
                        console.log(err)
                        custRes = {
                            sts: 400,
                            msg: 'error',
                            res: 0
                        }
                    }
                }
                res.json(custRes)
            })
        }
    })
})

//Display All Employees
app.get('/customers', (req, res) => {
    MongoClient.connect('mongodb://localhost:27017/emp', function (err, db) {
        if (err) {
            throw err;
        }
        else {
            // db.collection('person').find().toArray(function (err, result) {
            db.collection('employee').find().toArray(function (err, result) {
                res.json(result);
            });
        }
    });
});

//Get Current Employee using Object Id
app.post('/getCustomer', (req, res) => {
    console.log(req.body);
    MongoClient.connect('mongodb://localhost:27017/emp', function (err, db) {
        if (err) {
            throw err;
        }
        else {
            db.collection('employee').findOne({ "_id": new ObjectId(req.body._id) }, function (err, result) {
                let custRes = {}
                if (err) {

                    custRes = {
                        "status": 400,
                        "error": err
                    }
                }
                else {
                    custRes = {
                        "status": 200,
                        "result": result
                    }

                }
                res.json(custRes);
                // res.json(result);
            });
        }
    });
});

app.listen(3001, () =>
    console.log('Example app listening on port 3001!'))