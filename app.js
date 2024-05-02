const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { render } = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("."));

app.listen("8080", () => {
    console.log("Server up");
});

const db_conf = {
    host: "192.168.43.200",
    user: "anas",
    password: "palestine",
    database: "lms"
};

const connection = mysql.createConnection(db_conf);

app.get('/', (req, res) => {
    console.log('connected.');
    return res.render(__dirname + "/index", { message: "" })
});

app.post('/signup', (req, res)=>{
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let mobile = req.body.mobile
    let address = req.body.address
    const query = `INSERT INTO users (Name, Email, Password, Mobile, Address) VALUES ('${name}', '${email}', '${password}', '${mobile}', '${address}');`
    console.log(query)
    connection.query(query, (err, results)=>{
        if (err){
            console.error(err)
            return res.sendFile("/index.html")
        }
        console.log("account created.")
        console.log(query)
        return res.render(__dirname + "/index", { message: "your account created." })
    })
})
app.get('/signup', (req, res)=>{
    res.sendFile(__dirname + "/signup.html")
})

app.post('/login', (req, res)=>{
    let email = req.body.email
    let password = req.body.password
    connection.query(`SELECT * FROM users WHERE Email = '${email}';`, (err, results)=>{
        if (err){
            console.error(err)
            return res.sendFile("/index.html")
        }if (results.length === 0){
            console.log("Email not found.")
            return res.render(__dirname + "/index", { message: "Email not found" });
        }if (results[0].Password === password){
            console.log("logged.")
            return res.render(__dirname + "/home", {id: results[0].id, name: results[0].Name, email: results[0].Email, mobile: results[0].Mobile, password: results[0].Password, address: results[0].Address})
        }
        console.log("Password is Wrong.")
        return res.render(__dirname + "/index", { message: "Password is Wrong" });
    })
})

app.get("/profile", (req, res)=>{
    if (req.query.id === undefined) return res.status(401).send("<h1>401 Unauthorized</h1>");
    let query = `SELECT * FROM users WHERE id = '${req.query.id}';`
    connection.query(query, (err, results)=>{
        return res.render( __dirname + "/profile", {name: results[0].Name, email: results[0].Email, mobile: results[0].Mobile, password: results[0].Password, address: results[0].Address})
    })
})

app.get("/mybook", (req, res)=>{
    if (req.query.id === undefined) return res.status(401).send("<h1>401 Unauthorized</h1>");
    let query = `SELECT * FROM users WHERE id = '${req.query.id}';`
    connection.query(query, (err, results)=>{
        return res.render( __dirname + "/mybook", {name: results[0].Name, email: results[0].Email, mobile: results[0].Mobile, password: results[0].Password, address: results[0].Address})
    })
})