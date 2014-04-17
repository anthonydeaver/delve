module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // ts: {
    //  options: {
    //      target: 'es5',
    //      module: 'commonjs',
    //      sourcemap: false
    //  },
    //  responsive: {
    //      src: ["Scripts/**/*.ts", "!Scripts/UI/**/*.ts", "!Scripts/Tests/**/*.ts", "Scripts/UI/Responsive/**/*.ts"],
    //      out: "Distribution/wxmap.responsive.debug.js",
    //      reference: 'Scripts/UI/Responsive/Reference.ts',
    //  }
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
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/js/app/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['text/**/*.html']
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
            src: ["index.html", "assets/**", "environs/**", "js/libs/*.js", "!js/editor/*.js"],
            dest: "dist/",
            flatten: false,
            filter: "isFile"
          }
        ]
      }
    },
    watch: {
      files: ['<%= jshint.files %>', 'src/css/delve.less'],
      tasks: ['jshint','less']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint']);

  //grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
  grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify', 'copy']);

};