/**
 * Mock exported functions because Node.js imports modules once and then cache it
 * For more details check the third solution (https://medium.com/@minaluke/how-to-stub-spy-a-default-exported-function-a2dc1b580a6b)
 *
 * *** IMPORTANT: modulePath/dependencyPath should be related from this file ***
 * @param { String } modulePath - the path of the module that will be executed
 * @param { Array } [conditions] - the array of conditions
 * @return { NodeRequire } the module with the stubs imported functions
 */
const mockExportedFunction = (modulePath, conditions = []) => {
  /*
   * @param { String } dependencyPath - the path of the imported module
   * @param { Object } stubs - functions that will be stub
   * @param { Boolean } isFunction - the flag that means this exported function should be exported like a function not an object
   */
  conditions.forEach(({ dependencyPath, stubs, isFunction }) => {
    const stubLibs = {};

    if (require.cache[require.resolve(modulePath)]) {
      delete require.cache[require.resolve(modulePath)];
    }

    Object.keys(stubs).forEach(functionName => {
      stubLibs[functionName] = stubs[functionName];
    });

    if (isFunction) {
      require.cache[require.resolve(dependencyPath)] = {
        exports: Object.values(stubLibs)[0],
      };
    } else {
      require.cache[require.resolve(dependencyPath)] = {
        exports: { ...stubLibs },
      };
    }
  });

  return require(modulePath);
};

const successResultDataMock = data => ({
  success: true,
  ...(data && { result: data }),
});

module.exports = {
  mockExportedFunction,
  successResultDataMock,
};
