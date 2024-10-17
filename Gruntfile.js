/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function(grunt) {
    // Project configuration.
    grunt.loadNpmTasks('grunt-war');
    // Project configuration.
    var project = grunt.option('project'),
        projectName, projectVersion;

    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),
        war: {
            target: {
                options: {
                    war_dist_folder: 'build',
                    /* Folder where to generate the WAR. */

                    war_name: 'SPICE_CRDApp_6.0.1',//2.0.1.18',
                    webxml_display_name: 'SPICE_CRDApp'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/crd',
                    src: ['**'],
                    dest: ''
                }]
            }
        }
    });

    grunt.registerTask('default', ['war']);
};
