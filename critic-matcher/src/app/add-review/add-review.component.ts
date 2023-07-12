import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscribable, map, startWith } from 'rxjs';
import { DatabaseResult } from '../database-result';
import { response } from 'express';
import { ok } from 'assert';
@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})



export class AddReviewComponent {

  myControl = new FormControl('');
  options: string[] = ['Ghostbusters', 'Mission Impossible', 'Indiana Jones'];
  filteredOptions!: Observable<string[]>;
  username = 'Andy B';
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    //set userNameInput to the username
    (<HTMLInputElement>document.getElementById('userNameInput')).value = this.username;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  createUser = async () => {
    console.log('createUser()');
    let userName = (<HTMLInputElement>document.getElementById('userNameInput')).value;
    console.log('userName: ' + userName);
    //alert the user if the movie name is empty or the score is empty
    if (userName == '') {
      alert('Please enter a user name');
      return;
    }

    //check if user exists
    fetch('http://localhost:3002/api/getOne/?userName=' + userName, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(data => {
      console.log('data')
      console.log(data);
      if (data == null) {
        console.log('user does not exist');
        //add user to database
        fetch('http://localhost:3002/api/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userName: userName, reviews: [] })
        });
        console.log("added User to database");
      }
      else {
        console.log('user exists');
        //update the list of reviews
        fetch('http://localhost:3002/api/update/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userName: userName, reviews: [{ movieName: "test review", score: 10 }] })
        });

      }
    }
    );
  }



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
    let jsonString = JSON.stringify({ userName: this.username, reviews: [{ movieName: movieName, score: Number(score) }] })
    let jsonParsed = JSON.parse(jsonString);
    console.log(jsonString);
    let reviews = [{ movieName: movieName, score: score }];

    //check if user exists and if so, add the review to the user's reviews array
    fetch('http://localhost:3002/api/getOne/?userName=' + this.username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(data => {
      console.log('data')
      console.log(data);
      if (data == null) {
        console.log('user does not exist');
        alert('Please create a user first');
        return;
      }
      else {
        console.log('user exists');
        //update the list of reviews
        fetch('http://localhost:3002/api/update/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          //push reviews onto the reviews array
          body: JSON.stringify({ userName: this.username, reviews: [{ movieName: movieName, score: Number(score) }] })
        });
        console.log("added review to database");
      }
    }
    );


    //sleep for 1 second
    await new Promise(r => setTimeout(r, 1000));



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
  testMovieDatabase = async () => {
    const fetch = require('node-fetch');

    const url = 'https://api.themoviedb.org/3/movie/550?api_key=f07ae804924daefa91c7f218989fbe70';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    };

    fetch(url, options)
      .then((res: { json: () => any; }) => res.json())
      .then((json: any) => console.log(json))
      .catch((err: string) => console.error('error:' + err));
  }

  findMovie = async () => {
    let query = (<HTMLInputElement>document.getElementById('movieSelector')).value;
    const url = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=f07ae804924daefa91c7f218989fbe70&query=' + query;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    }; this.options = [];

    //await fetch(url, options).then(response => response.json()).then(data => {
    //  if (data.results.length == 0) {
    //    console.log('No movies found');
    //    return;
    //  }
    //  console.log(data);
    //  //console.log(data.results[0].title);
    //  //console.log(data.results[0].overview);
    //  for (let i = 0; i < data.results.length; i++) {
    //    console.log(data.results[i].title)
    //    this.options.push(data.results[i].title);
    //  }
    //  //set moviePoster to the first result
    //  (<HTMLInputElement>document.getElementById('moviePoster')).src = 'https://image.tmdb.org/t/p/w500' + data.results[0].poster_path;
    //  return data;
    //});
  }
  findReview = async () => {
    //call fetch on https://api.nytimes.com/svc/movies/v2/reviews/search.json
    //get the review from the first result
    //display the review in the review box
    let query = (<HTMLInputElement>document.getElementById('movieSelector')).value;
    const url = 'https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=' + query + '&api-key=A3wAc8R84elEZ6yqwTO2mBRhiazoUiEj';
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    };
    await fetch(url, options).then(response => response.json()).then(data => {
      //check if data is empty

      if (data.results.length == 0) {
        console.log('No reviews found');
        return;
      }
      console.log(data);
      console.log(data.results[0].summary_short);

      (<HTMLInputElement>document.getElementById('reviewMovieName')).innerText = data.results[0].display_title;
      (<HTMLInputElement>document.getElementById('reviewText')).innerText = data.results[0].summary_short;
      (<HTMLInputElement>document.getElementById('reviewScore')).innerText = data.results[0].mpaa_rating;
      (<HTMLInputElement>document.getElementById('reviewerName')).innerText = data.results[0].byline;

    });

    const url2 = 'https://content.guardianapis.com/search?q=' + query + ',review&tag=tone/reviews&show-tags=all&section=film&show-fields=all&api-key=4a05e183-6f78-48b0-8895-7ba2953343a2';
    const options2 = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    };

    console.log("guardian api:");
    let allReviews: any[] = [];
    fetch(url2, options2).then(response => response.json()).then(data => {

      console.log(data);
      //only print results if they contain "review" in the webTitle
      for (let i = 0; i < data.response.results.length; i++) {

        if (data.response.results[i].webTitle.includes("review")) {
          //set guardianReview to the first result
          console.log(data.response.results[i].webTitle + " " + data.response.results[i].fields.starRating + " " + data.response.results[i].fields.byline);
          allReviews.push(data.response.results[i])
        }
      }

      (<HTMLInputElement>document.getElementById('guardianReview')).innerText = allReviews[0].fields.bodyText;
      //(<HTMLInputElement>document.getElementById('reviewBox')).value = data.results[0].summary_short;
      //set reviewScore to the first result
      //set reviewerName to the first result
      //(<HTMLInputElement>document.getElementById('reviewerName')).innerText = data.results[0].webTitle;



      //return data;
    }
    );
  }
  getAllReviews = async (): Promise<any[]> => {
    let reviewsArray: any[] = [];

    const url = 'http://localhost:3002/api/getOne/?userName=' + this.username;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    };
    await fetch(url, options).then(response => response.json()).then(data => {
      console.log(data);
      console.log(data.reviews[0].movieName);
      console.log(data.reviews[0].score);

      //set moviePoster to the first result
      //(<HTMLInputElement>document.getElementById('moviePoster')).src = 'https://image.tmdb.org/t/p/w500' + data.results[0].poster_path;
      for (let i = 0; i < data.reviews.length; i++) {
        console.log(data.reviews[i].movieName);
        console.log(data.reviews[i].score);
        reviewsArray.push(data.reviews[i]);
      }

    });

    return reviewsArray;
  }
  getCriticReviewsForMovie = async (movieName: string) => {

    //make url for guardian api
    let allReviews: any[] = Array();
    const url = 'https://content.guardianapis.com/search?q=' + movieName + ',review&tag=tone/reviews&show-tags=all&section=film&show-fields=all&api-key=4a05e183-6f78-48b0-8895-7ba2953343a2';
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    };
    console.log("guardian api:");
    fetch(url, options).then(response => response.json()).then(data => {
      if (data.response.ok == false) {
        console.log("no reviews found");
        return;
      }
      console.log(data);
      for (let i = 0; i < data.response.results.length; i++) {
        allReviews.push(data.response.results[i]);
      }
    });
    console.log("Found some reviews")
    return allReviews;
  }

  getAllCriticsReviews = async () => {
    let userReviews = await this.getAllReviews();
    let allReviews: any[] = [];
    //check reviews exist
    if (userReviews.length == 0) {
      console.log('No reviews found');
      return;
    }
    console.log(userReviews);
    for (let i = 0; i < userReviews.length; i++) {
      let movieName = userReviews[i].movieName;
      console.log("movieName = " + movieName)
      let criticReviews = await this.getCriticReviewsForMovie(movieName);
      //wait for the critic reviews to be returned
      await new Promise(criticReviews => setTimeout(criticReviews, 1000));
      console.log(criticReviews)
      for (let j = 0; j < criticReviews.length; j++) {
        console.log(j)
        //check if the webtitle has all the words in the movie name
        //loop through all the words in movie name
        let containsAllWords = true;


        //check if the webtitle contains the word
        if (!criticReviews[j].webTitle.toLowerCase().includes(movieName.toLowerCase())) {
          console.log(criticReviews[j].webTitle + " does not contain " + movieName.toLowerCase());
        }
        else {
          console.log(criticReviews[j].webTitle + " contains " + movieName.toLowerCase());
          allReviews.push(criticReviews[j].webTitle + " " + criticReviews[j].fields.starRating + " " + criticReviews[j].fields.byline);
        }
      }
    }
    console.log(allReviews);
  }
}

