const posts  = document.querySelector('.posts');
const webUrl = 'https://tarmeezacademy.com/api/v1/posts';
document.getElementById('log').onclick =()=>{
    location = 'Login.html'
}
let tokenItem = localStorage.getItem('token') ||  null;

let userInfo = JSON.parse(localStorage.getItem('user'))|| null;
console.log(userInfo)
createPosts(1)
let lastPage = 1;
const defaultProfile = 'https://th.bing.com/th/id/OIP.ESxXNnztkffareLocbdhxAHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.5'
if(document.getElementById('register') !== null)
    document.getElementById('register').onclick =()=>{
        location = 'Registeration.html'
    }
function createImage(src){
    let img = document.createElement('img');
    img.src = src; 
    return img;
}
function profileImg(src , username1 , id){
    let div = document.createElement('div');
    
    let h4 = document.createElement('h4');
    div.className = 'profile-img';
    let image = createImage(src)
    image.setAttribute('onclick' , `showProfile(${id})`) 
    div.appendChild(image)
    h4.innerHTML = username1;
    div.appendChild(h4)
    return div;
}
function postImg(src){
    let div = document.createElement('div');
    div.className = 'img';
    div.appendChild(createImage(src))
    return div;
}
function createTimePost(timing){
    let h5 = document.createElement('h5');
    h5.className = 'time'
    h5.innerHTML = timing;
    h5.style.marginBottom = '5px'
    return h5;
}
function createTitle(title){
    let h3 = document.createElement('h3');
    h3.innerHTML = title;
    h3.style.marginBottom = '5px'
    return h3;
}
function bodyPost(bodyText){
    let h5 = document.createElement('h5');
    h5.classList = 'bodyPost'
    h5.innerHTML = bodyText;
    return h5;
}
function createButton(buttonVal , click = ''){
    let button = document.createElement('button');
    button.type = 'button'
    button.innerHTML = buttonVal;
    button.setAttribute('onclick' , click );
    return button;
}
function createPost(postItem ,userId,postId , src1 , src2 , username , timing , title , bodyText , buttonVal){
    let div = document.createElement('div');
    div.className = 'post';
    let profile = profileImg(src1 , username , userId)
    if(tokenItem !== null && userId === userInfo.id){
    
   let div = document.createElement('div')
   div.appendChild(createButton('<i class="fa-solid fa-pen-nib"></i>' , `location = 'updatePost.html?postId=${postId}'`))
   div.appendChild(createButton('<i class="fa-solid fa-trash"></i>' ,`deletePost(${postId} , ${JSON.stringify(postItem)})`))
   div.style.display= 'flex';
   div.style.width= '100%';
   div.style.gap= '10px';
   div.style.justifyContent = 'right'
   profile.appendChild(div)

       }
    div.appendChild(profile);
    if(src2 !== '')
        div.appendChild(postImg(src2));
    div.appendChild(createTimePost(timing));
    div.appendChild(createTitle(title));
    div.appendChild(bodyPost(bodyText))
    div.appendChild(createButton(buttonVal , `showComments(${postId})`));
    return div;
}
function createComment(text , src){
    let div = document.createElement('div');
    let h5 = document.createElement('h5');
    let img = createImage(src)
    div.className = 'comment';
    h5.innerHTML = text;
    div.appendChild(img)
    div.appendChild(h5)
    return div;  
}

