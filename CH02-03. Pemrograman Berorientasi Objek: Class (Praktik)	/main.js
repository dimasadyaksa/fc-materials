class Dog{
    static species
    static jumlah

    static {
        Dog.species = "Canis Lupus"
        Dog.jumlah = 0
    }

    static {
        console.log("class didefinisikan")
    }

    name
    age
    race
    gender

    constructor(name,age,race,gender){
        this.name = name
        this.age = age
        this.race = race
        this.gender = gender
        Dog.jumlah = Dog.jumlah + 1
        console.log("objek dibuat")
    }

    walking(){
        console.log(this.name +" is walking")
    }

    barking(){
        console.log(this.name + " is barking")
    }
}


let milo = new Dog("milo",3,"Shiba Inu","male")
// console.log(milo)
// console.log(milo.name)
// milo.walking()
// milo.barking()

let molly = new Dog("molly",2,"Golden Retriever","Female")
// molly.walking()
// molly.barking()

new Dog()
new Dog()
new Dog()


// console.log(Dog.species)
// console.log(Dog.jumlah)


