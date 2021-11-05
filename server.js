import dotenv from 'dotenv'
dotenv.config()
import fetch from "node-fetch"
import express from "express"
import cryptoJS from "crypto-js"
const apiKey = process.env.API_KEY
const apiSecret = process.env.API_SECRET
const apiPathSubmit = 'v2/auth/w/order/submit'
const apiPathWallet = "v2/auth/r/wallets"
const SERVER_PORT = process.env.SERVER_PORT
const app = express()
const mtaRoutes = [process.env.MTA_DEV]

import log4js from 'log4js'
import config from 'loggingConf.js'
log4js.configure(config.log4js.appLogConfig)
const logger = log4js.getLogger()

app.post('/submit', (req, res) => {
    let postBodyRequest = ''
    req.on('data', chunk => {
        postBodyRequest += chunk.toString()
    });

    req.on('end', ()=>{
        let params = JSON.parse(postBodyRequest)
        // console.log('params: ', params)
        logger.info('params', params)
        let orderType = params.type
        let pair = params.pair
        let amount = params.volume
        let nonce = (Date.now() * 1000).toString()
        let body = {
            type: orderType,
            symbol: pair,
            amount: amount
        }
        console.log('body: ', body)

        let signature = `/api/${apiPathSubmit}${nonce}${JSON.stringify(body)}`
        let sig = cryptoJS.HmacSHA384(signature, apiSecret).toString()


        fetch(`https://api.bitfinex.com/${apiPathSubmit}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'bfx-nonce': nonce,
                'bfx-apikey': apiKey,
                'bfx-signature': sig
            }
        })
            .then(res => res.json())
            .then(json => res.end(Buffer.from(JSON.stringify(json)))) // !!!!Возращает
            .then(json => console.log(json))
            .catch(err => {
                console.log(err)
            })

    })
})

app.post('/', (req, res) => {
    let chunks = []
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
    let parts = fullUrl.split('/')
    let targetUrl = parts[2]

    req.on('data', function(data) {
        chunks.push(data)

    })
        .on('end', function() {
            let data = Buffer.concat(chunks)
            let reqBody = JSON.parse(data)
            console.log(reqBody)

            switch (targetUrl){
                case 'localhost:3005':
                    resendPostMethod(reqBody);
                    res.status(200).send('localhost:3005')
                    break;
                default:
                    resendPostMethod(reqBody)
                    res.status(200).send('From postman external')
                    break;
            }
        });
});

function resendPostMethod(reqBody) {
    for(let i in mtaRoutes){
        let mta = mtaRoutes[i]
        console.log(mta)
        fetch(mta, {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}

app.post('/wallet', (req, res) => {

    const nonce = (Date.now() * 1000).toString()
    const body = {
    }

    let signature = `/api/${apiPathWallet}${nonce}${JSON.stringify(body)}`
    const sig = cryptoJS.HmacSHA384(signature, apiSecret).toString()

    fetch(`https://api.bitfinex.com/${apiPathWallet}`, {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
            /* auth headers */
            'Content-Type': 'application/json',
            'bfx-nonce': nonce,
            'bfx-apikey': apiKey,
            'bfx-signature': sig
        }
    })
        .then(res => res.json())
        .then(json => res.end(Buffer.from(JSON.stringify(json)))) // Возврат данных с биржи
        .catch(err => {
            console.log(err)
        })
})

app.listen(SERVER_PORT,() => {
    console.log('Server has been started on port', + SERVER_PORT, '...')
})
