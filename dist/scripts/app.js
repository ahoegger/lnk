"use strict";var lnk=lnk||{};lnk.namespace=function(e){var t,n=e.split("."),i=lnk;for("lnk"===n[0]&&(n=n.slice(1)),t=0;t<n.length;t+=1)"undefined"==typeof i[n[t]]&&(i[n[t]]={}),i=i[n[t]];return i},lnk.namespace("lnk.globals"),lnk.namespace("lnk.behaviour"),lnk.globals.articleViews=ko.observableArray(),jQuery(document).ready(function(){var e=ko.observableArray();lnk.behaviour.setObservableDataSource(e),ko.applyBindings({articles:lnk.viewmodels.getSortedArticleViewModel(e)},document.getElementById("top-results")),ko.applyBindings(lnk.viewmodels.getAddFormViewModel(e),document.getElementById("add")),ko.applyBindings(e,document.getElementById("search"))}),lnk.behaviour=function(){var e=null;return console.log("ObservableDataReference:"+e),{setObservableDataSource:function(t){e=t},search:function(t){var n;lnk.helper.logDebug(t),lnk.helper.logDir(e()),e.removeAll(),n=lnk.viewmodels.buildObservableArticleViews(lnk.services.getArticles()),_.each(n(),function(t){e.push(t)}),lnk.helper.logDir(e)},addArticle:function(e){var t=lnk.entities.Article(null,e.title.value,e.url.value,e.description.value,"newSubmitter",new Date,0,e.tags.value,0);lnk.helper.logDir(t),lnk.services.addArticle(t),lnk.globals.articleViews.push(lnk.entities.ArticleViewModel(t))},addComment:function(e){var t=lnk.entities.Comment(null,ko.dataFor(e).id,e.comment.value,"newCommenter",new Date);lnk.helper.logDir(t),lnk.services.addComment(t),ko.dataFor(e).addComment(t)},autoResize:function(e,t){var n,i,o;if(n=$(t.target),!n.prop("scrollTop"))do i=n.prop("scrollHeight"),o=n.height(),n.height(o-5);while(i&&i!==n.prop("scrollHeight"));n.height(n.prop("scrollHeight")+10)}}}(),lnk.namespace("lnk.helper"),lnk.helper=function(){function e(e,t){var i=t||n;window.console&&window.console.log&&window.console.log("["+i.toUpperCase()+"] "+e)}function t(t){window.console&&window.console.dir?window.console.dir(t):e("Unable to console.dir object"+t,"INFO")}var n="INFO";return{log:function(t,n){e(t,n)},logDebug:function(t){e(t,"DEBUG")},logInfo:function(t){e(t,"INFO")},logWarn:function(t){e(t,"WARN")},logError:function(t){e(t,"ERROR")},logFatal:function(t){e(t,"FATAL")},logDir:function(e){t(e)}}}(),lnk.namespace("lnk.entities"),lnk.entities=function(){var e={Article:function(e,t,n,i,o,r,l,s,a,c){this.id=e,this.title=t,this.url=n,this.imageUrl=i,this.description=o,this.submittedBy=r,this.submittedOn=l,this.votes=s,this.tags=a,this.numberOfComments=c},Comment:function(e,t,n,i,o){this.id=e,this.articleId=t,this.text=n,this.submittedBy=i,this.submittedOn=o},ArticleViewModel:function(e){var t;this.article=e,_.extend(this,e),this.numberOfComments=ko.observable(e.numberOfComments),this.comments=ko.observableArray([]),this.displayComments=ko.observable(!1),this.displayAddComment=ko.observable(!1),this.toggleShowComments=function(){this.displayComments(!this.displayComments()),this.displayAddComment(this.displayComments()),0==this.comments().length&&(t=lnk.services.getComments(this.id),_.each(t,function(e){this.comments.push(e)},this),lnk.helper.logDebug("Length of comments: "+this.comments.length))},this.toggleShowAddComment=function(){this.displayAddComment(!this.displayAddComment())},this.votes=ko.observable(e.votes),this.voteUp=function(){this.votes(this.votes()+1)},this.voteDown=function(){this.votes(this.votes()-1)},this.tags=ko.observableArray(this.tags),this.setTags=function(e){this.tags=e}.bind(this),this.setComments=function(e){this.comments=e}.bind(this),this.addComment=function(e){this.comments.push(e),this.numberOfComments(this.comments().length)}.bind(this)}};return{Article:function(t,n,i,o,r,l,s,a,c,d){return new e.Article(t,n,i,o,r,l,s,a,c,d)},Comment:function(t,n,i,o,r){return new e.Comment(t,n,i,o,r)},ArticleViewModel:function(t){return new e.ArticleViewModel(t)}}}(),lnk.namespace("lnk.services"),lnk.services=function(){var e=[{id:1,title:"Jersey - RESTful Web Services in Java",description:"Developing RESTful Web services that seamlessly support exposing your data in a variety of representation media types and abstract away the low-level details of the client-server communication is not an easy task without a good toolkit. In order to simplify development of RESTful Web services and their clients in Java, a standard and portable JAX-RS API has been designed. Jersey RESTful Web Services framework is open source, production quality, framework for developing RESTful Web Services in Java that provides support for JAX-RS APIs and serves as a JAX-RS (JSR 311 & JSR 339) Reference Implementation.",url:"https://jersey.java.net/",imageUrl:"https://jersey.java.net/images/jersey_logo.png",submittedBy:"hhe",submittedOn:new Date("06/14/2014"),votes:0,tags:["Java","REST","JAX-RS"],numberOfComments:2},{id:2,title:"FasterXML/jackson",description:"Jackson is a suite of data-processing tools for Java (and JVM platform), including the flagship JSON parsing and generation library, as well as additional modules to process data encoded in Avro, CBOR, CSV, Smile, XML or YAML (and list of supported format is still growing!)",url:"https://github.com/FasterXML/jackson",imageUrl:"http://fasterxml.com/images/fxml_logo.png",submittedBy:"aho",submittedOn:new Date,votes:0,tags:["Java","JSON"],numberOfComments:2},{id:3,title:"Eclipse Scout",description:"Eclipse Scout is a mature and open framework for modern, service oriented business applications. It substantially boosts developer productivity and is simple to learn.",url:"https://www.eclipse.org/scout/",imageUrl:"http://www.bsiag.com/scout/wp-content/themes/bsi_new/images/header1.png",submittedBy:"aho",submittedOn:new Date,votes:2,tags:["Scout","Eclipse Scout","Eclipse"],numberOfComments:3}],t=[{id:1,articleId:1,text:"Comment 1 for article 1",submittedOn:new Date,submittedBy:"aho"},{id:2,articleId:1,text:"Comment 2 for article 1",submittedOn:new Date,submittedBy:"hhe"},{id:3,articleId:2,text:"Comment 1 for article 2",submittedOn:new Date,submittedBy:"hhe"},{id:4,articleId:2,text:"Comment 2 for article 2",submittedOn:new Date,submittedBy:"aho"},{id:5,articleId:3,text:"Simple: Looking for an an application framework where you really get what you see? Then you might really like to have a look at the Eclipse Scout Screencasts",submittedOn:new Date,submittedBy:"hhe"},{id:6,articleId:3,text:"Simple: Looking for an an application framework where you really get what you see? Then you might really like to have a look at the Eclipse Scout Screencasts.",submittedOn:new Date,submittedBy:"hhe"},{id:7,articleId:3,text:"Flexible: Dreaming of an application framework that combines easy learning with powerful adapting? Why don't you check out our Eclipse Scout tutorial",submittedOn:new Date,submittedBy:"hhe"}],n={},i={};return n.checkLoopProperties=function(e,t){return void 0===e||void 0===t?(lnk.helper.logWarn("Searching new ID with incomplete data, dataArray="+e+", idProperty="+t),!1):!0},n.getNewId=function(e,t){var i=-1;if(n.checkLoopProperties(e,t)){for(var o=0,r=e.length;r>o;o+=1)i=(e[o][t]&&e[o][t])>i?e[o][t]:i;i+=1,lnk.helper.logDebug("New max value "+i)}return i},n.findPositionById=function(e,t,i){if(n.checkLoopProperties(e,t)){for(var o=0,r=e.length;r>o;o+=1)if(e[o][t]&&e[o][t]===i)return lnk.helper.logDebug("Found item with id "+i+" at position "+o),o;lnk.helper.logInfo("Found no item with id "+i)}},n.filterCommentsForArticle=function(e,t,i){var o=[];if(n.checkLoopProperties(e,t)||!i){for(var r=0,l=e.length;l>r;r+=1)e[r][t]&&e[r][t]===i&&(lnk.helper.logDebug("Found item with id "+i+" at position "+r),o.push(e[r]));return o}},i.getArticles=function(){return lnk.helper.logDebug("Returning articles "+e),e},i.addArticle=function(t){t.id=n.getNewId(e,"id"),e.push(t)},i.updateArticle=function(t){var i;i=n.findPositionById(e,"id",t.id),void 0!==i?e[i]=t:lnk.helper.logWarn("Article not found in cached articles. Article was "+t)},i.deleteArticle=function(t){var i;i=n.findPositionById(e,"id",t),void 0!==i?e.splice([i],1):lnk.helper.logWarn("Article id "+t+" not found in cached articles.")},i.getComments=function(e){return lnk.helper.logDebug("Returning comments for article "+e),n.filterCommentsForArticle(t,"articleId",e)},i.updateComment=function(e){var i;i=n.findPositionById(t,"id",e.id),void 0!==i?t[i]=e:lnk.helper.logWarn("Comment not found in cached articles. Comment was "+e)},i.addComment=function(e){e.id=n.getNewId(t,"id"),t.push(e)},i.deleteComment=function(e){var i;i=n.findPositionById(t,"id",e),void 0!==i?t.splice([i],1):lnk.helper.logWarn("Comment id "+e+" not found in cached comments.")},{getArticles:function(){return i.getArticles()},updateArticle:function(e){i.updateArticle(e)},addArticle:function(e){i.addArticle(e)},deleteArticle:function(e){i.deleteArticle(e)},getComments:function(e){return i.getComments(e)},updateComment:function(e){i.updateComment(e)},addComment:function(e){i.addComment(e)},deleteComment:function(e){i.deleteComment(e)}}}(),lnk.namespace("lnk.viewmodels"),lnk.viewmodels=function(e){function t(t,n){var i=[],o=[];return t&&e.trim(t).length>0?(i=t.split(n),_.each(i,function(t){o.push(e.trim(t))}),o):void 0}function n(e){var t,n,i=e.length,o=ko.observableArray();for(n=0;i>n;n+=1)t=lnk.entities.ArticleViewModel(e[n]),o.push(lnk.entities.ArticleViewModel(e[n]));return o}function i(e){var t,n=e;return t=ko.computed(function(){return n().sort(function(e,t){return e.votes()==t.votes()?0:e.votes()>t.votes()?-1:1})})}function o(n){var i=this;return i.targetDataSource=n,i.url=ko.observable(),i.title=ko.observable(),i.description=ko.observable(),i.alternateImageUrl=ko.observable(),i.imageUrl=ko.computed(function(){return lnk.helper.logDebug("Computing Image URL again"),i.alternateImageUrl()&&e.trim(i.alternateImageUrl()).length>0?i.alternateImageUrl():i.url()}),i.imageLoadedHandler=function(){lnk.helper.logDebug("image loaded handler called"),i.imageUrl()==i.url()&&(i.alternateImageUrl(null),i.displayAlternateImageUrl(!1))},i.imageLoadedErrorHandler=function(){lnk.helper.logDebug("Image error loading"),i.displayAlternateImageUrl(!0)},i.tags=ko.observable(),i.tagsArray=function(){return t(i.tags(),",")},i.submitArticle=function(){var e;lnk.helper.logDebug("Submitting this object:"),lnk.helper.logDir(i),e=lnk.entities.Article(null,i.title(),i.url(),i.imageUrl(),i.description(),"newSubmitter",new Date,0,i.tagsArray(),0),lnk.helper.logDir(e),lnk.services.addArticle(e)},i.displayAlternateImageUrl=ko.observable(!1),i}return{buildObservableArticleViews:function(e){return n(e)},getSortedArticleViewModel:function(e){return i(e)},getAddFormViewModel:function(e){return new o(e)}}}(jQuery);