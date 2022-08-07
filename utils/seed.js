import Album from "../models/album.js"
import Comment from "../models/comment.js"

const album_seeds=[
    {title:"Norman F Rockwell",
    description: "Probably the pop album I like the most currently",
    artist: "Lana Del Ray",
    trackListLength: 14,
    notableTracks: "The Greatest",
    recordLabel: "Interscope",
    date: "2019-08-30",
    genre: "pop",
    image:"https://upload.wikimedia.org/wikipedia/en/8/8a/Lana_Del_Rey_-_Norman_Fucking_Rockwell.png"},

    {title:"1989",
        description: "The first full on pop record by Taylor Swift",
        artist: "Taylor Swift",
        trackListLength: 13,
        notableTracks: "Shake it off",
        recordLabel: "Big Machine Records",
        date: "2014-10-14",
        genre: "pop",
        image:"https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Taylor_Swift_-_1989.png/220px-Taylor_Swift_-_1989.png"}

    
]

const seed = async() =>{
    await Album.deleteMany()
    console.log("Deleted All the Comics")

    await Comment.deleteMany();
    console.log("Deleted All the Comments")

   for(const album_seed of album_seeds){
        let album=await Album.create(album_seed)
        console.log("Created a new album ", album.title)
        await Comment.create({
            text:"I love this album",
            user: "whatever",
            albumId:album._id
        })
   }
}
export default seed