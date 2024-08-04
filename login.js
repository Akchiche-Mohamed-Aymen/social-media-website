const user = document.getElementById('user');
const password = document.getElementById('pass');
const btn = document.getElementById('log');
const head = document.getElementById('auth');
const addPost = document.getElementById('addPost');
const form = document.querySelector('form');
let cancel = document.getElementById('cancel');
let cancel2 = document.getElementById('cancel2');
let userData = JSON.parse(localStorage.getItem('user'))|| null;
let token = localStorage.getItem('token') ||  null;
if(userData){
user.value = userData.username
}
updateNavBar()
btn.onclick = ()=>{
   axios.post('https://tarmeezacademy.com/api/v1/login',{
    "username": user.value,
    "password" : password.value
   }) 
   .then((response)=>{
        localStorage.setItem('token' , response.data.token )  
        token = response.data.token
        localStorage.setItem('user' , JSON.stringify(response.data.user))
        updateNavBar()
        alertSucc()
   })
   .catch(()=>{
    alert('error in password or username') 
   })
} 
function login(){
        form.classList.add('active')
    }
cancel.onclick = ()=>{
    form.classList.remove('active')
}
cancel2.onclick =()=>{
    cancel.click()
}

function loginCase(){
    head.innerHTML = `
            <button onclick = 'login()' type="button">Log In</button>
            <button id="register" type="button">Register</button>
    `
    document.getElementById('register').onclick = ()=> location = 'Registeration.html'
    addPost.style.display = 'none';
    reset('none')
    let addComments = document.querySelectorAll('.newComment') || [];
    addComments.forEach(add => add.style.display = 'none')
}
function logoutCase(){
    let usernameval = userData.username;
    let image = userData.profile_image;
    if(isEmpty(image))
        image = defaultProfile;
    head.innerHTML =`
        <img src = ${image}>
        <h3>@${usernameval}</h3>
        <button onclick ='logout()'  type="button" id="logout" style='margin-right : 9px'git>Log out</button>
    `
    reset('initial')
    addPost.style.display = 'initial';
    let addComments = document.querySelectorAll('.newComment') || [];
    addComments.forEach(add => add.style.display = 'flex')
 
}
function updateNavBar(){
    token = localStorage.getItem('token') ||  null;
    if(token !== null){
        logoutCase()
        form.classList.remove('active')
    }
    else{
        loginCase()
       
    }
}

function logout(){
    let decision = confirm('are you sure that you want to logout ? ')
    if(decision){
        localStorage.removeItem('token')
        loginCase()
        
    }
}
   
let div = document.getElementById('alertSucc')
function alertSucc(){ 
    div.classList.add('show')
    setTimeout(()=> div.classList.remove('show') ,4500)
}
function reset(display){
    let modify = document.querySelectorAll('.post div  button')
    modify.forEach(item => item.style.display= display)
}
tokenItem = localStorage.getItem('token') ||  null;
if(tokenItem){
    
}
else{
    let addComments = document.querySelectorAll('.newComment')
    addComments.forEach(add => add.style.display = 'none')
    
}
