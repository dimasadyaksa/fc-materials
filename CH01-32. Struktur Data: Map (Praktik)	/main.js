let m = new Map()

m.set("user","John")
m.set("date","22 Oct")

let isDeleted = m.delete("date")
console.log("Is Deleted (date) = ",isDeleted)
console.log("Map = ",m)

isDeleted = m.delete("key")
console.log("Is Deleted (key) = ",isDeleted)

m.set(1,"a")
m.set(2,"b")
console.log("M = ",m)
m.clear()

console.log("M = ",m)

