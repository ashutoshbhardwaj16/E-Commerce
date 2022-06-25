const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

/* get all categories */
router.get('/', async (req, res)=>{
    const categoryList = await Category.find();
    if (!categoryList){
        res.status(500).json({success: false});
    }
  //  res.status(200).send(categoryList);
    res.send(categoryList);
})

/* get category by id */
router.get('/:id', async (req, res)=>{
    const category = await Category.findById(req.params.id);
    if (!category){
        res.status(500).json({success: false, message: 'Category id not found'})
    }
  //  res.status(200).send(category);
    res.send(category);
})


router.put('/:id', async (req, res)=>{
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }, {
        new: true
    });
    if (!category){
        res.status(500).json({success: false, message: 'Category id not found'})
    }
  //  res.status(200).send(category);
    res.send(category);
})


router.post('/', async (req, res)=>{
    let category = new Category({
        name: req.body.name,
        icon:  req.body.icon,
        color: req.body.color,
    })
    category = await category.save();
    if (!category){
        return res.status(404).send(`Category can't be created `);
    }

    res.send(category);
})

/* using promise */
router.delete('/:id', (req, res)=>{
    Category.findByIdAndDelete(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success: true, message: 'The Selected Category is deleted'});
        } else{
            return res.status(404).json({success: false, message: 'No Category found'});
        }
    }).catch((err)=>{
        return res.status(400).json({ success: false, error:err});
    })
})

module.exports = router;