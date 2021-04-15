const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const host = "localhost";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve('public'), { redirect: false }));

app.use('*', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});




app.get('/card-bundle.js', (req, res, next) => {

  axios.get(`https://fjakeravenbundles.s3.us-east-2.amazonaws.com/card-bundle.js`)
    .then(cardBundle => {
      res.send(cardBundle.data);
    })
    .catch((err) => {
      res.send(err);
    });

});

/* STATIC */
app.get('/:id', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


/* PRODUCT DETAILS */
app.get('/details/:productId', (req, res, next) => {

  console.log('PROXY /:productId req.params.productId', req.params.productId, req.query.indicator);

  axios.get(`http://3.138.79.75/details/${req.params.productId}`, { params: { indicator: 'all' } })
    .then((productDetailsData) => {
      res.send(productDetailsData.data);
    })
    .catch((err) => {
      res.send(err);
    });

});


/* PRODUCT CARD */

app.get('/card/:id', (req, res, next) => {

  console.log('PROXY /card/:id req.params.id', req.params.id);

  axios.get('http://product-card.fjakeraven.com/card/' + req.params.id)
    .then((cardData) => {
      res.send(cardData.data);
    })
    .catch((err) => {
      res.send(err);
    });

});


app.get('/images/:id', (req, res, next) => {

  console.log('PROXY /card/:id req.params.id', req.params.id);

  axios.get('http://product-card.fjakeraven.com/display/' + req.params.id)
    .then((imagesData) => {
      res.send(imagesData.data);
    })
    .catch((err) => {
      res.send(err);
    });

});



/* ACTIVITY FOR PRODUCT CARD DISPLAY */

app.get('/activity/:id', (req, res, next) => {

  console.log('PROXY activity/:id', req.params.id, req.query.indicator);

  axios.get(`http://3.138.79.75/${req.params.id}`, { params: { indicator: req.query.indicator } })
    .then((activityData) => {
      console.log('activity ', activityData.data);
      res.send(activityData.data.activity);
    })
    .catch((err) => {
      res.send(err);
    })
});


/* RELATED PRODUCTS */

app.get('/related-products/:id', (req, res, next) => {

  console.log('PROXY /related-products/:id ', req.params.id);

  axios.get(`http://3.129.111.96:8003/related-products/${req.params.id}`, { params: { id: req.params.id } })
    .then((relatedData) => {
      res.send(relatedData.data);
    })
    .catch((err) => {
      res.send(err);
    });
});


/* REVIEWS */

app.post('/:id', (req, res, next) => {

  console.log('PROXY Reviews /:id req.params.id', req.params.id);

  axios.post(`http://54.183.205.73:8004/${req.params.id}`)
    .then((reviewsProductsData) => {
      res.send(reviewsProductsData.data);
    })
    .catch((err) => {
      res.send(err);
    });

});


app.get('/reviews-products/:id', (req, res, next) => {

  console.log('PROXY /reviews-products/:id ', req.params.id);

  axios.get(`http://54.183.205.73:8004/reviews-products/:id`, { params: { id: req.params.id } })
    .then((reviewsProductsData) => {
      res.send(reviewsProductsdData.data);
    })
    .catch((err) => {
      res.send(err);
    });
});


app.listen(port, () => {
  console.log(`FJALLRAVEN PROXY listening at ${host}:${port}`);
});

