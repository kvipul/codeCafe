==============================================================================
==============Code Cafe by Vipul Kumar (kvipul)===============================
==============================================================================

Web Link: http://codecafe-kvipul.herokuapp.com/

About Code Cafe:
	-Code Cafe let users search and list code submission information conveniently.
	-Data is extracted from Web API and stored to Local storage(client side storage) in the form of json object

Instruction to Run:
	-To run the code on local your machine you just need to download the source code to your localhost folder
	-You will be needed internet access even on local host to use AngularJs and Jquery libraries
	-You can download these libraries to run code without internet access
	-This project is all about storing the data on client side and use it to show the view
	-On right side of page there are two sections-
		-one is to use filter and 
		-one is to see statistic
	-On left hand side there is view of each filtered submission containing information about code like title, submission id, language used, Users submitted, Compiler Status, level type, rating, source code etc.
	-There are some extra filters above these details
	-Users can also filter data by title, language and level


Technology I've used:
	-I guess there is no need to use MVC architectural patterns because here we are talking about client side storage only
	-Used Indexeddb database to store data on client side(user browser itselt)
	-Used Languages: HTML, CSS, Javascript
	-Used Libraries: Bootstrap, Angularjs, Jquery
	-Third party libraries: dirPagination

References:
	-Used Web API provided by hackerearth
	-dirPagination.js library to paginate data by michaelbromley
	
