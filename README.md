#lnk CAS FEE#
Holger Heymanns, Andreas Hoegger

The latest released of the front end only version is available under http://ahoegger.github.io/lnk/dist/.
The current state is deployed at https://frozen-inlet-2896.herokuapp.com/

## Installation ##
### Prerequisits ###
- Node.js (http://nodejs.org/) and node package manager (npm)

### Checkout from GIT ###
 - `git clone https://github.com/ahoegger/lnk.git`
 - move into the lnk directory `cd ./lnk`
 - `git checkout [branchName]` where branchname is milestone01 or master

### Install and run .lnk ###
 
 - `bower install`
 - `npm install`
 - `node lnk-server.js` the server is up and running on localhost:3000
 - Open a browser and connent to `http://localhost:3000`

#### Troubleshooting
Often the port used by .lnk is already in use.

## About .lnk ###
**Love the things you find - share the things you love <3.**
.lnk is the primary sharing platform for links. Registered users are able to post links and make them discoverable for others by tagging them smartly. To beatify your shares add an image to it.
Every share can be commented of any user. Vote up the share you love to bring them on a higher ranking for other users.

## Usage ##
- On the very right on the yellow navigation bar you have the two options to login or create a new user account.
  - The `create account` form requires a unique user name and will also ask you to do so in case you entered a username which is already in use. 
- On the main screen use the tab "Articles" to search for articles. This functionallity is open to anybody so does not use any authentication. The text search retuns matches of title or description.
- The secound tab `Add` is used to post new articles to .lnk. New articles can only be posted once you have successfully logged in. If you access the `Add` tab without a previous authenification you will be kindly asked to login. 
- - To add a new article (i.e. to share a .lnk you love) do the following:
    - go to the tab "Add"
    - Fill in the fields (all fields are required)
    - If .lnk URL is not a valid image URL, the additional field "alternate image URL" is being displayed and you may specify an URL pointing to an image (and have .lnk URL point to a webpage)
    - With the ".lnk it" button, the new entry gets stored.
- Every article can have several comments. The comments can be accessed through the `Show comments`link.
- To write a new comment you have to be authorized. In all other cases you will not see the textfield to write comments.
- Every `Tag` or `Author` is accessible and reduce the search result to articles of the accessed tag or username. The filter will be displayed under the search field and can be removed again by clicking the `cross` next to it.
- Every article can be voted up or down. To use the vote functionallity you have to be logged in (authenificated). Eeach user can only vote once on an article. This is reflected in the UI and also checked on the backend.



## Known limitations ##
none

## Used tools and frameworks ##
- [**boostrap**](http://getbootstrap.com/ "http://getbootstrap.com/") for layout and parts of grid functionality
- [**jQuery**](http://jquery.com "http://jquery.com/") for dom manipulations
- [**toaster**](https://github.com/jirikavi/AngularJS-Toaster "https://github.com/jirikavi/AngularJS-Toaster") for notifications.
- [**ngAnimate**](https://docs.angularjs.org/api/ngAnimate "https://docs.angularjs.org/api/ngAnimate") for animations.
- [**font awesome**](http://fortawesome.github.io/Font-Awesome/ "http://fortawesome.github.io/Font-Awesome/") as icon font.
- and some others...
