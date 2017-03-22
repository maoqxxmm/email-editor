var gulp = require('gulp'),
    compass = require('gulp-compass'),
    autoprefixer = require('gulp-autoprefixer'),
    shell = require('gulp-shell'),
    del = require('del'),
    inlineCss = require('gulp-inline-css'),
    data = require('gulp-data'),
    handlebars = require('gulp-compile-handlebars'),
    path = require('path'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    argv = require('yargs').argv,
    gulpIgnore = require('gulp-ignore'),
    fs = require('fs'),
    notify = require('gulp-notify');


var dirs = {
    src: './src',
    data: './src/data',
    hbs: './src/partials',
    styles: './src/styles',
    images: './src/img',
    entry: './src/entry',
    dest: './dist',
    build: './build',
    parent: '../web/task/src/main/webapp/WEB-INF/views/mail'
}

var plumberErrorHandler = {
    errorHandler: notify.onError({
        message: "Error: <%= error.message %>"
    })
};

var commonData = require(dirs.data + '/common.json')

var styles = function() {
    return gulp.src([dirs.styles + '/**/*.scss'], {
            base: dirs.styles
        })
        .pipe(plumber(plumberErrorHandler))
        .pipe(compass({
            css: dirs.dest,
            sass: dirs.styles
        }))
        .pipe(autoprefixer('last 2 version', 'ie 8', 'ie 9', 'android 4'))
        .pipe(gulp.dest(dirs.dest));
}

var hbs = function(lang, watch) {
    var options = {
        // ignorePartials: false,
        // partials: {
        //     footer: '<footer>the end</footer>'
        // },
        batch: [dirs.hbs],
        // helpers: {
        //     capitals: function(str) {
        //         return str.toUpperCase();
        //     }
        // }
    }

    var outPipe = false

    if (!watch) {
        !fs.existsSync(dirs.build) && fs.mkdirSync(dirs.build)
    }

    return gulp.src([dirs.entry + '/*.hbs'])
        .pipe(plumber(plumberErrorHandler))
        .pipe(data(function(file) {
            var datas = require(dirs.data + '/' + path.basename(file.path, '.hbs') + '.json');
            var data = undefined
            if (datas[lang]) {
                outPipe = false
                data = Object.assign({}, commonData[lang], datas['common'], datas[lang])
                if (!watch) {
                    var filePath = dirs.build + '/' + path.basename(file.path, '.hbs').replace(/(body)$/, 'title') + (lang == 'zh' ? '_zh_CN' : '') + '.html'
                    var out = fs.createWriteStream(filePath);
                    out.on('open', function () {
                        out.write(data.title)
                        out.end()
                    })
                }
            } else {
                outPipe = true
            }
            return data
        }))
        .pipe(gulpIgnore.exclude(function () {
            return outPipe
        }))
        .pipe(handlebars(data, options))
        .pipe(inlineCss())
        .pipe(rename(function (path) {
          lang == 'zh' && (path.basename += '_zh_CN')
          path.extname = '.html'
        }))
        .pipe(gulp.dest(dirs.build));

}

gulp.task('clean', function() {
    del([dirs.dest, dirs.build], {
        force: true
    });
});

gulp.task('watch', function() {
    gulp.watch([dirs.src + '/**/*'], ['build --watch']);
});

gulp.task('hbs', function() {
    var lang = argv.lang || 'en'
    var watch = argv.watch
    hbs(lang, watch);
})

gulp.task('styles', function() {
    styles();
})

gulp.task('build', shell.task([
    'gulp clean',
    'gulp styles',
    'gulp hbs',
    'gulp hbs --lang zh'
]));

gulp.task('move', function () {
    gulp.src([dirs.build + '/*'])
        .pipe(gulp.dest(dirs.parent))
})