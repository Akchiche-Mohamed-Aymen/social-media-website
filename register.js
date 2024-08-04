let profile =document.getElementById("profile");
let image = document.querySelector("img");
let reset = document.querySelector(".bg-none");

profile.onchange = ()=>{
    image.src = URL.createObjectURL(profile.files[0])
}
const defaultProfile = 'https://th.bing.com/th/id/OIP.ESxXNnztkffareLocbdhxAHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.5'
reset.onclick = ()=>{
    image.src = defaultProfile
}
let fullName = document.getElementById("name"),
    userName = document.getElementById("username"),
    Email = document.getElementById("email"),
    passWord = document.getElementById("password");

let nameValidate = (s = '')=> s.length >= 5 ;

fullName.onkeyup = ()=>{
    if(!nameValidate(fullName.value))
        fullName.style.border = "1px solid red";
    else
        fullName.style.border = "1.5px solid green";

    userName.value = fullName.value.toLocaleLowerCase().replace(" ", "_")
}
userName.onchange = ()=>{
    if(!nameValidate(userName.value))
        userName.style.border = "1px solid red";
    else
        userName.style.border = "1.5px solid green";
}

let form = document.getElementById('form');
form.onsubmit = (event)=>{
    event.preventDefault()
    let formdata = new FormData(form)
    axios.post('https://tarmeezacademy.com/api/v1/register', formdata)
    .then(response =>{
        localStorage.setItem('token' , response.data.token )  
        localStorage.setItem('user' , JSON.stringify(response.data.user))
        location ='index.html'
    })
    .catch(()=> alert('error in registrastion'))       
}