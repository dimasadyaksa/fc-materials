// inheritance 
//  Animal
//   |    \
//  Dog   Cow
//        |     \
//    DairyCow  BeefCattle

class Animal{
    name
    age
    gender

    constructor(name,age,gender){
        this.name = name
        this.age = age
        this.gender = gender
    }

    walking(){
        console.log(this.name + " is walking")
    }
}

class Dog extends Animal{
    race

    constructor(name, age, race, gender){
        super(name,age,gender)
        this.race = race
    }

    barking(){
        console.log(this.name + " is barking")
    }
}

class Cow extends Animal{
    constructor(name,age,gender){
        super(name,age,gender)
    }

    speak(){
        console.log("Mooo")
    }
}

class DairyCow extends Cow{
    constructor(name,age,gender){
        super(name,age,gender)
    }
}

class BeefCattle extends Cow{
    constructor(name,age,gender){
        super(name,age,gender)
    }
}



let dog = new Dog("Milo",3,"Shiba Inu","Male")
let cow = new Cow("Coco",3,"Male")
let dairyCow = new DairyCow("Milka",2,"Female")
let beefCattle = new BeefCattle("Beefie",2,"Male")

cow.walking()
dairyCow.walking()
beefCattle.walking()
dairyCow.speak()
beefCattle.speak()