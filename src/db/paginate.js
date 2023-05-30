module.exports = async (
  model,
  page_size,
  page_limit,
  search = {},
  order = [],
  transform
) => {
  const limit = parseInt(page_limit, 10) || 50;
  const page = parseInt(page_size, 10) || 1;

  // create an options object
  let options = {
    offset: getOffset(page, limit),
    limit: limit,
  };

  // check if the search object is empty
  if (Object.keys(search).length) {
    options = { options, ...search };
  }

  // check if the order array is empty
  if (order && order.length) {
    options["order"] = order;
  }

  // take in the model, take in the options
  let { count, rows } = await model.findAndCountAll(options);

  // check if the transform is a function and is not null
  if (transform && typeof transform === "function") {
    rows = transform(rows);
  }

  return {
    previous_page: getPreviousPage(page),
    current_page: page,
    next_page: getNextPage(page, limit, count),
    total: count,
    total_pages: count > limit ? Math.round(count / limit) : 1,
    limit: limit,
    data: rows,
  };
};

const getOffset = (page, limit) => {
  return page * limit - limit;
};

const getNextPage = (page, limit, total) => {
  if (total / limit > page) {
    return page + 1;
  }
  return null;
};

const getPreviousPage = (page) => {
  if (page <= 1) {
    return null;
  }
  return page - 1;
};
