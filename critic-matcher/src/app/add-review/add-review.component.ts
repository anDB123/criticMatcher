import { Component } from '@angular/core';
import { Review } from '../review';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})


export class AddReviewComponent {

  constructor() { };

  addReviewToMongo = async () => {
    console.log('addReviewToMongo()');
    let movieName = (<HTMLInputElement>document.getElementById('movieInput')).value;
    let score = (<HTMLInputElement>document.getElementById('scoreInput')).value;

    console.log('movieName: ' + movieName);
    //alert the user if the movie name is empty or the score is empty
    if (movieName == '' || score == '') {
      alert('Please enter a movie name and score');
      return;
    }
    fetch('http://localhost:3002/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movieName: movieName, score: Number(score) })
    });

    const response = await fetch('http://localhost:3002/api/getall');
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);
    if (myJson.length == 0) {
      console.log('no reviews');
    }
    else {
      console.log('reviews found');
    }
    console.log('end of addReviewToMongo()');

  }
}
