# populate-array

Populate a key in an array of objects (Especially when working with related database results.)

## Installation

```sh
npm i populate-array
# OR
yarn add populate-array
```

## Usage

Let's say we have an array of users where each user country is an iso2 code.
We want this to be the country object instead when sending it to the client side.

```javascript
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
populateArray(users, {
  path: 'country',
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

## Just that?

No!! There's more to the `populateArray` function, and they are packed in its options.

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
populateArray(users, {
  path: 'country',
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
Note: Your `path` value must be string-able for this to work.

```javascript
const users = [
  {id: 1, name: 'John Doe', country: 'US'},
  {id: 2, name: 'Jane Doe', country: 'RU'},
  {id: 3, name: 'Mark Doe', country: 'CA'},
  {id: 3, name: 'Jane Doe', country: 'US'},
  // ... and so on
];

populateArray(users, {
  path: 'country',
  unique: true,
  each: (pathValue) => {
    // The each function will be called only 3 times
    // because the `country` property is unique
    // i.e 'US', 'RU' and 'CA'
  }
});
```

### use

A function that provides any data used to populate

