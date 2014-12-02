## Application architecture and design
The .lnk web application consists of two functional areas:
* the user interface (or front end as we might say)
* the restful data transfer and handling

The front end consists of various static files and html partials that are served from the express server. The layout and 
handling is implemented with angular, that takes care of the routing stuff. Separation of concerns is accomplished using 
controllers that are responsible for the the interaction in the UI and layout details  and services that interact with
the backend to transfer data and listen on incoming web socket messages.

We modularized the application front end using various angular modules:
* controllers
    * addArticle-controller: functionality whe adding an article (i.e. sharing a .lnk)
    * articles-controller: controller for the collection of articles
    * article-controller: controller for a single article instance in the articles-loop. i.e. lacy loading of comments, handling up and down votes
    * comment-controller: controller for handling the comment(s) of the article: submitting a new comment, deleting the owners comments,...
    * login: controller handling login logic
    * navigation controller: well, for navigation purposes
    * userCreate-controller: handling creation of users
    * userUpdate-controller: updating the user resource

* services
    * article-service: interaction with the backend regarding articles and voting
    * authentication-service: interacting with the authentication api of the backend
    * behaviour-service: minor UI service
    * comment-service: interaction with the backend regarding comments
    * socket-factory: factory that creates the web socket listener
    * tokenInterceptor: Interception $http calls to enrich the call (http header) with the JSON web token
    * user-service: used when interacting with the user api of the backend
    
The bits and pieces are knit together in the app.js angular application file. using routes that assign html partials 
(views) the the ng-view part of the index.html and assign the basic controller. For single articles and the comments,
sub controllers (see above) are applied inside the loop (article) or a section of the partial (comments).

The comments of an article are realized as lazy loading. I.e. the user clicks on "Show comments" an just then the comments
are being fetched from the backend.

On the backend side like most web application, there are two functional distinct areas:
* serving static files
* serving data in a restful manner

The static files are served directly. We did not introduce a templating engine as with angular we're already using 
mechanisms for data binding, thus templating on the backend would not add much.
 
Serving the data we defined quite sam api routes seperated over some modules. The modules are:
* article
* authentication
* comments
* tags
* users

The article module consists of these components:
1. ArticleRouter: Assigns the middleware functions to the relevant URL parts and registers the param handler for the :articleId and :commentId parameter
* ArticleRouteModule: Provides the functions to handle selecting and inserting articles, votes, comments, and all the other things
* ArticleParamModule: Handles selecting a single article if the :articleId is present in the defined route
* ArticleRouterHelperModule: Some helper function exclusively for the article related functions

