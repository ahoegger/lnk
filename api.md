## Entities / documents / resource types ##
### The following entities are needed:
* article: the article / link submitted, references user, votes, comments and tags
* user: user name and its credentials, roles and stuff
* vote: single vote referencing the user that voted, the direction (+1, -1), and the article
* tag: "category"
* comment: comment on an article, referencing article, user (commenting)
* role: description of the role and its allowed operations

###  Article
* id: Generated ID of the article
* title: Title of the article, max length = 100, mandatory, not blank
* url: URL of the article, must be a valid URL, mandatory
* imageUrl: additional URL, if the URL itself ist not an image, must be a valid URL, optional
* description: A description, max length = 400, mandatory
* submittedBy: Reference to the user submitting the article, mandatory, immutable
* submittedOn: Date, when the article was initially submitted, does not reflect further edits, mandatory, immutable, must be a valid date
* votes: derived subselect as value of the votes, i.e. sum of all positive (+1) and negative votes (-1)
* userVote: +1, 0, -1 if the user already voted on the article, null if not (or no user logged in)
* tags: List of tag entities, at least one tag must be present, mandatory
* numberOfComments: derived subselect on the number of comment entites the article has.

### User
* id: Generated ID of the article
* username: username, min length 3, max length = 20, must be unique, not blank
* name:
* firstname:
* active: true, if the user ist still active; false if she deleted the account
* password: user password

### vote
* id: generated ID of the article
* userId: id of the user that voted, mandatory
* value: +1, -1 or 0, mandatory
* timestamp: timestamp of the last vote (by user and article)

### tag
* id: generated ID of the tag
* name: name of the tag, min length = 2, max length = 15, mandatory, not blank
* imageParameters: parameters, that are used in generating a tag image, mandatory, immutable
    
### Comment
* id: generated ID of the comment
* articleId: Reference to the article
* comment: the comment, min length = 2, max length = 400, mandatory, not blank 
* submittedBy: Reference to the user submitting the article, mandatory, immutable
* submittedOn: Date, when the article was initially submitted, does not reflect further edits, mandatory, immutable, must be a valid date

### role
* id: generated ID of the role
* name: name of the role, min length = 2, max length = 30, mandatory, not blank
* maxXy: true, if the role may do XY
    
## API ##
Hint: Watch out singular and plural
* GET /articles: Returns a list of articles
    * Query-Parameter "content=": Articles with the content in title or description
    * Query-Parameter "tags=": Articles with at least one of the given tags
    * Query-Parameter "user=": Articles for the given users
    * Query-Parameter "dateFrom=": Articles newer than the given date
    * Query-Parameter "dateTo=": Articles older than the given date
    * Query-Parameter "orderBy=": Property, by which the articles shall be ordered
    * Query-Parameter "orderDirection=": Ascending oder descending order
    * TODO: Paging...
* [HHE OK] POST /article: Posts a new article
* [HHE OK] GET /article/13: Returns article with the id 13
* PUT /article/13: Updates an article with a new entity
* DELETE /article/13: Deletes the article
* [HHE OK] GET /article/13/tags: Returns the list of tags for the article
* [HHE OK] GET /article/13/comments: Returns the comments for the articles
    [NOT YET] * Query-Parameter: user, dateFrom, dateTo, orderBy, oderDirection like from articles
* [HHE OK] GET /article/13/comment/432: Returns a single comment
* [HHE OK] POST /article/13/comment: Adds a new comment to the article
* PUT /article/13/comment/432: Updates a given single comment
* DELETE /article/13/comment/432: Updates a given single comment
* GET /article/13/user: Returns the user that submitted the article
* POST /article/13/votes/user/534: Adds a new vote to the article for the given user
* GET /article/13/votes/user/534: Returns the vote of the given user
* [HHE OK] PUT /article/13/votes/user/534: Updates the vote of the given user
* Authentication
    * POST /api/authentication/ : Payload (application/json) { userName: ccc, password: xxx (encrypted mit bycrtpjs, hash = 8)} result bei NOK: 401, bei ok: 200 mit user class
        * Currently, password may NOT be encrypted
        * Method will return a token, that must be added to the HTTP Header "Authorization" with the value "Bearer {token}". Note: space between Bearer and effective token
        * express-jwt will add req.user object to the request with the infortmation.
        * Sample Token: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlck5hbWUiOiJoaGUiLCJuYW1lIjoiaGV5bWFubnMiLCJmaXJzdG5hbWUiOiJob2xnZXIiLCJwYXNzd29yZCI6IiQyYSQwOCQxcklVZ0ZQYk1sTW9qSzNSMEh5bjMucWZZbkJVNTU3N2g1OUEvQnNqMFVHYUV3TEJFNTRrVyIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNDE1NTM0MDA2LCJleHAiOjE0MTU1Mzc2MDZ9.XllFCuY6hlEurBsuPER80nOZ0PWI60pkfMdaMDkmgaM
*** siehe link http://www.kdelemme.com/2014/03/09/authentication-with-angularjs-and-a-node-js-rest-api/ var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
*** user hhe, password = $2a$08$hs4iDHKduMbNz2cNpHUG9OcRDRD3u8IIMqcYHVBN4i9fcBfnAK0BK
*** user aho, password = $2a$08$5xb.Ly3La0FuRn21rJ5qe.JqFjXLXDgMaOYmynYaLNkMAkt5XZPay
** [HHE OK] GET /api/user/:id/: Return des Users
** [HHE OK] POST /api/users/ : Payload {Payload (application/json) { userName: ccc, name:, firstname;, password: xxx } return: 201, mit user class
** [HHE OK] PUT /api/user/:id/: Update vom User, return neuer user
** [HHE OK] DELETE /api/user/:id/: Löschen vom User (setzt active = false); gibt nichts zurück
