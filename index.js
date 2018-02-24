// const fs = require('fs');
const AWS = require('aws-sdk');
const chalk = require('chalk');

const credentials = new AWS.SharedIniFileCredentials({ profile: 'yoav-2' });
AWS.config.credentials = credentials;
const iam = new AWS.IAM();

const { lowerFirst } = require('./lib/util');

const IAMAPI = require('./lib/iam.json');
const defaultArgs = require('./lib/defaults.json');


const { operations } = IAMAPI;
const actions = Object.keys(operations);
// console.log('Total IAM Actions: ', actions.length);

const reqMembers = [];
const args0 = [];
const args1 = [];
const args2 = [];
const args3 = [];
const args4 = [];
const miscargs = [];

const listActions = [];
const getActions = [];
const writeActions = [];
const miscActions = [];
const ucActions = [];

const pithreListActions = {
  args0: [],
  args1: [],
  args2: [],
  args3: [],
  args4: [],
  miscargs: [],
};

const pithreGetActions = {
  args0: [],
  args1: [],
  args2: [],
  args3: [],
  args4: [],
  miscargs: [],
};

const pithreWriteActions = {
  args0: [],
  args1: [],
  args2: [],
  args3: [],
  args4: [],
  miscargs: [],
};

const pithreMiscActions = {
  args0: [],
  args1: [],
  args2: [],
  args3: [],
  args4: [],
  miscargs: [],
};

const pithreUcActions = {
  args0: [],
  args1: [],
  args2: [],
  args3: [],
  args4: [],
  miscargs: [],
};

const addtoLevel = (level, method) => {
  switch (level) {
    case 1:
      args1.push(method);
      break;
    case 2:
      args2.push(method);
      break;
    case 3:
      args3.push(method);
      break;
    case 4:
      args4.push(method);
      break;
    default:
      miscargs.push(method);
  }
  return true;
};

const levelizeActions = (obj, method, args = []) => {
  const level = args.length || 0;
  // console.log(method, args)
  switch (level) {
    case 0:
      obj.args0.push(method);
      break;
    case 1:
      obj.args1.push(method);
      break;
    case 2:
      obj.args2.push(method);
      break;
    case 3:
      obj.args3.push(method);
      break;
    case 4:
      obj.args4.push(method);
      break;
    default:
      // console.log("Method", method, "Level:", level)
      obj.miscargs.push(method);
  }
  return true;
};

const categorizeActions = (e, type = 'NA', args = []) => {
  switch (type) {
    case 'list':
      levelizeActions(pithreListActions, e, args);
      listActions.push(e);
      break;
    case 'get':
      levelizeActions(pithreGetActions, e, args);
      getActions.push(e);
      break;
    case 'write':
      levelizeActions(pithreWriteActions, e, args);
      writeActions.push(e);
      break;
    case 'misc':
      levelizeActions(pithreMiscActions, e, args);
      miscActions.push(e);
      break;
    default:
      // console.log("DEFAULT TYPE", e);
      levelizeActions(pithreUcActions, e, args);
  }
};

actions.forEach((e) => {
  const { input, type } = operations[e];
  const required = input ? input.required : false;
  categorizeActions(e, type, required);
  if (!required) {
    args0.push(e);
  } else {
    const args = required.length;
    reqMembers.push(...required);
    addtoLevel(args, e);
  }
});

// const s = [...new Set(reqMembers)];

const pithreIAM = {
  args0,
  args1,
  args2,
  args3,
  args4,
  miscargs,
  getActions,
};

const pithreActions = [
  pithreListActions,
  pithreGetActions,
  pithreWriteActions,
  pithreMiscActions,
];

const pithreGetActionsArr =
Object.keys(pithreGetActions).map(e => pithreGetActions[e].length);
const pithreListActionsArr =
Object.keys(pithreListActions).map(e => pithreListActions[e].length);
const pithreWriteActionsArr =
Object.keys(pithreWriteActions).map(e => pithreWriteActions[e].length);
const pithreMiscActionsArr =
Object.keys(pithreMiscActions).map(e => pithreMiscActions[e].length);
const pithreUcActionsArr =
Object.keys(pithreUcActions).map(e => pithreUcActions[e].length);
// const pithreGetActionsArr = Object.keys(pithreGetActions).map((e)=>pithreGetActions[e].length);

console.log('Total IAM Actions', actions.length, 'categorized into ', [args0.length, args1.length, args2.length, args3.length, args4.length,
  miscargs.length]);
console.log('IAM Get actions', getActions.length, 'levelized into ', pithreGetActionsArr);
console.log('IAM List actions', listActions.length, 'levelized into ', pithreListActionsArr);
console.log('IAM Write actions', writeActions.length, 'levelized into ', pithreWriteActionsArr);
console.log('IAM Misc actions', miscActions.length, 'levelized into ', pithreMiscActionsArr);
console.log('IAM UC actions', ucActions.length, 'levelized into ', pithreUcActionsArr);
// console.log('Pithre Get Actions', pithreGetActionsArr);

// console.log(pithreIAM);
// fs.writeFile('lib/defaults.json', JSON.stringify(s), (error) => {
//   if (error) {
//     console.log('Error while writing to a file');
//   }
// });
const makeRequest = (method, params, dryrun = true) => {
  const action = lowerFirst(method);
  const pParams = {};
  if (Array.isArray(params)) {
    params.forEach((p) => {
      pParams[p] = defaultArgs[p];
    });
  }
  // console.log(action, pParams);

  if (!dryrun) {
    iam[action](pParams, (err) => {
      if (err) {
        console.log('=====');
        console.log('ERR: ', method);
        console.log(err.code);
        console.log(err.message);
      } else {
        console.log(chalk.green(action));
        // fs.writeFile(`bk/${e}.json`, JSON.stringify(data), (error) => {
        //   if (error) {
        //     console.log('Error while writing to a file');
        //   }
        // });
      }
    });
  }
};
console.log('==========================================================');
// Object.keys(pithreIAM)
// // getActions
// .forEach((e) => {
//   const args = pithreIAM[e];
//   console.log(e);
//   console.log(chalk.yellow('Running actions with', e," = ", args.length));
//   // console.log(args);
//   console.log('==========================================================');
//   args.forEach((method) => {
//     const params = (operations[method] && operations[method].input && operations[method].input.required) ? operations[method].input.required : {};
//     // makeRequest(method, params, false);
//   });
// });


module.exports = pithreIAM;
