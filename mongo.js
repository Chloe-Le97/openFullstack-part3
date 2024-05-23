const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const personName = process.argv[3]

const phoneNumber = process.argv[4]

const url =
  `mongodb+srv://phuonganhkitty365:${password}@phonebook2024.utotnlo.mongodb.net/phonebook?retryWrites=true&w=majority&appName=phonebook2024`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', numberSchema)

const number = new Phonebook({
  name: personName,
  number: phoneNumber,
})

if(personName){
	number.save().then(result => {
		//   console.log(result)
		  console.log(`added ${result.name} number ${result.number} to phonebook`)
		  mongoose.connection.close()
		})
}else{
	Phonebook.find({}).then(results => {
		console.log('phonebook:')
		results.forEach(result => {
			
			console.log(result.name + ' ' + result.number)
		})
		mongoose.connection.close()
	})
}


// Phonebook.find({}).then(persons => {
// 	persons.forEach(person => {
// 	  console.log(person)
// 	})
// 	mongoose.connection.close()
//   })
