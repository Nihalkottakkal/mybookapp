var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();
const db = require('../connection/connection')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});







//admin routes

//admin login
router.get('/admin', (req, res) => {
  res.render('admin')
})
router.post('/admin', (req, res) => {
  const body = req.body
  return new Promise(async (resolve, reject) => {
    const data = await db.get().collection('admin').findOne({ username: body.username })
    if (data) {
      if (body.password == data.password) {
        res.render('adminhome')
      }
      else {
        res.send('wrong password')
      }
    }
    else {
      res.send('not an admin')
    }
  })
})



//admin home
router.get('/adminhome', (req, res) => {
  res.render('adminhome')
})



//admin data enter
router.get('/data', (req, res) => {
  res.render('data')
})

router.post('/data', (req, res) => {
  const data = req.body
  return new Promise(async (resolve, reject) => {
    await db.get().collection('books').insertOne(data)
    res.redirect('/data')
  })
})



//admin updatelist
router.get('/list', (req, res) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.get().collection('books').find().sort({ time: -1 }).toArray()
    res.render('list', { list: data })
  })

})



//delete
router.get('/deleted/:id', (req, res) => {
  const data = req.params
  return new Promise(async (resolve, reject) => {
    await db.get().collection('books').deleteOne({ _id: ObjectId(data.id) })
    res.redirect('/list')
  })
})



//update
router.get('/updated/:id', (req, res) => {
  const id = req.params.id
  console.log(id);
  return new Promise(async (resolve, reject) => {
    const data = await db.get().collection('books').findOne({ _id: ObjectId(id) })
    res.render('update', { list: data })
  })
})

router.post('/update/:id', (req, res) => {
  const data = req.body
  console.log(data);
  return new Promise(async (resolve, reject) => {
    await db.get().collection('books').updateOne({ _id: ObjectId(data.id) }, {
      $set: {
        name: data.name,
        author: data.author,
        year: data.year,
        category: data.category,
        price: data.price,
        stock: data.stock,
        time: data.time
      }
    })
    res.redirect('/list')
  })
})




//card
router.get('/card', (req, res) => {
  return new Promise(async (resolve, reject) => {
    const data = await db.get().collection('books').find().toArray()
    res.render('card', { list: data })
  })

})





//favs
router.get('/favs', (req, res) => {
  res.render('favs')
})
router.get('/favourites/:id', (req, res) => {
  const id = req.params.id

  return new Promise(async (resolve, reject) => {
    const favdata = await db.get().collection('favourites').findOne({ _id: ObjectId(id) })

    if (favdata) {
      const favs = await db.get().collection('favourites').find().toArray()
      res.render('favs', { list: favs })
    }
    else {
      const data = await db.get().collection('books').findOne({ _id: ObjectId(id) })
      await db.get().collection('favourites').insertOne(data)
      const favs = await db.get().collection('favourites').find().toArray()
      res.render('favs', { list: favs })
    }
  })
})



//remove from favs
router.get('/remove/:id', (req, res) => {
  const id = req.params.id
  return new Promise(async (resolve, reject) => {
    await db.get().collection('favourites').deleteOne({ _id: ObjectId(id) })
    const favs = await db.get().collection('favourites').find().toArray()
    res.render( 'favs',{ list: favs })
  })
})












//user routes


router.get('/home', (req, res) => {
  res.render('home')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  bodydata = req.body
  console.log(bodydata);
  return new Promise(async (resolve, reject) => {
    const dbdata = await db.get().collection('login').findOne({ username: bodydata.username })
    if (dbdata) {
      if (bodydata.password == dbdata.password) {
        res.send('success')
      }
      else {
        res.send(' incorrect password')
      }
    }
    else {
      res.send('incorrect username ')
    }
  })
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', (req, res) => {
  const data = req.body
  console.log(data);
  return new Promise(async (resolve, reject) => {
    await db.get().collection('login').insertOne(data)
    res.redirect('/login')
  })
})

module.exports = router;




