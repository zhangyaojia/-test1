/**
 * Created by zhangyaojia on 2016/12/3.
 */
var del=require('del');
var gulp=require('gulp');
var uglify=require('gulp-uglify');
var imagemin=require('gulp-imagemin');
var mincss=require('gulp-clean-css');//压缩css
var inline=require('gulp-inline-source'); //资源内联 （主要是js，css，图片）
var include=require('gulp-include'); //资源内联（主要是html片段）
var sequence=require('gulp-sequence');
var useref=require('gulp-useref'); //合并文件
var gulpif=require('gulp-if');
var print=require('gulp-print'); //打印命中的文件
var connect=require('gulp-connect'); //本地服务器

var gulp = require('gulp')
var sass = require('gulp-sass')
var swig = require('gulp-swig')
var cleanCss = require('gulp-clean-css')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync')


gulp.task("html",function(){
        return gulp.src("./src/*.html")
            .pipe(inlime())//将js内联到html中
            .pipe(include())//把html片段内联到html主文件中
            .pipe(useref())//根据标记的块，合并js或者css
            .pipe(gulpif("*.js",uglifg()))
            .pipe(gulpif("*.css",mincss()))
            .pipe(connect.reload())//重新构造后自动
            .pipe(gulp.dest("dist"));
    });

//本地服务器，支持自动
gulp.task("connect",function(){
        connect.server({
            root:"./dist";//本地服务器的项目录路
            port:8088;
            liverload:true
        });
    });
//sequence的函数只能运行一次，所以这里用function cb方式使用

gulp.task("watchlist",function(cb) {
    sequence("clean",["hint","minimg","minjs","html"])(cb)
});

gulp.task('sass', function() {
    gulp.src('src/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'iOS >= 7',
                'Android >= 2.0',
            ],
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('./dist'))
})

gulp.task('swig', function() {
    gulp.src('src/index.html')
        .pipe(swig({
            defaults: { cache: false }
        }))
        .pipe(gulp.dest('./dist'))
})

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
        files: ['dist/*.html', 'dist/*.css'],
    })
})

gulp.task('watch', function() {
    gulp.watch('src/**/*.html', ['swig'])
    gulp.watch('src/**/*.scss', ['sass'])
})

gulp.task('build', ['swig', 'sass'])
gulp.task('dev', ['build', 'watch', 'serve'])