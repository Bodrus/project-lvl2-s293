import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const getParser = extName => parsers[extName];

const getData = (pathFile) => {
  const extName = path.extname(pathFile);
  const parser = getParser(extName);
  const data = fs.readFileSync(pathFile, 'utf-8');
  return parser(data);
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
