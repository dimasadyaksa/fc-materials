// Encapsulation
//              World   Class   SubClass
// Public         v       v         v
// Private        x       v         x 
// Protected      x       v         v

class Animal{
    protected name: string
    protected age
    protected gender

    constructor(name,age,gender){
        this.name = name
        this.age = age
        this.gender = gender
    }

    protected walking(){
        console.log(this.name + " is walking")
    }

    get getName(){

        // milo
        //                      m -> M                          ilo
        let name = this.name.charAt(0).toUpperCase() + this.name.substring(1).toLowerCase()
        return name
    }

    set setName(name: string){
        for(let i = 0;i<name.length;i++){
            if(name.charCodeAt(i) >= 65 && name.charCodeAt(i) <= 90){
                continue
            }

            if(name.charCodeAt(i) >= 97 && name.charCodeAt(i) <= 122){
                continue
            }
            
            console.log("Nama "+name+" tidak valid")
        
            return
        }

        this.name = name
    }
    
}

class Dog extends Animal{
    private race

    constructor(name, age, race, gender){
        super(name,age,gender)
        this.race = race
    }

    barking(){
       console.log(this.name + " is barking, i am a "+this.race)
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

let dog = new Dog("milo",3,"Shiba Inu","Male")

// dog.barking() 
dog.setName = "mila"
console.log(dog.getName)
