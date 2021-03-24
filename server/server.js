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


/* PRODUCT DETAILS */

app.get('/:productId', (req, res, next) => {

  console.log('PROXY /:productId req.params.productId', req.params.productId, req.query.indicator);

  if (!req.query.service) {

    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  } else if (req.query.indicator === 'all' ) {

    axios.get(`http://localhost:8002/${req.params.productId}`, { params: { indicator: 'all'} })
      .then((productDetailsData) => {
        res.send(productDetailsData.data);
      })
      .catch((err) => {
        res.send(err);
      });

    } else {
      res.sendFile(path.join(__dirname, '../public', 'index.html'));
    }

});

/* STATIC */

app.get('/:id', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


/* PRODUCT CARD */

app.get('/card/:id', (req, res, next) => {

  console.log('PROXY /card/:id req.params.id', req.params.id);

  axios.get('http://localhost:8001/card/' + req.params.id)
    .then((cardData) => {
      res.send(cardData.data);
    })
    .catch((err) => {
      res.send(err);
    });

});


app.get('/images/:id', (req, res, next) => {

  console.log('PROXY /card/:id req.params.id', req.params.id);

  axios.get('http://localhost:8001/images/' + req.params.id)
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

  axios.get(`http://localhost:8002/${req.params.id}`, { params: { indicator: req.query.indicator } })
    .then((activityData) => {
      res.send(activityData.data.activity);
    })
    .catch((err) => {
      res.send(err);
    })
});


/* RELATED PRODUCTS */

app.get('/related-products/:id', (req, res, next) => {

  console.log('PROXY /related-products/:id ', req.params.id);

  axios.get('http://localhost:8001/related', { params: { id: req.params.id } })
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

  axios.post(`http://localhost:8004/${req.params.id}`)
    .then((reviewsProductsData) => {
      res.send(reviewsProductsData.data);
    })
    .catch((err) => {
      res.send(err);
    });

});


app.get('/reviews-products/:id', (req, res, next) => {

  console.log('PROXY /reviews-products/:id ', req.params.id);

  axios.post('http://localhost:8004/reviews-products/:id', { params: { id: req.params.id } })
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