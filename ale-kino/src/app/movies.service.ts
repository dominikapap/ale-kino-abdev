import { Injectable } from '@angular/core';
import { Movie } from 'src/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  movies: Movie[] = [
    {
      title: 'Apokawixa',
      tags: ['Horror'],
      length: '120',
      rated: 'PG-13',
      description:
        'Lorem ipsum dolor sit amet, alii rebum postea eam ex. Et mei laoreet officiis, summo sensibus id mei.',
      image: '../assets/img/imagePlaceholder.png',
      premiere: true,
      score: '8',
      schedule: [
        {
          date: '18/11',
          hours: ['12:30', '15:30', '18:30'],
        },
        {
          date: '19/11',
          hours: ['12:30', '18:30'],
        },
      ],
    },
    {
      title: 'Apokawixa 2',
      tags: ['Comedy'],
      length: '80',
      rated: 'PG-13',
      description:
        'Lorem ipsum dolor sit amet, alii rebum postea eam ex. Et mei laoreet officiis, summo sensibus id mei.',
      image: '../assets/img/imagePlaceholder.png',
      premiere: true,
      score: '8',
      schedule: [
        {
          date: '18/11',
          hours: ['12:30', '15:30', '18:30'],
        },
        {
          date: '19/11',
          hours: ['12:30', '18:30'],
        },
      ],
    },
  ];

  getMovies() {
    return this.movies;
  }
  constructor() {}
}
