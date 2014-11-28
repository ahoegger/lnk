/**
 * This class contains information regarding a collection of votes
 * @module backend/entities/VoteContainer
 * @author Holger Heymanns
 * @since 05.11.2014
 */

/**
 * This class implements the VoteContainer class. This class hold various properties regard votes of an article
 * @param numberOfVotes
 * @param userVote
 * @param articleId
 * @constructor
 * @class
 */
function VoteContainer(numberOfVotes, userVote, articleId) {
    this.numberOfVotes = numberOfVotes;
    this.userVote = userVote;
    this.articleId = articleId;
}

/**
 * This function returns a clone of the entity
 * @return {VoteContainer}
 */
VoteContainer.prototype.clone = function() {
    return new VoteContainer(this.numberOfVotes, this.userVote, this.articleId);
};

/**
 * This function returns true, if the UserVote is known
 * @return {boolean}
 */
VoteContainer.prototype.isUserVote = function() {
    return userVote !== undefined && userVote !== null;
};

/**
 * This function returns true, if the user's vote is an upvote
 * @return {boolean}
 */
VoteContainer.prototype.isUserVotedUp = function() {
    return this.isUserVote() && this.userVote > 0;
};

/**
 * This function returns true, if the user's vote is a downvote
 * @return {boolean}
 */
VoteContainer.prototype.isUserVotedDown = function() {
    return this.isUserVote() && this.userVote < 0;
};

module.exports = {
    VoteContainer: VoteContainer
};