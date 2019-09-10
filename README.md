# Polaris Playground

A simple code editor to quickly build and share prototypes built with Polaris and React.


# Local development

## Create a .env file

Create a new `.env` file in the project folder. It will have the following variables:
```
REACT_APP_GRAPH_COOL_API=
REACT_APP_GOOGLE_CLIENT_ID=
```

**REACT_APP_GOOGLE_CLIENT_ID**

Get a `REACT_APP_GOOGLE_CLIENT_ID` by following the [instructions](https://developers.google.com/identity/sign-in/web/sign-in). Make sure to add `localhost` to the allowed domains. The value should look like `XXXX.apps.googleusercontent.com`


**REACT_APP_GRAPH_COOL_API**

You will need to get a URL for the API for `REACT_APP_GRAPH_COOL_API`. We currently are using GraphCool. They have a [quickstart guide](https://www.graph.cool/docs/quickstart/). The value should look like `https://api.graph.cool/simple/v1/XXXX`.


## Get started

Make sure you have `yarn` and `nodejs` installed. Then run:
```
yarn
yarn start
```

Open [http://localhost:3000/](http://localhost:3000/)