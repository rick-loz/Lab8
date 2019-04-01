const uuidv4 = require('uuid/v4');

let blogDB = [
					{
						id : uuidv4(),
						title : "First Post",
						content : "This is a text post, my first post",
						author : "Juan Gonzalez",
						publishDate : new Date(2019, 3, 28)
					},
					{
						id : uuidv4(),
						title : "Second Post",
						content : "This is a text post, my second post",
						author : "Pedro Gutierrez",
						publishDate : new Date(2019, 3, 25)
					},
					{
						id : uuidv4(),
						title : "Third Post",
						content : "This is a text post, my third post",
						author : "Jose Hernandez",
						publishDate : new Date(2019, 3, 20)
					}
				];

const ListPosts = {
	get : function() {
		return blogDB;
	},
	post : function( newObject ) {

		blogDB.push(newObject);

		return newObject;
	},
	delete : function(id) {
		let index = blogDB.findIndex( x => x.id === id);

		let objectToDelete = blogDB[index];

		blogDB.splice(index, 1);

		return objectToDelete;
	},
	put : function( newData) {
		let index = blogDB.findIndex( x => x.id === newData.id);

		console.log(index);

		blogDB[index].title = newData.title ? newData.title : blogDB[index].title;
		blogDB[index].content = newData.content ? newData.content : blogDB[index].content;
		blogDB[index].author = newData.author ? req.body.author : blogDB[index].author;
		blogDB[index].publishDate = newData.publishDate ? newData.publishDate : blogDB[index].publishDate;

		console.log(blogDB[index]);

		return blogDB[index];
	},
	idExists : function(id) {
		return blogDB.find( x=> x.id === id);
	}
}

module.exports = {ListPosts};