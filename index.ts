import lodashGet from "lodash.get";
import lodashSet from "lodash.set";

/**
 * Check if path has dot notation
 * @param path
 */
function hasDotNotation(path: string) {
    return path.indexOf(".") !== -1;
}

/**
 * Only use lodash get if path has a dot notation
 * @param obj
 * @param path
 */
function liteGet<T = any>(obj: any, path: string): T | undefined {
    if (hasDotNotation(path)) {
        return lodashGet(obj, path) as T;
    } else {
        return obj[path] as T;
    }
}

/**
 * Only use lodash set if path has a dot notation
 * @param obj
 * @param path
 * @param value
 */
function liteSet<T>(obj: any, path: string, value: T) {
    if (hasDotNotation(path)) {
        lodashSet(obj, path, value);
    } else {
        obj[path] = value;
    }
}

/**
 * Populate array Options Type
 */
export interface PopulateOptions<PathType = any, AllType = any> {
    // as - rename the populated path
    as?: string;

    /**
     * unique - if true, will only populate unique values
     * When running `each` function, it will cache using a uniqueKey
     * Thereby not running `each` function for duplicate values
     */
    unique?: boolean;

    /**
     * use - if provided, will use this function will be called and its result will
     * be passed to `each` function as second argument
     * @param all
     */
    use?: (all: PathType[]) => Promise<AllType> | AllType;

    /**
     * each - function to run for each item in the array.
     * return value will be set to the populated path
     * @param each
     * @param allData
     */
    each: (each: PathType, allData: AllType) => Promise<any> | any;
}

/**
 * Populate array
 * @param array
 * @param path
 * @param options
 */
export function populateArray<PathType = any, AllType = any>(
    array: any[],
    path: string,
    options: PopulateOptions<PathType, AllType>
) {
    if (options.use) {
        const pathValues = array.map((item) => liteGet(item, path));
        const convertedValues = options.use(pathValues);

        populateEach<PathType>(array, path, options, convertedValues);
    } else {
        populateEach<PathType, AllType>(array, path, options);
    }
}

/**
 * Populate array (Async version)
 * @param array
 * @param path
 * @param options
 */
export async function populateArrayAsync<PathType = any, AllType = any>(
    array: any[],
    path: string,
    options: PopulateOptions<PathType, AllType>
) {
    if (options.use) {
        const pathValues = array.map((item) => liteGet(item, path));
        const convertedValues = await options.use(pathValues);

        await populateEachAsync<PathType>(array, path, options, convertedValues);
    } else {
        await populateEachAsync<PathType, AllType>(array, path, options);
    }
}

/**
 * Helper function to populate each item in the array
 * @param array
 * @param path
 * @param options
 * @param convertedValues
 */
function populateEach<PathType = any, AllType = any>(
    array: any[],
    path: string,
    options: PopulateOptions<PathType, AllType>,
    convertedValues?: AllType
) {
    if (options.unique) {
        const unique = {} as Record<string, PathType>;

        for (const item of array) {
            const pathValue = liteGet(item, path);

            if (!["string", "number"].includes(typeof pathValue)) {
                throw new Error(`Unique Path value must be a string or number`);
            }

            const uniqueKey = String(pathValue);

            let convertedValue;
            if (unique.hasOwnProperty(uniqueKey)) {
                convertedValue = unique[uniqueKey];
            } else {
                convertedValue = options.each(pathValue, convertedValues!);
                unique[uniqueKey] = convertedValue;
            }

            liteSet(item, options.as || path, convertedValue);
        }
    } else {
        for (const item of array) {
            const pathValue = liteGet(item, path);
            liteSet(
                item,
                options.as ? options.as : path,
                options.each(pathValue, convertedValues!)
            );
        }
    }
}

/**
 * populateArray (Async version)
 * @param array
 * @param path
 * @param options
 * @param convertedValues
 */
async function populateEachAsync<PathType = any, AllType = any>(
    array: any[],
    path: string,
    options: PopulateOptions<PathType, AllType>,
    convertedValues?: AllType
) {
    if (options.unique) {
        const unique = {} as Record<string, PathType>;

        for (const item of array) {
            const pathValue = liteGet(item, path);

            if (!["string", "number"].includes(typeof pathValue)) {
                throw new Error(`Unique Path value must be a string or number`);
            }

            const uniqueKey = String(pathValue);

            let convertedValue;
            if (unique.hasOwnProperty(uniqueKey)) {
                convertedValue = unique[uniqueKey];
            } else {
                convertedValue = await options.each(pathValue, convertedValues!);
                unique[uniqueKey] = convertedValue;
            }

            liteSet(item, options.as || path, convertedValue);
        }
    } else {
        for (const item of array) {
            const pathValue = liteGet(item, path);
            liteSet(
                item,
                options.as ? options.as : path,
                await options.each(pathValue, convertedValues!)
            );
        }
    }
}
