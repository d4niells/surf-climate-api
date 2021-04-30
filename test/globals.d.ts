declare namespace NodeJS {
  interface Global {
    // Declare a new type testRequest on Global nodejs interfaces
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
  }
}
