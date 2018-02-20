'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    openui5_preload: {
      component: {
        options: {
          resources: {
            cwd: 'public/webapp',
            prefix: 'com/mlauffer/gotmoneyappui5',
            src: [
              '**/*.js',
              '**/*.xml',
              '!**/js/**',
              '!**/test/**'
            ]
          },
          dest: 'public/webapp',
          compress: true
        },
        components: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-openui5');
  grunt.registerTask('build', ['openui5_preload']);
  grunt.registerTask('default', ['build']);
};
