var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename=require('gulp-rename');

gulp.task('generateDistJs', function() {

    return gulp.src(
        "./src/js/js-fixed-header.js"
    ).pipe(uglify({preserveComments:"license"}))
        .pipe(rename({suffix: ".min"}))
     .pipe(gulp.dest("./dist"));
});
