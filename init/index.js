const mongoose=require("mongoose");
const Listing=require("../models/listing.js")
const initData=require("./data.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
async function main(){
    await mongoose.connect(MONGO_URL)
}
main().then(()=>{
    console.log("Connection succesfull");
}).catch((err)=>{
    console.log(err);
})

 

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"69f629f810870a0b75ad194c"}))
    await Listing.insertMany(initData.data);
    console.log("data was intialized");
}
initDB();

