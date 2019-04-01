const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuidv4 = require('uuid/v4');
const {ListPosts} = require('./blog-post-model');

router.get('/blog-posts', (req, res) => {

	let allBlogPosts = ListPosts.get();

	if( allBlogPosts ) {
		res.status(200).json({
			message : "Successfully sent the list of blog posts",
			status : 200,
			blogPosts : allBlogPosts
		});
	}
});

router.get('/blog-posts/:author', (req, res, next) => {
	let authorName = req.params.author;

	if ( authorName ) {
		let allBlogPosts = ListPosts.get();

		if( allBlogPosts ) {
			allBlogPosts.forEach(item => {
				if (item.author == authorName){
					res.status(200).json({
						message : "Successfully sent the blog post",
						status : 200,
						blogPost : item
					});
				}
			});
			res.status(404).json({
				message : "Author not found in the list",
				status : 404
			});
		}
	} else {
		res.status(406).json({
			message : "Missing param 'author'",
			status : 404
		});

		return next();
	}
});

router.post('/blog-posts', jsonParser, (req, res, next) => {

	let requiredFields = ['title', 'content', 'author', 'publishDate'];

	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];

		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});

			return next();
		}
	}

	let date = new Date(req.body.publishDate);
	if( date == "Invalid Date") {
		res.status(406).json({
				message : `The date is not written correctly or is invalid`,
				status : 406
			});

		return next();
	}

	let objectToAdd = {
		id: uuidv4(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: date,
	};

	ListPosts.post( objectToAdd );
	res.status(201).json({
		message : "Successfully added the blog post",
		status : 201,
		blogPost : objectToAdd
	});
});

router.put('/blog-posts/:id', jsonParser, (req, res) => {
	
	let blogPostId = req.params.id;
	
	if( blogPostId ) {
		if ( ListPosts.idExists(blogPostId) ){
			
			let newInfo = {
				id : blogPostId,
				title : req.body.title,
				content : req.body.content,
				author : req.body.author,
				publishDate : req.body.publishDate
			};

			console.log(newInfo);

			let item = ListPosts.put(newInfo);

			res.status(200).json({
					message : "Successfully updated the blog post",
					status : 200,
					blogPost : item
				});

		} else {
			res.status(404).json({
				message : "Blog post not found in the list",
				status : 404
			});

			return next();
		}

	} else{
		res.status(406).json({
			message : "Missing param 'id'",
			status : 406
		});

		return next();
	}
});

router.delete('/blog-posts/:id', jsonParser, (req, res) => {
	let requiredFields = ['id'];
	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});

			return next();
		}
	}
	let blogPostId = req.params.id;
	if (blogPostId){
		if(blogPostId == req.body.id){
			
			if ( ListPosts.idExists(blogPostId) ){
				
				let item = ListPosts.delete(blogPostId);

				res.status(204).json({
					message : "Successfully deleted the blog post",
					status : 204,
					blogPost : item
				});
			} else {
				res.status(404).json({
					message : "Blog post not found in the list",
					status : 404
				});

				return next();
			}
		} else{
			res.status(400).json({
				message : "Param and body do not match",
				status : 400
			});

			return next();
		}
	}
	else{
		res.status(406).json({
			message : "Missing param 'id'",
			status : 406
		});

		return next();
	}
});

module.exports = router;
/*app.get('/blog-posts', (req, res) => {
	res.status(200).json({
		message : "Successfully sent the list of blog posts",
		status : 200,
		blogPosts : blogArray
	});
});

app.get('/blog-posts/:author', (req, res) =>{
	let authorName = req.params.author;

	if ( authorName ) {
		blogArray.forEach(item => {
			if (item.author == authorName){
				res.status(200).json({
					message : "Successfully sent the blog post",
					status : 200,
					blogPost : item
				});
			}
		});

		res.status(404).json({
			message : "Author not found in the list",
			status : 404
		});
	} else {
		res.status(406).json({
			message : "Missing param 'author'",
			status : 404
		}).send("Finish");
	}
});

app.post('/blog-posts', jsonParser, (req, res) => {

	let requiredFields = ['title', 'content', 'author', 'publishDate'];

	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];

		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			}).send("Finish");
		}
	}

	let date = new Date(req.body.publishDate);
	if( date == "Invalid Date") {
		res.status(406).json({
				message : `The date is not written correctly or is invalid`,
				status : 406
			}).send("Finish");
	}

	let objectToAdd = {
		id: uuidv4(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: date,
	};

	blogArray.push(objectToAdd);
	res.status(201).json({
		message : "Successfully added the blog post",
		status : 201,
		blogPost : objectToAdd
	});
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	
	let blogPostId = req.params.id;
	if (blogPostId){
		blogArray.forEach((item, index) => {
			if (item.id == blogPostId){
				blogArray[index].title = req.body.title ? req.body.title : blogArray[index].title;
				blogArray[index].content = req.body.content ? req.body.content : blogArray[index].content;
				blogArray[index].author = req.body.author ? req.body.author : blogArray[index].author;
				blogArray[index].publishDate = req.body.publishDate ? req.body.publishDate : blogArray[index].publishDate;
				res.status(200).json({
					message : "Successfully updated the blog post",
					status : 200,
					blogPost : item
				});
			}
		});
		res.status(404).json({
			message : "Blog post not found in the list",
			status : 404
		}).send("Finish");;
	}
	else{
		res.status(406).json({
			message : "Missing param 'id'",
			status : 406
		}).send("Finish");
	}
});

app.delete('/blog-posts/:id', jsonParser, (req, res) => {
	let requiredFields = ['id'];
	for ( let i = 0; i < requiredFields.length; i ++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			}).send("Finish");
		}
	}
	let blogPostId = req.params.id;
	if (blogPostId){
		if(blogPostId == req.body.id){
			blogArray.forEach((item, index) => {
				if (item.id == blogPostId){
					blogArray.splice(index, 1);
					res.status(204).json({
						message : "Successfully deleted the blog post",
						status : 204,
						blogPost : item
					});
				}
			});
			res.status(404).json({
				message : "Blog post not found in the list",
				status : 404
			}).send("Finish");
		}
		else{
			res.status(400).json({
				message : "Param and body do not match",
				status : 400
			}).send("Finish");
		}
	}
	else{
		res.status(406).json({
			message : "Missing param 'id'",
			status : 406
		}).send("Finish");
	}
});*/