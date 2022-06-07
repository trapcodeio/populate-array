import { test } from "@japa/runner";
import Users from "./users.json";
import { populateArray, populateArrayAsync } from "../index";

type User = typeof import("./users.json")[number] & { verified?: boolean };

test("populateArray", ({ assert }) => {
    // Test logic goes here
    const users: User[] = [...Users];

    populateArray(users, "verified", {
        each: () => true
    });

    assert.isTrue(users.every((user) => user.verified === true));
});

test("populateArray: use is passed to each", ({ assert }) => {
    // Test logic goes here
    const users: any[] = [...Users];

    populateArray<string, Record<string, string>>(users, "email", {
        as: "emailUppercase",
        use: (emails) => {
            // test that use gets an array of the selected path
            assert.deepEqual(
                emails,
                users.map((user) => user.email)
            );

            const upperCased = {} as Record<string, string>;
            for (const email of emails) upperCased[email] = email.toUpperCase();

            return upperCased;
        },
        each: (value, upperCased) => {
            return upperCased[value];
        }
    });

    assert.isTrue(users.every((user) => user.emailUppercase === user.email.toUpperCase()));
});

test("populateArrayAsync", async ({ assert }) => {
    // Test logic goes here
    const users: any[] = [...Users];

    await populateArrayAsync(users, "verified", {
        each: () => true
    });

    assert.isTrue(users.every((user) => user.verified === true));
});

test("populateArrayAsync: use is passed to each", async ({ assert }) => {
    // Test logic goes here
    const users: any[] = [...Users];

    await populateArrayAsync<string, Record<string, string>>(users, "email", {
        as: "emailUppercase",
        use: (emails) => {
            // test that use gets an array of the selected path
            assert.deepEqual(
                emails,
                users.map((user) => user.email)
            );

            const upperCased = {} as Record<string, string>;
            for (const email of emails) upperCased[email] = email.toUpperCase();

            return upperCased;
        },
        each: (value, upperCased) => {
            return upperCased[value];
        }
    });

    assert.isTrue(users.every((user) => user.emailUppercase === user.email.toUpperCase()));
});
