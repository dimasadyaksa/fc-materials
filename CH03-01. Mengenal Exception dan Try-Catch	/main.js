function exampleSyntaxError(){
    console.log(2 * 3)
}

function exampleReferenceError(){
    console.log("before error")
    console.log(noVar)
    console.log("after error")
}

function exampleTypeError(){
    let x = {
        ping: ()=>{}
    }

    x.ping()
}

function exampleRangeError(n){
    if(n<0){
        throw new RangeError("error range")
        console.log("After throw")
    }
}

function throwErrorExample(){
    throw new Error("Sample Error")
}



function tryCatchExample(){
    try{
        exampleRangeError(1)
    }catch(error){
        console.log(error)
    }finally{
        console.log("Block Finally")
    }
    console.log("After Try-Catch")
}


function parent(){
    try{
        child()
    }catch(error){
        console.log(error)
    }
}

function child(){
    try {
        exampleRangeError(-1)
    } catch (error) {
        console.log("child -> ",error)
        throw new Error("Unhandled Error")
    }
}


function checkingErrorType(){
    try {
        exampleReferenceError()
    } catch (error) {
        switch(true){
            case error instanceof SyntaxError:
                console.log("got syntax error")
                break
            case error instanceof ReferenceError:
                console.log("got reference error")
                break
            case error instanceof RangeError:
                console.log("got range error")
                break                
            default:
                console.log("undefined error")
                break
        }
    }
}

checkingErrorType()