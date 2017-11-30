
module.exports = function (gulp, plugins, paths) {
  return function() {
   /*gulp.src('./dist/templates/*.html')
    .pipe(plugins.inject(gulp.src('./dist/assets/imgs/svgs/circle.svg'), {
      starttag: '<!-- inject:circle -->',
      transform: function (filePath, file) {
        // return file contents as string 
        return file.contents.toString('utf8');
      }
    })).pipe(gulp.dest('./dist/templates/test'));*/
    console.log("End of svgstore task");
  };
};

