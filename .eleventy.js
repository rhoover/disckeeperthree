const fs = require('fs');

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({"src/css/rev": "css"});
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy('favicon.ico');

  // add link shortcut to perfectly revisioned css file
  eleventyConfig.addNunjucksShortcode("cssLink", function() {
    const files = fs.readdirSync('dist/css');
    for (const file of files) {
      var cssFile = file;
    };
    return `<link rel="stylesheet" type="text/css" media='print' href="/css/${cssFile}" onload="this.media='screen' " >`;
  });

  // initialize directories
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};