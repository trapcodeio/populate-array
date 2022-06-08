import Users from "../tests/users.json";
import { populateArray } from "../index";
import { benchmarkFunctions } from "@trapcode/benchmark";

function Native() {
    const users: any[] = [...Users];

    for (const user of users) {
        user.verified = true;
    }
}

function PopulateArray() {
    const users: any[] = [...Users];
    populateArray(users, "verified", {
        each: () => true
    });
}

benchmarkFunctions([Native, PopulateArray]).run();
