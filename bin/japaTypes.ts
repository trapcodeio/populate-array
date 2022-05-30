import '@japa/runner'
import {Assert} from "@japa/assert";

declare module '@japa/runner' {
  interface TestContext {
    // assert: Assert
    // notify TypeScript about custom context properties
  }

  interface Test<TestData> {
    // notify TypeScript about custom test properties
  }
}
