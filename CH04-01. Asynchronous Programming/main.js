function readingBook(){
    console.log("i'm reading a book")
}

function watchingMovie(){
    console.log("i'm watching a movie")
}

function playingGame(){
    console.log("i'm playing a game")
}

function order(){
    return new Promise((resolve,reject)=>{
        console.log("i'm ordering food")
        // console.log("Process I/O")
        
        fetch("https://google.com/").then((result)=>{
            if(result.ok){
                resolve("Food is good")
            }else{
                reject("Food is not good")
            }
        })
        console.log("i received the food")
    })
}

async function orderFood(){
    console.log("i'm ordering food")
    // console.log("Process I/O")
    let result = await fetch("https://google.com/")
    console.log("i received the food")

    if(result.ok){
        return "Food is good"
    }else{
        throw new Error("Food is not good")
    }
}

function eat(result){
    console.log("i'm eating the food: ",result)
}

function complain(message){
    console.log("i'm complaining to resto: ",message.message)
}

readingBook()
watchingMovie()
let orderResult = Promise.all([
    orderFood(),
    orderFood(),
    orderFood(),
])
orderResult.then((data)=>{
    console.log(data)
})
playingGame()
