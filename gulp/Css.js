var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');

gulp.task('generateDistCss', function() {



    return  gulp.src(
        "./src/css/js-fixed-header.scss"
    )
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:"compressed"}))
        .pipe(rename({suffix: ".min"}))
        .pipe(sourcemaps.write("./", {includeContent: false, sourceRoot: "../scss"}))
        .pipe(gulp.dest("./dist"));



});
