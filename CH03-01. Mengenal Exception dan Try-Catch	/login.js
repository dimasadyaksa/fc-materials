class LoginError extends Error{
    username

    constructor(message,username){
        super(message)
        this.username = username
    }
}

function login(username,password){
    let expectedUsername = "john.doe"
    let expectedPassword = "john123"

    if(expectedUsername != username || expectedPassword != password){
        throw new LoginError("Invalid username/password",username)
    }

    console.log("Login Succeeded!")
}

try {
    login("john","12345")    
} catch (error) {
    if(error instanceof LoginError){
        let username = error.username
        console.log("Username "+username+" is not valid")    
        console.log(error.stack)
    }
}
