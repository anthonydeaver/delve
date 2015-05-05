module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    typescript: {
      base: {
        options: {
          target: 'es5',
          module: 'amd'
        },
        src: ['src/ts/game/*.ts'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    // typescript: {
    //     base: {
    //         src: ['lib/**/*.ts'],
    //         dest: 'js/PixelVisionJSDemos.js',
    //         options: {
    //             module: 'amd',
    //             target: 'es5'
    //         }
    //     }
    // },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "dist/css/delve.css": "src/css/delve.less"
        }
      }
    },
    clean : {
      main : {
          src : [ "src/ts/game/*.js", 'dist/<%= pkg.name %>.js']
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/Engine.js', 'src/js/**'],
        dest: 'dist/Delve2.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= typescript.base.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/js/**/*.js',  '!src/js/libs/*.js', '!src/js/editor/*.js', 'test/js/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "src/",
            src: ["index.html", "assets/**", "environs/**", "js/**", "!js/editor/*.js"],
            dest: "dist/",
            flatten: false,
            filter: "isFile"
          }
        ]
      }
    },
    watch: {
      files: ['src/index.html', '<%= jshint.files %>', 'src/Engine.js', 'src/js/**', 'src/css/delve.less'],
      tasks: ['less','copy']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint', 'typescript', 'qunit']);

  //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['jshint', 'less', 'typescript', 'uglify', 'copy', 'clean']);

};