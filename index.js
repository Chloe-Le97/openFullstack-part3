const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', req => {
	return JSON.stringify(req.body)
  })
  
app.use(morgan(':method :url :body'))

let persons = [
	{ 
		"id": 1,
		"name": "Arto Hellas", 
		"number": "040-123456"
	  },
	  { 
		"id": 2,
		"name": "Ada Lovelace", 
		"number": "39-44-5323523"
	  },
	  { 
		"id": 3,
		"name": "Dan Abramov", 
		"number": "12-43-234345"
	  },
	  { 
		"id": 4,
		"name": "Mary Poppendieck", 
		"number": "39-23-6423122"
	  }
]

let countPeople = persons.length;
let currentTime = new Date();
// console.log(currentTime.toString());

app.get('/', (request, response) => {
	response.send(`<p>Phonebook has info for ${countPeople} people</p><p>${currentTime.toString()}</p>`)
  })

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${countPeople} people</p><p>${currentTime.toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)

	if(person){
		response.json(person)
	}else{
		response.status(404).end()
	}
  })

app.delete('/api/persons/:id',(request,response)=>{
	const id = Number(request.params.id)

	persons = persons.filter(person => person.id !== id)

	response.status(204).end()
})

const generateID = () =>{
	return Math.floor(Math.random() * 1000)
}

app.post('/api/persons',(request,response)=>{
	const body = request.body

	duplicateName = persons.find(person => person.name === body.name);

	if(!body.name || !body.number){
		return response.status(400).json({
			error:'content missing'
		})
	}else if(duplicateName){
		return response.status(400).json({
			error:'name must be unique'
		})
	}

	const person ={
		id: generateID(),
		name: body.name,
		number: body.number,
	}

	persons = persons.concat(person)

	response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})