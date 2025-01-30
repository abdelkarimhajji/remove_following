require('dotenv').config();
const axios = require('axios');
const accessToken = process.env.GITHUB_ACCESS_TOKEN;


let followers = [];
let following = [];
let intruders = [];

function find_intruders()
{
    for(let i = 0; i < following.length; i++)
    {
        if(!followers.includes(following[i]))
            intruders.push(following[i])
    }
    unfollow();
}

async function getFollowers(arg)
{
    let valid = true;
    let url_followers = '';
    let  numbers = 1;
    while(valid)
    {
        url_followers = `https://api.github.com/users/abdelkarimhajji/${arg}?per_page=100&page=${numbers}`;
    
        const response = await axios.get(url_followers,{
            headers:{
                'Authorization':`token ${accessToken}`,
                'Accept' : 'application/vnd.github.v3+json'
            }
        })

        if (response.data.length === 0)
            valid = false
        response.data.forEach(follower =>{
            if(arg === "followers")
                followers.push(follower.login);
            else if(arg === "following")
                following.push(follower.login);
            
        })
        numbers++;
        
    }
    if(arg == "following")
        find_intruders();
    // console.log(`- ${following.length}`)
}
getFollowers("followers");
getFollowers("following");


async function unfollow()
{
    for(let i = 0; i < intruders.length; i++)
    {
        const url = `https://api.github.com/user/following/${intruders[i]}`;
        const response = await axios.delete(url,{
            headers:{
                'Authorization':`token ${accessToken}`,
                'Accept' : 'application/vnd.github.v3+json'
            }
        })
        if(response.status === 204)
            console.log("succes");
    }

}
