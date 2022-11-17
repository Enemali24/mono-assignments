const Auth = require('../model/auth')


exports.registerPage = (req, res) => {
   return res.render('register', {title:'REGISTER'})
}

exports.loginPage = (req, res) => {
    return res.render('login', { title: 'LOGIN' })
}

exports.dashboardPage = (req, res) => {
   return res.render('dashboard',{title:'DASHBOARD'})
}


exports.register = async (req, res) => {
    const {email, password, username} = req.body
    
    if (!email || !password || !username) {
        console.log('please provide all the required information')
        return res.status(400).render('register',{msg : 'please provide all the necessary information'})
    }

    const user = await Auth.findOne({email})
    
    if (user) {
        console.log('User already exists')
        return res.status(400).render('register', { msg: `${req.body.email} already exists`})
    }

    const newUser = await Auth.create({...req.body})
    const token = newUser.createJWT()
    console.log(token) 

    return res.status(201).redirect('login')
    // console.log('Registratiion route') 
    // res.send('Hello')
}

exports.login = async (req, res) => {
    try {
        const {email, password } = req.body
        const user = await Auth.findOne({email})
        
        if (!user) {
            console.log('user dose not exist in data base')
            return res.status(400).render('login', {msg: `${req.body.user} dose not exist in our database`})
        }

        const userExist = await user.comparePasswords(password)
        if (!userExist) {
            return res.status(400).render('login',{ msg: 'password is icorrect'})
        
        }
        console.log(req.body)

        return res.status(200).redirect('dashboard')

    } catch (error) {
        console.log(error)
    }
}

