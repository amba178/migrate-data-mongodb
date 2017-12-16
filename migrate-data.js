const MongoClient= require('mongodb').MongoClient
const  logger  = require('morgan')
const url = 'mongodb://localhost:27017/mongo-migration-script'
const  errorhandler = require('errorhandler')
const  bodyParser = require('body-parser')
const assert = require('assert')
const async =  require('async')
const customers = require('./m3-customer-data.json')
const customerAddress = require('./m3-customer-address-data.json')


let tasks =[]
const limit = parseInt(process.argv[2], 10 ) || 1000  

const migrate_data = MongoClient.connect(url, (err, db) => {
	if(err) return process.exit(1)
// 	console.log("Connected correctly to server")
// 	fs.readFile('./m3-customer-data.json', 'utf8', (error, data) => {
// 		if(error) return console.error(`Got error: ${error.message}`)
// 		const parsedData = JSON.parse(data)
// 		db.collection('customers_data').insertMany(parsedData, (err, result) =>{
// 			assert.equal(err, null)
// 			assert.equal(1000, result.result.n)
// 			assert.equal(1000, result.ops.length)
// 			console.log("Inserted 1000 documents into the document collection")
// 		})

// 	})

// })

	customers.forEach((customer, index, list) => {
		customers[index] = Object.assign(customer, customerAddress[index])
		if(index % limit==0){
			const start = index 
			const end = (start + limit > customers.length) ? customers.length - 1 : start + limit 
			tasks.push((done) => {
				console.log(`processing ${start} - ${end} out of ${customers.length}`)
				db.collection('customers').insert(customers.slice(start, end), (error, results) => {
				done(error, results)
			})
		  })
		}
	})

	console.log(`Launching ${tasks.length} parallel task(s)`)
	const startTime = Date.now()
	async.parallel(tasks, (error, results) => {
		if(error) console.error(error)
		const endTime = Date.now()
		console.log(`Execution time: ${endTime-startTime}`)
		db.close()
	})

})//end of the mongoClient 

// //default 20 query
// const migrateCustomer = (count=20) => {
// 				MongoClient.connect(url, (err, db) => {
				 
// 				 const range = parseInt(count)
// 				 if(err) return process.exit(1)
// 				 fs.readFile('./m3-customer-address-data.json', 'utf8', (error, customers_address_data) => {
// 		            if(error) return console.error(`Got error: ${error.message}`)
// 		           const partialCustomersAddress = JSON.parse(customers_address_data).slice(range)
// 			       db.collection('customers_data').find({},{_id: 0}).limit(range).toArray((error, data) => {
// 	                    if (error) return console.log(error)
// 	                     data.forEach((item, index) =>{
// 	                    	const customers_address = {}
// 	                    	console.log('index is' , index)
// 	                    	const country =partialCustomersAddress[index].country 
// 	                    	const city = partialCustomersAddress[index].city
// 	                    	const state = partialCustomersAddress[index].state
// 	                    	const phone = partialCustomersAddress[index].phone
// 	                        data[index].country = country 
// 	                        data[index].city = city 
// 	                        data[index].state =   state
// 	                        data[index].phone =  phone 
// 	                       db.collection('customers_data').update({id: data[index].id},data[index],{upsert: true})   
//                        }) 

//                     })
//                 })		 	
//             })

// }

// migrateCustomer(process.argv[2])
