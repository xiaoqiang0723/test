var express = require('express'),
redis = require('redis'),
app = express(),
port = 3000,
ip = '127.0.0.1',
randomNum = 0,
cacheKey = 'randomNumKey',
client = redis.createClient();
app.listen(port,ip);

client.on("error", function (err) {  
    console.log("Error " + err) 
});

function getRandomNum(){
	var randomNumF = Math.random() * 100
	randomNum = parseInt(randomNumF)
	client.set(cacheKey,randomNum+'',redis.print)
	return randomNum
}

app.get('/start',function(req,res){
	getRandomNum()
    res.send('OK')
});

app.get('/:number',function(req,res){ 
	let number = req.params.number;
	let responContent = '';
	if(number > randomNum){
		responContent = 'bigger'
	}else if(number < randomNum){
		responContent = 'smaller'
	}else if(number == randomNum){
		responContent = 'equal'
		getRandomNum()
	}
	res.send(responContent);
});