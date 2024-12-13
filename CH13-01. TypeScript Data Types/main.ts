// Data Types
// number,string, boolean
// <variable_declarator> <identifier>:<data_type> = <value>

let personName: string = "John"
let age = 22;

type Person = { name: string, age?: number }
type ID = string
type Greeter = (name: string) => void

let person: Person = { name: "John" }
let personA: Person = { name: "Jane" }
let nik: ID = "1234567890"

let greetInID: Greeter = (name: string) => {
  console.log("Halo ", name)
}
let greetInEN: Greeter = (name: string) => {
  console.log("Hello ", name)
}

function greet(name: string, greetFunctions: Greeter[]) {
  for (let i = 0; i < greetFunctions.length; i++) {
    greetFunctions[i](name)
  }
}

function sum(x: number, y: number): number {
  return x + y
}

function printMessage(msg: string): undefined {
  console.log(msg)
}


// Union Type
type Comparable = string | number | boolean

function isEqual(x: Comparable, y: Comparable): boolean {
  return x == y
}

type HasLength = { length: () => number }

// Generic Type
function search<T extends Comparable>(id: T, arr: T[]): boolean {
  return true
}



abstract class LivingThings {
  abstract isBreathing: boolean
  abstract moving: () => void;
}



class Animal extends LivingThings {
  //private
  //protected
  //public

  // #privateProperty
  // publicProperty

  public isBreathing: boolean;
  public name;
  private gender;
  protected species;

  public moving: () => void = () => {
    console.log("moving")
  };

  private methodPrivate() {

  }

  protected methodProtected() {

  }
}

class Dog extends Animal {
  private method() {
    this.species
    super.methodProtected()
  }
}

interface Runnable {
  run: () => void
}

interface Stoppable {
  stop: () => void
}

class Horse extends Animal implements Runnable, Stoppable {
  run: () => void = () => {
    console.log("Running")
  }
  stop: () => void = () => {
    console.log("Stopped")
  }
}