const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({"src/css/rev": "css"});
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy('src/img');
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy('favicon.ico');
  eleventyConfig.addPassthroughCopy('disckeeper-service-worker-min.js');

  // add link shortcut to perfectly revisioned css file
  eleventyConfig.addNunjucksShortcode("cssLink", function() {
    const files = fs.readdirSync('dist/css');
    for (const file of files) {
      var cssFile = file;
    };
    return `<link rel="stylesheet" type="text/css" media='print' href="/css/${cssFile}" onload="this.media='screen' " >`;
  });

  // create the disckeeper-sw-data.json file for the service worker
  eleventyConfig.on('eleventy.after', async () => {

    // endpoints and initialization
    let foldersToInclude = [ 'css', 'fonts', 'js', 'img/sprites'];    // only html from root
    let filesToInclude = fs.readdirSync('dist').filter(function(file) {
      return path.extname(file) === '.html';
    });

    // go through each endpoint folder to extract each file with file-path to stuff into final array
    foldersToInclude.forEach((folder) => {
      let tempFile = fs.readdirSync('dist/' + folder);
      tempFile.forEach((file) => {
          filesToInclude.push('/' + folder + '/' + file);
      });
    });

    // cleaning up
    // get only the image in the header
    let headerImage = fs.readdirSync('dist/img').filter(function(file) {
      return file === 'disckeeper-logo.webp';
    });
    filesToInclude.push('/img/dk-icns/' + headerImage[0]);
    // not a file but a directory, so get rid of it
    const index = filesToInclude.indexOf("/fonts");
    if (index > -1) {
      filesToInclude.splice(index, 1);
    }
    // no need to cache this, so get rid of it
    // const indexOne = filesToInclude.indexOf('googleeea66bb2e7056d77.html');
    // if (index > -1) {
    //   filesToInclude.splice(indexOne, 1);
    // }

    // write file containing array of files with their path
    fs.writeFileSync(
      'dist/disckeeper-service-worker-data.json',
      JSON.stringify(filesToInclude)
    )
  });
  // initialize directories
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};