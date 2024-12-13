// ===== Polymorphism =====
// Poly = Banyak
// Morph = Berubah Bentuk
// 
// Sebuah fungsi/method dengan signature yang sama dapat melakukan aksi yang berbeda 
// Dicapai melalui:
//      1. Inheritance
//      2. Method Overriding

class Animal{
    protected name: string
    protected age: number
    protected gender: string

    constructor(name,age,gender){
        this.name = name
        this.age = age
        this.gender = gender
    }

    eat(){
        console.log(this.name + " is eating")
    }
}

class Dog extends Animal{
    private race: string

    constructor(name, age, race, gender){
        super(name,age,gender)
        this.race = race
    }    

    eat(){
        console.log(this.name + " is eating meat")
    }
}

class Cow extends Animal{
    constructor(name,age,gender){
        super(name,age,gender)
    }

    eat(){
        console.log(this.name + " is eating grass")
    }
}

class Fish extends Animal{
    constructor(name){
        super(name,1,"Male")
    }

    eat(){
        console.log(this.name + " is eating worm")
    }
}

let animals = [
    new Dog("Milo",3,"Shiba Inu","Male"),
    new Dog("Mila",2,"Rotweiller","Female"),
    new Cow("Coco",3,"Male"),
    new Cow("Momo",4,"Female"),
    new Fish("Nemo"),
    new Fish("Dory")
]

function Feeding(...animals: Animal[]){
    for(let animal of animals){
        animal.eat()
    }
}

Feeding(...animals)