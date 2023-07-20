import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

const firebaseConfig = {
   
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();


let regBtn = document.querySelectorAll(".reg-btn")[0];
let inputs = document.querySelectorAll("input");
regBtn && regBtn.addEventListener("click", () => {
    createUserWithEmailAndPassword(auth, inputs[1].value, inputs[2].value)
        .then(async (userCredential) => {
            try {

                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {

                    username: inputs[0].value,
                    email: inputs[1].value
                });

            } catch (error) {
                console.log(error)
            }
            if (window.location.href !== "./Profile.html") {
                window.location.href = "./Profile.html"


            }


        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })

        });
})
let loginBtn = document.querySelectorAll(".login-btn")[0];
loginBtn && loginBtn.addEventListener("click", () => {
    signInWithEmailAndPassword(auth, inputs[0].value, inputs[1].value)
        .then(async (userCredential) => {

            const user = userCredential.user;

            if (window.location.href !== "./Profile.html") {
                window.location.href = "./Profile.html"
            }



        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })
        });
})

let logOutBtn = document.querySelectorAll(".logout-btn")[0];
logOutBtn && logOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        Swal.fire({
            icon: 'success',
            title: "Log out"
        })
        window.location.href = "index.html"
        localStorage.clear()
    }).catch((error) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
        })
    });

})




const printDetails = async (id) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        inputs[1].value = docSnap.data().username;
        inputs[2].value = docSnap.data().email;
        if(docSnap.data().phone){

            inputs[3].value = docSnap.data().phone;
        }

       


    } else {

        console.log("No such document!");
    }

}

onAuthStateChanged(auth, (user) => {
    if (user) {

        let uid = user.uid;
        console.log("user mil gaya", uid)
        printDetails(uid)
        localStorage.setItem("uid" , uid)


    } else {
        if (window.location.href === "./Profile.html") {
            window.location.href = "index.html"
        }
    }
});
let updateBtn = document.querySelectorAll(".update-btn")[0];
updateBtn && updateBtn.addEventListener("click", async () => {
console.log(inputs)

    let userId = localStorage.getItem("uid")
    console.log(userId)
    await setDoc(doc(db, "users", userId), {
        username: inputs[1].value,
        email:inputs[2].value ,
        phone: inputs[3].value
    });
    Swal.fire({
        icon: 'sucess',
        title: 'User Updated'
    })
})

let pasImg = document.querySelectorAll("#pas-img")[0];
let pasInput = document.querySelectorAll("input[type='password']")[0];
let flag = false
pasImg && pasImg.addEventListener("click", () => {

    if (!flag) {
        pasImg.src = "./images/icons8-hide-password-24.png"
        pasInput.type = "text"
        flag = true;

    } else if (flag) {
        pasImg.src = "./images/icons8-eye-24.png"
        pasInput.type = "password"
        flag = false;
    }


})
