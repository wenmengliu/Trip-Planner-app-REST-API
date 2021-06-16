const express = require('express')
const mongo = require('mongodb').MongoClient
// run the project locally as well as MongoDB locally too.
const url = "mongodb://localhost:27017"

const app = express()
app.use(express.json())

let db, trips, expenses

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("tripcost")
    trips = db.collection("trips")
    expenses = db.collection("expenses")
  }
)
// offer the client a way to add trip Using the POST /trip endpoint
app.post("/trip", (req, res) => {
  const name = req.body.name
  // add a trip to DB
  trips.insertOne({ name: name}, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err})
    }
    console.log(result)
    res.status(200).json({ ok : true})
  })
})

//get the trips
app.get("/trip", (req, res) => {
  trips.find().toArray((err, items) => {
    if (err){
      console.error(err)
      res.status(500).json({ err: err})
      return
    }
    res.status(200).json({ trips: items})
  })
})

// POST /expense { trip, date, amount, category, description }
app.post("/expense", (req, res) => {
  expenses.insertOne(
  {
    trip: req.body.trip,
    date: req.body.date,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description
  },
  (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err})
      return
    }
    res.status(200).json({ ok: true})
  }
  )
})

app.get("/expense", (req, res) => {
  expenses.find().toArray((err, items) => {
    if(err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ trip_expenses: items})
  })
})
app.listen(3000, () => console.log("Server ready"))