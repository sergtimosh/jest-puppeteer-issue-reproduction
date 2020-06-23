## Priority Auth Web Automation

Priority E2E tests written with the use of puppeteer + jest (https://pptr.dev/, https://jestjs.io/) 


#### Installing:
- install npm if not installed https://www.npmjs.com/get-npm
- clone this repository in to you local directory``$ git clone {repository url}``
- ``$ cd`` to your test project
- run:
```
npm i
```

#### Run all tests automatically(headless by default in chromium browser):
- run from your tests root directory(chose any):
```
$ npm test

$ npx jest --silent
```

#### Executing all tests automatically in headed mode:
- run any:
```
$ HEADLESS='false' npm test

$ HEADLESS='false' npx jest --silent
```
#### Executing particular test:
- run any(in any unix shell):
```
$ HEADLESS='false' npm test 'suite name'       //suite name is a string from the describe() block (ex. npm test 'Sign up')

$ HEADLESS='false' npm test 'test name'       //test name is a string in the test() block (ex. npm test 'Login via Google')

$ HEADLESS='false' npx jest <file name path> --silent    //file name should have <*.spec.js> pattern (ex. npm test tests/sign_up.spec.js)
```
- run any(in windows power shell):
```
> $env:HEADLESS='false'; npm test -t='suite name'    //suite name is a string from the describe() block (ex. npm test 'Login')

> $env:HEADLESS='false'; npm test -t='test name'     //test name is a string in the test() block (ex. npm test 'Delete Internal Dialog')

> $env:HEADLESS='false'; npx jest <file name path> --silent   //file name should have <*.spec.js> pattern (ex. npm test tests/sign_up.spec.js)
```

#### Select environment for test execution:
- run any(in any unix shell):
```
$ ENV=DEV LANG=HEB npx jest       //execute tests against DEV environment with HEBREW language parameter

$ ENV=STAGING LANG=ENG npx jest   //execute tests against STAGING environment with ENGLISH language parameter

$ npx jest    //execute tests against default environment and with default language parameter(STAGING and ENGLISH)
```
- run any(in windows power shell):
```
> $env:ENV='DEV'; $env:LANG='HEB'; npx jest    //execute tests against DEV environment with HEBREW language parameter in windows power shell
```

#### Run tests in paralell:
- run any:
```
$ npx jest --maxWorkers=1           //that will run only one test in a row

$ npx jest --maxWorkers=4           //that will run 4 tests in a row
```

#### Detecting flaky tests:
- to detect if tests having unstable results run next:

```
for i in {1..100}; 
do npx jest tests/sign_up.spec.js --silent || (echo "Failed after $i attempts" && break); 
echo "test #$i was executed" ; 
done; 
echo "All $i tests were executed"
```
- eliminate flakiness(if detected) by adding additional contitions (ex. wait for some element to be displayed, wait for particular request or number of requests)
- if it is not possible to overcome random fails with some conditions use [waitForNetworkIdle()](support/helpers/BasicHelper.js) method
- if nothing described above helps to avoid flakiness use explicit waiting for needed amount of time

#### Writing tests:
- describe TC in the google spredsheet. TC number should use *PRAXXXX-XX* pattern.
- give suite name and TC name
- if TC logically belongs to some previously described suite add it as inner test (ex. *PRA0005* is 'Create Order' suite. If you want to add new TC describing order functionality number should be *PRA0005-XX*)
- to create new test suite(test file) create branch from master. Branch name should contain TC number
- add suite name to the *describe()* block:
```
 describe('Create Order', ...
```
- add test name to the *test* block:
```
 test('Create new Order', ...
```
- before writing test explore [helpers](support/) directory, to understand how test logic is splitted according to application functionality. If needed methods are already created - re-use them.
- do not change helper methods if they are used in other tests and impact isn't tested

#### If tests doesn't run try to update nmp modules first:

```
$ npm i
```
and then rerun tests

#### Test results:
- test execution generates screenshots on every test fail in the [screenshots](reports/screenshots) directory
- test are configured to *retry n-times* to minimise random fails and test is reported as failed only in case if n'th retry fails (global retry times setting, can be overriden by *jest.retryTimes(n)* in the test suite)
- test results are displayed in the CLI after test execution
- if you want to have additional options after test(s) are executed run tests in *--watch* mode. It gives you abilities to retry ony failed tests, to run only changes tests, etc. Example:

```
$ npm test --watch
```

For more CLI run options please reffer to [jest documentation](https://jestjs.io/docs/en/cli.html)
