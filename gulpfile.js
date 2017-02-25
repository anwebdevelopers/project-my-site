var basePaths = {
        src: "build/",
        dest: "html/"
    },
    paths = {
        images: {
            src: basePaths.src + "img/",
            dest: basePaths.dest + "img/"
        },
        sprite: {
            src: basePaths.src + "sprite/*",
            svg: "img/sprite.svg",
            css: "../" + basePaths.src + "scss/components/_sprite.scss"
        },
        templates: {
            src: basePaths.src + "scss/tpl/"
        }
    },
    $ = {
        gutil: require("gulp-util"),
        svgSprite: require("gulp-svg-sprite"),
        svg2png: require("gulp-svg2png"),
        size: require("gulp-size")
    },
    changeEvent = function(evt) {
        $.gutil.log("File", $.gutil.colors.cyan(evt.path.replace(new RegExp("/.*(?=/" + basePaths.src + ")/"), "")), "was", $.gutil.colors.magenta(evt.type))
    },
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCSS = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    browserSync = require("browser-sync").create(),
    csscomb = require("gulp-csscomb"),
    path = require("path"),
    concat = require("gulp-concat"),
    imageop = require("gulp-image-optimization"),
    uglify = require("gulp-uglify");

gulp.task('browser-sync', ['styles', 'scripts'], function() {
		browserSync.init({
				server: {
						baseDir: "./html"
				},
				notify: false
		});
});

gulp.task('styles', function () {
	return gulp.src('build/scss/*.scss')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(cleanCSS())
	.pipe(gulp.dest('html/css'))
	.pipe(browserSync.stream());
});

gulp.task('scripts', function() {
	return gulp.src([
		//'./html/libs/modernizr/modernizr.js',
		'./html/libs/jquery/jquery-3.1.1.min.js',
		//'./html/libs/waypoints/waypoints.min.js',
		//'./html/libs/animate/animate-css.js',
		'./html/libs/plugins-scroll/plugins-scroll.js',
		//'./html/libs/bootstrap/js/bootstrap.min.js',
		'./html/libs/owl.carousel/dist/owl.carousel.min.js',
		'./html/libs/jquery-easing/jquery.easing.min.js',
		//'./html/libs/easy-pie-charts/jquery.easypiechart.min.js',
		'./html/libs/mixitup/jquery.mixitup.min.js',
		//'./html/libs/popup/jquery.popup.min.js',
		//'./html/libs/gMap/jquery.gmap.min.js',
		//'./html/libs/jquery.viewport-master/jquery.viewport.min.js',
		//'./html/libs/jquery-scrollspy-master/scrollspy.js',
		//'./html/libs/page-scroll-to-id/jquery.malihu.PageScroll2id.js',
		//'./html/libs/velocity/velocity.min.js',
		//'./html/libs/velocity/velocity.ui.min.js',
		// './html/libs/superfish/dist/js/superfish.min.js',
		// './html/libs/jQuery.mmenu/dist/js/jquery.mmenu.all.min.js',
		'./html/libs/jquery-equalheight/jquery.equalheight.min.js',
		'./html/libs/jquery-validation/jquery.validate.min.js',
		'./html/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
		])
	.pipe(concat('libs.js'))
	.pipe(uglify()) //Minify libs.js
	.pipe(gulp.dest('./html/js/'));
});

gulp.task('full', function () {
	return gulp.src('build/scss/*.scss')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	.pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
	.pipe(csscomb())
	.pipe(gulp.dest('html/css'))
});

gulp.task('watch', function () {
	gulp.watch('build/scss/**/*.scss', ['styles']);
	gulp.watch('html/libs/**/*.js', ['scripts']);
	gulp.watch('html/js/*.js').on("change", browserSync.reload);
	gulp.watch('html/*.html').on('change', browserSync.reload);

});

gulp.task('images', function(cb) {
    gulp.src(['build/img/*.png','build/img/*.jpg','build/img/*.gif','build/img/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('html/img')).on('end', cb).on('error', cb);
});

gulp.task('svgSprite', function () {
	return gulp.src(paths.sprite.src)
		.pipe($.svgSprite({
			shape: {
				spacing: {
					padding: 5
				}
			},
			mode: {
				css: {
					dest: "./",
					layout: "diagonal",
					sprite: paths.sprite.svg,
					bust: false,
					render: {
						scss: {
							dest: "../build/scss/components/_sprite.scss",
							template: "build/scss/tpl/sprite-template.scss"
						}
					}
				}
			},
			variables: {
				mapname: "icons"
			}
		}))
		.pipe(gulp.dest(basePaths.dest));
});

gulp.task('pngSprite', ['svgSprite'], function() {
	return gulp.src(basePaths.dest + paths.sprite.svg)
		.pipe($.svg2png())
		.pipe($.size({
			showFiles: true
		}))
		.pipe(gulp.dest(paths.images.dest));
});

gulp.task('sprite', ['pngSprite']);

gulp.task('default', ['browser-sync', 'watch']);