The authentication module consists of these components:
1. AuthenticationRouter: Assigns the middleware functions to the relevant URL parts regarding authentication
* AuthenticationRouterModule: Provides the functions to handle user authentication (i.e. simply checking the credentials and returning the jason web token if everything is ok

The comments module consists of these components
1. CommentParamHandler: Param handler registered in the ArticleRouter that handles selecting a specific comment when a :commentId is in the route
  
The tag module consists of these components:
1. TagRouter: Assigns the middleware functions to the relevant URL parts and registers the param handler for the :tagId parameter
* TagRouteModule: Provides the functions to handle selecting tags, a single tag and the articles with a given tag
* TagParamModule: Handles selecting a single article if the :articleId is present in the defined route

The user module consists of these components
1. UserRouter: Assigns the middleware functions to the relevant URL parts and registers the param handler for the :userId parameter
* UserRouteModule: Provides the functions to handle selecting and inserting users (not authenticating)
* UserParamModule: Handles selecting a single user if the :userId is present in the defined route

Persistence is handled separately and implemented without external dependencies:
* The CrudDatabaseFactory module provides basic CRUD functionality on a "in memory basis". i.e. with the implementation, 
all data is served from data structures that are held in memory. A very basic persistence functionality has been implemented: the internal structures are stored on the file system a JSON files
* The InMemorydataStore module provides the high level api to access data from within the router modules. It holds the various tables based on the CrudDatabaseFactory.
It ist also the responsibility of this module to handle the relationship between the tables. The persistence is based around the defined entities
(and thus realizes an relational database functionality and a crude schema checking by requiring a specific constructor for each entities table).

The persistence realised in the InMemorydataStore is injected as a dependency into the routing mechanism. A different 
implementation of the same api can be used in later development of the application. A simple application of the principle
can be seen in the unit test AuthenticationRouterModule-spec.js: A dummy datastore is provided whe requiring the module.

The entities are explained below and are simply realizations of object prototypes. 

Various unit tests have been developed and it's coverage can be calculated and reported. The unit tests are by far not
complete but should be viewed as a proof of concept (and well, ensure that the tested code doesn't break).

To generate the documentation of the application, we used JSDoc which provides conventions to generate code documentation.  

## Technology Stack
### Backend
* runtime: [nodejs](http://www.nodejs.org/)
* server: [expressjs](http://expressjs.com/) (including some modules)
* websocket server: [socket.io](http://socket.io/)
* persistence: own implementation with persistence on the file system (plain json style) 
* security:
    * [express-jwt](https://github.com/auth0/express-jwt) for json web token
    * [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for encrypting passwords
* hateoas: [halson](https://github.com/seznam/halson)
* logging: [log4js](https://github.com/nomiddlename/log4js-node)

### Frontend
* databinding and routing: [angularjs](https://angularjs.org/)
* layout: [bootstrap](http://getbootstrap.com/)
* styling: css, based on [less](http://lesscss.org/)
* icons: [fontawesome](https://fortawesome.github.io/Font-Awesome/)

### Tooling
* taskrunner: [npm](https://www.npmjs.org/)
* dependency management: [bower](http://bower.io/)
* 
* unit tests:
    * testrunner: [mocha](http://mochajs.org/)
    * assertion library: [chai](http://chaijs.com/) with bdd style [expect](http://chaijs.com/api/bdd/)
    * mocking / spies: [sinon](http://sinonjs.org/)
    * coverage reporting: [istanbul](https://github.com/gotwarlost/istanbul)

## Feature Check
### Mandatory features
* Erfassen neuer Links: Implemented
* Links kommentieren: Implemented
* Neue Logins/ Accounts anlegen: Implemented
* Login / Logout: Implemented (using json web token)
* Neu nur wenn logged in: Implemented (authentication handling an the front end and backend)
* Rating von Links: Implemented (vote up and down with +1 and -0)
* Rating von Kommentaren: Not implemented
* Eigenes Rating rückgängig machen: Implemented (vote up / down depending on login state and vote before; remove vote with "0")

### Non functional requirements
* Domain Objekte sauber in Klassen gekapselt: Implemented (various entities as classes)
* Layer Architektur auf dem Client: Implemented (controllers and services with corresponding dependencies)
* Fluides Design auf  Smart-Phone und Desktop: Implemented (layout changes on various break points, see the header bar as an example)
* Alle Clients sind synchron: Partial implementation (as a proof of concept voting gets synchronized between all clients)  
* Daten via Templates darstellen: Implemented (using angular data binding)
* Einfaches Deployment und Starten: Implemented (clone from git, type "npm install", type "node lnk-server.js", open app in browser (localhost, port 3000) )
* Mindestens 3 «sinnvolle» Unit Tests: Implemented (run the tests with "npm run mocha-test", check the coverage by typing "npm run coverage" and opening the file lnk/coverage/lcov-report/index.html)
* Sauberer JavaScript Code / Struktur: Implemented (as to our judgement)
* Sauberer CSS Code: Implemented (used less, as to our judgement)

### Optional requirements
* Löschen von eigenen Links: Implemented
* Bearbeiten von eigenen Links: Not implemented in the front end, the backend api allows updating the article) 
* Kommentieren  von Kommentaren: Not implemented
* Bearbeiten des Accounts: Implemented
* Dashboard für Account: Sort of implemented: Clicking on any user name will load that users articles.

**Not all features could be implemented in the quality we feel is important for a production ready application. The project 
demonstrates quite a long list of features, technologies and techniques. Some are final, some are proof of concept.
But after all, we ar absolutely convinced, that the "package" of our .lnk app reflects very well the content of
the CAS-FEE and the skills and know how we could learn.**

See a small prezi presentation for [.lnk](https://prezi.com/ccxn2fh6jjbd/lnk/)

## Entities / documents / resource types ##
### The following entities are needed:
* article: the article / link submitted, references user, votes, comments and tags
* user: user name, some more properties and its credentials
* vote: single vote referencing the user that voted, the direction (+1, -1), and the article
* voteContainer: summarized collection of votes for a given article
* tag: "category"
* comment: comment on an article, referencing article, user (commenting)
* role: description of the role and its allowed operations

###  Article
* id: Generated ID of the article
* title: Title of the article, max length = 100, mandatory, not blank
* url: URL of the article, must be a valid URL, mandatory
* imageUrl: additional URL, if the URL itself ist not an image, must be a valid URL, optional
* description: A description, max length = 400, mandatory
* submittedBy: Reference to the user submitting the article, mandatory, immutable. IN halson replaced by embedded user object
* submittedOn: Date, when the article was initially submitted, does not reflect further edits, mandatory, immutable, must be a valid date
* votes: derived subselect as value of the votes, i.e. sum of all positive (+1) and negative votes (-1)
* userVote: +1, 0, -1 if the user already voted on the article, null if not (or no user logged in)
* tags: List of tag entities, at least one tag must be present, mandatory

### User
* id: Generated ID of the article
* username: username, min length 3, max length = 20, must be unique, not blank
* name:
* firstname:
* active: true, if the user ist still active; false if she deleted the account
* password: user password

### ArticleUserVote
* id: generated ID of the article
* userId: id of the user that voted, mandatory
* articleId: id of the article for which the user voted
* value: +1, -1 or 0, mandatory

### VoteContainer
* numberOfVotes: The number of votes the article has currently
* userVote: The value of the user's vote (+1, 0, -1; or null)

### tag
* id: generated ID of the tag
* name: name of the tag, min length = 2, max length = 15, mandatory, not blank
    
### Comment
* id: generated ID of the comment
* articleId: Reference to the article
* comment: the comment, min length = 2, max length = 400, mandatory, not blank 
* submittedBy: Reference to the user submitting the article, mandatory, immutable
* submittedOn: Date, when the article was initially submitted, does not reflect further edits, mandatory, immutable, must be a valid date

### ArticleTag 
* id: generated id
* articleId: id of the article
* tagId: id of the tag

## API ##
Hint: Watch out singular and plural
* GET /articles: Returns a list of articles
    * [HHE OK] Query-Parameter "anywhere=": Searches (caseinsensitive) the given string in the title and the description (not the tags or comments)
    * [NOT YET] Query-Parameter "content=": Articles with the content in title or description
    * [NOT YET] Query-Parameter "tags=": Articles with at least one of the given tags
    * [NOT YET] Query-Parameter "user=": Articles for the given users
    * [NOT YET] Query-Parameter "dateFrom=": Articles newer than the given date
    * [NOT YET] Query-Parameter "dateTo=": Articles older than the given date
    * [NOT YET] Query-Parameter "orderBy=": Property, by which the articles shall be ordered
    * [NOT YET] Query-Parameter "orderDirection=": Ascending oder descending order
* [HHE OK] POST /article: Posts a new article
* [HHE OK] GET /article/13: Returns article with the id 13
* [HHE OK] PUT /article/13: Updates an article with a new entity
* [HHE OK] DELETE /article/13: Deletes the article
* [HHE OK] GET /article/13/tags: Returns the list of tags for the article
* [HHE OK] GET /article/13/comments: Returns the comments for the articles
    * [NOT YET] Query-Parameter: user, dateFrom, dateTo, orderBy, oderDirection like from articles
* [HHE OK] GET /article/13/comment/432: Returns a single comment
* [HHE OK] POST /article/13/comment: Adds a new comment to the article
* PUT /article/13/comment/432: Updates a given single comment
* DELETE /article/13/comment/432: Updates a given single comment
* GET /article/13/user: Returns the user that submitted the article
* POST /article/13/votes/user/534: Adds a new vote to the article for the given user
* GET /article/13/votes/user/534: Returns the vote of the given user
* [HHE OK] PUT /article/13/votes/user/534: Updates the vote of the given user
* [HHE OK] Authentication
    * POST /api/authentication/ : Payload (application/json) { userName: ccc, password: xxx (encrypted mit bycrtpjs, hash = 8)} result bei NOK: 401, bei ok: 200 mit user class
        * Currently, password may NOT be encrypted
        * Method will return a token, that must be added to the HTTP Header "Authorization" with the value "Bearer {token}". Note: space between Bearer and effective token
        * express-jwt will add req.user object to the request with the information.
        * Sample Token: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlck5hbWUiOiJoaGUiLCJuYW1lIjoiaGV5bWFubnMiLCJmaXJzdG5hbWUiOiJob2xnZXIiLCJwYXNzd29yZCI6IiQyYSQwOCQxcklVZ0ZQYk1sTW9qSzNSMEh5bjMucWZZbkJVNTU3N2g1OUEvQnNqMFVHYUV3TEJFNTRrVyIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNDE1NTM0MDA2LCJleHAiOjE0MTU1Mzc2MDZ9.XllFCuY6hlEurBsuPER80nOZ0PWI60pkfMdaMDkmgaM
        * siehe link http://www.kdelemme.com/2014/03/09/authentication-with-angularjs-and-a-node-js-rest-api/ var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
    * [HHE OK] GET /api/user/:id/: Return des Users
    * [HHE OK] POST /api/users/ : Payload {Payload (application/json) { userName: ccc, name:, firstname;, password: xxx } return: 201, mit user class
    * [HHE OK] PUT /api/user/:id/: Update vom User, return neuer user
    * [HHE OK] DELETE /api/user/:id/: Löschen vom User (setzt active = false); gibt nichts zurück (also 204)
    * [HHE OK] GET /api/users?username=xxx returns a list of matching user
