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

    const link = `http://localhost:5050/reset-password/${user.id}/${token}` //who ever clicks on that link it should be routed to /reset-password/:id/:token
    
    console.log(link)
    res.send('Pass link has beend sent to your email...')

    //--------------------------


})

app.get("/reset-password/:id/:token", (req, res, next)=>{
    const {id, token} = req.params
    
    //-----Check if id exist in DB -----
    if(id !== user.id){
        res.send("Invalid id!")
        reutrn
    }
    //-----------------------------

    // ----- If ID is valid, we have a valid user ---------
    const secret = JWT_SECRET + user.password // this is the same as secretNew
    try {
        const payload = jwt.verify(token, secret)
        res.render('resetPass', {email: user.email})
        
    } catch (error) {
        console.log(error.message)
        res.send(error.message)
    }
    //---------------------------

})



app.post("/reset-password/:id/:token", (req, res, next)=>{

    const {id, token} = req.params
    const {password, passwordRe} = req.body

        //-----Check if id exist in DB -----
        if(id !== user.id){
            res.send("Invalid id!")
            reutrn
        }
        //-----------------------------


        // ----- If ID is valid, we have a valid user ---------
        const secret = JWT_SECRET + user.password // this is the same as secretNew
        try {
            const payload = jwt.verify(token, secret)

            //-- Validate if password and passwordRe match----
            if(password !== passwordRe){
                res.send("Password do not match!")
                return
            }
            //--------------------------


            //---Find the user in the DB and update new pass ---
            //Always hash the new password
            user.password = password
            res.send(user)
            //---------------------
            
        } catch (error) {
            console.log(error.message)
            res.send(error.message)
        }
        //---------------------------


})




app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.listen(5050, () => console.log(`Listen on http://localhost:5050`))