function createPosts(index){
    fetch(`${webUrl}?limit=5&&page=${index}`)
    .then( response =>response.json())
    .then((response)=> {
        let post = response.data;
        lastPage = response.meta.last_page;
        for(let i = 0 ; i < post.length ; i++){
            let imgpro = post[i].author.profile_image;
            let imgPost = post[i].image;
            if(isEmpty(imgpro))
                imgpro = defaultProfile;
            if(isEmpty(imgPost))
                imgPost = '';

            let postItem = createPost(post[i],post[i].author.id,post[i].id,imgpro, imgPost ,
                 post[i].author.username , post[i].created_at,
                 post[i].title ,post[i].body ,
                 `<span><i class="fa-solid fa-pen"></i> </span><span>(${post[i].comments_count})</span>comments`);
                 for(let j = 0 ; j < post[i].tags.length ; j++){
                    let tagEle = `<span class="tag">${post[i].tags[j].name}</span>`
                    postItem.innerHTML+=tagEle;
                 }
            posts.appendChild(postItem);
        }
   if(tokenItem)
        reset('initial')
    else reset('none')
    })
    .catch(err => console.log(err))
}
let page =1;
function scrolling(){
    let end =  (window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight
    if(end && page <= lastPage){
        page++;
        createPosts(page)
    }
    else if(page > lastPage)
        alert('no posts')
}
onscroll =  scrolling;
function showComments(id){
    let current =  document.querySelector(`button[onclick='showComments(${id})']`).parentElement;
   axios.get(`${webUrl}/${id}`)
   .then(response=>{
        for(let k = 0 ; k < posts.children.length ; k++)
            if(current !==    posts.children[k]){
                posts.children[k].style.display = 'none';
                onscroll = null
            }
        let h1 = document.createElement('h1')
        h1.innerHTML = `${response.data.data.author.username}'s post`;
        posts.prepend(h1)
        let commentsItems = response.data.data.comments
        console.log(commentsItems)
        for(let p = 0 ; p < commentsItems.length ; p++)
            current.appendChild(createComment(commentsItems[p].body , commentsItems[p].author.profile_image))
        let newComment = document.createElement('div')
        tokenItem = localStorage.getItem('token') ||  null;
        newComment.className = 'newComment';
            newComment.innerHTML = `
            <input type='text'  id='comment${id}' >
            <button type='button' class= 'addComment' onclick  = 'addComment(${id})'>send</button>
            `
            current.appendChild(newComment)
        if(!tokenItem){
            newComment.style.display = 'none'   
        }
       
   })
   .catch(error => console.log(error))

}
function addComment(id){
    let token = localStorage.getItem('token') ||  null;
    let commebtBody = document.getElementById(`comment${id}`).value;
    let div = document.getElementById('succAdd');
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,{body:commebtBody}, {
        headers: {
            'authorization' : `Bearer ${token}` 
        }})
        .then(response=>{
            shoeAlert(div)   
            showComments(id) 
        })
        .catch(error=>{
           shoeAlert(div.nextElementSibling)
        });
}

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
    }
    }       
    return true;
}
function shoeAlert(ele){
    ele.classList.add('showRes')
    setTimeout(()=>{
        ele.classList.remove('showRes')
    },5000)
}
function deletePost(postId , postItem){
    let showDeleteBar = document.querySelector('.deletePost')
    showDeleteBar.classList.add('showDelete')
    let cancel = document.getElementById('noDel')
    console.log(postItem)
    cancel.onclick = ()=>showDeleteBar.classList.remove('showDelete')
    let remove  = document.getElementById('del')
    remove.onclick = ()=>{
        axios.delete(`${webUrl}/${postId}`, {
            headers:{
                'authorization' : `Bearer ${tokenItem}`,
                "Accept"        : "application/json"
            },
            data: {
                source: postItem
              }
        })
        .then(()=> {
            setTimeout(()=> location = 'index.html' , 1000)
        })
        .catch(()=>alert('can ` t delete post'))
        
    }
    
}
document.querySelector('.profile').setAttribute('onclick' , `showProfile(${userInfo.id})`)
function reset(display){
    let modify = document.querySelectorAll('.post div  button')
    modify.forEach(item => item.style.display= display)
}

function showProfile(id){
    deletePosts()
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then(response=> {
        let items = response.data.data;
        let div = document.createElement('div')
        let div2 = document.createElement('div')
        let div3 = document.createElement('div')
        div.className = 'profileInfo'
        div2.className = 'personInfo'
        div3.className = 'statisticInfo'
        let pic = response.data.data.profile_image;
        if(isEmpty(pic))
            pic =defaultProfile
        div2.appendChild(createImage(pic))
        let h2 = document.createElement('h2')
        h2.innerHTML='@' + response.data.data.username;
        div2.appendChild(h2)
        div.appendChild(div2)
        console.log(response)
        let h3 = document.createElement('h3')
        let h23 = document.createElement('h3')
        h3.innerHTML = `<span>${response.data.data.posts_count}</span> posts`
        h23.innerHTML = `<span>${response.data.data.comments_count}</span> comments`
        div3.appendChild(h3)
        div3.appendChild(h23)
        div.appendChild(div3)
   
        posts.appendChild(div)
    })
    .catch(err => console.log(err))
}
function deletePosts(){
    for( let i = 0 ; i < posts.children.length; i++)
        posts.children[i].style.display = 'none'
    onscroll = null
}
function rePost(){
    for(let i = 0 ; i < posts.children.length ; i++){
        posts.children[i].style.display = 'initial'
        onscroll = scrolling
        if(posts.children[i].getAttribute('class'))
            if(posts.children[i].className !== 'post')
                  posts.children[i].style.display = 'none'
        if(!posts.children[i].getAttribute('class'))
            posts.children[i].style.display = 'none'
        let comments = document.querySelectorAll('.comment')||  [];
        let inputs = document.querySelectorAll('input')||  [];
        let buttons = document.querySelectorAll('.addComment')||  [];
        comments.forEach(comment => comment.remove())
        inputs.forEach(input =>input.remove())
        buttons.forEach(button =>button.remove())
      
    }
}