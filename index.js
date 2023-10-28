const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')

//-----------Data base* Hardcore user----------
let user = {
    id: "ahjhiudguihs",
    email: "john@yahoo.com",
    password: "hhiuhiaufhuafhjhg;jhafhuaighaigh"
}
//------------------------------------------------


//---- JWT config--------
const JWT_SECRET = "some super secret..."

//----------------------

app.get("/forgot-password", (req, res, next)=>{
 res.render('forgotPass')
})

app.post("/forgot-password", (req, res, next)=>{
    const {email} = req.body
    
    //----Check if user actually exist in DB----
    if(email !== user.email){
        res.send("User not register!")
        reutrn;
    }
    //--------------------------------------


    //--- Create one time password link, valid for 15 min----

    const secretNew = JWT_SECRET + user.password //it will be unique for each user
    const payload = {
        email: user.email,
        id: user.id
    }

    const token = jwt.sign(payload, secretNew, {expiresIn: "15m"})

    const link = `http://localhost:5050/reset-password/${user.id}/${token}`
    
    console.log(link)
    res.send('Pass link has beend sent to your email...')

    //--------------------------


})

app.get("/reset-password", (req, res, next)=>{

})

app.post("/reset-password", (req, res, next)=>{

})




app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(5050, () => console.log(`Listen on http://localhost:5050`))