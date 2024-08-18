const Parser = require('./Parser');
const Algorithm = require('./Algorithm');

function main(args) {

    // parse instance from first input file
    const parser = new Parser();
    const instance = parser.parseInstance(args[0]);

    // create Algorithm object, supplying instance
    const algorithm = new Algorithm(instance);
    let matchingValid;

    if (args.length > 1) { // matching given
        matchingValid = parser.parseMatching(args[1]); // parse matching from second input file

    } else {
        algorithm.run(); // run RGS algorithm
        matchingValid = algorithm.checkMatching(); // check constructed matching for validity
    }

    if (matchingValid) {
        algorithm.printMatching(); // print matching to console
        algorithm.checkStability(); // check matching for stability
    } else {
        console.log('The matching is invalid!')
    }

}

main(process.argv.slice(2));