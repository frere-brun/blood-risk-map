'use strict';

  var gulp          = require('gulp');
  var watch         = require('gulp-watch');
  var plugins       = require('gulp-load-plugins')();

  console.log(plugins);

  var rootDir = {
    dev : "./src",
    dist : "./dist"
  }

  var paths = {

      clean: {
        files: rootDir + ''
      },
      server : {
        port: '5000',
        url: 'http://localhost',
        file: './server/server.js'
      },
      fonts: {
        files: rootDir.dev + '/assets/fonts/**/*',
        dest: rootDir.dist + '/assets/fonts/',
        watch: [rootDir.dev + '/assets/fonts/**/*']
      },
      vendor: {
        name: 'vendor.min.js',
        dest: rootDir.dist + '/vendor/',
        watch: './bower_components/*'
      },
      templates: {
          files: rootDir.dev + '/**/*.jade',
          dest: rootDir.dist + '/',
          watch: rootDir.dev + '/**/*.jade'
      },
      ressources: {
        files: rootDir.dev + '/ressources/**/*.{json,geojson}',
        dest: rootDir.dist + '/ressources/',
        watch: rootDir.dev + '/ressources/**/*.json'
      },
      styles: {
          files:  rootDir.dev + '/styles/*.scss',
          dest: rootDir.dist + '/styles/',
          watch: rootDir.dev + '/styles/**/*.scss'
      },
      scripts: {
          files: rootDir.dev + '/scripts/app.js',
          dest: rootDir.dist + '/scripts/',
          name: 'app.min.js',
          watch: rootDir.dev + '/scripts/*.js'
      },
      assets : {
        files: [rootDir.dev + '/assets/imgs/**/*{png,svg,jpg}'],
        dest: rootDir.dist + '/assets/imgs/',
        watch: rootDir.dev + '/assets/imgs/**/*',
        clean: rootDir.dist + '/assets/imgs/**/*'
      }
  }

  function getTask(task) {
      return require('./gulp-tasks/' + task)(gulp, plugins, paths);
  }

  gulp.task('clean', getTask('clean'));
  gulp.task('nodemon', getTask('nodemon'));
  gulp.task('style', getTask('style'));
  gulp.task('assets', getTask('assets'));
  gulp.task('jade', getTask('jade'));
  gulp.task('scripts', getTask('scripts'));
  gulp.task('vendor', getTask('vendor'));
  gulp.task('watch', getTask('watch'));
  gulp.task('ressources', getTask('ressources'));
  gulp.task('svgstore', getTask('svgstore'));

  gulp.task('build-prod', function(cb) {
    plugins.runSequence('clean', 'jade', 'svgstore', 'style', 'assets', 'vendor', 'scripts', 'ressources');
  });

  gulp.task('build-html', function(cb) {
    plugins.runSequence('clean', 'jade', 'svgstore');
  });

  gulp.task('default', ['watch', 'nodemon']);
  gulp.task('production', ['build-prod']);
