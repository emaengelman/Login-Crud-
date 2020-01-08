const express = require('express');
const router = express.Router();
//Pool es la DB
const pool = require('../database');
const {isLoggedIn } = require('../lib/auth');

router.get('/add',isLoggedIn, (req, res)=>{
res.render('links/add');
}); 
router.post('/add',isLoggedIn, async (req,res)=>{
 const { tittle, url, description } =  req.body
 const newLink={
     tittle,
     url,
     description,
     user_id: req.user.id
 };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link guardado correctamente');
    res.redirect('/links');
});

router.get('/',isLoggedIn, async (req, res)=>{
    const links = await pool.query('SELECT * FROM links WHERE user_id = ? ',[req.user.id]);
    
    res.render('links/list', {links});
});

router.get('/delete/:id',isLoggedIn, async (req, res)=>{
   const {id}= req.params;
  await pool.query('DELETE FROM links WHERE ID = ?', [id]);
  req.flash('success', 'Link removido!');
   res.redirect('/links');
});
router.get('/edit/:id',isLoggedIn, async (req, res)=>{
    const {id}= req.params;
    const links = await pool.query('SELECT *FROM links WHERE ID = ?', [id]);
    res.render('links/edit',{links: links[0]});
});
router.post('/edit/:id',isLoggedIn, async(req,res )=>{
    const{id} = req.params;
    const {tittle , description, url}= req.body;
    const newLink = {
        tittle,
        description,
        url
    };
   await pool.query('UPDATE links set ? WHERE ID = ?', [newLink, id]);
    req.flash('success', 'Link editado!');
   
   res.redirect('/links');
});

module.exports = router;