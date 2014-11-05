/**
 * Created by Holger on 05.11.2014.
 * This class contains information regarding a collection of votes
 */

function VoteContainer(numberOfVotes, userVote) {
    this.numberOfVotes = numberOfVotes;
    this.userVote = userVote;
}

VoteContainer.prototype.clone = function() {
    return new VoteContainer(this.numberOfVotes, this.userVote);
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