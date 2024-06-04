function getHello (req,res){
    try{
        res.status(201).json({message: 'hellooooo'})
    }
    catch(err){
        console.error("error: ",err)
    }
}
function getHiii (req,res){
    try{
        res.status(201).json({message: 'hiiiiiiiiiii'})
    }
    catch(err){
        console.error("error: ",err)
    }
}
module.exports = {getHello, getHiii};