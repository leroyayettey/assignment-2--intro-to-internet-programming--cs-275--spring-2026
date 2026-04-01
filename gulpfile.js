const{ src, dest, series, watch} =  require('gulp'),
cssLinter = require('gulp-stylelintrc'),
{deleteAsync} = require('del'),
babel = requre('gulp-babel')
htmlCompressor = require('gulp-htmlmin'),
jsCompressor = require('gulp-uglify'),
jsLinter = require('gulp-eslint'),
sass = require('gulp-sass')(require('sass')),
browserSync = require('browser-sync'),
reload = browserSync.reload;


let compressHTML = () => {
    return src(['assignment-2--intro-to-internet-programming--cs-275--spring-2026/*.html'])
        .pipe(htmlCompressor({ collapseWhitespace: true }))
        .pipe(dest('prod'));
};

let compileCSSForDev = () => {
    return src('assignment-2--intro-to-internet-programming--cs-275--spring-2026/styles/main.css')
        .pipe(sass.sync({ style: 'expanded', precision: 10 }).on('error', sass.logError))
        .pipe(dest('temp/styles'));
};

let compileCSSForProd = () => {
    return src('assignment-2--intro-to-internet-programming--cs-275--spring-2026/styles/main.css')
        .pipe(sass.sync({ style: 'compressed', precision: 10 }).on('error', sass.logError))
        .pipe(dest('prod/styles'));
};

let lintCSS = () => {
    return src('assignment-2--intro-to-internet-programming--cs-275--spring-2026/styles/*.css')
        .pipe(cssLinter({
            failAfterError: false,
            reporters: [{ formatter: 'string', console: true }]
        }));
};

let lintJS = () => {
    return src('assignment-2--intro-to-internet-programming--cs-275--spring-2026/js/*.js','assignment-2--intro-to-internet-programming--cs-275--spring-2026/*.js')
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach('compact'));
};

let transpileJSForDev = () => {
    return src('assignment-2--intro-to-internet-programming--cs-275--spring-2026/js/*.js')
        .pipe(babel())
        .pipe(dest('temp/scripts'));
};

let transpileJSForProd = () => {
    return src('assignment-2--intro-to-internet-programming--cs-275--spring-2026/js/*.js')
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest('prod/scripts'));
};

let copyUnprocessedAssetsForProd = () => {
    return src([
        'assignment-2--intro-to-internet-programming--cs-275--spring-2026/*.*',
        'assignment-2--intro-to-internet-programming--cs-275--spring-2026/**',
        '!assignment-2--intro-to-internet-programming--cs-275--spring-2026/*.html',
        '!assignment-2--intro-to-internet-programming--cs-275--spring-2026/**/*.js',
        '!assignment-2--intro-to-internet-programming--cs-275--spring-2026/styles/**',
        '!assignment-2--intro-to-internet-programming--cs-275--spring-2026/img/',
        '!assignment-2--intro-to-internet-programming--cs-275--spring-2026/img/.gitignore',

    ], { dot: true })
    .pipe(dest('prod'));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        server: {
            baseDir: ['temp', 'assignment-2--intro-to-internet-programming--cs-275--spring-2026']
        }
    });

    watch('assignment-2--intro-to-internet-programming--cs-275--spring-2026/js/*.js', series(lintJS, transpileJSForDev)).on('change', reload);
    watch('assignment-2--intro-to-internet-programming--cs-275--spring-2026/styles/*.css', compileCSSForDev).on('change', reload);
    watch('assignment-2--intro-to-internet-programming--cs-275--spring-2026/*.html', compressHTML).on('change', reload);
    watch('assignment-2--intro-to-internet-programming--cs-275--spring-2026/img/*').on('change', reload);
};

async function clean() {
    const foldersToDelete = await deleteAsync(['./temp', 'prod']);
    console.log('Deleted directories:', foldersToDelete);
}

async function listTasks() {
    const exec = require('child_process').exec;
    exec('gulp --tasks', function (error, stdout) {
        if (error) {
            console.log('Error listing tasks:', error);
        } else {
            console.log(`Available tasks:\n\n${stdout}`);
        }
    });
}

exports.compileCSSForDev = compileCSSForDev;
exports.lintCSS = lintCSS;
exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compressHTML = compressHTML;
exports.transpileJSForProd = transpileJSForProd;
exports.copyUnprocessedAssetsForProd = copyUnprocessedAssetsForProd;
exports.clean = clean;
exports.default = listTasks;
exports.serve = series(
    compileCSSForDev,
    lintJS,
    transpileJSForDev,
    serve
);
exports.build = series(
    compressHTML,
    compileCSSForProd,
    transpileJSForProd,
    copyUnprocessedAssetsForProd
);
