const { lowerFirst } = require('./lib/util');

// Taken from aws-sdk/apis/iam-2010-05-08.min.json @^2.199.0
const IAMAPI = require('./lib/iam.json');

const { operations } = IAMAPI;
const actions = Object.keys(operations);

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

const levelizeActions = (obj, umethod, args = []) => {
  const level = args.length || 0;
  const method = lowerFirst(umethod);
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
      levelizeActions(pithreUcActions, e, args);
      ucActions.push(e);
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

const pithreIAM = {
  list: pithreListActions,
  get: pithreGetActions,
  write: pithreWriteActions,
  misc: pithreMiscActions,
};

module.exports = pithreIAM;
