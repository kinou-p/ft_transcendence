/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: apommier <apommier@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/22 18:05:15 by apommier          #+#    #+#             */
/*   Updated: 2023/03/22 19:20:40 by apommier         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express');
const bodyParser = require('body-parser');
// const { Client } = require('pg');
const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    port: 5432,
    user: 'kinou',
    password: 'pass',
    database: 'postgreDB'
})

module.exports = pool;


pool.query('SELECT * FROM users', (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res.rows);
    }
  });

const app = express();
// const client = new Client({
//   host: process.env.POSTGRES_HOST,
//   port: process.env.POSTGRES_PORT,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB
// });
// client.connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/test', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/login', (req, res) => {
    
    // const formData = req.body;
    // console.log(formData);
    console.log('get request');
    console.log(req.body);
    res.status(201).json(req.body);
  });

app.listen(5000, () => console.log('Server is up and running'));