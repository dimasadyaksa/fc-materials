// ===== Abstraction =====
// 
// Abstraksi -> 
//   1. Generalisasi objek-objek dengan karakteristik yang sama 
//   2. Menyembunyikan detail implementasi
// 
// Class Hierarchy
// Base Class -> More Common
//    ...
//  Sub Class -> More Specific
//       
// 

abstract class Animal{
    abstract move();

    eat(){
        console.log("i'm eating")
    }
}

class Dog extends Animal{
    name = ""
    move() {
        console.log("i'm walking")
    }
}

class CatFish extends Animal{
    move() {
        console.log("i'm swimming")
    }
}

class Eagle extends Animal{
    move() {
        console.log("i'm flying")
    }
}

function moving(animal: Animal){
    animal.move()
}



moving(new Dog())
moving(new CatFish())
moving(new Eagle())


// konsep/abstrak
// let animal = new Animal()