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
 - `npm install`
 - `bower install`
 - `gulp`
 - `gulp watch` the server is up an running on localhost:9000. Consider the console output for the port number (usually 9000)

## About .lnk ###
**Love the things you find - share the things you love <3.**
.lnk is the primary sharing platform for links. Registered users are able to post links and make them discoverable for others by tagging them smartly. To beatify your shares add an image to it.
Every share can be commented of any user. Vote up the share you love to bring them on a higher ranking for other users.

## Usage ##
- On the main screen, use the tab "search" to search for articles in the "in memory database".
- By default, there are three articles with dummy data and articles available.
- The search is no real search functionality, but retrieves all articles, regardless of what was entered
- To add a new article (i.e. to share a .lnk you love) do the following:
    - go to the tab "Add"
    - Fill in the fields (all fields are required)
    - If .lnk URL is not a valid image URL, the additional field "alternate image URL" is being displayed and you may specify an URL pointing to an image (and have .lnk URL point to a webpage)
    - With the ".lnk it" button, the new entry gets stored in the "in memoray database"; to see it, execute the search again
- You can vote up or vote down the articles as you like; they are sorted instantly
- You can show or hide comments and you can add comments as you like
- You can expect even more love and share with the next milestone. Enjoy.

## Known limitations ##
- The links to the tags and users below the articles do not yet lead to other resources, as the backend is not yet available
- New articles are "persisted" in the in memory database and availble for search. They are reset with each reload of the page

## Used tools and frameworks ##
- **boostrap** for layout and parts of grid functionality
- **jQuery** for dom manipulation
- **knockout.js** as MVVM data binding library
