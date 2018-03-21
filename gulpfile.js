const gulp = require('gulp')
const filter = require('gulp-filter')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const shell = require('gulp-shell')
const runSequence = require('run-sequence')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
// const fancyLog = require('fancy-log')
const del = require('del')

const paths = {
  'manifest': './src/manifest.json',
  'src': './src',
  'js': './src/**/*.js',
  'css': './src/css/*.css',
  'sass': './src/sass/*.+(sass|scss)',
  'html': './src/html/*.html',
  'image': './src/image/*.+(png|jpg|jpag|svg|ico)',
  'contents': './dist/contents',
  'package': './scripts/package.sh'
}

const manifest = require(paths.manifest)
manifest.desktop = manifest.desktop || {}
manifest.desktop.js = manifest.desktop.js || []
manifest.desktop.css = manifest.desktop.css || []
manifest.mobile = manifest.mobile || {}
manifest.mobile.js = manifest.mobile.js || []
manifest.config = manifest.config || {}
manifest.config.js = manifest.config.js || []
manifest.config.css = manifest.config.css || []

// clean
gulp.task('clean', () => {
  del([paths.contents])
})

// manifest
gulp.task('manifest', () => {
  return gulp.src([paths.manifest])
    .pipe(gulp.dest(paths.contents))
})

// clean:js
gulp.task('clean:js', () => {
  del([paths.contents + '/js/**/*'])
})

// js
gulp.task('js', () => {
  return gulp.src([paths.js])
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.contents))
})

// clean:css
gulp.task('clean:css', () => {
  del([paths.contents + '/css/**/*'])
})

// sass
gulp.task('sass', () => {
  const cssFiles = manifest.desktop.css
    .concat(manifest.config.css)
    .filter(file => {
      return !file.match(/^https?/)
    })
  const sassFiles = cssFiles
    .map(file => {
      return '**/' + file.replace(/^css\/(.+)\.css$/, 'sass/$1.scss')
    })

  return gulp.src([paths.sass])
    .pipe(filter(sassFiles, {restore: true}))
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(sass())
    .pipe(gulp.dest(paths.contents + '/css'))
})

// css
gulp.task('css', () => {
  const cssFiles = manifest.desktop.css
    .concat(manifest.config.css)
    .filter(file => {
      return !file.match(/^https?/)
    })
    .map(file => {
      return '**/' + file
    })

  return gulp.src([paths.css])
    .pipe(filter(cssFiles, {restore: true}))
    .pipe(gulp.dest(paths.contents + '/css'))
})

// clean:html
gulp.task('clean:html', () => {
  console.log(paths.contents + '/html/**/*')
  del([paths.contents + '/html/**/*'])
})

// html
gulp.task('html', () => {
  const manifest = require(paths.manifest)
  const htmls = []
  if (manifest.config && manifest.config.html) {
    htmls.push('**/' + manifest.config.html)
  }
  return gulp.src([paths.html])
    .pipe(filter(htmls, {restore: true}))
    .pipe(gulp.dest(paths.contents + '/html'))
})

// clean:image
gulp.task('clean:image', () => {
  console.log(paths.contents + '/image/**/*')
  del([paths.contents + '/image/**/*'])
})

// image
gulp.task('image', ['clean:image'], () => {
  const manifest = require(paths.manifest)
  const images = []
  if (manifest.icon) {
    images.push('**/' + manifest.icon)
  }
  return gulp.src([paths.image])
    .pipe(filter(images, {restore: true}))
    .pipe(gulp.dest(paths.contents + '/image'))
})

// package
gulp.task('package', () => {
  return gulp.src([paths.contents])
    .pipe(shell(paths.package))
})

// watch
gulp.task('watch', () => {
  gulp.watch(paths.manifest, () => {
    runSequence('manifest', 'package')
  })
  gulp.watch(paths.js, () => {
    runSequence('clean:js', 'js', 'package')
  })
  gulp.watch([paths.sass, paths.css], () => {
    runSequence('clean:css', 'sass', 'css', 'package')
  })
  gulp.watch(paths.html, () => {
    runSequence('clean:html', 'html', 'package')
  })
  gulp.watch(paths.image, () => {
    runSequence('clean:image', 'image', 'package')
  })
})

// default
gulp.task('default', (callback) => {
  runSequence(
    ['clean:js', 'clean:css', 'clean:html', 'clean:image'],
    ['manifest', 'js', 'sass', 'css', 'html', 'image'],
    'package', callback)
})
