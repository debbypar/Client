var timer = {};
var meanv;
var fileTimer = [];
var max;
var fs = require('fs');
var math = require('mathjs');
exports.setLenght = setLengthFn;
exports.pushTime = pushTimeFn;
exports.pushFileTime = pushFileTimeFn;
function setLengthFn(i)
{
    max = i;

    timer = {
        numberOfFile: max,
        phase1: [],
        phase2: [],
        phase1Mean:0,
        phase2Mean:0
    }

}
function pushTimeFn(time)
{
    timer.phase1.push(time);
    if(timer.phase1.length >= max*2.5)
    {
        timer.phase1Mean = math.mean(timer.phase1);
        // console.log(timer);

    }

}

function pushFileTimeFn(time)
{
    timer.phase2.push(time);
    console.log(timer.phase2.length);
    if(timer.phase2.length >= max*2.5)
    {
        timer.phase2Mean = math.mean(timer.phase2);
        fs.writeFile("./Files/RisultatiTest/uploadTest" + max,
            "TEST EFFETTUATO CON " + max+ " FILE\n" +
            JSON.stringify(timer, null, "\t")
            , function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });

    }

}