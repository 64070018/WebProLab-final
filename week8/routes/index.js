const express = require('express')
const router = express.Router()
var article = require('../article-db')

router.get('/', function (req, res, next) {
    var search = req.query.search;

    var result = article.filter(data => {
        var low_search = typeof(search) === 'string' ? search.toLowerCase() : ''
        var low_title = typeof(data.title) === 'string' ? data.title.toLowerCase() : ''
        if (low_title.includes(low_search)){
            return data.title

        }

    })
    var data_show = {title: 'finder', data: result}
    res.render('index', data_show)

})


router.get('/blog', (req, res) => {
    res.render('index', article)
})

// กำหนดให้ path blogapi/id แสดงข้อมูลบทความตาม id ที่กำหนด

router.get('/blog/:id', (req, res) => {
    var details = {
        data: article.find(
            article => article.id === req.params.id
        )
    }
    // if (!details) {
    //     res.render("error")
    // } else {
    res.render('./detail', details)
    // }

})

module.exports = router