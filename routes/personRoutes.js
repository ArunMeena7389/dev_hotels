const express = require("express")
const router = express.Router();

const Person = require('../modules/person')



router.get('/', async(req,res)=>{
    try{
        const data = await Person.find();
        res.status(200).json(data);

    }catch(error){
        res.status(500).json({error:'Internal Server error'})
    }

});


router.post('/', async (req,res)=>{
    try{
        const data = req.body //the request body contains person data

        //create a new person document using the mongose model
        const newPerson = new Person(data);
        const response = await newPerson.save();
        console.log(response,'----------rres');
        res.status(200).json(response);
        

    }catch(error){
        console.log(error,'error api person');
        res.status(500).json({error:"Internal server error"})
        

    }
})

router.get('/:workType', async(req,res)=>{
    try{
        const workType = req.params.workType;
        if(workType == "chef" || workType == "waiter" || workType == "manager"){
            const data = await Person.find({work:workType});
            res.status(200).json(data);



        }else{
            res.status(404).json({error:'Internal Server error'})

        }

    }catch(error){
        res.status(500).json({error:'Internal Server error'})
    }

})

module.exports = router;