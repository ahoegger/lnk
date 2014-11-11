/**
 * Created by Holger on 05.11.2014.
 * This class contains information regarding a collection of votes
 */

function VoteContainer(numberOfVotes, userVote, articleId) {
    this.numberOfVotes = numberOfVotes;
    this.userVote = userVote;
    this.articleId = articleId;
}

VoteContainer.prototype.clone = function() {
    return new VoteContainer(this.numberOfVotes, this.userVote, this.articleId);
};

VoteContainer.prototype.isUserVote = function() {
    return userVote !== undefined && userVote !== null;
};

VoteContainer.prototype.isUserVotedUp = function() {
    return this.isUserVote() && this.userVote > 0;
};

VoteContainer.prototype.isUserVotedDown = function() {
    return this.isUserVote() && this.userVote < 0;
};

module.exports = {
    VoteContainer: VoteContainer
};