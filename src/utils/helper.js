import * as _ from 'lodash';

export function removeEmptyObjects(obj) {
  return _.omitBy(obj, (v) => _.isUndefined(v) || _.isNull(v) || v === '');
}
