import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";


const firebaseConfig = {
   
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


let regBtn = document.querySelectorAll(".reg-btn")[0];
let inputs = document.querySelectorAll("input");


const uploadFile = (file) => {
    let uid = localStorage.getItem("uid")

    console.log("filename", file.name)

    return new Promise((resolve, reject) => {
        const mountainsRef = ref(storage, `images/${uid}`);
        const uploadTask = uploadBytesResumable(mountainsRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    })
}
let srrc;
let fileInput = document.querySelectorAll("input[type='file']")[0];
fileInput && fileInput.addEventListener("change", () => {

    console.log("working", fileInput.files[0])

    uploadFile(fileInput.files[0]).then((res) => {
        let profImg = document.querySelectorAll(".prof-img")[0];
        profImg.src = res;
        srrc = res
        console.log("imgurl", res)
    }).catch((rej) => {
        console.log("reject==>".rej)
    })
});





regBtn && regBtn.addEventListener("click", () => {
    let usNameInput = document.querySelectorAll("input[type='text']")[0];
    let emailInput = document.querySelectorAll("input[type='email']")[0];
    let passInput = document.querySelectorAll("input[type='password']")[0];
    createUserWithEmailAndPassword(auth, emailInput.value, passInput.value)
        .then(async (userCredential) => {
            try {

                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {

                    username: usNameInput.value,
                    email: emailInput.value
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
let passwordType;
let loginBtn = document.querySelectorAll(".login-btn")[0];
loginBtn && loginBtn.addEventListener("click", () => {
    let emailInput = document.querySelectorAll("input[type='email']")[0];
    let passInput = document.querySelectorAll("input[type='password']")[0];
    passwordType = pasInput.value
    signInWithEmailAndPassword(auth, emailInput.value, passInput.value)
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
    let usNameInput = document.querySelectorAll("input[type='text']")[0];
    let emailInput = document.querySelectorAll("input[type='email']")[0];
    let phoneInput = document.querySelectorAll("input[type='text']")[1];
    if (docSnap.exists()) {

        usNameInput.value = docSnap.data().username;
        emailInput.value = docSnap.data().email;
        if (docSnap.data().phone) {

            phoneInputvalue = docSnap.data().phone;
        }
        let profImg = document.querySelectorAll(".prof-img")[0];
        if (docSnap.data().image) {

            profImg.src =  docSnap.data().image;
        }
        else {

            profImg.src = "./images/user.png"
        }




    } else {
        if(window.location.href !== "index.html" && window.location.href !== "Profile.html" ){

            window.location.href = "index.html"
        }
        console.log("No such document!");
    }

}

onAuthStateChanged(auth, (user) => {
    if (user) {

        let uid = user.uid;
        console.log("user mil gaya", uid)
        printDetails(uid)
        localStorage.setItem("uid", uid)
        if(location.pathname !== "Profile.html" && location.pathname === "index.html" && location.pathname === "register.html"){

            window.location.href = "Profile.html"
            console.log("loginpage nhi ane dena 1")
        }
        if(location.pathname === "index.html" || location.pathname === "register.html"){
            window.location.href = "Profile.html"
        }
        
    } else {
        if(window.location.href !== "index.html" && window.location.href === "Profile.html" ){

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
        email: inputs[2].value,
        phone: inputs[3].value,
        image: srrc,
        password: passwordType
    });
    Swal.fire({
        icon: 'success',
        title: 'User Updated'
    })
});



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
