import pkg from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import sourcemaps from 'gulp-sourcemaps';

const compileSass = gulpSass(sass)
const { src, dest, watch, series } = pkg

function css() {
  return src("src/scss/app.scss").pipe(sourcemaps.init()).pipe(compileSass()).pipe(sourcemaps.write('.')).pipe(dest("src/styles"));
}

function dev() {
  watch("src/scss/**/*.scss", css);
}

export default series(css, dev)