```javascript
var bracket = new Bracket('<', '>')

// file.txt contents: 
// "<p> what a wonderful day to be <strong> bold </strong> </p>"

var sample = fs.createReadStream('file.txt')

sample.pipe(bracket)
  .on('data', function(data) {
    console.log(data)
  })
```

Results:
```
p
strong
/strong
/p
```

