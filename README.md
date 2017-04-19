# beam-viz
Visualizations for the BEAM Framework

## Development
* Install `webpack` and `yarn` globally
* Run `yarn` in the project root directory
* `npm run dev-server` will start the webpack development server with hot reloading
* For production build, run `npm run build` (or `npm start` to build and serve)


## Deploying on Heroku
* Install [Heroku CLI][https://devcenter.heroku.com/articles/heroku-cli] and login
* Run the following commands:
    - `heroku create`: This will add heroku remote to current repository. Try `heroku help create` for more details.
    - `git push heroku master`: This will push the repository to heroku and deploy.
