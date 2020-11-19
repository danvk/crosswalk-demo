import { HTTPError, TypedRouter } from 'crosswalk';

import { API, Actor, Movie } from './api';

const luke: Actor = {
  id: 'luke',
  name: 'Mark Hamill',
  dateOfBirthISO: '1951-09-25',
};

const han: Actor = {
  id: 'han',
  name: 'Harrison Ford',
  dateOfBirthISO: '1942-07-13',
};

const leia: Actor = {
  id: 'leia',
  name: 'Carrie Fisher',
  dateOfBirthISO: '1956-10-21',
};

const ACTOR_DB = [luke, han, leia];

const MOVIE_DB: Movie[] = [
  {
    id: '123',
    title: 'Star Wars IV',
    plotSummary: '',
    year: 1977,
    revenueUsd: 775_400_000,
    cast: [
      luke,
      han,
      leia,
    ]
  }
]

// Defining domain-specific helpers like this using HTTPError can greatly
// streamline the implementation of your request handlers.
function getMovieOr404(movieId: string) {
  const movie = MOVIE_DB.find(m => m.id === movieId);
  if (!movie) {
    throw new HTTPError(404, `No such movie ${movieId}`);
  }
  return movie;
}

export function register(router: TypedRouter<API>) {
  router.get('/movies', async () => ({movies: MOVIE_DB}));

  router.registerEndpoint('post', '/movies', async ({}, body) => {
    const {castActorIds, ...movie} = body;
    const cast: Actor[] = [];
    for (const actorId of body.castActorIds) {
      const actor = ACTOR_DB.find(actor => actor.id === actorId);
      if (!actor) {
        throw new HTTPError(403, `No such actor ${actorId}`);
      }
      cast.push(actor);
    }

    const newMovie: Movie = {
      id: '' + Math.floor(10000 * Math.random()),
      ...movie,
      cast,
    }
    MOVIE_DB.push(newMovie);

    return newMovie;
  });

  router.get('/movies/:movieId', async ({movieId}) => {
    return getMovieOr404(movieId);
  });

  router.get('/movies/:movieId/actors', async ({movieId}) => {
    const movie = getMovieOr404(movieId);
    return movie.cast;
  });

  router.registerEndpoint('patch', '/movies/:movieId', async ({movieId}, body) => {
    const movie = getMovieOr404(movieId);
    if (body.castActorIds) {
      throw new HTTPError(501, 'updating castActorIds is not implemented.');
    }
    for (const prop of ['plotSummary', 'title', 'revenueUsd', 'year'] as const) {
      const v = body[prop];
      if (v) {
        (movie as any)[prop] = v;
      }
    }
    return movie;
  });

  router.get('/movies/:movieId/actors/:actorId', async ({movieId, actorId}) => {
    const movie = getMovieOr404(movieId);
    const actor = movie.cast.find(a => a.id === actorId);
    if (!actor) {
      throw new HTTPError(404, `Could not find actor ${actorId} in ${movieId}`);
    }
    return actor;
  });

  router.registerEndpoint('delete', '/movies/:movieId/actors/:actorId', async ({movieId, actorId}) => {
    throw new HTTPError(501, 'DELETE endpoint not yet implemented');
  });
}
