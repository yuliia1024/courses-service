const { isArray } = require('lodash');
const { createCustomError } = require('../index');
const { DEFAULT_ERROR_MESSAGE } = require('../../constants');

const createPaginateOptions = (offset, pageLimit, order = []) => {
  try {
    const offsetValue = parseInt(offset, 10) || 0;
    const limit = parseInt(pageLimit, 10) || 10;

    const options = {
      offset: offsetValue,
      limit,
    };

    // check if the order array is not empty
    if (isArray(order) && order.length) {
      options.order = order;
    }

    return options;
  } catch (err) {
    throw createCustomError(err, DEFAULT_ERROR_MESSAGE);
  }
};

const createDataObjectWithPaginationInfo = (offset, pageLimit, totalRecordsCount, data) => {
  const offsetValue = parseInt(offset, 10) || 0;
  const limit = parseInt(pageLimit, 10) || 10;

  return {
    offset: offsetValue,
    limit,
    totalRecords: totalRecordsCount,
    records: data,
  };
};

module.exports = {
  createPaginateOptions,
  createDataObjectWithPaginationInfo,
};
