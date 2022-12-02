import { Injectable } from '@angular/core';
import { Movie } from 'src/app/movie';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {

  constructor(private http: HttpClient) {}

  // movies: Movie[] = [
  //   {
  //     title: 'Apokawixa',
  //     tags: ['Horror'],
  //     length: '120',
  //     rated: 'PG-13',
  //     description:
  //       'Lorem ipsum dolor sit amet, alii rebum postea eam ex. Et mei laoreet officiis, summo sensibus id mei.',
  //     image: '../assets/img/imagePlaceholder.png',
  //     premiere: true,
  //     score: '8',
  //     schedule: [
  //       {
  //         date: '13/11',
  //         hours: ['12:30', '15:30', '18:30'],
  //       },
  //       {
  //         date: '14/11',
  //         hours: ['12:30', '18:30'],
  //       },
  //       {
  //         date: '15/11',
  //         hours: ['12:30', '14:20', '16:10', '18:30'],
  //       },
  //       {
  //         date: '16/11',
  //         hours: ['12:30', '18:30'],
  //       },
  //       {
  //         date: '17/11',
  //         hours: ['12:30', '14:00', '18:30'],
  //       },
  //       {
  //         date: '18/11',
  //         hours: ['12:30', '15:30'],
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Apokawixa 2',
  //     tags: ['Comedy'],
  //     length: '80',
  //     rated: 'PG-13',
  //     description:
  //       'Lorem ipsum dolor sit amet, alii rebum postea eam ex. Et mei laoreet officiis, summo sensibus id mei.',
  //     image: '../assets/img/imagePlaceholder.png',
  //     premiere: true,
  //     score: '8',
  //     schedule: [
  //       {
  //         date: '13/11',
  //         hours: ['12:30', '15:30', '18:30'],
  //       },
  //       {
  //         date: '14/11',
  //         hours: ['12:30', '18:30'],
  //       },
  //       {
  //         date: '15/11',
  //         hours: ['12:30', '14:20', '16:10', '18:30'],
  //       },
  //       {
  //         date: '16/11',
  //         hours: ['12:30', '18:30'],
  //       },
  //       {
  //         date: '17/11',
  //         hours: ['12:30', '14:00', '18:30'],
  //       },
  //       {
  //         date: '18/11',
  //         hours: ['12:30', '15:30'],
  //       },
  //     ],
  //   },
  // ];

  getMovies() {
    return this.http.get<Movie[]>('http://localhost:3000/movies');
  }

  getMovie(movieId: string){
    return this.http.get<Movie[]>(`http://localhost:3000/movies/${movieId}`);
  }

  getSchedule() {
    return this.http.get('http://localhost:3000/schedule');
  }

  ngOnInit(){

  }

}
