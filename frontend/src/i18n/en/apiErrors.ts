export const apiErrors = {
  badRequest: {
    invalidText: 'Invalid text. Cannot be empty.',
    invalidPassword:
      'Your password is invalid. Our passwords use at least 8 characters, one uppercase, one lowercase, one number and one special character.',
    invalidName: 'Name is invalid.',
    invalidEmail: 'Invalid email.',
    invalidRating: 'Rating is invalid. It must be between 0 and 10.',
    invalidProgress: 'Progress is invalid. It is out of range.',
    invalidSeasonNumber: 'Season number is invalid. It is not an integer.',
    negativePage: 'Page number is invalid. It is less than 1.',
    nonIntegerPage: 'Page number is invalid. It is not an integer.',
    invalidSearchQuery: 'Search query is invalid. It is empty.',
    invalidId: 'Id is invalid.',
  },
  conflict: {
    emailInUse: 'The given email is already in use.',
    reviewAlreadyExists:
      'A review for this entry by this user already exists. Cannot create a new one.',
    alreadyInWatchlist:
      'The given entry is already in the watchlist of the user.',
    updateDeletedOpinion: 'The given opinion is deleted and cannot be updated.',
    deleteWithReview:
      'The given item was not deleted. It has an opinion associated with it.',
    reviewHaventWatched:
      "You are not allowed to review this entry because you haven't watched it.",
  },
  unauthorized: {
    updateOpinion: 'User is not authorized to update opinion.',
    deleteOpinion: 'User is not authorized to delete opinion.',
    updateUser: 'You are not authorized to update this user.',
    updateRoles: 'You are not authorized to update user roles.',
    addEntries:
      'You are not authorized add entries to a watchlist that is not yours.',
    deleteEntries:
      'You are not authorized delete entries from other users watchlist.',
    updateEntries:
      'You are not authorized update entries from other users watchlist.',
  },
  notFound: {
    entryNotFound: 'Entry was not found.',
    opinionNotFound: 'Opinion was not found.',
    userNotFound: 'The user was not found.',
    itemNotFound: 'The item was not found.',
    imdbEntryNotFound: 'The imdbId entry was not found.',
  },
  forbidden: {
    badCredentials: 'Wrong name or password.',
  },
  serviceUnavailable: {
    omdbError: 'External provider OMDB returned status different than 200.',
  },
};
