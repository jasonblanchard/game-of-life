module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        'jshintrc': true
      },
      src: ['app/*.js']
    },
    
    aws: grunt.file.readJSON('s3.json'),
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        uploadConcurrency: 5,
        region: '<%= aws.region %>'
      },

      production: {
        options: {
          bucket: '<%= aws.bucket %>',
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['**'], dest: ''}
        ]
      }
    },
    broccoli: {
      dist: {
        dest: 'dist'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-broccoli');

  grunt.registerTask('deploy', ['broccoli:dist:build', 'aws_s3']);
};
