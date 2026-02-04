exports.log = (...args)=>{
  console.log(
    new Date().toISOString(),
    ...args
  );
};

exports.error = (...args)=>{
  console.error(
    new Date().toISOString(),
    ...args
  );
};
