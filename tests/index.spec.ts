import {test} from '@japa/runner'
import Users from './users.json';
import {populateArray} from "../index";


test('populateArray', async ({assert}) => {

    // Test logic goes here
    const users: any[] = [...Users];

    await populateArray(users, {
        path: 'verified',
        each: () => true
    })

    assert.isTrue(users.every(user => user.verified === true))
});

test('populateArray: use is passed to each', async ({assert}) => {

    // Test logic goes here
    const users: any[] = [...Users];

    await populateArray<string, Record<string, string>>(users, {
        path: 'email',
        as: 'emailUppercase',
        use: (emails) => {
            assert.deepEqual(emails, users.map(user => user.email))

            const upperCased = {} as Record<string, string>;

            for (const email of emails)
                upperCased[email] = email.toUpperCase();

            return upperCased;
        },
        each: (value, upperCased) => {
            return upperCased[value];
        }
    })

    assert.isTrue(users.every(user => user.emailUppercase === user.email.toUpperCase()))
});

