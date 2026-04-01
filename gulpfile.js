const{ src, dest, series, watch} =  require('gulp'),
cssLinter = require('gulp-stylelint'),
{deleteAsync} = require('del'),
babel = require('gulp-babel')
htmlCompressor = require('gulp-htmlmin'),
jsCompressor = require('gulp-uglify'),
jsLinter = require('gulp-eslint'),
sass = require('gulp-sass')(require('sass')),
browserSync = require('browser-sync'),
reload = browserSync.reload;


let compressHTML = () => {
    return src(['*.html'])
        .pipe(htmlCompressor({ collapseWhitespace: true }))
        .pipe(dest('prod'));
};

let compileCSSForDev = () => {
    return src('styles/main.css')
        .pipe(sass.sync({ style: 'expanded', precision: 10 }).on('error', sass.logError))
        .pipe(dest('temp/styles'));
};

let compileCSSForProd = () => {
    return src('styles/main.css')
        .pipe(sass.sync({ style: 'compressed', precision: 10 }).on('error', sass.logError))
        .pipe(dest('prod/styles'));
};

let lintCSS = () => {
    return src('styles/*.css')
        .pipe(cssLinter({
            failAfterError: false,
            reporters: [{ formatter: 'string', console: true }]
        }));
};

let lintJS = () => {
    return src('js/*.js','*.js')
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach('compact'));
};

let transpileJSForDev = () => {
    return src('js/*.js')
        .pipe(babel())
        .pipe(dest('temp/scripts'));
};

let transpileJSForProd = () => {
    return src('js/*.js')
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest('prod/scripts'));
};

let copyUnprocessedAssetsForProd = () => {
    return src([
        '*.*',
        '**',
        '!*.html',
        '!**/*.js',
        '!styles/**',
        '!img/',
        '!img/.gitignore',

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

    watch('js/*.js', series(lintJS, transpileJSForDev)).on('change', reload);
    watch('styles/*.css', compileCSSForDev).on('change', reload);
    watch('*.html', compressHTML).on('change', reload);
    watch('img/*').on('change', reload);
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
