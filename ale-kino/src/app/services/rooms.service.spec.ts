import { RoomsService, Room } from './rooms.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EnvironmentInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('RoomsService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [RoomsService],
      imports: [HttpClientTestingModule],
    });
  });

  const room: Room = {
    id: 1,
    name: 'Sala B',
    rows: 12,
    seats: 12,
  };

  it('getTodos', (done) => {
    // arrange
    const expectedUrl = '/rooms/1';
    const service = TestBed.inject(EnvironmentInjector).get(RoomsService);
    const httpController = TestBed.inject(HttpTestingController);

    // act
    service.getRoomDetails(1).subscribe({
      next: (res) => {
        expect(res).toEqual(room);
        done();
      },
      error: (err: HttpErrorResponse) => {
        expect(err.statusText).toEqual('Error');
        done();
      },
    });

    const req = httpController.expectOne(expectedUrl);

    req.flush(room);
  });

  it('getAllRooms', (done) => {
    // arrange
    const expectedUrl = '/rooms';
    const service = TestBed.inject(EnvironmentInjector).get(RoomsService);
    const httpController = TestBed.inject(HttpTestingController);

    // act
    service.getAllRooms().subscribe({
      next: (res) => {
        expect(res).toEqual([room]);
        done();
      },
      error: (err: HttpErrorResponse) => {
        expect(err.statusText).toEqual('Error');
        done();
      },
    });

    const req = httpController.expectOne(expectedUrl);

    req.flush([room]);
  });
});
