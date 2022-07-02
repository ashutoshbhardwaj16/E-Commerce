const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


/* get all users */
router.get('/', async (req, res)=>{
    const usersList = await User.find().select('-passwordHash');
    if (!usersList){
        res.status(500).json({success: false});
    }
    res.send(usersList);
})

/* get user by id */
router.get('/:id', async (req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user){
        res.status(500).json({success: false, message: 'user id not found'})
    }
  //  res.status(200).send(category);
    res.send(user);
})


router.put('/:id', async (req, res)=>{
    const userExists = await User.findById(req.params.id);
    let newPassword
    if (req.params.password){
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else{
        newPassword = userExists.passwordHash;
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    }, {
        new: true
    });
    if (!user){
        res.status(500).json({success: false, message: 'user id not found'})
    }
    res.send(user);
})


/* add user with hashed password */
router.post('/', async(req, res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).json({status: true, message :'the user cannot be created!'})

    res.send(user);
})

router.post('/login', async (req, res)=>{
    const user = await User.findOne({email: req.body.email});

    if (!user){
        return res.status(404).json({status: false, message: 'No user found'});
    }
    if ( user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            'secret this should be unique ',
            {expiresIn: '1d'}
        )
        res.status(200).json({status: true, user: user.email, token: token}); 
    } else {
        res.status(400).json({status: false, message: 'Wrong password'});
    }
})

/* add user with hashed password */
router.post('/register', async(req, res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).json({status: true, message :'the user cannot be created!'})

    res.send(user);
})

/* get users count API */
router.get(`/get/count`,async (req, res)=>{
    const userCount = await User.countDocuments()
    if (!userCount){
        return res.status(500).json({success: false});
    }
     res.send({userCount: userCount});
 })

 router.delete('/:id', (req, res)=>{
    User.findByIdAndDelete(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success: true, message: 'The Selected user is deleted'});
        } else{
            return res.status(404).json({success: false, message: 'No user found'});
        }
    }).catch((err)=>{
        return res.status(400).json({ success: false, error:err});
    })
})


module.exports = router;