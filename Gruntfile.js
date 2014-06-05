/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    compass: {
      dist: {
        options: {
          httpPath: 'dist/',
          cssDir: 'dist/css',
          sassDir: 'sass/',
          imagesDir: '/images',
          javascriptsDir: 'js/',
          fontsDir: 'fonts/',
          require: 'susy',
          outputStyle: 'compressed'
        }
      }
    },
    concat: {
      options: {
        stripBanners: true
      },
      dist: {
        src: [
          'js/vendor/jquery-1.10.2.min.js',
          'js/vendor/jquery.qtip.min.js',
          'js/vendor/d3.min.js',     
          'js/vendor/jquery.fittext.js',     
          'js/main.js'
        ],
        dest: 'dist/js/script.min.js'
      }
    },
    uglify: {
      dist: {
        src: [
          'dist/js/script.min.js'
        ],
        dest: 'dist/js/script.min.js'
      }
    },
    watch: {
      compass: {
        files: [
          'sass/*.*'          
        ],
        tasks: ['compass'],
        options: {
          livereload: true,
          outputStyle: 'compressed'
        }
      },
      js: {
        files: [
          'js/*.*',
        ],
        tasks: ['concat'],
        options: {
          livereload: true
        }
      },
      html: {
        files: [
          '*.html'
        ],
        tasks: ['copy'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      options: {
        port: 9004,
        livereload: 35729,
        open: true
      },
      livereload: {
        options: {
          open: true,
          base: 'dist/'
        }
      }      
    },
    includes: {
      files: {
        src: ['templates/*.html'],
        dest: 'dist',
        flatten: true,
        cwd: '.',
        options: {
          silent: true,
        }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            // src: 'images/**',
            src: [
              '*.html'
            ],
            dest: 'dist/'
          }
        ]
      }
    },
    clean: {
      build: ['dist']
    }
  });

  require('load-grunt-tasks')(grunt);

  // Default task.
  grunt.registerTask('default', ['imagemin', 'concat', 'compass', 'uglify']);
  grunt.registerTask('push', ['imagemin', 'includes', 'compass', 'concat', 'uglify', 'rsync:deploy-staging']);
  grunt.registerTask('server', ['copy', 'connect', 'watch']);
};