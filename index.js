'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

var api_url = 'https://api.korbit.co.kr/v1/ticker/detailed?currency_pair=';

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello world');
})

//초기 상태 get '시작'' 버튼으로 시작
app.get('/keyboard', function(req, res){
  let keyboard = {
    "type" : "text"
    /*
    or button, like this
    "type" : "buttons",
    "buttons" : ["btn 1", "btn 2", "btn 3"]
    */
  };
  res.send(keyboard);
});

//카톡 메시지 처리
app.post('/message', function(req,res){
  let user_key = decodeURIComponent(req.body.user_key); // user's key
  let type = decodeURIComponent(req.body.type); // message type
  let content = decodeURIComponent(req.body.content); // user's message
  let currency = "";

  if (content == "BTC" || content == "비트코인") {
    currency = "btc_krw";
  } else if (content == "ETH" || content == "이더리움") {
    currency = "eth_krw";
  } else if (content == "XRP" || content == "리플") {
    currency = "xrp_krw";
  }
  
  let url = api_url + currency;
    
  // 천단위 콤마 함수
  function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  request(url, function (error, response, body) {
    console.log(response.statusCode);
      let text = "";
      if (!error && response.statusCode == 200) {
        //json 파싱
        var objBody = JSON.parse(response.body);
        text = objBody.last;
        //text = response.body;
         //res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
         //res.end(body);
        // text = body;
      } else {
         //res.status(response.statusCode).end();
         //console.log('error = ' + response.statusCode);
         text = response.statusCode;
      }
    
      let answer = {
        "message":{
          "text": "현재 시세는 " + numberWithCommas(text) + "원 입니다."// in case 'text'
        }
      }

      res.set({
            'content-type': 'application/json'
      }).send(JSON.stringify(answer));
  });
  /*
  let answer = {
    "message":{
      "text":"your message is arrieved server : "+content // in case 'text'
    }
  }
  res.send(answer);
  */
  /*
  answer can use 
  {
    "message": {
      "text": "귀하의 차량이 성공적으로 등록되었습니다. 축하합니다!",
      "photo": {
        "url": "https://photo.src",
        "width": 640,
        "height": 480
      },
      "message_button": {
        "label": "주유 쿠폰받기",
        "url": "https://coupon/url"
      }
    },
    "keyboard": {
      "type": "buttons",
      "buttons": [
        "처음으로",
        "다시 등록하기",
        "취소하기"
      ]
    }
  }
  */
});

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'));
})