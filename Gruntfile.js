module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.initConfig({
    'less': {
      production: {
        options: { cleancss: true },
        files: {
          'css/shakedown.min.css':
          'src/less/shakedown.less'
        }
      }
    }
  });

  grunt.registerTask('default', [
    'less'
  ]);
};
