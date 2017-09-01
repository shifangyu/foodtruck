var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('rev-image', function () {
    return gulp.src(['src/*.+(jpg|gif|png|bmp)'])
        .pipe(plugins.rev())
        .pipe(gulp.dest('./build'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('rev'));
});

gulp.task('rev-imagereplace', ['rev-image'], function () {
    return gulp.src(['rev/*.json'
            , 'src/index.css'
            , 'src/index.js'
        ])
        .pipe(plugins.revCollector())
        .pipe(gulp.dest('build'));
});

gulp.task('css', ['rev-imagereplace'], function () {
    return gulp.src(['build/*.css'])
        .pipe(plugins.minifyCss())
        .pipe(plugins.rev())
        .pipe(gulp.dest('build'))
        .pipe(plugins.rev.manifest({path: 'rev/rev-manifest.json', base: 'rev', merge: true}))
        .pipe(gulp.dest('rev'));
});

gulp.task('js', ['css'], function () {
    return gulp.src(['build/*.js'])
        .pipe(plugins.uglify())
        .pipe(plugins.rev())
        .pipe(gulp.dest('build'))
        .pipe(plugins.rev.manifest({path: 'rev/rev-manifest.json', base: 'rev', merge: true}))
        .pipe(gulp.dest('rev'));
});

gulp.task('replace', ['css', 'js'], function () {
    return gulp.src(['rev/*.json', 'src/*.html'])
        .pipe(plugins.revCollector({replaceReved: true}))
        .pipe(gulp.dest(''));
});

gulp.task('default', ['replace']);