const urlParams = new URLSearchParams(window.location.search);
const postIDe = urlParams.get('postId');
const body = document.querySelector('input[name="body"]'),
title = document.querySelector('input[name=title]'),
image = document.querySelector('img'),
form = document.querySelector('form'),
btn = document.querySelector('button'),
inputFile = document.getElementById('postPohto');
inputFile.onchange = ()=> image.src = URL.createObjectURL(inputFile.files[0])
let token = localStorage.getItem('token') ||  null;
let url = `https://tarmeezacademy.com/api/v1/posts`;
let div = document.querySelector('div')
if(postIDe){
  btn.innerHTML = 'Update now'
  div.innerHTML = 'post was updated'
  div.nextElementSibling.innerHTML = 'Error in updating post'
    url+=`/${postIDe}`
    axios.get(url)
    .then(response =>{
        body.value = response.data.data.body
        title.value = response.data.data.title
        image.src = response.data.data.image
})
    .catch(()=> alert('error'))
}
else{
    btn.innerHTML = 'Post now'
    div.innerHTML = 'New post was added'
    div.nextElementSibling.innerHTML = 'New post was added'
}

//update 
btn.onclick = ()=>{
  let formdata = new FormData(form)
    if(postIDe)
      formdata.append('_method' , 'put')
  axios.post(url, formdata,{
        headers: {
            'authorization' : `Bearer ${token}`,
            'Content-Type' : 'multipart/form-data',
        }
  })
  .then((response)=>{
    shoeAlert(div)
    setTimeout(()=>location = 'index.html' ,3000)
  }
)
  .catch(error=>{
    shoeAlert(div.nextElementSibling)
    setTimeout(()=>location = 'index.html' ,3000)
  } )
}
function shoeAlert(ele){
  ele.classList.add('showRes')
  setTimeout(()=>{
      ele.classList.remove('showRes')
  },5000)
}