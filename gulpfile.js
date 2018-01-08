const gulp = require('gulp');
const babel = require('gulp-babel');


const sourceFile = "./src/**/*.js";
const dist = "./build/";

/**
 * Собирает js приложение в app.min.js
 */
gulp.task('build:js', function buildJS() {
    return gulp.src(sourceFile)
        .pipe(babel({
            presets: ['env','stage-0'],
            only: /src\/.*/,
            ignore: /.*\/node_modules\/.*/
        }))
        .on('error', handleBuildError)
        .pipe(gulp.dest(dist));
});

gulp.task("debug", gulp.series(["build:js"], function () {
    return require('./build/app.js');
}));

/**
 * Обработка ошибок
 */
function handleBuildError(error){
    console.log("Build failed");
    console.log(error.toString());
    this.emit("end");
}