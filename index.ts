import get from "lodash.get";
import set from "lodash.set";

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
export async function populateArray<PathType = any, AllType = any>(
    array: any[],
    path: string,
    options: PopulateOptions<PathType, AllType>
) {
    if (options.use) {
        const pathValues = array.map((item) => get(item, path));
        const convertedValues = await options.use(pathValues);

        await populateEach<PathType>(array, path, options, convertedValues);
    } else {
        await populateEach<PathType, AllType>(array, path, options);
    }
}

/**
 * Helper function to populate each item in the array
 * @param array
 * @param path
 * @param options
 * @param convertedValues
 */
async function populateEach<PathType = any, AllType = any>(
    array: any[],
    path: string,
    options: PopulateOptions<PathType, AllType>,
    convertedValues?: AllType
) {
    if (options.unique) {
        const unique = new Map<string, PathType>();

        for (const item of array) {
            const pathValue = get(item, path);
            let uniqueKey;
            let convertedValue;

            try {
                uniqueKey = String(pathValue);
            } catch (error) {
                throw new Error(`Path value is not string-able`);
            }

            if (unique.has(uniqueKey)) {
                convertedValue = unique.get(uniqueKey);
            } else {
                convertedValue = await options.each(pathValue, convertedValues!);
                unique.set(uniqueKey, convertedValue);
            }

            set(item, options.as || path, convertedValue);
        }
    } else {
        for (const item of array) {
            const pathValue = get(item, path);
            set(
                item,
                options.as ? options.as : path,
                await options.each(pathValue, convertedValues!)
            );
        }
    }
}
