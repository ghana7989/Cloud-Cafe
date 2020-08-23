const cafeList = document.getElementById("cafe-list")
const form = document.getElementById("add-cafe-form")



function renderCafe(doc) {
    const li = document.createElement("li")
    const name = document.createElement("span")
    const city = document.createElement("span")
    const cross = document.createElement("div")


    li.dataset.id = doc.id
    name.innerText = doc.data().name
    city.innerText = doc.data().city
    cross.innerText = "X"

    li.appendChild(name)
    li.appendChild(city)
    li.appendChild(cross)

    cafeList.appendChild(li)

    // Deleting Data
    cross.addEventListener("click", (e) => {
        e.stopPropagation()
        const id = doc.id
        db.collection("cafes").doc(id).delete().then(console.log("Deleted Cafe"))
    })
}
// // Getting Data
// db.collection("cafes").orderBy("time","desc").get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc)
//     })
// })


// Saving Data
form.addEventListener("submit", (e) => {
    e.preventDefault()
    db.collection("cafes").add({
        name: form.name.value,
        city: form.city.value.toLowerCase(),
        time: new Date().getTime()
    })
        .then(() => { form.reset(); console.log("Cafe Added") })
        .catch(err => alert("Ooops !!", err))
})

// RealTime Listener

db.collection("cafes").orderBy("time").onSnapshot(snapshot => {
    const changes = snapshot.docChanges()
    changes.forEach(change => {
        if (change.type == "added") {
            renderCafe(change.doc)
        }
        else if (change.type == "removed") {
            let li = document.querySelector(`[data-id=${change.doc.id}]`)
            cafeList.removeChild(li)
        }
    })
})