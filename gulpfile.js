/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

var SRC_FILE = 'stackdriver-errors.js';
var DEST = 'dist/';

var dependencies = [
    './node_modules/stacktrace-js/dist/stacktrace-with-promises-and-json-polyfills.js',
];

gulp.task('lint', function() {
  return gulp.src(SRC_FILE)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
    return gulp
    .src('test/test.html')
    .pipe(mochaPhantomJS({reporter: 'spec'}));
});

gulp.task('dist', function() {
  return gulp.src(dependencies.concat(SRC_FILE))
    .pipe(sourcemaps.init())
    .pipe(concat(SRC_FILE.replace('.js', '-concat.js')))
    // This will output the non-minified version
    .pipe(gulp.dest(DEST))
    // This will minify and rename to stackdriver-errors.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(DEST));
});

gulp.task('min-demo', function() {
  return gulp.src('demo/demo.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('demo'));
});

gulp.task('default', ['lint', 'test']);
