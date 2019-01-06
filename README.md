# Adikteev test

## Purpose

Compute local information within a rolling time
window of length TAU, such as the number of points in the
window, the  minimum or maximum, or the rolling sum

*   Time: number of seconds since epoch
*   Value: price in EUROS
*   N_O: number of observation of in the current sliding time window
*   Roll_Sum: the current rolling sum,
*   Min_Value: the minimum in the current window,
*   Max_Value: the maximum in the current window.

## Installation

It needs NodeJs to run this application.
It has been tested with nodesJS version 8.9.3 and 9.11.2.

To require all needed dependencies, run the following code in  the project folder.

    npm install


## Run the application

You can now run the application with the following command:

    node index.js <file>

where `file` is a path to a file containing 2 columns separted by white spaces. First column is a timestamp (in s) and the second the value (in €).

It is possible to change the TAU value with `-t`

    node index.js -t 120 <file>


## Architecture

`index.js` read arguments nd the read the given file. It reads the file line by line in order to support large file nd avoid consumming too much memory.

`modules/Rolling.js` is to handle the rolling window. It keeps track of data arriving and clear old data (to keep memory consumption low and avoid extra computing for the next entry).
It does not redo the whole computing if the new data does not remove any old data (so some loop computation are saved).

**Warning**: It assumes that data are received sorted (from older to newer).


## Tests

Some tests are available in the `test` folder.

You can run test with the following command:

    npm test


## Author

Benoît Mariat
(b.mariat@gmail.com)
