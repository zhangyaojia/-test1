/**
 * Created by zhangyaojia on 2016/12/3.
 */
var del=require('del');
var gulp=require('gulp');
var uglify=require('gulp-uglify');
var imagemin=require('gulp-imagemin');
var mincss=require('gulp-clean-css');//ѹ��css
var inline=require('gulp-inline-source'); //��Դ���� ����Ҫ��js��css��ͼƬ��
var include=require('gulp-include'); //��Դ��������Ҫ��htmlƬ�Σ�
var sequence=require('gulp-sequence');
var useref=require('gulp-useref'); //�ϲ��ļ�
var gulpif=require('gulp-if');
var print=require('gulp-print'); //��ӡ���е��ļ�
var connect=require('gulp-connect'); //���ط�����

var gulp = require('gulp')
var sass = require('gulp-sass')
var swig = require('gulp-swig')
var cleanCss = require('gulp-clean-css')
var autoprefixer = require('gulp-autoprefixer')
var browserSync = require('browser-sync')


gulp.task("html",function(){
        return gulp.src("./src/*.html")
            .pipe(inlime())//��js������html��
            .pipe(include())//��htmlƬ��������html���ļ���
            .pipe(useref())//���ݱ�ǵĿ飬�ϲ�js����css
            .pipe(gulpif("*.js",uglifg()))
            .pipe(gulpif("*.css",mincss()))
            .pipe(connect.reload())//���¹�����Զ�
            .pipe(gulp.dest("dist"));
    });

//���ط�������֧���Զ�
gulp.task("connect",function(){
        connect.server({
            root:"./dist";//���ط���������Ŀ¼·
            port:8088;
            liverload:true
        });
    });
//sequence�ĺ���ֻ������һ�Σ�����������function cb��ʽʹ��

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