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
                throw err;
            }
            else {
                let custRes = {}
                db.collection("user").insertOne(user, function (err, result) {
                    if (err) {
                        custRes = {
                            
                            "status": 400,
                            "msg": "Image not Saved",
                            "error": err
                        }
                    }
                    else {
                        custRes = {
                            "status": 200,
                            "msg": "Successfully Saved",
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
            "error": "not found"
        }
        res.json(custRes);
    }

});

// GET All Users
app.get("/getFiles", (req, res, next) => {
    User.find().then(data => {
        res.status(200).json({
            message: "Users retrieved successfully!",
            users: data
        });
    });
});

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