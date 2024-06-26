require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const app = express()

const Phonebook = require('./models/person')

const mongoose = require('mongoose')

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', req => {
	return JSON.stringify(req.body)
  })
  
app.use(morgan(':method :url :body'))

mongoose.set('strictQuery',false)

// console.log(currentTime.toString());


app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${countPeople} people</p><p>${currentTime.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
	Phonebook.find({}).then(persons =>{
		response.json(persons)
	})
})

app.get('/api/persons/:id', (request, response,next) => {
	Phonebook.findById(request.params.id).then(person =>{
		if(person){
			response.json(person)
		}else{
			response.status(404).end()
		}
	})
	.catch(error => next(error))

	
  })

app.delete('/api/persons/:id',(request,response,next)=>{
	Phonebook.findByIdAndDelete(request.params.id)
		.then(result =>{
			response.status(204).end()
		}).catch(error => next(error))
})

app.put('/api/persons/:id',(request,response,next)=>{
	const body = request.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Phonebook.findByIdAndUpdate(request.params.id,person,{new:true,runValidators:true,content:'query'})
		.then(updatedPerson =>{
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.post('/api/persons',(request,response,next)=>{
	const body = request.body

	const person = new Phonebook ({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson =>{
		response.json(savedPerson)
	}).catch(error => next(error))
	
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
  
	if (error.name === 'CastError') {
	  return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
  
	next(error)
  }
  
  // this has to be the last loaded middleware, also all the routes should be registered before this!
  app.use(errorHandler)
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})