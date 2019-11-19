const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const imagemin = require('gulp-imagemin');
// const path = require('path');
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev'); //对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');//路径替换
const gulpif = require('gulp-if'); 
// const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const connect = require("gulp-connect");

// const sourcemaps = require('gulp-sourcemaps');

const srcPath = './src/**';
const distPath = './dist/';
const revPath = './rev/';
const htmlFiles = [`${revPath}**/*.json`, `${srcPath}/*.html`];

const scssFiles = [
  `${srcPath}/*.scss`
];
const jsFiles = [`${srcPath}/*.js`];
const imgFiles = [
  `${srcPath}/images/*.{png,jpg,gif,ico}`,
  `${srcPath}/images/**/*.{png,jpg,gif,ico}`
];

/* 清除dist目录 */
gulp.task('clean', done => {
  del.sync([`${distPath}**/*`, `${revPath}**/*`]);
  done();
});

/* 编译html文件 */
const html = (env) => {
	return () => {
		const options = {
		removeComments: true,//清除HTML注释
		collapseWhitespace: true,//压缩HTML
		collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
		// removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
		// removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
		// removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
		minifyJS: true,//压缩页面JS
		minifyCSS: true//压缩页面CSS
	};
  return gulp
    .src(htmlFiles, { since: gulp.lastRun(html) })
		.pipe(gulpif(env === 'build', revCollector({replaceReved:true})))
		.pipe(htmlmin(options))
    .pipe(gulp.dest(distPath));
	};
};
gulp.task('devHtml', html('development'));
gulp.task('html', html('build'));

/* 编译JS文件 */
const js = (env) => {
	return () => {
		return gulp
    .src(jsFiles, { since: gulp.lastRun(js) })
    // .pipe(eslint())
		// .pipe(eslint.format())
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulpif(env === 'build', rev()))
    .pipe(gulp.dest(distPath))
		.pipe(gulpif(env === 'build', rev.manifest()))
		.pipe(gulpif(env === 'build', gulp.dest(`${revPath}js`)));
	};
};
gulp.task('devJs', js('development'));
gulp.task('js', js('build'));

/* 编译scss文件 */
const css = (env) => {
	return () => {
		return gulp
    .src(scssFiles)
		.pipe(sass())
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minifyCSS())
		.pipe(gulpif(env === 'build', rev()))
    .pipe(gulp.dest(distPath))
		.pipe(gulpif(env === 'build', rev.manifest()))
		.pipe(gulpif(env === 'build', gulp.dest(`${revPath}css`)));
	};
};
gulp.task('devCss', css('development'));
gulp.task('css', css('build'));

/* 编译压缩图片 */
const img = (env) => {
	return () => {
		return gulp
    .src(imgFiles, { since: gulp.lastRun(img)})
    .pipe(imagemin(
			{
				optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
				progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
				interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
				multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
			}
		))
		.pipe(gulpif(env === 'build', rev()))
    .pipe(gulp.dest(distPath))
		.pipe(gulpif(env === 'build', rev.manifest()))
		.pipe(gulpif(env === 'build', gulp.dest(`${revPath}/img`)));
	};
};
gulp.task('devImg', img('development'));
gulp.task('img', img('build'));
const reload = () => {
	gulp.src(`${distPath}**/*.html`)
		.pipe(connect.reload());
};
gulp.task(reload);

/* 启动本地服务 */
const server = () => {
	connect.server({
		root: `${distPath}`,
		livereload: true,
		port: 8080
	});
};
gulp.task(server);


/* watch */
gulp.task('watch', () => {
	let watchScssFiles = [...scssFiles];
  watchScssFiles.pop();
  gulp.watch(imgFiles, img('development'));
  gulp.watch(watchScssFiles, css('development'));
  gulp.watch(jsFiles, js('development'));
  gulp.watch(htmlFiles, html('development'));
	gulp.watch(`${distPath}**/*.*`, reload);
});


/* build */
gulp.task(
  'build',
  gulp.series('clean', 'img', 'css', 'js', 'html')
);

/* dev */
gulp.task('dev', gulp.series('clean', gulp.parallel('devImg', 'devCss', 'devJs', 'devHtml'), 'watch'));


