module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    dir: {
      src: 'src',
      dist: 'dist',
      test: 'test',
      coverage: 'coverage',
      webapp: {
        src: 'src/webapp',
        dist: 'dist/webapp'
      }
    },

    connect: {
      options: {
        port: 8080,
        hostname: '*'
      },
      src: {},
      dist: {}
    },

    openui5_connect: {
      options: {
        cors: {
          origin: 'http://localhost:<%= karma.options.port %>'
        }
      },
      src: {
        options: {
          appresources: '<%= dir.src %>'
        }
      },
      dist: {
        options: {
          appresources: '<%= dir.dist %>'
        }
      }
    },

    openui5_preload: {
      component: {
        options: {
          resources: [
            {
              cwd: '<%= dir.webapp.src %>',
              prefix: 'com/mlauffer/gotmoneyappui5',
              src: [
                '**/*.js',
                '**/*.properties',
                '**/*.xml',
                '**/*.json',
                '!**/Component-preload.js',
                '!**/js/**',
                '!**/localService/**',
                '!**/test/**'
              ]
            }
          ],
          dest: '<%= dir.webapp.src %>',
          compress: true
        },
        components: true
      }
    },

    clean: {
      dist: '<%= dir.dist %>',
      coverage: '<%= dir.coverage %>'
    },

    copy: {
      dist: {
        expand: true,
        cwd: '<%= dir.src %>/',
        src: [
          '**'
        ],
        dest: '<%= dir.dist %>'
      }
    },

    eslint: {
      test: ['<%= dir.test %>'],
      src: ['<%= dir.src %>']
    }
  });

  // These plugins provide necessary tasks.
  //grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-openui5');
  //grunt.loadNpmTasks('grunt-eslint');
  //grunt.loadNpmTasks('grunt-karma');

  // Server task
  grunt.registerTask('serve', function(target) {
    grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
  });

  // Linting task
  grunt.registerTask('lint', ['eslint']);

  // Test tasks
  grunt.registerTask('test', ['clean:coverage', 'openui5_connect:src', 'karma:ci']);
  grunt.registerTask('watch', ['openui5_connect:src', 'karma:watch']);
  grunt.registerTask('coverage', ['clean:coverage', 'openui5_connect:src', 'karma:coverage']);

  // Build task
  //grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);
  grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);

  // Default task
  grunt.registerTask('default', ['serve']);
};
