export const apiErrors = {
  badRequest: {
    invalidOpinionId: 'opinionId invalid.',
    invalidText: 'text invalid. Nu poate fi gol.',
    invalidPassword:
      'Parola invalida. Trebuie sa contina cel putin 8 caractere, un caracter mare, un caracter mic, un numar si un caracter special.',
    invalidName: 'Nume invalid.',
    invalidEmail: 'Email invalid.',
    invalidId: 'Id invalid.',
    invalidRating: 'Rating invalid. Trebuie sa fie intre 0 si 10.',
    invalidProgress: 'Progress invalid. Este in afara intervalului.',
    invalidSeasonNumber: 'Numarul sezoanelor e invalid. Nu e un numar intreg.',
    negativePage:
      'Numarul paginii e invalid. Trebuie sa fie mai mare sau egal cu 1.',
    nonIntegerPage: 'Numarul paginii e invalid. Nu e un numar intreg.',
    invalidSearchQuery: 'Cautarea e invalida. Termenul nu poate fi gol.',
  },
  conflict: {
    emailInUse: 'Emailul este deja în uz.',
    reviewAlreadyExists:
      'Ai recenzat deja aceasta entitate. Nu se poate crea încă o recenzie.',
    alreadyInWatchlist: 'Entitatea este deja în lista utilizatorului.',
    updateDeletedOpinion: 'Opinia e ștearsă și nu poate fi actualizată.',
    deleteWithReview: 'Intrarea nu a fost stearsă. Are o opinie asociata.',
    reviewHaventWatched:
      'Nu poți recenza această entitate deoarece nu se află în lista ta.',
  },
  unauthorized: {
    updateOpinion: 'Nu ai dreptul sa actualizezi aceasta opinie.',
    deleteOpinion: 'Nu ai dreptul sa stergi aceasta opinie.',
    updateUser: 'Nu ai dreptul sa actualizezi acest utilizator.',
    updateRoles: 'Nu ai dreptul sa actualizezi rolurile utilizatorilor.',
    addEntries: 'Nu ai dreptul sa adaugi lista altuia.',
    deleteEntries: 'Nu ai dreptul sa ștergi intrarile din lista altuia.',
    updateEntries: 'Nu ai dreptul sa actualizezi intrarile din lista altuia.',
  },
  notFound: {
    entryNotFound: 'Entitatea nu a fost gasită.',
    opinionNotFound: 'Opinia nu a fost gasită.',
    userNotFound: 'Utilizatorul nu a fost gasit.',
    itemNotFound: 'Intrarea nu a fost gasită.',
    imdbEntryNotFound: 'Entitatea imdbId nu a fost gasită.',
  },
  forbidden: {
    badCredentials: 'Ai greșit numele sau parola.',
  },
  serviceUnavailable: {
    omdbError: 'A apărut o eroare la accesarea API-ului OMDb.',
  },
};
