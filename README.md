#lnk CAS FEE#
Holger Heymanns, Andreas Hoegger

The latest released version is available under http://ahoegger.github.io/lnk/dist/.

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

## Known limitations ##
- The links to the tags and users below the articles do not yet lead to other resources, as the backend is not yet available
- New articles are "persisted" in the in memory database and availble for search. vote up / vote down is not persisted

## Used tools and frameworks ##
- **boostrap** for layout and parts of grid functionality
- **jQuery** for dom manipulation
- **underscore.js** for convenience functions
- **knockout.js** as MVVM data binding library
