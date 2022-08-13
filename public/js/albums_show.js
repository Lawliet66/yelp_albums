const upvoteBtn = document.getElementById("upvote_btn")
const downvoteBtn = document.getElementById("downvote_btn")
const score = document.getElementById("score")


const sendVote = async(voteType)=>{
    const options={
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        }
    }
    if(voteType=='up'){
        options.body = JSON.stringify({voteType:"up", albumId})
    }
    else if (voteType=='down'){
    options.body = JSON.stringify({voteType:"down",albumId})
    }
    else{
        throw "vote up or down"
    }
    await fetch("/albums/vote",options)
    .then(data =>{
        return data.json()
    })
    .then(res=>{
        console.log(res)
        handleVote(res.score,res.code)
    })
    .catch(err=>{
        console.log(err)
    })
}

const handleVote = (newScore,code)=>{
    score.innerText = newScore

    if(code===0){
        upvoteBtn.classList.remove("btn-success")
        upvoteBtn.classList.add("btn-outline-success")
        downvoteBtn.classList.remove("btn-danger")
        downvoteBtn.classList.add("btn-outline-danger")
    }
    else if(code===1){
        upvoteBtn.classList.remove("btn-outline-success")
        upvoteBtn.classList.add("btn-success") 
        downvoteBtn.classList.remove("btn-danger")
        downvoteBtn.classList.add("btn-outline-danger")
    }
    else if(code===-1){
        upvoteBtn.classList.add("btn-outline-success")
        upvoteBtn.classList.remove("btn-success") 
        downvoteBtn.classList.add("btn-danger")
        downvoteBtn.classList.remove("btn-outline-danger")
    }
    else{
        console.log("error in handleVote")
    }
}


upvoteBtn.addEventListener("click",async function(){
   
    sendVote("up")
})

downvoteBtn.addEventListener("click",async function(){
   
    sendVote("down")
})

