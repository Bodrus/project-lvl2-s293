import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';


// const getYamlFile = (pathFile) => {
//   const data = yaml.safeLoad(fs.readFileSync(pathFile, 'utf8'));
//   return data;
// };

// const getJsonFile = (pathFile) => {
//   const data = fs.readFileSync(pathFile, 'utf-8');
//   return JSON.parse(`${data}`);
// };

// const getIniFile = (pathFile) => {
//   const data = ini.parse(fs.readFileSync(pathFile, 'utf-8'));
//   return data;
// };


const parsers = {
  '.json': (pathFile) => {
    const data = fs.readFileSync(pathFile, 'utf-8');
    return JSON.parse(`${data}`);
  },

  '.yml': (pathFile) => {
    const data = yaml.safeLoad(fs.readFileSync(pathFile, 'utf8'));
    return data;
  },

  '.ini': (pathFile) => {
    const data = ini.parse(fs.readFileSync(pathFile, 'utf-8'));
    return data;
  },
};

const getParser = extName => parsers[extName];


const getData = (pathFile) => {
  const extName = path.extname(pathFile);
  const parser = getParser(extName);
  const data = parser(pathFile);
  return data;
};


const getKeysFromObjects = (after, before) => _.union(_.keys(after), _.keys(before));


const getConvertTostring = (before, after) => {
  const keys = getKeysFromObjects(after, before);

  const newString = keys.reduce((acc, key) => {
    if (_.has(after, key) && !_.has(before, key)) {
      return [...acc, `+ ${key}: ${after[key]}`];
    } if (_.has(after, key)) {
      if (before[key] === after[key]) {
        return [...acc, ` ${key}: ${after[key]}`];
      }
      const beforeStr = `- ${key}: ${before[key]}`;
      const afterStr = `+ ${key}: ${after[key]}`;
      return [...acc, `${beforeStr}`, `${afterStr}`];
    }
    return [...acc, `- ${key}: ${before[key]}`];
  }, []);

  return newString.join('\n');
};


export default (a, b) => {
  const result = getConvertTostring(getData(a), getData(b));
  return result;
};
