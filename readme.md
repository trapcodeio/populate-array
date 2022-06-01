# populate-array

Populate a key in an array of objects (Especially when working with related database results.)

## Installation

```sh
npm i populate-array
# OR
yarn add populate-array
```

## Import
```javascript
// ES6:
import {populateArray} from 'populate-array';
// CommonJS:
var {populateArray} = require('populate-array');
```

## Usage

Let's say we have an array of users where each user country is an iso2 code.
We want this to be the country object instead when sending it to the client side.

```typescript
import {populateArray} from "populate-array";

const users = [
    {
        id: 1,
        name: 'John Doe',
        country: 'US'
    },
    // ... and so on
];

// Normal way
for (const user of users) {
    user.country = getCountryFn(user.country)
}

// Populate way
populateArray(users, 'country', {
    each: getCountryFn
});

// Result:
// @formatter:off
[
  {
    id: 1,
    name: 'John Doe',
    country: {
      name: 'United States',
      iso2: 'US'
    }
  }
  // ... and so on
]
// @formatter:on
```

## Arguments
The populateArray function takes three arguments:

- `array`: The array of objects to populate.
- `path`: The path of the objects to populate.
- `options`: The options object.

**Path Note:**
This package makes use of `lodash.get` to get the value of a key in an object and `lodash.set` to set the value of a key in an object.
So nested keys are supported. e.g. `user.address.city` using dot notation.

## Just that?

No!! ☺️ There's more to the `populateArray` function, and they are packed in its options.


## Options

- [as](#as)
- [each](#each)
- [unique](#unique)
- [use](#use)

### as

The name of the property to populate.

```javascript
// Normal way
for (const user of users) {
  user.countryData = getCountryFn(user.country)
}

// Populate way
populateArray(users, 'country', {
  as: 'countryData',
  each: getCountryFn
});
```

### each

A function that will be called for each object in the array. This function receives 2 arguments:

- The `path` value
- The data returned by the `use` function, **if defined.**

```javascript
const users = [
  {id: 1, name: 'John Doe', country: 'US'},
  {id: 2, name: 'Jane Doe', country: 'RU'},
  {id: 3, name: 'Mark Doe', country: 'CA'},
  // ... and so on
];

populateArray(users, {
  path: 'country',
  each: (pathValue) => {
    // `pathValue` is the value of the `country` property
    // i.e either 'US', 'RU' or 'CA'
  }
});

// with `use` function
populateArray(users, {
  path: 'country',
  use(countries) {
    // `countries` is an array of the `path` values
    // i.e ['US', 'RU', 'CA']
    return getCountries(countries);
  },
  each(pathValue, useData) {
    // `pathValue` is the value of the `country` property
    // `useData` is the value returned by the `use` function
    return useData.find(country => country.iso2 === pathValue);
  }
});
```

### unique

If true, the `each` function will be called only once for a unique `path` value object.
Note: Your `path` value must be a **string** or **number** for this to work.

```javascript
const users = [
  {id: 1, name: 'John Doe', country: 'US'},
  {id: 2, name: 'Jane Doe', country: 'RU'},
  {id: 3, name: 'Mark Doe', country: 'CA'},
  {id: 3, name: 'Jane Doe', country: 'US'},
  // ... and so on
];

populateArray(users, 'country', {
  unique: true,
  each: (pathValue) => {
    // The each function will be called only 3 times
    // because the `country` property is unique
    // i.e 'US', 'RU' and 'CA'
  }
});
```

### use

A function that provides any data that can be used to populate.

Using a database example: A case scenario where we want to populate the `userId` property of a `posts` array.

```javascript
// The `posts` array is an array of objects
// where each object has a `userId` property
// and we want to populate the `user` property
// with the user object from the database

const posts = [
  {id: 1, userId: 1, title: 'Post 1'},
  {id: 2, userId: 2, title: 'Post 2'},
  {id: 3, userId: 2, title: 'Post 3'},
  {id: 4, userId: 1, title: 'Post 4'},
]

populateArray(posts, 'userId', {
  use(userIds) {
    // `userIds` is an array of the `userId` values
    // i.e [1, 2, 2, 1]
    // Assuming we are using a mongodb like database
    return Users.find({_id: {$in: userIds}});
  },
  each(userId, users) {
    // `userId` is the value of the `userId` property
    // `users` is the value returned by the `use` function
    // now we loop through the users array and return the user object
    // that matches the `userId` value
    // This is faster/better than calling the database on each iteration.
    // in terms of performance.
    return users.find(user => user.id === userId);
  }
});
```

