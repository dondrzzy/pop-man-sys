[![Build Status](https://travis-ci.com/dondrzzy/pop-man-sys.svg?branch=master)](https://travis-ci.com/dondrzzy/pop-man-sys)
[![Coverage Status](https://coveralls.io/repos/github/dondrzzy/pop-man-sys/badge.svg?branch=ch-pop-coveralls)](https://coveralls.io/github/dondrzzy/pop-man-sys?branch=ch-pop-coveralls)


# Population Management System API
This is a population management system API that facilitates creation of locations with certain parameters such as name of location, number
of male and female residents. A location can also belong to another location.


#### Note: User must be authenticated to do anything location based.


>Application UI

The application API is live [here](https://pop-man-sys.herokuapp.com).This is a `node express` API.

> Pivotal Tracker with user stories

The user stories for the project are [here](https://www.pivotaltracker.com/n/projects/2358805).

## requirements

- [Node (stable)](https://nodejs.org/en/)

- [MongoDB](https://www.mongodb.com/)

- [Postman](https://www.getpostman.com/)



## Installation and setup

1. Clone the repository.

```
git clone git@github.com:dondrzzy/pop-man-sys.git
```

2. cd into the application

```
cd <application folder>
```

3. Install the application dependencies

```
npm install
```

4. Set up some environment variables

```
Create a .env file at the root of the application and add the following env variables
- DB_NAME
- DB_URI=
- NODE_ENV=development  # leave as development for development environment and testing for testing environment
- SECRET_KEY
```

5. Start you mongodb service, in your terminal run

```
mongod
```

6. Spin up the server with

```
npm start or install nodemon with npm i nodemon and run nodemon
```

7. Use postman or anyother REST API tool to make API calls.


> Run `npm run test` to run tests with coverage.



## Main API features

- can register user.
- can get users
- can login user
- can create location
- can view locations
- can view location
- can update location
- can delete location


## End points

| Endpoint                 | payload              | headers     | Method |
| -------------------------| -------------------- | ----------- | ------ |
| `/api/v1/users`       | [User](#User)  | [header1](#header1) | `POST` |
| `/api/v1/users`       |                      |             | `GET`  |
| `/api/v1/users/login` | [User](#User)  | [header1](#header1) | `POST` |
| `/api/v1/location` | [locationPayload](#locationPayload)  | [header2](#header2) | `POST` |
| `/api/v1/location` |            | [header2](#header2) | `GET` |
| `/api/v1/location/<locationId>` |            | [header2](#header2) | `GET` |
| `/api/v1/location/<locationId>` |            | [header2](#header2) | `PUT` |
| `/api/v1/location/<locationId>` |            | [header2](#header2) | `DELETE` |


## API samples

#### header1

```
- Application/json
```

#### header2

```
- Application/json
- token-x
```

#### User

```
{
    "email": "peter@gmail.com",
	"password": "#peter@1234"
}

```

#### Location 

```
{
    "_id": "5d137f787b193c24b322aa77",
    "name": Some Location",
    "male": "200",
    "female": "300",
    "parentId": "5d137f787b193c24b322aa77",
    "createdAt": "2019-06-26T14:21:08.283Z"
}
```

#### loginPayload

```

{
	"email": "peter@gmail.com",
	"password": "#user@1234"
}

```

#### locationPayload

```
{
	"name": Some Location",
    "male": "200",
    "female": "300",
    "parentId": "5d137f787b193c24b322aa77",
}
```


### Author: Sibo Donald

> For more enquiries: Email me at sibo.donald16@gmail.com

