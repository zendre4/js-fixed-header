var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

gulp.task('generateDistCss', function() {



    return  gulp.src(
        "./src/css/js-fixed-header.scss"
    )
    .pipe(sass({outputStyle:"compressed"}))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("./dist"));
});
