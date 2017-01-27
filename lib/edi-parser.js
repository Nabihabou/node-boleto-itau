module.exports = function (banks) {
  return {
    parse: function (bankName, fileContent) {
      return banks[bankName].parseEDIFile(fileContent)
    }
  }
}
