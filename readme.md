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

- [path](#path)
- [as](#as)
- [each](#each)
- [unique](#unique)
- [use](#use)


### path
The path of the array to populate.

### as
The name of the property to populate.

### each
A function that will be called for each object in the array.

### unique
If true, the `each` function will be called only once for a unique `path` value object.

### use 
A function that provides any data used to populate


```javascript

```